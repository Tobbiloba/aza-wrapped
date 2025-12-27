import { Transaction } from '@/types/transaction';
import { WrappedAnalysis, MerchantStat, RecipientStat, MoneyArchetype } from '@/types/analysis';
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils/formatters';

// ============================================
// ODOGWU DAY INSIGHTS
// ============================================

export interface OdogwuDayInsight {
  headline: string;
  roast: string;
  details: string;
  emoji: string;
}

export function generateOdogwuDayInsight(
  amount: number,
  transactionCount: number,
  transactions: Transaction[],
  date: Date
): OdogwuDayInsight {
  // Analyze what happened that day
  const categories = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
  const merchants = transactions.filter(t => t.merchant).map(t => t.merchant);
  const topMerchant = merchants[0];

  // Time span analysis
  const hours = transactions.map(t => t.date.getHours());
  const startHour = Math.min(...hours);
  const endHour = Math.max(...hours);
  const isMarathon = endHour - startHour > 6;

  // Generate headline based on amount
  let headline: string;
  let emoji: string;

  if (amount > 150000) {
    headline = "ODOGWU MODE ACTIVATED";
    emoji = "🔥";
  } else if (amount > 100000) {
    headline = "You were BALLING";
    emoji = "💰";
  } else if (amount > 50000) {
    headline = "Soft life was soft-lifing";
    emoji = "✨";
  } else if (amount > 30000) {
    headline = "Money was moving";
    emoji = "💸";
  } else {
    headline = "A solid spending day";
    emoji = "📊";
  }

  // Generate roast based on what happened
  let roast: string;

  if (topMerchant && topCategory) {
    const merchantAmount = transactions.find(t => t.merchant === topMerchant);
    if (topCategory[0] === 'shopping' || topCategory[0] === 'pos') {
      roast = `${topMerchant} saw you coming and alerted the manager 😂. Retail therapy chose you that day.`;
    } else if (topCategory[0] === 'food') {
      roast = `Your stomach made ALL the financial decisions. ${topMerchant ? topMerchant + ' fed you well!' : 'Food vendors were happy!'}`;
    } else if (topCategory[0] === 'transfers') {
      roast = `Everybody got paid! You were the mobile bank that day. ATM behavior 💳`;
    } else {
      roast = `${topMerchant} collected the lion's share. No regrets, just vibes.`;
    }
  } else if (transactionCount > 8) {
    roast = `${transactionCount} transactions in one day?! The card was SMOKING. Take it easy! 🔥`;
  } else if (amount > 100000) {
    roast = `Over ₦100K gone just like that. We're not judging, we're just... impressed? 👀`;
  } else {
    roast = `A proper spending spree. Your account felt that one.`;
  }

  // Generate details
  let details: string;
  if (isMarathon) {
    details = `${transactionCount} transactions from ${formatHour(startHour)} to ${formatHour(endHour)}. Marathon mode!`;
  } else {
    details = `${transactionCount} transactions. Quick and decisive.`;
  }

  return { headline, roast, details, emoji };
}

// ============================================
// MERCHANT RELATIONSHIP INSIGHTS
// ============================================

export interface MerchantRelationship {
  status: string;
  statusEmoji: string;
  roast: string;
}

export function getMerchantRelationship(merchant: MerchantStat): MerchantRelationship {
  const { count: visits, totalAmount, averageAmount } = merchant;

  // High visits = serious relationship
  if (visits >= 20) {
    return {
      status: "It's Serious",
      statusEmoji: "💍",
      roast: "They've seen you in your morning wrapper. It's real.",
    };
  }

  if (visits >= 15) {
    return {
      status: "Committed",
      statusEmoji: "💕",
      roast: "They know your face, your order, and probably your car sound.",
    };
  }

  if (visits >= 10) {
    return {
      status: "Regular Thing",
      statusEmoji: "🤝",
      roast: "You're a familiar face. Staff meetings mention you.",
    };
  }

  // High spend, low visits = sugar customer
  if (averageAmount > 50000) {
    return {
      status: "Sugar Customer",
      statusEmoji: "💰",
      roast: "You don't come often, but when you do... WAHALA for their inventory.",
    };
  }

  if (visits >= 5) {
    return {
      status: "The Situationship",
      statusEmoji: "👀",
      roast: "Still figuring things out. Potential is there.",
    };
  }

  // Low spend, many visits
  if (averageAmount < 5000 && visits > 5) {
    return {
      status: "Small Chops Regular",
      statusEmoji: "🍿",
      roast: "₦2K here, ₦3K there... e dey enter!",
    };
  }

  return {
    status: "Casual",
    statusEmoji: "👋",
    roast: "Just passing through. No commitment yet.",
  };
}

