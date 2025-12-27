'use client';

import { motion } from 'motion/react';

const steps = [
  {
    number: 1,
    title: 'Open OPay App',
    description: 'Launch your OPay mobile app on your phone',
    emoji: '📱',
  },
  {
    number: 2,
    title: 'Go to Statements',
    description: 'Navigate to Account → Statements or History',
    emoji: '📊',
  },
  {
    number: 3,
    title: 'Export as CSV',
    description: 'Select your date range and download as CSV file',
    emoji: '💾',
  },
  {
    number: 4,
    title: 'Upload Here',
    description: 'Drag and drop or select your downloaded CSV file',
    emoji: '🚀',
  },
];

export function DownloadInstructions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mt-20 max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          How to Get Started
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Download your bank statement in just a few simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-full shadow-lg hover:shadow-xl transition-shadow">
              {/* Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">{step.number}</span>
              </div>

              {/* Emoji */}
              <div className="text-5xl mb-4 text-center">{step.emoji}</div>

              {/* Content */}
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 text-center">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 text-center"
      >
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          <span className="font-black">💡 Tip:</span> Make sure to export your statement as CSV format for the best results
        </p>
      </motion.div>
    </motion.div>
  );
}



