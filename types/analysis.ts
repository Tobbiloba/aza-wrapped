import { Category, StatementMetadata, Transaction } from './transaction';

export interface MerchantStat {
  name: string;
  count: number;
  totalAmount: number;
  averageAmount: number;
  category: Category;
}

export interface RecipientStat {
  name: string;
  count: number;
  totalAmount: number;
}

export interface CategoryStat {
  category: Category;
  count: number;
  totalAmount: number;
  percentage: number;
}

export interface DayOfWeekStat {
  day: number; // 0 = Sunday, 6 = Saturday
  dayName: string;
  count: number;
  totalAmount: number;
}

export interface HourStat {
  hour: number; // 0-23
  count: number;
  totalAmount: number;
}

export interface MonthStat {
  month: number; // 0-11
  monthName: string;
  year: number;
  count: number;
  totalAmount: number;
  credits: number;
  debits: number;
}

export interface SubscriptionStat {
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'one-time';
  totalSpent: number;
  count: number;
}

export type MoneyArchetype =
  | 'The Foodie'
  | 'The Social Butterfly'
  | 'The Data Junkie'
  | 'The Night Owl'
  | 'The Weekend Warrior'
  | 'The Saver'
  | 'The Big Spender'
  | 'The Subscription Addict'
  | 'The Early Bird'
  | 'The Steady Eddie';

export interface PersonalityResult {
  archetype: MoneyArchetype;
  traits: string[];
  description: string;
  emoji: string;
}

export interface WrappedAnalysis {
  metadata: StatementMetadata;

  period: {
    start: Date;
    end: Date;
    totalDays: number;
  };

  overview: {
    totalTransactions: number;
    totalDebits: number;
    totalCredits: number;
    netFlow: number;
    averageTransaction: number;
  };

  merchants: {
    top: MerchantStat[];
    totalMerchants: number;
    favoriteStore: MerchantStat | null;
  };

  recipients: {
    top: RecipientStat[];
    totalRecipients: number;
    totalSentToOthers: number;
  };

  categories: {
    breakdown: CategoryStat[];
    topCategory: Category;
  };

  subscriptions: {
    list: SubscriptionStat[];
    monthlyTotal: number;
    yearlyProjection: number;
  };

  temporal: {
    byDayOfWeek: DayOfWeekStat[];
    byHour: HourStat[];
    byMonth: MonthStat[];
    weekendVsWeekday: {
      weekend: { count: number; amount: number };
      weekday: { count: number; amount: number };
    };
    peakSpendingDay: {
      date: Date;
      amount: number;
      transactionCount: number;
      transactions: Transaction[];
    };
    peakMonth: MonthStat | null;
    busiestHour: HourStat | null;
    timeOfDayBreakdown: {
      morning: { count: number; amount: number }; // 6-12
      afternoon: { count: number; amount: number }; // 12-18
      evening: { count: number; amount: number }; // 18-22
      night: { count: number; amount: number }; // 22-6
    };
  };

  streaks: {
    longestNoSpend: {
      days: number;
      startDate: Date;
      endDate: Date;
    };
    currentNoSpend: number;
    totalNoSpendDays: number;
  };

  personality: PersonalityResult;

  funFacts: string[];

  firstTransaction: {
    date: Date;
    description: string;
    amount: number;
  } | null;

  lastTransaction: {
    date: Date;
    description: string;
    amount: number;
  } | null;

  biggestTransaction: {
    date: Date;
    description: string;
    amount: number;
  } | null;
}
