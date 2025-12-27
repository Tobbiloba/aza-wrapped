import { Transaction, StatementMetadata } from '@/types/transaction';
import { WrappedAnalysis } from '@/types/analysis';
import { analyzeMerchants } from './merchants';
import { analyzeRecipients } from './recipients';
import { analyzeCategories, analyzeSubscriptions } from './categories';
import { analyzeTemporalPatterns } from './temporal';
import { analyzeStreaks } from './streaks';
import { determinePersonality } from './personality';
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils/formatters';

export function analyzeTransactions(
  transactions: Transaction[],
  metadata: StatementMetadata
): WrappedAnalysis {
  // Basic overview
  const debitTransactions = transactions.filter((t) => t.type === 'debit');
  const creditTransactions = transactions.filter((t) => t.type === 'credit');

  const totalDebits = debitTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );
  const totalCredits = creditTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );
  const netFlow = totalCredits - totalDebits;
  const averageTransaction =
    debitTransactions.length > 0 ? totalDebits / debitTransactions.length : 0;

  // Merchant analysis
  const merchantAnalysis = analyzeMerchants(transactions);

  // Recipient analysis
  const recipientAnalysis = analyzeRecipients(transactions);

  // Category analysis
  const categoryAnalysis = analyzeCategories(transactions);
  const subscriptionAnalysis = analyzeSubscriptions(transactions);

  // Temporal analysis
  const temporalAnalysis = analyzeTemporalPatterns(transactions);

  // Streak analysis
  const streakAnalysis = analyzeStreaks(transactions);

  // Period calculation
  const sortedByDate = [...transactions].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  const periodStart = sortedByDate[0]?.date || metadata.period.start;
  const periodEnd =
    sortedByDate[sortedByDate.length - 1]?.date || metadata.period.end;
  const totalDays = Math.ceil(
    (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  // First/Last/Biggest transactions
  const firstTransaction = sortedByDate[0]
    ? {
        date: sortedByDate[0].date,
        description: sortedByDate[0].description,
        amount: sortedByDate[0].amount,
      }
    : null;

  const lastTransaction = sortedByDate[sortedByDate.length - 1]
    ? {
        date: sortedByDate[sortedByDate.length - 1].date,
        description: sortedByDate[sortedByDate.length - 1].description,
        amount: sortedByDate[sortedByDate.length - 1].amount,
      }
    : null;

  const biggestDebit = [...debitTransactions].sort(
    (a, b) => Math.abs(b.amount) - Math.abs(a.amount)
  )[0];
  const biggestTransaction = biggestDebit
    ? {
        date: biggestDebit.date,
        description: biggestDebit.description,
        amount: biggestDebit.amount,
      }
    : null;

  // Personality analysis
  const personality = determinePersonality(
    transactions,
    categoryAnalysis.breakdown,
    totalCredits,
    totalDebits,
    recipientAnalysis.totalRecipients
  );

  // Generate fun facts
  const funFacts = generateFunFacts({
    totalDebits,
    totalCredits,
    transactionCount: transactions.length,
    topMerchant: merchantAnalysis.favoriteStore,
    subscriptions: subscriptionAnalysis,
    categoryBreakdown: categoryAnalysis.breakdown,
    averageTransaction,
  });

  return {
    metadata,
    period: {
      start: periodStart,
      end: periodEnd,
      totalDays,
    },
    overview: {
      totalTransactions: transactions.length,
      totalDebits,
      totalCredits,
      netFlow,
      averageTransaction,
    },
    merchants: merchantAnalysis,
    recipients: recipientAnalysis,
    categories: categoryAnalysis,
    subscriptions: subscriptionAnalysis,
    temporal: temporalAnalysis,
    streaks: streakAnalysis,
    personality,
    funFacts,
    firstTransaction,
    lastTransaction,
    biggestTransaction,
  };
}

function generateFunFacts(data: {
  totalDebits: number;
  totalCredits: number;
  transactionCount: number;
  topMerchant: { name: string; totalAmount: number; count: number } | null;
  subscriptions: { monthlyTotal: number; yearlyProjection: number };
  categoryBreakdown: { category: string; totalAmount: number }[];
  averageTransaction: number;
}): string[] {
  const facts: string[] = [];

  // Merchant fact
  if (data.topMerchant) {
    facts.push(
      `You visited ${data.topMerchant.name} ${data.topMerchant.count} times, spending ${formatCurrency(data.topMerchant.totalAmount)}`
    );
  }

  // Comparison facts
  const jollofRicePlates = Math.floor(data.totalDebits / 2500);
  if (jollofRicePlates > 10) {
    facts.push(
      `Your total spending could buy ${jollofRicePlates.toLocaleString()} plates of jollof rice!`
    );
  }

  // iPhone comparison
  const iPhoneCount = Math.floor(data.totalDebits / 800000);
  if (iPhoneCount >= 1) {
    facts.push(
      `You spent enough to buy ${iPhoneCount} iPhone${iPhoneCount > 1 ? 's' : ''}!`
    );
  }

  // Subscription fact
  if (data.subscriptions.yearlyProjection > 0) {
    facts.push(
      `Your subscriptions cost about ${formatCurrencyCompact(data.subscriptions.yearlyProjection)} per year`
    );
  }

  // Data spending
  const dataSpending = data.categoryBreakdown.find((c) => c.category === 'data');
  if (dataSpending && dataSpending.totalAmount > 10000) {
    const gbEstimate = Math.floor(dataSpending.totalAmount / 1000); // Rough estimate
    facts.push(`You probably downloaded ${gbEstimate}GB+ of data this period!`);
  }

  // Transaction frequency
  const avgPerDay = data.transactionCount / 30; // Rough monthly average
  if (avgPerDay > 5) {
    facts.push(
      `You made about ${Math.round(avgPerDay)} transactions per day on average`
    );
  }

  // Average transaction
  if (data.averageTransaction > 0) {
    facts.push(
      `Your average transaction was ${formatCurrency(data.averageTransaction)}`
    );
  }

  return facts.slice(0, 5); // Return max 5 fun facts
}
