import { Transaction, Category } from '@/types/transaction';
import { CategoryStat, SubscriptionStat } from '@/types/analysis';
import { SUBSCRIPTION_KEYWORDS } from '@/lib/utils/constants';

export function analyzeCategories(transactions: Transaction[]): {
  breakdown: CategoryStat[];
  topCategory: Category;
} {
  const categoryMap = new Map<Category, { count: number; totalAmount: number }>();

  // Only consider debit transactions
  const debitTransactions = transactions.filter((t) => t.type === 'debit');
  const totalSpent = debitTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );

  for (const transaction of debitTransactions) {
    const category = transaction.category;
    const amount = Math.abs(transaction.amount);

    const existing = categoryMap.get(category);
    if (existing) {
      existing.count += 1;
      existing.totalAmount += amount;
    } else {
      categoryMap.set(category, { count: 1, totalAmount: amount });
    }
  }

  const breakdown: CategoryStat[] = Array.from(categoryMap.entries())
    .map(([category, stats]) => ({
      category,
      count: stats.count,
      totalAmount: stats.totalAmount,
      percentage: totalSpent > 0 ? (stats.totalAmount / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  const topCategory = breakdown[0]?.category || 'other';

  return { breakdown, topCategory };
}

export function analyzeSubscriptions(transactions: Transaction[]): {
  list: SubscriptionStat[];
  monthlyTotal: number;
  yearlyProjection: number;
} {
  const subscriptionMap = new Map<string, SubscriptionStat>();

  const subscriptionTransactions = transactions.filter(
    (t) => t.type === 'debit' && t.category === 'subscriptions'
  );

  for (const transaction of subscriptionTransactions) {
    const amount = Math.abs(transaction.amount);
    let subscriptionName = 'Other Subscription';

    // Match against known subscription patterns
    for (const { name, pattern } of SUBSCRIPTION_KEYWORDS) {
      if (pattern.test(transaction.description)) {
        subscriptionName = name;
        break;
      }
    }

    const existing = subscriptionMap.get(subscriptionName);
    if (existing) {
      existing.count += 1;
      existing.totalSpent += amount;
    } else {
      subscriptionMap.set(subscriptionName, {
        name: subscriptionName,
        amount,
        frequency: 'monthly', // Assume monthly by default
        totalSpent: amount,
        count: 1,
      });
    }
  }

  const list = Array.from(subscriptionMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent
  );

  // Calculate monthly total (average per subscription)
  const monthlyTotal = list.reduce((sum, sub) => {
    // Estimate monthly cost based on total and count
    const avgAmount = sub.totalSpent / sub.count;
    return sum + avgAmount;
  }, 0);

  const yearlyProjection = monthlyTotal * 12;

  return { list, monthlyTotal, yearlyProjection };
}
