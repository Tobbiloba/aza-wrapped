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

export default function UploadPage() {
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
            console.warn('AI insights failed, continuing without them');
          }
        } catch (aiError) {
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
    <section className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col justify-center items-center py-8 sm:py-12 md:py-20 px-4">
      {/* Background Kinetic Blocks */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[#FF00FE] z-0 origin-bottom"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)' }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          <h1 className="text-3xl sm:text-5xl md:text-8xl font-black leading-none text-white uppercase tracking-tighter mb-4">
            UPLOAD YOUR <br />
            <span className="text-black italic">STATEMENT</span>
          </h1>
          <p className="text-sm sm:text-lg md:text-2xl text-white/80 font-medium">
            Drop your CSV file here to get started
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label
            htmlFor="file-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative block w-full p-6 sm:p-12 md:p-20 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-dashed
              transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm
              ${
                isDragging
                  ? 'border-[#1DB954] bg-[#1DB954]/20 scale-[1.02]'
                  : 'border-white/30 hover:border-[#1DB954] hover:bg-white/20'
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
                      className="text-4xl sm:text-6xl md:text-8xl mb-4 sm:mb-6"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      {progress < 60 ? '📊' : progress < 90 ? '🔥' : '✨'}
                    </motion.div>
                    <p className="text-lg sm:text-2xl md:text-3xl font-black text-white mb-3 sm:mb-4">
                      {progressMessage || 'Processing...'}
                    </p>
                    <div className="w-full max-w-md mx-auto bg-white/20 rounded-full h-2 sm:h-4 mb-3 sm:mb-4">
                      <motion.div
                        className="bg-[#1DB954] h-2 sm:h-4 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-white/80">{fileName}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-5xl sm:text-7xl md:text-9xl mb-4 sm:mb-6 md:mb-8">📄</div>
                    <p className="text-xl sm:text-3xl md:text-5xl font-black text-white mb-3 sm:mb-4">
                      DROP YOUR CSV FILE
                    </p>
          <p className="text-sm sm:text-base md:text-xl text-white/80 mb-4 sm:mb-6 md:mb-8">
            or click to browse files (CSV, XLSX)
          </p>
                    <span className="inline-block px-6 sm:px-10 md:px-12 py-3 sm:py-4 md:py-6 bg-black text-white rounded-full font-black text-sm sm:text-base md:text-xl hover:bg-[#1DB954] transition-colors">
                      CHOOSE FILE
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
                className="mt-4 sm:mt-6 p-4 sm:p-6 bg-red-500/20 border-2 sm:border-4 border-red-500 rounded-xl sm:rounded-2xl"
              >
                <p className="text-red-200 text-center font-bold text-sm sm:text-base md:text-lg">
                  {errorMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help Link */}
          <div className="mt-4 sm:mt-6 md:mt-8 text-center">
            <Link 
              href="/tutorial"
              className="text-white/60 hover:text-[#1DB954] font-bold text-xs sm:text-sm md:text-lg underline transition-colors"
            >
              Not sure how to get your statement? →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="hidden lg:block absolute p-6 rounded-2xl shadow-2xl border-4 border-black"
        style={{ backgroundColor: '#FF5733', left: '10%', top: '20%', rotate: -12 }}
      >
        <p className="text-black font-bold uppercase text-xs">Format</p>
        <p className="text-black font-black text-3xl">CSV</p>
      </motion.div>
    </section>
  );
}

