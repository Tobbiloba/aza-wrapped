import { Transaction } from '@/types/transaction';
import { DayOfWeekStat, HourStat, MonthStat } from '@/types/analysis';
import { getDayName, getMonthName } from '@/lib/utils/formatters';

export function analyzeTemporalPatterns(transactions: Transaction[]) {
  const debitTransactions = transactions.filter((t) => t.type === 'debit');

  return {
    byDayOfWeek: analyzeDayOfWeek(debitTransactions),
    byHour: analyzeHour(debitTransactions),
    byMonth: analyzeMonth(transactions), // All transactions for monthly view
    weekendVsWeekday: analyzeWeekendVsWeekday(debitTransactions),
    peakSpendingDay: findPeakSpendingDay(debitTransactions),
    peakMonth: findPeakMonth(debitTransactions),
    busiestHour: findBusiestHour(debitTransactions),
    timeOfDayBreakdown: analyzeTimeOfDay(debitTransactions),
  };
}

function analyzeDayOfWeek(transactions: Transaction[]): DayOfWeekStat[] {
  const stats = Array.from({ length: 7 }, (_, i) => ({
    day: i,
    dayName: getDayName(i),
    count: 0,
    totalAmount: 0,
  }));

  for (const transaction of transactions) {
    const dayOfWeek = transaction.date.getDay();
    stats[dayOfWeek].count += 1;
    stats[dayOfWeek].totalAmount += Math.abs(transaction.amount);
  }

  return stats;
}

function analyzeHour(transactions: Transaction[]): HourStat[] {
  const stats = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: 0,
    totalAmount: 0,
  }));

  for (const transaction of transactions) {
    const hour = transaction.date.getHours();
    stats[hour].count += 1;
    stats[hour].totalAmount += Math.abs(transaction.amount);
  }

  return stats;
}

function analyzeMonth(transactions: Transaction[]): MonthStat[] {
  const monthMap = new Map<string, MonthStat>();

  for (const transaction of transactions) {
    const month = transaction.date.getMonth();
    const year = transaction.date.getFullYear();
    const key = `${year}-${month}`;

    const existing = monthMap.get(key);
    const amount = Math.abs(transaction.amount);
    const isCredit = transaction.type === 'credit';

    if (existing) {
      existing.count += 1;
      existing.totalAmount += amount;
      if (isCredit) {
        existing.credits += amount;
      } else {
        existing.debits += amount;
      }
    } else {
      monthMap.set(key, {
        month,
        monthName: getMonthName(month),
        year,
        count: 1,
        totalAmount: amount,
        credits: isCredit ? amount : 0,
        debits: isCredit ? 0 : amount,
      });
    }
  }

  return Array.from(monthMap.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
}

function analyzeWeekendVsWeekday(transactions: Transaction[]): {
  weekend: { count: number; amount: number };
  weekday: { count: number; amount: number };
} {
  const result = {
    weekend: { count: 0, amount: 0 },
    weekday: { count: 0, amount: 0 },
  };

  for (const transaction of transactions) {
    const dayOfWeek = transaction.date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const amount = Math.abs(transaction.amount);

    if (isWeekend) {
      result.weekend.count += 1;
      result.weekend.amount += amount;
    } else {
      result.weekday.count += 1;
      result.weekday.amount += amount;
    }
  }

  return result;
}

function findPeakSpendingDay(transactions: Transaction[]): {
  date: Date;
  amount: number;
  transactionCount: number;
  transactions: Transaction[];
} {
  const dayMap = new Map<string, { date: Date; amount: number; count: number; transactions: Transaction[] }>();

  for (const transaction of transactions) {
    const dateKey = transaction.date.toDateString();
    const amount = Math.abs(transaction.amount);

    const existing = dayMap.get(dateKey);
    if (existing) {
      existing.amount += amount;
      existing.count += 1;
      existing.transactions.push(transaction);
    } else {
      dayMap.set(dateKey, {
        date: new Date(transaction.date),
        amount,
        count: 1,
        transactions: [transaction],
      });
    }
  }

  const days = Array.from(dayMap.values());
  const peakDay = days.sort((a, b) => b.amount - a.amount)[0];

  return peakDay
    ? {
        date: peakDay.date,
        amount: peakDay.amount,
        transactionCount: peakDay.count,
        transactions: peakDay.transactions,
      }
    : {
        date: new Date(),
        amount: 0,
        transactionCount: 0,
        transactions: [],
      };
}

function findPeakMonth(transactions: Transaction[]): MonthStat | null {
  const monthStats = analyzeMonth(transactions.filter((t) => t.type === 'debit'));
  return monthStats.sort((a, b) => b.debits - a.debits)[0] || null;
}

function findBusiestHour(transactions: Transaction[]): HourStat | null {
  const hourStats = analyzeHour(transactions);
  return hourStats.sort((a, b) => b.count - a.count)[0] || null;
}

function analyzeTimeOfDay(transactions: Transaction[]): {
  morning: { count: number; amount: number };
  afternoon: { count: number; amount: number };
  evening: { count: number; amount: number };
  night: { count: number; amount: number };
} {
  const result = {
    morning: { count: 0, amount: 0 }, // 6-12
    afternoon: { count: 0, amount: 0 }, // 12-18
    evening: { count: 0, amount: 0 }, // 18-22
    night: { count: 0, amount: 0 }, // 22-6
  };

  for (const transaction of transactions) {
    const hour = transaction.date.getHours();
    const amount = Math.abs(transaction.amount);

    if (hour >= 6 && hour < 12) {
      result.morning.count += 1;
      result.morning.amount += amount;
    } else if (hour >= 12 && hour < 18) {
      result.afternoon.count += 1;
      result.afternoon.amount += amount;
    } else if (hour >= 18 && hour < 22) {
      result.evening.count += 1;
      result.evening.amount += amount;
    } else {
      result.night.count += 1;
      result.night.amount += amount;
    }
  }

  return result;
}
