import { useState } from 'react';

export function WizardNavigation({ currentStep, totalSteps, onNext, onPrev, canGoNext = true, nextLabel = 'Next' }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-slate-700 px-4 py-2 shadow-lg z-30 safe-bottom">
      <div className="flex items-center justify-between gap-3 max-w-sm mx-auto pb-1">
        {/* Previous Button - Compact Icon */}
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className={`flex items-center justify-center p-2 rounded-lg transition min-h-[40px] min-w-[40px] touch-manipulation ${
            currentStep === 0
              ? 'bg-gray-50 dark:bg-slate-800 text-gray-300 dark:text-gray-700 cursor-not-allowed'
              : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95'
          }`}
          aria-label="Previous step"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Compact Step Indicator */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === currentStep
                  ? 'w-6 bg-indigo-600'
                  : index < currentStep
                  ? 'w-1 bg-indigo-400'
                  : 'w-1 bg-gray-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Next Button - Compact Icon */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center justify-center p-2 rounded-lg transition min-h-[40px] min-w-[40px] touch-manipulation ${
            !canGoNext
              ? 'bg-indigo-200 dark:bg-indigo-900/30 text-indigo-400 dark:text-indigo-800 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md'
          }`}
          aria-label={nextLabel}
        >
          {currentStep === totalSteps - 1 ? (
            // Checkmark for final step
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            // Arrow for other steps
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
