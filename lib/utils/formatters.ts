export function formatCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);
}

export function formatCurrencyCompact(amount: number): string {
  const absAmount = Math.abs(amount);
  if (absAmount >= 1_000_000) {
    return `₦${(absAmount / 1_000_000).toFixed(1)}M`;
  }
  if (absAmount >= 1_000) {
    return `₦${(absAmount / 1_000).toFixed(0)}K`;
  }
  return `₦${absAmount.toFixed(0)}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-NG').format(num);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatMonthShort(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    month: 'short',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function parseAmount(value: string): number {
  if (!value || value === '--' || value === '-') return 0;
  // Remove currency symbol, commas, and whitespace
  const cleaned = value.replace(/[₦,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Convert Excel serial date number to JavaScript Date
 * Excel epoch is 1900-01-01 (with bug: treats 1900 as leap year, so use Dec 30, 1899)
 * Excel serial date 1 = Jan 1, 1900
 */
export function excelSerialDateToJSDate(serial: number): Date {
  // Excel epoch: December 30, 1899 (because Excel incorrectly treats 1900 as a leap year)
  const excelEpoch = new Date(1899, 11, 30); // Month 11 = December (0-indexed)
  // Convert serial number to milliseconds (subtract 1 because serial 1 = Jan 1, 1900 = epoch + 1 day)
  const date = new Date(excelEpoch.getTime() + (serial - 1) * 24 * 60 * 60 * 1000);
  return date;
}

export function parseDate(dateStr: string): Date {
  if (!dateStr || !dateStr.trim()) {
    return new Date(); // Return current date for empty strings
  }
  
  const cleaned = dateStr.trim();
  
  // Check if this is an Excel serial date (numeric value that looks like a date serial number)
  // Excel serial dates are typically >= 1 (Jan 1, 1900) and < 1000000 (year 2738)
  // We check for pure numbers (no slashes, dashes, or spaces) to distinguish from formatted dates
  const dateNum = parseFloat(cleaned);
  if (!isNaN(dateNum) && dateNum >= 1 && dateNum < 1000000 && 
      !cleaned.includes('/') && !cleaned.includes('-') && !cleaned.includes(' ') && 
      !cleaned.includes(':') && cleaned === dateNum.toString()) {
    // This is likely an Excel serial date
    const excelDate = excelSerialDateToJSDate(dateNum);
    // Only use if it results in a reasonable date (after 1900)
    if (excelDate.getFullYear() >= 1900 && excelDate.getFullYear() <= 2100) {
      return excelDate;
    }
  }
  
  // Handle format: "01 Oct 2025 10:27:47" or "01 Oct 2025"
  const date = new Date(cleaned);
  if (!isNaN(date.getTime()) && date.getFullYear() >= 1900 && date.getFullYear() <= 2100) {
    // Accept if it's a valid date in a reasonable range
    return date;
  }
  
  // Fallback: try parsing manually (format: "01 Oct 2025")
  const parts = cleaned.split(' ');
  if (parts.length >= 3) {
    const day = parseInt(parts[0]);
    const month = getMonthNumber(parts[1]);
    const year = parseInt(parts[2]);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year >= 1900 && year <= 2100) {
      const timeParts = parts[3]?.split(':') || ['0', '0', '0'];
      const parsedDate = new Date(
        year,
        month,
        day,
        parseInt(timeParts[0]) || 0,
        parseInt(timeParts[1]) || 0,
        parseInt(timeParts[2]) || 0
      );
      // Verify the date is valid
      if (parsedDate.getFullYear() === year && parsedDate.getMonth() === month) {
        return parsedDate;
      }
    }
  }
  
  // If all else fails, return current date (fallback)
  console.warn('[parseDate] Could not parse date:', dateStr, 'using current date as fallback');
  return new Date();
}

function getMonthNumber(monthStr: string): number {
  const months: Record<string, number> = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11,
  };
  return months[monthStr.toLowerCase()] ?? 0;
}

export function getDayName(day: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day] || '';
}

export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month] || '';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
