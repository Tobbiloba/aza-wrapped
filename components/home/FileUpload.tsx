'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWrappedStore } from '@/store/wrapped-store';
import { parseOpayStatement } from '@/lib/parsers/opay-parser';
import { validateFile, readFileAsText, readXLSXAsRows } from '@/lib/parsers/file-reader';
import { analyzeTransactions } from '@/lib/analysis/analyzer';
import { prepareAnalysisSummary } from '@/lib/analysis/prepare-summary';
import { AIInsights } from '@/types/insights';

export function FileUpload() {
  const router = useRouter();
  const {
    setTransactions,
    setAnalysis,
    setAIInsights,
    setLoading,
    setError,
    isLoading,
  } = useWrappedStore();

  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        setErrorMessage(validation.error || 'Invalid file');
        return;
      }

      setFileName(file.name);
      setErrorMessage(null);
      setLoading(true);
      setProgress(10);
      setProgressMessage('Reading your statement...');

      try {
        let rows: string[][];

        // Read file based on type
        setProgress(20);
        if (validation.type === 'csv') {
          const csvText = await readFileAsText(file);
          // Parse CSV to rows
          const Papa = (await import('papaparse')).default;
          const result = Papa.parse<string[]>(csvText, {
            header: false,
            skipEmptyLines: true,
          });
          rows = result.data;
        } else if (validation.type === 'xlsx') {
          rows = await readXLSXAsRows(file);
        } else {
          throw new Error('PDF parsing is not yet supported. Please use CSV or XLSX format.');
        }

        // Parse statement
        setProgress(30);
        setProgressMessage('Parsing transactions...');
        const { metadata, transactions } = parseOpayStatement(rows);

        if (transactions.length === 0) {
          throw new Error('No transactions found in this file');
        }

        setTransactions(transactions);
        setProgress(40);

        // Analyze transactions
        setProgress(50);
        setProgressMessage('Analyzing your spending...');
        const analysis = analyzeTransactions(transactions, metadata);
        setAnalysis(analysis);

        // Generate AI insights
        setProgress(60);
        setProgressMessage('Generating your roasts...');

        try {
          const summary = prepareAnalysisSummary(analysis);
          const response = await fetch('/api/generate-insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(summary),
          });

          if (response.ok) {
            const insights: AIInsights = await response.json();
            setAIInsights(insights);
            setProgress(90);
            setProgressMessage('Preparing your wrapped...');
          } else {
            // AI failed but we can continue without it
            console.warn('AI insights failed, continuing without them');
          }
        } catch (aiError) {
          // AI failed but we can continue without it
          console.warn('AI insights failed:', aiError);
        }

        setProgress(100);
        setProgressMessage('Ready!');

        // Navigate to wrapped experience
        setTimeout(() => {
          router.push('/wrapped');
        }, 500);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to process file';
        setErrorMessage(message);
        setError(message);
        setProgress(0);
        setProgressMessage('');
        setFileName(null);
      } finally {
        setLoading(false);
      }
    },
    [router, setTransactions, setAnalysis, setAIInsights, setLoading, setError]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="w-full max-w-2xl mx-auto mt-16"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">
          Upload Your Statement
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Drag and drop or click to select your CSV file
        </p>
      </div>

      <label
        htmlFor="file-upload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative block w-full p-12 sm:p-16 rounded-3xl border-2 border-dashed
          transition-all duration-300 cursor-pointer bg-gray-50 dark:bg-gray-900
          ${
            isDragging
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 scale-[1.02] shadow-xl'
              : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
          ${isLoading ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        <input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="sr-only"
          disabled={isLoading}
        />

        <div className="text-center">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="text-6xl mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  {progress < 60 ? '📊' : progress < 90 ? '🔥' : '✨'}
                </motion.div>
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {progressMessage || 'Processing...'}
                </p>
                <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
                  <motion.div
                    className="bg-purple-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{fileName}</p>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-7xl mb-6">📄</div>
                <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-3">
                  Drop your CSV file here
                </p>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
                  or click to browse files
                </p>
                    <span className="inline-block px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg">
                      Choose File
                    </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </label>

      {/* Error message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl"
          >
            <p className="text-red-600 dark:text-red-400 text-center font-medium">
              {errorMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
