import { Transaction } from '@/types/transaction';
import { RecipientStat } from '@/types/analysis';

export function analyzeRecipients(transactions: Transaction[]): {
  top: RecipientStat[];
  totalRecipients: number;
  totalSentToOthers: number;
} {
  const recipientMap = new Map<string, RecipientStat>();

  // Only consider debit transactions with recipients (transfers)
  const transferTransactions = transactions.filter(
    (t) => t.type === 'debit' && t.recipient && t.category === 'transfers'
  );

  let totalSentToOthers = 0;

  for (const transaction of transferTransactions) {
    const recipientName = transaction.recipient!;
    const amount = Math.abs(transaction.amount);
    totalSentToOthers += amount;

    const existing = recipientMap.get(recipientName);

    if (existing) {
      existing.count += 1;
      existing.totalAmount += amount;
    } else {
      recipientMap.set(recipientName, {
        name: recipientName,
        count: 1,
        totalAmount: amount,
      });
    }
  }

  const allRecipients = Array.from(recipientMap.values());

  // Sort by total amount sent
  const sortedByAmount = [...allRecipients].sort(
    (a, b) => b.totalAmount - a.totalAmount
  );

  return {
    top: sortedByAmount.slice(0, 10),
    totalRecipients: allRecipients.length,
    totalSentToOthers,
  };
}

export function getTopRecipientsByFrequency(
  transactions: Transaction[]
): RecipientStat[] {
  const result = analyzeRecipients(transactions);
  return [...result.top].sort((a, b) => b.count - a.count);
}
