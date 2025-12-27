import { Transaction } from '@/types/transaction';

export function analyzeStreaks(transactions: Transaction[]): {
  longestNoSpend: {
    days: number;
    startDate: Date;
    endDate: Date;
  };
  currentNoSpend: number;
  totalNoSpendDays: number;
} {
  const debitTransactions = transactions
    .filter((t) => t.type === 'debit')
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (debitTransactions.length === 0) {
    return {
      longestNoSpend: {
        days: 0,
        startDate: new Date(),
        endDate: new Date(),
      },
      currentNoSpend: 0,
      totalNoSpendDays: 0,
    };
  }

  // Get all unique dates with spending
  const spendingDates = new Set<string>();
  for (const t of debitTransactions) {
    spendingDates.add(t.date.toDateString());
  }

  // Get date range
  const startDate = debitTransactions[0].date;
  const endDate = debitTransactions[debitTransactions.length - 1].date;

  // Find all days in range
  const allDays: Date[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    allDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Find longest no-spend streak
  let longestStreak = { days: 0, startDate: startDate, endDate: startDate };
  let currentStreak = { days: 0, startDate: startDate };
  let totalNoSpendDays = 0;

  for (const day of allDays) {
    const dateStr = day.toDateString();
    if (!spendingDates.has(dateStr)) {
      // No spending on this day
      totalNoSpendDays += 1;
      if (currentStreak.days === 0) {
        currentStreak.startDate = day;
      }
      currentStreak.days += 1;
    } else {
      // Spending occurred
      if (currentStreak.days > longestStreak.days) {
        longestStreak = {
          days: currentStreak.days,
          startDate: currentStreak.startDate,
          endDate: new Date(day.getTime() - 24 * 60 * 60 * 1000), // Day before
        };
      }
      currentStreak = { days: 0, startDate: day };
    }
  }

  // Check if current streak is the longest
  if (currentStreak.days > longestStreak.days) {
    longestStreak = {
      days: currentStreak.days,
      startDate: currentStreak.startDate,
      endDate: allDays[allDays.length - 1],
    };
  }

  // Calculate current no-spend streak (from last transaction to now)
  const lastSpendDate = debitTransactions[debitTransactions.length - 1].date;
  const today = new Date();
  const daysSinceLastSpend = Math.floor(
    (today.getTime() - lastSpendDate.getTime()) / (24 * 60 * 60 * 1000)
  );

  return {
    longestNoSpend: longestStreak,
    currentNoSpend: Math.max(0, daysSinceLastSpend),
    totalNoSpendDays,
  };
}

export function findSpendingStreaks(transactions: Transaction[]): {
  longestSpendingStreak: number;
  averageDailySpending: number;
} {
  const debitTransactions = transactions
    .filter((t) => t.type === 'debit')
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (debitTransactions.length === 0) {
    return { longestSpendingStreak: 0, averageDailySpending: 0 };
  }

  // Get unique spending dates
  const spendingDatesMap = new Map<string, number>();
  for (const t of debitTransactions) {
    const dateStr = t.date.toDateString();
    spendingDatesMap.set(
      dateStr,
      (spendingDatesMap.get(dateStr) || 0) + Math.abs(t.amount)
    );
  }

  const spendingDates = Array.from(spendingDatesMap.keys()).sort();

  // Find longest consecutive spending streak
  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < spendingDates.length; i++) {
    const prevDate = new Date(spendingDates[i - 1]);
    const currDate = new Date(spendingDates[i]);
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (diffDays === 1) {
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  // Calculate average daily spending
  const totalSpent = Array.from(spendingDatesMap.values()).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const averageDailySpending = totalSpent / spendingDatesMap.size;

  return { longestSpendingStreak: longestStreak, averageDailySpending };
}
