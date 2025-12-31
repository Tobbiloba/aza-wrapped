import Papa from 'papaparse';
import {
  Transaction,
  ParsedStatement,
  StatementMetadata,
  Category,
} from '@/types/transaction';
import { parseAmount, parseDate, generateId, excelSerialDateToJSDate } from '@/lib/utils/formatters';

/**
 * Parse OPay statement from rows (works with both CSV and XLSX)
 */
export function parseOpayStatement(rows: string[][]): ParsedStatement {
  // Extract metadata from rows 1-6
  const metadata = extractMetadata(rows);

  // Find the header row - be more specific to avoid matching metadata rows
  // Look for transaction table headers that have multiple transaction-related columns
  const strongHeaderPatterns = [
    'trans. date',  // OPay format: "Trans. Date" - must be exact match or close
    'transaction date',
    'trans date',
  ];
  
  const weakHeaderPatterns = [
    'transaction date/time',
    'date/time',
    'posting date',
  ];

  let headerRowIndex = -1;
  let columnMapping: { date: number; description: number; debit: number; credit: number; balance: number; channel: number; reference: number } | null = null;

  // Try to find header row by looking for transaction table headers
  for (let i = 0; i < Math.min(rows.length, 50); i++) {
    const row = rows[i];
    if (!row || row.length < 5) continue; // Transaction headers should have at least 5 columns

    const rowText = row.join(' ').toLowerCase();
    
    // Skip obvious metadata rows
    if (rowText.includes('account name') || 
        rowText.includes('account type') || 
        rowText.includes('opening balance') ||
        rowText.includes('closing balance') ||
        rowText.includes('date printed')) {
      continue;
    }

    // Check for strong transaction header patterns (Trans. Date, Transaction Date, etc.)
    const hasStrongHeader = strongHeaderPatterns.some(pattern => {
      // Look for exact match or close match (allow for spacing variations)
      return rowText.includes(pattern) || 
             row.some(cell => cell && cell.toLowerCase().trim() === pattern) ||
             row.some(cell => cell && cell.toLowerCase().trim().replace(/\./g, '') === pattern.replace(/\./g, ''));
    });

    // Also check if row has multiple transaction-related keywords (more reliable)
    const hasMultipleKeywords = (
      (rowText.includes('debit') || rowText.includes('credit')) &&
      (rowText.includes('description') || rowText.includes('narration')) &&
      (rowText.includes('balance') || rowText.includes('reference'))
    );

    if (hasStrongHeader || (hasMultipleKeywords && rowText.includes('date'))) {
      // Try to map columns - this should find the actual transaction columns
      const mapping = detectColumnMapping(row);
      if (mapping && mapping.date >= 0) {
        headerRowIndex = i;
        columnMapping = mapping;
        break;
      }
    }
  }

  // If header not found by pattern, try to detect by data pattern (look for date-like first column)
  let transactionStartRow = headerRowIndex >= 0 ? headerRowIndex + 1 : 0;

  if (headerRowIndex === -1) {
    for (let i = 0; i < Math.min(rows.length, 50); i++) {
      const row = rows[i];
      if (!row || row.length < 3) continue;

      // Check if first column looks like a date and row has enough columns
      const firstCell = row[0]?.trim() || '';
      const looksLikeDate = isDateLike(firstCell);
      
      if (looksLikeDate && row.length >= 5) {
        // Check if previous row might be a header
        if (i > 0) {
          const prevMapping = detectColumnMapping(rows[i - 1]);
          if (prevMapping) {
            headerRowIndex = i - 1;
            columnMapping = prevMapping;
            transactionStartRow = i;
            break;
          }
        }
        
        // This looks like the first data row - use inferred mapping
        columnMapping = detectColumnMappingFromData(row) || getDefaultColumnMapping(row.length);
        if (columnMapping) {
          headerRowIndex = i - 1; // Set to row before data starts
          transactionStartRow = i;
          break;
        }
      }
    }
  }

  if (!columnMapping) {
    // Debug: log first few rows to help diagnose
    const sampleRows = rows.slice(0, Math.min(20, rows.length));
    console.error('[PARSER] Could not detect column mapping. First few rows:', sampleRows);
    console.error('[PARSER] Sample row structure:', sampleRows.map((r, i) => `Row ${i}: ${r?.slice(0, 10).join(' | ')}`));
    throw new Error(`Could not find transaction header row. File may be in an unsupported format.`);
  }

  // Parse transactions starting from transaction start row
  const transactions: Transaction[] = [];
  let skippedCount = 0;
  let parsedCount = 0;
  
  for (let i = transactionStartRow; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 3) {
      skippedCount++;
      continue;
    }

    // Skip empty rows or rows that don't look like transactions
    const firstCell = row[0]?.trim() || '';
    if (!firstCell) {
      skippedCount++;
      continue;
    }

    // Skip summary/total rows
    if (firstCell.toLowerCase().includes('total') || 
        firstCell.toLowerCase().includes('summary') ||
        firstCell.toLowerCase().includes('opening') ||
        firstCell.toLowerCase().includes('closing')) {
      skippedCount++;
      continue;
    }

    const transaction = parseTransactionRow(row, columnMapping);
    if (transaction) {
      transactions.push(transaction);
      parsedCount++;
    } else {
      skippedCount++;
    }
  }

  return { metadata, transactions };
}