export function generateSpotsOverallInsight(topMerchant: MerchantStat): string {
  const amount = topMerchant.totalAmount;
  const visits = topMerchant.count;

  // Relatable comparisons
  const jollofPlates = Math.floor(amount / 2500);
  const shawarmaCount = Math.floor(amount / 3500);
  const iPhonePercent = Math.floor((amount / 800000) * 100);

  if (amount > 500000) {
    return `Your ${topMerchant.name} spending could buy a decent generator. Just saying 🔌`;
  }
  if (amount > 200000) {
    return `That's ${iPhonePercent}% of an iPhone spent at ${topMerchant.name}. Priorities! 📱`;
  }
  if (jollofPlates > 50) {
    return `${jollofPlates} plates of jollof rice worth! Your loyalty is unmatched 🍚`;
  }
  if (visits > 15) {
    return `${visits} visits?! At this point, apply for staff discount 😭`;
  }

  return `${shawarmaCount} shawarmas worth of spending. No regrets though! 🌯`;
}

// ============================================
// MONEY CIRCLE (RECIPIENTS) INSIGHTS
// ============================================

export interface RecipientInsight {
  relationship: string;
  roast: string;
}

export function getRecipientInsight(
  recipient: RecipientStat,
  rank: number,
  totalRecipients: number
): RecipientInsight {
  const { count, totalAmount } = recipient;

  if (rank === 1) {
    if (totalAmount > 200000) {
      return {
        relationship: "Your Personal Beneficiary",
        roast: `₦${formatCurrencyCompact(totalAmount)} sent! Business partner or best friend? Either way, they're eating good 🍽️`,
      };
    }
    if (count > 10) {
      return {
        relationship: "The Frequent Receiver",
        roast: `${count} transfers! Your account knows their account number by heart ❤️`,
      };
    }
    return {
      relationship: "#1 Receiver",
      roast: "Top of the money chain. They know you've got their back.",
    };
  }

  if (count >= 5) {
    return {
      relationship: "Regular on the List",
      roast: "Consistent support. You're a real one! 💯",
    };
  }

  if (totalAmount > 50000) {
    return {
      relationship: "Big Ticket Transfer",
      roast: "Fewer transfers, bigger amounts. Quality over quantity.",
    };
  }

  return {
    relationship: "In the Circle",
    roast: "Part of the money flow. You remember them when it matters.",
  };
}

export function generateMoneyCircleOverall(
  totalRecipients: number,
  totalSent: number
): string {
  if (totalRecipients > 30) {
    return `You sent money to ${totalRecipients} different people! Your account is basically a community bank 🏦`;
  }
  if (totalRecipients > 20) {
    return `${totalRecipients} people received from you. Generosity is your middle name! 💝`;
  }
  if (totalRecipients > 10) {
    return `${totalRecipients} people in your money circle. Solid support system! 🤝`;
  }
  if (totalSent > 500000) {
    return `₦${formatCurrencyCompact(totalSent)} sent to others. You're everybody's favorite alert! 📱`;
  }

  return `You keep your circle tight. ${totalRecipients} trusted recipients.`;
}

// ============================================
// TIME/RHYTHM INSIGHTS
// ============================================

export interface RhythmInsight {
  title: string;
  description: string;
  emoji: string;
}

export function generateRhythmInsight(
  timeOfDay: { morning: number; afternoon: number; evening: number; night: number },
  weekendPercent: number
): RhythmInsight {
  const total = timeOfDay.morning + timeOfDay.afternoon + timeOfDay.evening + timeOfDay.night;

  const morningPercent = (timeOfDay.morning / total) * 100;
  const nightPercent = (timeOfDay.night / total) * 100;
  const eveningPercent = (timeOfDay.evening / total) * 100;

  // Night owl
  if (nightPercent > 20) {
    return {
      title: "Night Crawler",
      emoji: "🦉",
      description: `${nightPercent.toFixed(0)}% of your transactions happen when normal people are sleeping. The trenches never rest! 🌙`,
    };
  }

  // Early bird
  if (morningPercent > 40) {
    return {
      title: "Early Bird",
      emoji: "🌅",
      description: `You handle business before most people finish breakfast. ${morningPercent.toFixed(0)}% of spending before noon!`,
    };
  }

  // Weekend warrior
  if (weekendPercent > 45) {
    return {
      title: "Weekend Warrior",
      emoji: "🎉",
      description: `${weekendPercent.toFixed(0)}% of your spending happens on weekends. TGIF hits different for your wallet!`,
    };
  }

  // Evening spender
  if (eveningPercent > 35) {
    return {
      title: "Evening Spender",
      emoji: "🌆",
      description: `After work is when the wallet opens. ${eveningPercent.toFixed(0)}% of transactions in the evening.`,
    };
  }

  // Afternoon person
  return {
    title: "Afternoon Mover",
    emoji: "☀️",
    description: "Peak spending hours: afternoon. You like to handle business during daylight.",
  };
}

