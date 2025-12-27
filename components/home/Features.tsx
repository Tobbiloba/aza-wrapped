'use client';

import { motion } from 'motion/react';

const features = [
  {
    emoji: '📊',
    title: 'Spending Breakdown',
    description: 'See where your money goes with category insights',
  },
  {
    emoji: '🏪',
    title: 'Top Merchants',
    description: 'Discover your favorite stores and how much you spent',
  },
  {
    emoji: '👥',
    title: 'Transfer Insights',
    description: 'See who you sent the most money to',
  },
  {
    emoji: '🎭',
    title: 'Money Personality',
    description: 'Find out your unique spending archetype',
  },
  {
    emoji: '📅',
    title: 'Time Patterns',
    description: 'When do you spend the most? Weekend or weekday?',
  },
  {
    emoji: '🔥',
    title: 'Streaks & Records',
    description: 'Your longest no-spend streak and biggest day',
  },
];

export function Features() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="mt-20 max-w-6xl mx-auto"
    >
      <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-12">
        What You&apos;ll Discover
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
            className="p-6 rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl transition-all"
          >
            <div className="text-4xl mb-4">{feature.emoji}</div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