function extractMetadata(rows: string[][]): StatementMetadata {
  let accountName = '';
  let accountNumber = '';
  let periodStart = new Date();
  let periodEnd = new Date();
  let openingBalance = 0;
  let closingBalance = 0;
  let totalDebit = 0;
  let totalCredit = 0;
  let debitCount = 0;
  let creditCount = 0;

  for (const row of rows.slice(0, 10)) {
    const rowText = row.join(' ').toLowerCase();

    // Account Name
    if (rowText.includes('account name')) {
      accountName = row[1]?.trim() || '';
    }

    // Account Number
    if (rowText.includes('account number')) {
      accountNumber = row[3]?.trim() || '';
    }

    // Period
    if (rowText.includes('period')) {
      const periodStr = row[1] || row[3] || '';
      
      const periodMatch = periodStr.match(/(\d{1,2}\s+\w+\s+\d{4})\s*[-–]\s*(\d{1,2}\s+\w+\s+\d{4})/i);
      if (periodMatch) {
        const parsedStart = parseDate(periodMatch[1]);
        const parsedEnd = parseDate(periodMatch[2]);
        
        // Only use if both dates are valid (years >= 1900)
        if (parsedStart.getFullYear() >= 1900 && parsedEnd.getFullYear() >= 1900 && parsedStart <= parsedEnd) {
          periodStart = parsedStart;
          periodEnd = parsedEnd;
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[METADATA] Invalid dates from regex match:', parsedStart, parsedEnd);
          }
        }
      } else {
        // Check if dates are in separate cells (common in XLSX)
        // Look for two date-like values in adjacent cells
        for (let i = 1; i < row.length - 1; i++) {
          const cell1 = (row[i] || '').trim();
          const cell2 = (row[i + 1] || '').trim();
          
          // Skip if cells are empty
          if (!cell1 || !cell2) continue;
          
          // Try to parse both as dates
          const date1 = parseDate(cell1);
          const date2 = parseDate(cell2);
          
          // If both are valid dates (years >= 1900), and date1 <= date2, use them
          if (date1.getFullYear() >= 1900 && date2.getFullYear() >= 1900 && 
              date1.getFullYear() <= 2100 && date2.getFullYear() <= 2100 &&
              date1 <= date2) {
            periodStart = date1;
            periodEnd = date2;
            break;
          }
        }
      }
    }

    // Opening Balance
    if (rowText.includes('opening balance')) {
      openingBalance = parseAmount(row[1] || '');
    }

    // Closing Balance
    if (rowText.includes('closing balance')) {
      closingBalance = parseAmount(row[1] || '');
    }

    // Total Debit
    if (rowText.includes('total debit')) {
      totalDebit = parseAmount(row[1] || row[3] || '');
    }

    // Total Credit
    if (rowText.includes('total credit')) {
      totalCredit = parseAmount(row[1] || row[3] || '');
    }

    // Debit Count
    if (rowText.includes('debit count')) {
      debitCount = parseInt(row[1] || row[5] || '0') || 0;
    }

    // Credit Count
    if (rowText.includes('credit count')) {
      creditCount = parseInt(row[1] || row[5] || '0') || 0;
    }
  }

  return {
    accountName,
    accountNumber,
    period: { start: periodStart, end: periodEnd },
    openingBalance,
    closingBalance,
    totalDebit,
    totalCredit,
    debitCount,
    creditCount,
  };
}

