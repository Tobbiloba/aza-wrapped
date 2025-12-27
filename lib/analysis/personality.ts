import { Transaction } from '@/types/transaction';
import { PersonalityResult, MoneyArchetype, CategoryStat } from '@/types/analysis';
import { ARCHETYPE_INFO } from '@/lib/utils/constants';

interface PersonalityScores {
  'The Foodie': number;
  'The Social Butterfly': number;
  'The Data Junkie': number;
  'The Night Owl': number;
  'The Weekend Warrior': number;
  'The Saver': number;
  'The Big Spender': number;
  'The Subscription Addict': number;
  'The Early Bird': number;
  'The Steady Eddie': number;
}

export function determinePersonality(
  transactions: Transaction[],
  categoryBreakdown: CategoryStat[],
  totalCredits: number,
  totalDebits: number,
  recipientCount: number
): PersonalityResult {
  const scores: PersonalityScores = {
    'The Foodie': 0,
    'The Social Butterfly': 0,
    'The Data Junkie': 0,
    'The Night Owl': 0,
    'The Weekend Warrior': 0,
    'The Saver': 0,
    'The Big Spender': 0,
    'The Subscription Addict': 0,
    'The Early Bird': 0,
    'The Steady Eddie': 0,
  };

  const debitTransactions = transactions.filter((t) => t.type === 'debit');
  const totalSpent = debitTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );

  // Calculate category percentages
  const getCategoryPercent = (category: string): number => {
    const cat = categoryBreakdown.find((c) => c.category === category);
    return cat?.percentage || 0;
  };

  // --- SCORING LOGIC ---

  // The Foodie: High food spending
  const foodPercent = getCategoryPercent('food');
  if (foodPercent > 25) scores['The Foodie'] += 4;
  else if (foodPercent > 15) scores['The Foodie'] += 2;
  else if (foodPercent > 8) scores['The Foodie'] += 1;

  // The Social Butterfly: Many transfer recipients
  if (recipientCount > 30) scores['The Social Butterfly'] += 4;
  else if (recipientCount > 20) scores['The Social Butterfly'] += 3;
  else if (recipientCount > 10) scores['The Social Butterfly'] += 2;

  // The Data Junkie: High data/airtime spending
  const dataPercent = getCategoryPercent('data') + getCategoryPercent('airtime');
  if (dataPercent > 15) scores['The Data Junkie'] += 4;
  else if (dataPercent > 10) scores['The Data Junkie'] += 2;
  else if (dataPercent > 5) scores['The Data Junkie'] += 1;

  // The Night Owl: Transactions between 10pm and 6am
  const nightTransactions = debitTransactions.filter((t) => {
    const hour = t.date.getHours();
    return hour >= 22 || hour < 6;
  });
  const nightPercent = (nightTransactions.length / debitTransactions.length) * 100;
  if (nightPercent > 25) scores['The Night Owl'] += 4;
  else if (nightPercent > 15) scores['The Night Owl'] += 2;
  else if (nightPercent > 8) scores['The Night Owl'] += 1;

  // The Early Bird: Transactions between 5am and 9am
  const morningTransactions = debitTransactions.filter((t) => {
    const hour = t.date.getHours();
    return hour >= 5 && hour < 9;
  });
  const morningPercent = (morningTransactions.length / debitTransactions.length) * 100;
  if (morningPercent > 20) scores['The Early Bird'] += 4;
  else if (morningPercent > 12) scores['The Early Bird'] += 2;
  else if (morningPercent > 6) scores['The Early Bird'] += 1;

  // The Weekend Warrior: Weekend spending ratio
  const weekendTransactions = debitTransactions.filter((t) => {
    const day = t.date.getDay();
    return day === 0 || day === 6;
  });
  const weekendSpending = weekendTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );
  const weekendPercent = (weekendSpending / totalSpent) * 100;
  if (weekendPercent > 45) scores['The Weekend Warrior'] += 4;
  else if (weekendPercent > 35) scores['The Weekend Warrior'] += 2;
  else if (weekendPercent > 28) scores['The Weekend Warrior'] += 1;

  // The Saver: Positive net flow
  const netFlow = totalCredits - totalDebits;
  const savingsRate = totalCredits > 0 ? (netFlow / totalCredits) * 100 : 0;
  if (savingsRate > 20) scores['The Saver'] += 4;
  else if (savingsRate > 10) scores['The Saver'] += 2;
  else if (savingsRate > 0) scores['The Saver'] += 1;

  // The Big Spender: High average transaction
  const avgTransaction = totalSpent / debitTransactions.length;
  if (avgTransaction > 50000) scores['The Big Spender'] += 4;
  else if (avgTransaction > 25000) scores['The Big Spender'] += 2;
  else if (avgTransaction > 15000) scores['The Big Spender'] += 1;

  // The Subscription Addict: High subscription spending
  const subscriptionPercent = getCategoryPercent('subscriptions');
  if (subscriptionPercent > 10) scores['The Subscription Addict'] += 4;
  else if (subscriptionPercent > 5) scores['The Subscription Addict'] += 2;
  else if (subscriptionPercent > 2) scores['The Subscription Addict'] += 1;

  // The Steady Eddie: Consistent daily spending (low variance)
  const dailySpending = new Map<string, number>();
  for (const t of debitTransactions) {
    const dateKey = t.date.toDateString();
    dailySpending.set(dateKey, (dailySpending.get(dateKey) || 0) + Math.abs(t.amount));
  }
  const dailyAmounts = Array.from(dailySpending.values());
  if (dailyAmounts.length > 5) {
    const avgDaily = dailyAmounts.reduce((a, b) => a + b, 0) / dailyAmounts.length;
    const variance =
      dailyAmounts.reduce((sum, val) => sum + Math.pow(val - avgDaily, 2), 0) /
      dailyAmounts.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / avgDaily;

    if (coefficientOfVariation < 0.5) scores['The Steady Eddie'] += 3;
    else if (coefficientOfVariation < 0.8) scores['The Steady Eddie'] += 2;
    else if (coefficientOfVariation < 1.2) scores['The Steady Eddie'] += 1;
  }

  // Find the archetype with highest score
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const archetype = sortedScores[0][0] as MoneyArchetype;
  const info = ARCHETYPE_INFO[archetype];

  return {
    archetype,
    traits: info.traits,
    description: info.description,
    emoji: info.emoji,
  };
}
