// AI-generated insights for each slide
export interface AIInsights {
  // Intro
  intro: {
    greeting: string; // "Omo, [Name]!"
    tagline: string; // "Your money moved mad this year"
  };

  // Overview
  overview: {
    headline: string; // "Big Man Tings" or "Soft Life Merchant"
    reaction: string; // Commentary on their overall flow
  };

  // Odogwu Day (biggest spending day)
  odogwuDay: {
    title: string; // "ODOGWU MODE ACTIVATED" or "Na Who Dey Breathe?"
    roast: string; // Main roast about that day
    verdict: string; // Short verdict like "Certified Big Spender"
  };

  // Your Spots (top merchants)
  yourSpots: {
    overall: string; // Overall commentary on their spots
    merchants: {
      name: string;
      relationship: string; // "It's Serious", "Situationship", etc.
      roast: string; // Specific roast for this merchant
    }[];
  };

  // Money Circle (recipients)
  moneyCircle: {
    overall: string; // Commentary on who they're sending money to
    recipients: {
      name: string;
      title: string; // "The Landlord", "Bank of Mum", etc.
      insight: string;
    }[];
  };

  // Categories
  categories: {
    headline: string;
    roast: string; // Commentary on their spending priorities
  };

  // Your Rhythm
  rhythm: {
    title: string; // "Night Crawler" or "Early Bird Baller"
    description: string;
    verdict: string;
  };

  // The Journey
  journey: {
    peakMonthRoast: string; // Roast about their peak spending month
    trend: string; // Commentary on their spending trend
  };

  // Personality
  personality: {
    archetype: string; // Their money personality
    emoji: string;
    opener: string; // Opening line
    roast: string; // Main roast paragraph
    prediction: string; // "2025 Prediction: ..."
    traits: { emoji: string; label: string }[];
  };

  // Summary
  summary: {
    headline: string; // Final headline
    caption: string; // Shareable caption
    hashtags: string[];
  };
}

// Summary data sent to Claude for insight generation
export interface AnalysisSummary {
  accountName: string;
  period: { start: string; end: string; days: number };
  overview: {
    totalTransactions: number;
    totalCredits: number;
    totalDebits: number;
    netFlow: number;
  };
  biggestDay: {
    date: string;
    amount: number;
    transactionCount: number;
    topPurchases: string[];
  };
  topMerchants: { name: string; amount: number; visits: number }[];
  topRecipients: { name: string; amount: number; count: number }[];
  categories: { name: string; amount: number; percentage: number }[];
  rhythm: {
    peakTimeOfDay: string;
    peakTimeAmount: number;
    weekendSpend: number;
    weekdaySpend: number;
    weekendPercentage: number;
  };
  journey: {
    peakMonth: string;
    peakMonthAmount: number;
    monthlyTrend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  };
  personality: {
    archetype: string;
    traits: string[];
  };
}