/**
 * Detect column mapping from header row
 */
function detectColumnMapping(headerRow: string[]): { date: number; description: number; debit: number; credit: number; balance: number; channel: number; reference: number } | null {
  const header = headerRow.join(' ').toLowerCase();
  
  // Find column indices for each field
  let dateCol = -1;
  let descCol = -1;
  let debitCol = -1;
  let creditCol = -1;
  let balanceCol = -1;
  let channelCol = -1;
  let refCol = -1;

  for (let i = 0; i < headerRow.length; i++) {
    const cell = (headerRow[i] || '').toLowerCase().trim();
    if (!cell) continue;
    
    // Date column - more flexible patterns
    if (dateCol === -1 && (
      cell.includes('date') || 
      cell.includes('time') ||
      cell.includes('posted') ||
      cell === 'dt' ||
      cell === 'd/t'
    )) {
      dateCol = i;
    }
    
    // Description/Narration column - more patterns
    if (descCol === -1 && (
      cell.includes('description') || 
      cell.includes('narration') || 
      cell.includes('particulars') || 
      cell.includes('details') || 
      cell.includes('remark') ||
      cell.includes('narrative') ||
      cell.includes('memo') ||
      cell.includes('note') ||
      cell === 'desc' ||
      cell === 'narration/description'
    )) {
      descCol = i;
    }
    
    // Debit column
    if (debitCol === -1 && (cell.includes('debit') || cell === 'dr' || cell === 'withdrawal')) {
      debitCol = i;
    }
    
    // Credit column
    if (creditCol === -1 && (cell.includes('credit') || cell === 'cr' || cell === 'deposit')) {
      creditCol = i;
    }
    
    // Balance column
    if (balanceCol === -1 && (
      cell.includes('balance') || 
      cell.includes('bal') ||
      cell.includes('running balance') ||
      cell === 'bal.'
    )) {
      balanceCol = i;
    }
    
    // Channel column - more patterns
    if (channelCol === -1 && (
      cell.includes('channel') || 
      cell.includes('source') || 
      cell.includes('type') ||
      cell.includes('medium') ||
      cell.includes('mode')
    )) {
      channelCol = i;
    }
    
    // Reference column - more patterns
    if (refCol === -1 && (
      cell.includes('reference') || 
      cell.includes('ref') || 
      cell.includes('transaction id') ||
      cell.includes('transaction no') ||
      cell.includes('trans ref') ||
      cell.includes('trxn ref') ||
      cell === 'ref no' ||
      cell === 'refno'
    )) {
      refCol = i;
    }
  }

  // We need at least date and description to be a valid transaction header
  // Also, date column should be one of the first few columns (not in the middle)
  if (dateCol === -1 || dateCol > 5) {
    return null;
  }
  
  // If we found date but it's clearly not a transaction date (like "Date Printed"), reject it
  const dateHeaderCell = (headerRow[dateCol] || '').toLowerCase().trim();
  if (dateHeaderCell.includes('printed') || dateHeaderCell.includes('statement')) {
    return null;
  }

  // If we couldn't find debit/credit, try to find amount column
  if (debitCol === -1 && creditCol === -1) {
    for (let i = 0; i < headerRow.length; i++) {
      const cell = (headerRow[i] || '').toLowerCase().trim();
      if (cell.includes('amount')) {
        // Assume it's in debit or credit position
        debitCol = i;
        creditCol = i;
        break;
      }
    }
  }

  // If we found date column but not description, check if there's a "Value Date" column next
  // OPay format often has: Trans. Date, Value Date, Description
  let actualDescCol = descCol;
  if (dateCol >= 0 && descCol === -1 && dateCol + 1 < headerRow.length) {
    const nextCell = (headerRow[dateCol + 1] || '').toLowerCase().trim();
    if (nextCell.includes('value date') || (nextCell.includes('value') && nextCell.includes('date'))) {
      // Skip the Value Date column, description should be at dateCol + 2
      actualDescCol = dateCol + 2;
    } else {
      // No Value Date, description should be at dateCol + 1
      actualDescCol = dateCol + 1;
    }
  } else if (descCol === -1 && dateCol >= 0) {
    actualDescCol = dateCol + 1;
  }

  // Build mapping with fallbacks
  const mapping = {
    date: dateCol >= 0 ? dateCol : 0,
    description: actualDescCol >= 0 ? actualDescCol : (dateCol >= 0 ? dateCol + 1 : 1),
    debit: debitCol >= 0 ? debitCol : (actualDescCol >= 0 ? actualDescCol + 1 : (dateCol >= 0 ? dateCol + 3 : 3)),
    credit: creditCol >= 0 ? creditCol : (debitCol >= 0 ? debitCol + 1 : (actualDescCol >= 0 ? actualDescCol + 2 : (dateCol >= 0 ? dateCol + 4 : 4))),
    balance: balanceCol >= 0 ? balanceCol : (creditCol >= 0 ? creditCol + 1 : (debitCol >= 0 ? debitCol + 2 : (actualDescCol >= 0 ? actualDescCol + 3 : (dateCol >= 0 ? dateCol + 5 : 5)))),
    channel: channelCol >= 0 ? channelCol : (balanceCol >= 0 ? balanceCol + 1 : (creditCol >= 0 ? creditCol + 2 : (dateCol >= 0 ? dateCol + 6 : 6))),
    reference: refCol >= 0 ? refCol : (channelCol >= 0 ? channelCol + 1 : (balanceCol >= 0 ? balanceCol + 2 : (dateCol >= 0 ? dateCol + 7 : 7))),
  };
  
  return mapping;
}