// ============================================
// PERSONALITY ROASTS
// ============================================

export interface PersonalityRoast {
  opener: string;
  body: string;
  prediction: string;
  traits: { label: string; emoji: string }[];
}

export function generatePersonalityRoast(
  archetype: MoneyArchetype,
  analysis: WrappedAnalysis
): PersonalityRoast {
  const topMerchant = analysis.merchants.top[0];
  const topRecipient = analysis.recipients.top[0];
  const avgTransaction = analysis.overview.averageTransaction;

  const roasts: Record<MoneyArchetype, PersonalityRoast> = {
    'The Foodie': {
      opener: "Your account has a DIRECT hotline to your stomach! 🍔",
      body: topMerchant
        ? `${topMerchant.name}, and every food spot in Lagos... they all have your number saved as "Valued Customer 💰". Home cooking? You don't know her.`
        : "Restaurants, fast food, street food - you've tried them all. Your kitchen is basically decorative at this point.",
      prediction: "2025 Prediction: Your kitchen will remain for decoration purposes only. Maybe you'll finally learn to boil egg?",
      traits: [
        { label: "Belly First", emoji: "🍖" },
        { label: "Restaurant VIP", emoji: "⭐" },
        { label: "Cooking Who?", emoji: "🙅" },
      ],
    },

    'The Social Butterfly': {
      opener: "Omo, you're EVERYBODY'S benefactor! 💝",
      body: topRecipient
        ? `You sent money to ${analysis.recipients.totalRecipients} different people! ${topRecipient.name} alone collected ${formatCurrency(topRecipient.totalAmount)}. Western Union is studying your methods.`
        : `${analysis.recipients.totalRecipients} people in your transfer history. Your WhatsApp is probably 90% "please help me with..." messages.`,
      prediction: "2025 Prediction: Your phone will still vibrate with transfer requests. You can't help it, you're too kind 🥹",
      traits: [
        { label: "Mobile ATM", emoji: "💸" },
        { label: "Family Pillar", emoji: "🏠" },
        { label: "Can't Say No", emoji: "🫠" },
      ],
    },

    'The Data Junkie': {
      opener: "Low data? You don't know her! 📱",
      body: `Your data and airtime spending is ELITE. While others ration their MB, you're streaming in 4K without fear. "WiFi available" means nothing to you - your data is always ON.`,
      prediction: "2025 Prediction: 5G will be your new bestie. Your data bundle will still finish before month end though 😭",
      traits: [
        { label: "Always Online", emoji: "📶" },
        { label: "Stream King", emoji: "📺" },
        { label: "Data is Life", emoji: "💉" },
      ],
    },

    'The Night Owl': {
      opener: "3AM and you're making PURCHASES? 🦉",
      body: `While others count sheep, you're counting items in cart. ${analysis.temporal.timeOfDayBreakdown.night.count} transactions happened when normal people are sleeping. The streets never sleep and neither does your wallet.`,
      prediction: "2025 Prediction: You'll discover that 4AM purchases feel different in the morning. No refunds on night decisions!",
      traits: [
        { label: "Midnight Shopper", emoji: "🌙" },
        { label: "Insomnia Spender", emoji: "😵‍💫" },
        { label: "Cart Before Sleep", emoji: "🛒" },
      ],
    },

    'The Weekend Warrior': {
      opener: "Weekdays are for SURVIVAL, weekends are for LIVING! 🎉",
      body: `Friday-Sunday is when your wallet truly opens. ${analysis.temporal.weekendVsWeekday.weekend.count} weekend transactions vs ${analysis.temporal.weekendVsWeekday.weekday.count} weekday. TGIF hits different for your account!`,
      prediction: "2025 Prediction: You'll continue funding the weekend economy. Monday balance notifications will remain scary 😱",
      traits: [
        { label: "TGIF Energy", emoji: "🎊" },
        { label: "Weekend Spender", emoji: "💃" },
        { label: "Monday Blues", emoji: "😰" },
      ],
    },

    'The Saver': {
      opener: "Money comes in, money stays in! 🐷",
      body: `Your credits beat your debits. While others are spending, you're stacking. Financial discipline is your middle name. The savings account is thriving!`,
      prediction: "2025 Prediction: You'll keep building. Investment apps will start recommending you to others 📈",
      traits: [
        { label: "Stack Builder", emoji: "🧱" },
        { label: "Discipline", emoji: "💪" },
        { label: "Future Secure", emoji: "🔒" },
      ],
    },

    'The Big Spender': {
      opener: "Small money? You don't know her! 💎",
      body: avgTransaction > 30000
        ? `Your average transaction is ${formatCurrency(avgTransaction)}. You don't do things small. When you enter the market, traders alert each other on WhatsApp.`
        : `When you spend, you SPEND. No half measures, no small purchases. Go big or go home is your philosophy.`,
      prediction: "2025 Prediction: Your POS machine will need therapy. But you'll look good spending it! ✨",
      traits: [
        { label: "Premium Only", emoji: "👑" },
        { label: "No Small Talk", emoji: "🎯" },
        { label: "Big Energy", emoji: "⚡" },
      ],
    },

    'The Subscription Addict': {
      opener: "If it has a monthly fee, YOU HAVE IT! 📺",
      body: `Netflix, Spotify, Canva, Starlink... your subscriptions have subscriptions. Direct debit is your love language. At least you're never bored!`,
      prediction: "2025 Prediction: You'll add 3 more subscriptions but cancel 0. 'I'll use it eventually' - you, every month 😂",
      traits: [
        { label: "Auto-Renew King", emoji: "🔄" },
        { label: "Never Bored", emoji: "🎬" },
        { label: "Cancel? Never", emoji: "🙅" },
      ],
    },

    'The Early Bird': {
      opener: "Rise and SPEND! 🌅",
      body: `While others are still snoozing, you're already making transactions. Morning hours are your peak spending time. Productivity king/queen!`,
      prediction: "2025 Prediction: 6AM will still find you handling business. Your bank app sees more sunrises than most people 🌄",
      traits: [
        { label: "Morning Person", emoji: "☀️" },
        { label: "Early Moves", emoji: "🏃" },
        { label: "Productive", emoji: "✅" },
      ],
    },

    'The Steady Eddie': {
      opener: "Balanced. Predictable. Responsible. ⚖️",
      body: `No extreme highs, no extreme lows. Your spending is consistent and measured. Banks love you. Financial planners want to study you.`,
      prediction: "2025 Prediction: You'll continue being the example others should follow. Boring? Maybe. Smart? Definitely! 🧠",
      traits: [
        { label: "Consistent", emoji: "📊" },
        { label: "Predictable", emoji: "🎯" },
        { label: "Responsible", emoji: "✨" },
      ],
    },
  };

  return roasts[archetype] || roasts['The Steady Eddie'];
}

