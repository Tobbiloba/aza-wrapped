/**
 * File reading utilities for different file formats
 */

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Read XLSX file and convert to CSV-like rows
 */
export async function readXLSXAsRows(file: File): Promise<string[][]> {
  try {
    // Dynamic import of xlsx library - use namespace import
    const XLSX = await import('xlsx');
    
    // xlsx library - check if it's a namespace import
    const xlsxLib = (XLSX as any).default ? (XLSX as any).default : XLSX;
    
    if (!xlsxLib || typeof xlsxLib.read !== 'function') {
      throw new Error('XLSX library not loaded correctly');
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          if (!arrayBuffer) {
            throw new Error('Failed to read file as ArrayBuffer');
          }
          
          const data = new Uint8Array(arrayBuffer);
          
          // Suppress console warnings temporarily (xlsx library emits warnings for some ZIP entries)
          const originalWarn = console.warn;
          const originalError = console.error;
          const warnings: string[] = [];
          
          console.warn = (...args: any[]) => {
            const msg = args.join(' ');
            // Filter out xlsx library's "Bad uncompressed size" warnings - these are harmless
            if (!msg.includes('Bad uncompressed size')) {
              originalWarn.apply(console, args);
            }
          };
          
          try {
            const workbook = xlsxLib.read(data, { type: 'array' });
            
            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
              throw new Error('Workbook contains no sheets');
            }
            
            // Get first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            if (!worksheet) {
              throw new Error(`Sheet "${firstSheetName}" not found`);
            }
            
            // Convert to array of arrays (rows)
            const rows: string[][] = xlsxLib.utils.sheet_to_json(worksheet, {
              header: 1,
              defval: '', // Default value for empty cells
              raw: false, // Convert all values to strings
            }) as string[][];
            
            resolve(rows);
          } finally {
            // Restore original console methods
            console.warn = originalWarn;
            console.error = originalError;
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[XLSX] Error parsing file:', error);
          }
          reject(new Error(`Failed to parse XLSX file: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[XLSX] Error importing or initializing XLSX:', error);
    }
    throw new Error(`Failed to load XLSX library: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate file type and size
 */
export function validateFile(file: File): { valid: boolean; error?: string; type?: 'csv' | 'xlsx' | 'pdf' } {
  const fileName = file.name.toLowerCase();
  
  // Check file type
  if (fileName.endsWith('.csv')) {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'File is too large. Maximum size is 10MB' };
    }
    return { valid: true, type: 'csv' };
  }
  
  if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'File is too large. Maximum size is 10MB' };
    }
    return { valid: true, type: 'xlsx' };
  }
  
  if (fileName.endsWith('.pdf')) {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'File is too large. Maximum size is 10MB' };
    }
    return { valid: true, type: 'pdf' };
  }
  
  return { valid: false, error: 'Please upload a CSV, XLSX, or PDF file' };
}