/**
 * Try to detect column mapping from data row (when no clear header exists)
 */
function detectColumnMappingFromData(dataRow: string[]): { date: number; description: number; debit: number; credit: number; balance: number; channel: number; reference: number } | null {
  // Look for date-like value in first column
  const firstCell = dataRow[0]?.trim() || '';
  if (isDateLike(firstCell)) {
    // Check if second column is also date-like (Value Date column in OPay format)
    const secondCell = dataRow[1]?.trim() || '';
    const hasValueDate = isDateLike(secondCell);
    
    // OPay format: Trans. Date (col 0), Value Date (col 1), Description (col 2), Debit (col 3), Credit (col 4), Balance (col 5), Channel (col 6), Reference (col 7)
    if (hasValueDate && dataRow.length >= 7) {
      // Standard OPay format with Value Date
      return {
        date: 0,          // Trans. Date
        description: 2,   // Description (skip Value Date at col 1)
        debit: 3,         // Debit
        credit: 4,        // Credit
        balance: 5,       // Balance After
        channel: 6,       // Channel
        reference: 7,     // Transaction Reference
      };
    } else {
      // Alternative format without Value Date: Date, Description, Debit, Credit, Balance, Channel, Reference
      return {
        date: 0,
        description: dataRow.length > 1 ? 1 : 0,
        debit: dataRow.length > 2 ? 2 : 1,
        credit: dataRow.length > 3 ? 3 : 2,
        balance: dataRow.length > 4 ? 4 : 3,
        channel: dataRow.length > 5 ? 5 : 4,
        reference: dataRow.length > 6 ? 6 : 5,
      };
    }
  }
  return null;
}