// ============================================
// JOURNEY/TIMELINE INSIGHTS
// ============================================

export function generateJourneyInsight(
  peakMonth: { monthName: string; amount: number; count: number } | null,
  months: { monthName: string; debits: number }[]
): string {
  if (!peakMonth) return "Your spending journey continues...";

  const monthVibes: Record<string, string> = {
    'January': "New year, new spending habits... or not 😂",
    'February': "Valentine's month came with expenses!",
    'March': "March madness hit your wallet!",
    'April': "April showers brought spending powers 💸",
    'May': "May was a whole mood!",
    'June': "Mid-year, the money was moving!",
    'July': "July had you in your bag... spending it 💰",
    'August': "August was ACTIVE!",
    'September': "Ember months started strong!",
    'October': "October was your ODOGWU month! 🔥",
    'November': "November came with the vibes!",
    'December': "Detty December was REAL! 🎄",
  };

  const vibe = monthVibes[peakMonth.monthName] || `${peakMonth.monthName} was something else!`;

  return `${peakMonth.monthName} was your peak month with ${formatCurrency(peakMonth.amount)} spent. ${vibe}`;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatHour(hour: number): string {
  if (hour === 0) return "12AM";
  if (hour === 12) return "12PM";
  if (hour < 12) return `${hour}AM`;
  return `${hour - 12}PM`;
}
