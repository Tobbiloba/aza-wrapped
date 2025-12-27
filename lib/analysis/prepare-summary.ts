import { WrappedAnalysis } from '@/types/analysis';
import { AnalysisSummary } from '@/types/insights';
import { formatDate } from '@/lib/utils/formatters';

export function prepareAnalysisSummary(analysis: WrappedAnalysis): AnalysisSummary {
  // Determine peak time of day
  const timeOfDay = analysis.temporal.timeOfDayBreakdown;
  const times = [
    { name: 'Morning (6am-12pm)', amount: timeOfDay.morning.amount },
    { name: 'Afternoon (12pm-6pm)', amount: timeOfDay.afternoon.amount },
    { name: 'Evening (6pm-10pm)', amount: timeOfDay.evening.amount },
    { name: 'Night (10pm-6am)', amount: timeOfDay.night.amount },
  ];
  const peakTime = times.reduce((a, b) => (a.amount > b.amount ? a : b));

  // Calculate weekend percentage
  const weekendVsWeekday = analysis.temporal.weekendVsWeekday;
  const totalSpend = weekendVsWeekday.weekend.amount + weekendVsWeekday.weekday.amount;
  const weekendPercentage = totalSpend > 0
    ? (weekendVsWeekday.weekend.amount / totalSpend) * 100
    : 0;

  // Determine monthly trend
  const months = analysis.temporal.byMonth;
  let monthlyTrend: 'increasing' | 'decreasing' | 'stable' | 'volatile' = 'stable';

  if (months.length >= 2) {
    const firstHalf = months.slice(0, Math.floor(months.length / 2));
    const secondHalf = months.slice(Math.floor(months.length / 2));

    const firstAvg = firstHalf.reduce((sum, m) => sum + m.debits, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, m) => sum + m.debits, 0) / secondHalf.length;

    const change = (secondAvg - firstAvg) / firstAvg;

    if (change > 0.2) monthlyTrend = 'increasing';
    else if (change < -0.2) monthlyTrend = 'decreasing';
    else {
      // Check for volatility
      const amounts = months.map(m => m.debits);
      const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const variance = amounts.reduce((sum, a) => sum + Math.pow(a - avg, 2), 0) / amounts.length;
      const stdDev = Math.sqrt(variance);
      if (stdDev / avg > 0.5) monthlyTrend = 'volatile';
    }
  }

  // Get top purchases from biggest day
  const biggestDayTransactions = analysis.temporal.peakSpendingDay.transactions || [];
  const topPurchases = biggestDayTransactions
    .filter(t => t.type === 'debit')
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 5)
    .map(t => {
      const desc = t.description.slice(0, 50);
      return `${desc} (₦${Math.abs(t.amount).toLocaleString()})`;
    });

  // Get personality traits
  const traits: string[] = [];
  if (analysis.personality.archetype.includes('Foodie')) traits.push('Food Lover');
  if (analysis.personality.archetype.includes('Generous')) traits.push('Big Giver');
  if (weekendPercentage > 60) traits.push('Weekend Warrior');
  if (peakTime.name.includes('Night')) traits.push('Night Spender');
  if (analysis.merchants.top.length > 0) traits.push('Loyal Customer');
  traits.push(analysis.personality.archetype);

  return {
    accountName: analysis.metadata.accountName || 'Friend',
    period: {
      start: formatDate(analysis.period.start),
      end: formatDate(analysis.period.end),
      days: analysis.period.totalDays,
    },
    overview: {
      totalTransactions: analysis.overview.totalTransactions,
      totalCredits: analysis.overview.totalCredits,
      totalDebits: analysis.overview.totalDebits,
      netFlow: analysis.overview.totalCredits - analysis.overview.totalDebits,
    },
    biggestDay: {
      date: formatDate(analysis.temporal.peakSpendingDay.date),
      amount: analysis.temporal.peakSpendingDay.amount,
      transactionCount: analysis.temporal.peakSpendingDay.transactionCount,
      topPurchases,
    },
    topMerchants: analysis.merchants.top.slice(0, 5).map(m => ({
      name: m.name,
      amount: m.totalAmount,
      visits: m.count,
    })),
    topRecipients: analysis.recipients.top.slice(0, 5).map(r => ({
      name: r.name,
      amount: r.totalAmount,
      count: r.count,
    })),
    categories: analysis.categories.breakdown.map(c => ({
      name: c.category,
      amount: c.totalAmount,
      percentage: c.percentage,
    })),
    rhythm: {
      peakTimeOfDay: peakTime.name,
      peakTimeAmount: peakTime.amount,
      weekendSpend: weekendVsWeekday.weekend.amount,
      weekdaySpend: weekendVsWeekday.weekday.amount,
      weekendPercentage,
    },
    journey: {
      peakMonth: analysis.temporal.peakMonth
        ? `${analysis.temporal.peakMonth.monthName} ${analysis.temporal.peakMonth.year}`
        : 'N/A',
      peakMonthAmount: analysis.temporal.peakMonth?.debits || 0,
      monthlyTrend,
    },
    personality: {
      archetype: analysis.personality.archetype,
      traits,
    },
  };
}