/**
 * Get default column mapping when we can't detect it
 */
function getDefaultColumnMapping(rowLength: number): { date: number; description: number; debit: number; credit: number; balance: number; channel: number; reference: number } {
  return {
    date: 0,
    description: Math.min(1, rowLength - 1),
    debit: Math.min(2, rowLength - 1),
    credit: Math.min(3, rowLength - 1),
    balance: Math.min(4, rowLength - 1),
    channel: Math.min(5, rowLength - 1),
    reference: Math.min(6, rowLength - 1),
  };
}

/**
 * Check if a string looks like a date
 */
function isDateLike(str: string): boolean {
  if (!str || str.length < 5) return false;
  
  // Common date patterns: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, etc.
  const datePatterns = [
    /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/, // DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
    /^\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}/, // YYYY-MM-DD, YYYY/MM/DD
    /^\d{1,2}\s+\w{3,}\s+\d{4}/i, // DD Mon YYYY, DD Month YYYY
    /^\w{3,}\s+\d{1,2},?\s+\d{4}/i, // Mon DD YYYY, Month DD YYYY
    /^\d{8}$/, // YYYYMMDD (compact format)
  ];
  
  // Also check for Excel serial date numbers (roughly between 1900 and 2100)
  const numValue = parseFloat(str);
  if (!isNaN(numValue) && numValue > 1 && numValue < 100000) {
    // Could be Excel date serial number
    return true;
  }
  
  return datePatterns.some(pattern => pattern.test(str));
}

function parseTransactionRow(row: string[], columnMapping: { date: number; description: number; debit: number; credit: number; balance: number; channel: number; reference: number }): Transaction | null {
  try {
    const transDate = row[columnMapping.date]?.trim() || '';
    const description = row[columnMapping.description]?.trim() || '';
    const debit = row[columnMapping.debit]?.trim() || '';
    const credit = row[columnMapping.credit]?.trim() || '';
    const balance = row[columnMapping.balance]?.trim() || '';
    const channel = row[columnMapping.channel]?.trim() || '';
    const reference = row[columnMapping.reference]?.trim() || '';
    
    // Skip if no date (invalid transaction row)
    if (!transDate) {
      return null;
    }

    const debitAmount = parseAmount(debit);
    const creditAmount = parseAmount(credit);

    const transaction: Transaction = {
      id: generateId(),
      date: parseDate(transDate), // parseDate now handles Excel serial dates automatically
      description,
      amount: creditAmount > 0 ? creditAmount : -debitAmount,
      type: creditAmount > 0 ? 'credit' : 'debit',
      balance: parseAmount(balance),
      channel,
      reference,
      merchant: extractMerchant(description),
      recipient: extractRecipient(description),
      category: classifyTransaction(description, channel),
    };

    return transaction;
  } catch {
    return null;
  }
}

