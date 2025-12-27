import { Category } from '@/types/transaction';
import { MoneyArchetype } from '@/types/analysis';

export const CATEGORY_COLORS: Record<Category, string> = {
  food: '#FF6B6B',
  transport: '#4ECDC4',
  data: '#45B7D1',
  airtime: '#96CEB4',
  bills: '#FFEAA7',
  entertainment: '#DDA0DD',
  shopping: '#98D8C8',
  subscriptions: '#F7DC6F',
  transfers: '#BB8FCE',
  pos: '#85C1E9',
  other: '#AEB6BF',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  food: 'Food & Dining',
  transport: 'Transport',
  data: 'Mobile Data',
  airtime: 'Airtime',
  bills: 'Bills & Utilities',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  subscriptions: 'Subscriptions',
  transfers: 'Transfers',
  pos: 'POS Purchases',
  other: 'Other',
};

export const CATEGORY_EMOJIS: Record<Category, string> = {
  food: '🍔',
  transport: '🚗',
  data: '📱',
  airtime: '📞',
  bills: '💡',
  entertainment: '🎬',
  shopping: '🛍️',
  subscriptions: '📺',
  transfers: '💸',
  pos: '💳',
  other: '📦',
};

export const ARCHETYPE_INFO: Record<
  MoneyArchetype,
  { emoji: string; description: string; traits: string[] }
> = {
  'The Foodie': {
    emoji: '🍕',
    description: 'Your wallet knows every restaurant in town. Food is love, food is life!',
    traits: ['Loves dining out', 'Supports local restaurants', 'Appreciates good food'],
  },
  'The Social Butterfly': {
    emoji: '🦋',
    description: 'You\'re always sending money to friends and family. Generosity is your middle name!',
    traits: ['Generous with loved ones', 'Strong social connections', 'Always helping out'],
  },
  'The Data Junkie': {
    emoji: '📶',
    description: 'Always online, always connected. Your data subscription game is strong!',
    traits: ['Heavy internet user', 'Loves staying connected', 'Digital native'],
  },
  'The Night Owl': {
    emoji: '🦉',
    description: 'The night is young when you\'re just getting started. Late-night transactions are your thing!',
    traits: ['Active at night', 'Enjoys nightlife', 'Burns the midnight oil'],
  },
  'The Weekend Warrior': {
    emoji: '🎉',
    description: 'Weekends are for spending! You work hard and play harder.',
    traits: ['Loves weekends', 'Work-life balance', 'Makes time for fun'],
  },
  'The Saver': {
    emoji: '🐷',
    description: 'Money comes in, but it doesn\'t rush out. You\'re building that financial future!',
    traits: ['Financially disciplined', 'Future-focused', 'Smart with money'],
  },
  'The Big Spender': {
    emoji: '💎',
    description: 'Life is too short for small transactions. You go big or go home!',
    traits: ['Enjoys luxury', 'Lives in the moment', 'Values experiences'],
  },
  'The Subscription Addict': {
    emoji: '📺',
    description: 'Netflix, Spotify, Canva... you\'ve got a subscription for everything!',
    traits: ['Loves digital services', 'Values convenience', 'Tech-savvy'],
  },
  'The Early Bird': {
    emoji: '🌅',
    description: 'Rise and grind! Your transactions start with the sunrise.',
    traits: ['Morning person', 'Productive early hours', 'Organized lifestyle'],
  },
  'The Steady Eddie': {
    emoji: '⚖️',
    description: 'Balanced and consistent. No extremes here, just steady financial flow.',
    traits: ['Predictable habits', 'Consistent spending', 'Stable lifestyle'],
  },
};

export const SLIDE_GRADIENTS = [
  'from-purple-600 to-blue-600',
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-amber-500',
  'from-violet-500 to-purple-500',
  'from-red-500 to-pink-500',
  'from-teal-500 to-cyan-500',
  'from-indigo-500 to-violet-500',
  'from-yellow-500 to-orange-500',
];

export const SUBSCRIPTION_KEYWORDS = [
  { name: 'Netflix', pattern: /netflix/i },
  { name: 'Spotify', pattern: /spotify/i },
  { name: 'Canva', pattern: /canva/i },
  { name: 'Starlink', pattern: /starlink/i },
  { name: 'YouTube Premium', pattern: /youtube.*premium/i },
  { name: 'Amazon Prime', pattern: /amazon.*prime/i },
  { name: 'Apple Music', pattern: /apple.*music/i },
  { name: 'DStv', pattern: /dstv/i },
  { name: 'GOtv', pattern: /gotv/i },
  { name: 'Showmax', pattern: /showmax/i },
  { name: 'Udemy', pattern: /udemy/i },
];

export const FOOD_MERCHANTS = [
  'chicken republic',
  'kfc',
  'dominos',
  'pizza hut',
  'mr biggs',
  'tantalizers',
  'sweet sensation',
  'kilimanjaro',
  'bukka hut',
  'the place',
  'barcelos',
  'cold stone',
  'ice cream factory',
  'food concepts',
  'baguette',
];
