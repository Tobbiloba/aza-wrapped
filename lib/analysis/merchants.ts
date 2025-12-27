import { Transaction } from '@/types/transaction';
import { MerchantStat } from '@/types/analysis';

export function analyzeMerchants(transactions: Transaction[]): {
  top: MerchantStat[];
  totalMerchants: number;
  favoriteStore: MerchantStat | null;
} {
  const merchantMap = new Map<string, MerchantStat>();

  // Only consider debit transactions with merchants
  const merchantTransactions = transactions.filter(
    (t) => t.type === 'debit' && t.merchant
  );

  for (const transaction of merchantTransactions) {
    const merchantName = transaction.merchant!;
    const existing = merchantMap.get(merchantName);

    if (existing) {
      existing.count += 1;
      existing.totalAmount += Math.abs(transaction.amount);
      existing.averageAmount = existing.totalAmount / existing.count;
    } else {
      merchantMap.set(merchantName, {
        name: merchantName,
        count: 1,
        totalAmount: Math.abs(transaction.amount),
        averageAmount: Math.abs(transaction.amount),
        category: transaction.category,
      });
    }
  }

  const allMerchants = Array.from(merchantMap.values());

  // Sort by total amount spent
  const sortedByAmount = [...allMerchants].sort(
    (a, b) => b.totalAmount - a.totalAmount
  );

  // Get favorite store (most visits)
  const sortedByCount = [...allMerchants].sort((a, b) => b.count - a.count);
  const favoriteStore = sortedByCount[0] || null;

  return {
    top: sortedByAmount.slice(0, 10),
    totalMerchants: allMerchants.length,
    favoriteStore,
  };
}

export function getTopMerchantsByCategory(
  transactions: Transaction[],
  category: string
): MerchantStat[] {
  const result = analyzeMerchants(
    transactions.filter((t) => t.category === category)
  );
  return result.top;
}