function extractMerchant(description: string): string | undefined {
  const desc = description.toLowerCase();

  // POS transactions - extract merchant name
  if (desc.includes('pos') || desc.includes('card payment')) {
    // Pattern: "OPay Card Payment | MERCHANT NAME"
    const posMatch = description.match(/(?:Card Payment|POS).*?\|\s*([^|]+)/i);
    if (posMatch) {
      return cleanMerchantName(posMatch[1]);
    }
  }

  // Known merchants from description
  const merchantPatterns = [
    { pattern: /topnotch\s*supermar/i, name: 'Topnotch Supermarket' },
    { pattern: /just\s*rite/i, name: 'Justrite Supermarket' },
    { pattern: /shoprite/i, name: 'Shoprite' },
    { pattern: /chicken\s*republic/i, name: 'Chicken Republic' },
    { pattern: /kfc/i, name: 'KFC' },
    { pattern: /bukka\s*hut/i, name: 'Bukka Hut' },
    { pattern: /silverbird\s*cinema/i, name: 'Silverbird Cinemas' },
    { pattern: /palmpay/i, name: 'PalmPay' },
    { pattern: /food\s*concepts/i, name: 'Food Concepts' },
    { pattern: /baguette/i, name: '12inch Baguette' },
  ];

  for (const { pattern, name } of merchantPatterns) {
    if (pattern.test(description)) {
      return name;
    }
  }

  return undefined;
}

function extractRecipient(description: string): string | undefined {
  // Pattern: "Transfer to NAME | Bank | Number"
  const transferMatch = description.match(/Transfer\s+to\s+([^|]+)/i);
  if (transferMatch) {
    return cleanRecipientName(transferMatch[1]);
  }

  return undefined;
}

function cleanMerchantName(name: string): string {
  return name
    .replace(/\d{6,}/g, '') // Remove long numbers
    .replace(/[|]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^T\s+/i, '') // Remove leading "T " prefix
    .replace(/\s*\d+\s*$/, '') // Remove trailing numbers
    .replace(/LANG$/i, '')
    .replace(/\s*NG$/i, '')
    .trim()
    .split(' ')
    .slice(0, 3) // Take first 3 words max
    .join(' ');
}

function cleanRecipientName(name: string): string {
  return name
    .replace(/\s*[-|]\s*.*$/, '') // Remove everything after - or |
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 3) // Take first 3 words (usually full name)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function classifyTransaction(description: string, channel: string): Category {
  const desc = description.toLowerCase();

  // Subscriptions
  if (/netflix|spotify|canva|youtube.*premium|amazon.*prime|udemy|starlink/i.test(desc)) {
    return 'subscriptions';
  }

  // Data
  if (/mobile\s*data|datamtn|dataglo|dataair|data9mobile|\d+gb/i.test(desc)) {
    return 'data';
  }

  // Airtime
  if (/airtime|recharge|vtu/i.test(desc) && !/data/i.test(desc)) {
    return 'airtime';
  }

  // Bills
  if (/electricity|power|nepa|phcn|ikedc|ekedc|dstv|gotv|startimes|cable|water\s*bill/i.test(desc)) {
    return 'bills';
  }

  // Food
  if (/chicken\s*republic|kfc|dominos|pizza|mr\s*biggs|tantalizers|food|restaurant|eatery|bukka|shawarma|suya|baguette|ice\s*cream/i.test(desc)) {
    return 'food';
  }

  // Entertainment
  if (/cinema|silverbird|filmhouse|genesis|bet9ja|sporty|nairabet|1xbet|game|football\s*internet/i.test(desc)) {
    return 'entertainment';
  }

  // Shopping
  if (/jumia|konga|amazon|shoprite|supermarket|mall|market|demerge/i.test(desc)) {
    return 'shopping';
  }

  // Transport
  if (/uber|bolt|taxi|transport|fuel|filling|petrol|diesel/i.test(desc)) {
    return 'transport';
  }

  // Transfers
  if (/transfer\s+to/i.test(desc)) {
    return 'transfers';
  }

  // POS
  if (channel === 'POS' || /card\s*payment|pos/i.test(desc)) {
    return 'pos';
  }

  return 'other';
}

/**
 * Legacy function for backwards compatibility - parses CSV text
 */
export function parseOpayCSV(csvText: string): ParsedStatement {
  // Parse CSV without headers (raw data)
  const result = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: true,
  });

  const rows = result.data;
  return parseOpayStatement(rows);
}
