'use client';

import { useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { useWrappedStore } from '@/store/wrapped-store';
import { ProgressBar } from './ProgressBar';

// New streamlined slides
import { IntroSlide } from './slides/IntroSlide';
import { OverviewSlide } from './slides/OverviewSlide';
import { OdogwuDaySlide } from './slides/OdogwuDaySlide';
import { YourSpotsSlide } from './slides/YourSpotsSlide';
import { MoneyCircleSlide } from './slides/MoneyCircleSlide';
import { CategoryBreakdownSlide } from './slides/CategoryBreakdownSlide';
import { YourRhythmSlide } from './slides/YourRhythmSlide';
import { TheJourneySlide } from './slides/TheJourneySlide';
import { PersonalitySlide } from './slides/PersonalitySlide';
import { SummarySlide } from './slides/SummarySlide';

export function WrappedContainer() {
  const { analysis, aiInsights, currentSlide, totalSlides, nextSlide, prevSlide } =
    useWrappedStore();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Handle click/tap navigation
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't navigate if clicking a link or button
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        return;
      }

      const x = e.clientX;
      const width = window.innerWidth;

      if (x < width / 3) {
        prevSlide();
      } else {
        nextSlide();
      }
    },
    [nextSlide, prevSlide]
  );

  // Handle touch/swipe navigation
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  if (!analysis) {
    return null;
  }

  // 10 Slides:
  // 0. Intro
  // 1. Overview (transactions + money flow)
  // 2. Odogwu Day (biggest spending day)
  // 3. Your Spots (top merchants)
  // 4. Money Circle (top recipients)
  // 5. The Breakdown (categories)
  // 6. Your Rhythm (time patterns)
  // 7. The Journey (timeline + peak month)
  // 8. Personality (archetype + roast)
  // 9. Summary (shareable card)

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return (
          <IntroSlide
            key="intro"
            periodStart={analysis.period.start}
            periodEnd={analysis.period.end}
            accountName={analysis.metadata.accountName}
            aiInsights={aiInsights?.intro}
          />
        );

      case 1:
        return (
          <OverviewSlide
            key="overview"
            totalTransactions={analysis.overview.totalTransactions}
            totalCredits={analysis.overview.totalCredits}
            totalDebits={analysis.overview.totalDebits}
            days={analysis.period.totalDays}
            aiInsights={aiInsights?.overview}
          />
        );

      case 2:
        return (
          <OdogwuDaySlide
            key="odogwu-day"
            date={analysis.temporal.peakSpendingDay.date}
            amount={analysis.temporal.peakSpendingDay.amount}
            transactionCount={analysis.temporal.peakSpendingDay.transactionCount}
            transactions={analysis.temporal.peakSpendingDay.transactions}
            aiInsights={aiInsights?.odogwuDay}
          />
        );

      case 3:
        return (
          <YourSpotsSlide
            key="your-spots"
            merchants={analysis.merchants.top}
            aiInsights={aiInsights?.yourSpots}
          />
        );

      case 4:
        return (
          <MoneyCircleSlide
            key="money-circle"
            recipients={analysis.recipients.top}
            totalRecipients={analysis.recipients.totalRecipients}
            totalSent={analysis.recipients.totalSentToOthers}
            aiInsights={aiInsights?.moneyCircle}
          />
        );

      case 5:
        return (
          <CategoryBreakdownSlide
            key="categories"
            categories={analysis.categories.breakdown}
            aiInsights={aiInsights?.categories}
          />
        );

      case 6:
        return (
          <YourRhythmSlide
            key="your-rhythm"
            timeOfDay={analysis.temporal.timeOfDayBreakdown}
            weekendVsWeekday={analysis.temporal.weekendVsWeekday}
            aiInsights={aiInsights?.rhythm}
          />
        );

      case 7:
        return (
          <TheJourneySlide
            key="the-journey"
            months={analysis.temporal.byMonth}
            peakMonth={analysis.temporal.peakMonth}
            aiInsights={aiInsights?.journey}
          />
        );

      case 8:
        return (
          <PersonalitySlide
            key="personality"
            analysis={analysis}
            aiInsights={aiInsights?.personality}
          />
        );

      case 9:
        return (
          <SummarySlide
            key="summary"
            analysis={analysis}
            aiInsights={aiInsights?.summary}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="fixed inset-0 overflow-hidden cursor-pointer select-none"
    >
      <ProgressBar current={currentSlide} total={totalSlides} />

      <AnimatePresence mode="wait">{renderSlide()}</AnimatePresence>
    </div>
  );
}
