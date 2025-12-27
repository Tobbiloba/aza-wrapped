import { create } from 'zustand';
import { Transaction } from '@/types/transaction';
import { WrappedAnalysis } from '@/types/analysis';
import { AIInsights } from '@/types/insights';

interface WrappedState {
  // Raw data
  rawTransactions: Transaction[];

  // Analysis results
  analysis: WrappedAnalysis | null;

  // AI-generated insights
  aiInsights: AIInsights | null;
  isGeneratingInsights: boolean;

  // UI state
  currentSlide: number;
  totalSlides: number;
  isLoading: boolean;
  isAnalyzing: boolean;
  error: string | null;

  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  setAnalysis: (analysis: WrappedAnalysis) => void;
  setAIInsights: (insights: AIInsights) => void;
  setGeneratingInsights: (generating: boolean) => void;
  setLoading: (loading: boolean) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setError: (error: string | null) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  reset: () => void;
}

const TOTAL_SLIDES = 10;

export const useWrappedStore = create<WrappedState>((set, get) => ({
  rawTransactions: [],
  analysis: null,
  aiInsights: null,
  isGeneratingInsights: false,
  currentSlide: 0,
  totalSlides: TOTAL_SLIDES,
  isLoading: false,
  isAnalyzing: false,
  error: null,

  setTransactions: (transactions) =>
    set({ rawTransactions: transactions, error: null, currentSlide: 0 }),

  setAnalysis: (analysis) => set({ analysis, isAnalyzing: false, currentSlide: 0 }),

  setAIInsights: (insights) => set({ aiInsights: insights, isGeneratingInsights: false }),

  setGeneratingInsights: (isGeneratingInsights) => set({ isGeneratingInsights }),

  setLoading: (isLoading) => set({ isLoading }),

  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

  setError: (error) => set({ error, isLoading: false, isAnalyzing: false, isGeneratingInsights: false }),

  nextSlide: () => {
    const { currentSlide, totalSlides } = get();
    if (currentSlide < totalSlides - 1) {
      set({ currentSlide: currentSlide + 1 });
    }
  },

  prevSlide: () => {
    const { currentSlide } = get();
    if (currentSlide > 0) {
      set({ currentSlide: currentSlide - 1 });
    }
  },

  goToSlide: (index) => {
    const { totalSlides } = get();
    if (index >= 0 && index < totalSlides) {
      set({ currentSlide: index });
    }
  },

  reset: () =>
    set({
      rawTransactions: [],
      analysis: null,
      aiInsights: null,
      isGeneratingInsights: false,
      currentSlide: 0,
      isLoading: false,
      isAnalyzing: false,
      error: null,
    }),
}));
