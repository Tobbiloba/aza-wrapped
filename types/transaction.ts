export type Category =
  | 'food'
  | 'transport'
  | 'data'
  | 'airtime'
  | 'bills'
  | 'entertainment'
  | 'shopping'
  | 'subscriptions'
  | 'transfers'
  | 'pos'
  | 'other';

export type TransactionType = 'credit' | 'debit';

export type Channel = 'Mobile' | 'POS' | 'WEB' | string;

export interface RawTransaction {
  transDate: string;
  valueDate: string;
  description: string;
  debit: string;
  credit: string;
  balance: string;
  channel: string;
  reference: string;
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number; // Positive for credit, negative for debit
  type: TransactionType;
  balance: number;
  channel: Channel;
  reference: string;
  merchant?: string;
  recipient?: string;
  category: Category;
}

export interface StatementMetadata {
  accountName: string;
  accountNumber: string;
  period: {
    start: Date;
    end: Date;
  };
  openingBalance: number;
  closingBalance: number;
  totalDebit: number;
  totalCredit: number;
  debitCount: number;
  creditCount: number;
}

export interface ParsedStatement {
  metadata: StatementMetadata;
  transactions: Transaction[];
}
