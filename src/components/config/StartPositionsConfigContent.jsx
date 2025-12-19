import { useRef } from 'react';
import { AddItemForm } from '../common/AddItemForm';

export function StartPositionsConfigContent({
  startPositions,
  onAddStartPosition,
  onUpdateStartPosition,
  onDeleteStartPosition,
  onExportConfig,
  error,
  clearError
}) {
  // Track previous valid labels for each position
  const previousLabelsRef = useRef({});

  // Add custom position (S0) to the display list
  const allPositions = [
    { key: 'S0', label: 'Custom', isSystem: true },
    ...startPositions
  ];

  const handleLabelFocus = (actualIdx, currentLabel) => {
    // Store the current valid label when user starts editing
    previousLabelsRef.current[actualIdx] = currentLabel;
  };

  const handleLabelBlur = (actualIdx, currentLabel) => {
    // If there's an error on this field, revert to previous valid value
    if (error?.index === actualIdx) {
      const previousLabel = previousLabelsRef.current[actualIdx];
      if (previousLabel !== undefined) {
        onUpdateStartPosition(actualIdx, { label: previousLabel });
      }
      clearError();
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Configure preset starting positions. Keys are auto-generated in S{'{n}'} format.
      </p>

      <div className="space-y-2">
        {allPositions.map((pos, idx) => {
          const isCustom = pos.key === 'S0';
          const actualIdx = isCustom ? -1 : idx - 1; // Adjust index for non-custom positions
          
          return (
            <div key={pos.key || idx} className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 rounded">
              <div className="flex gap-2 items-center">
                <svg className="w-4 h-4 text-gray-700 dark:text-gray-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Read-only key display */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 w-12">Key:</label>
                    <div className="px-3 py-1.5 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 border-2 border-gray-400 dark:border-slate-500 rounded text-xs font-mono font-bold text-gray-900 dark:text-gray-100 shadow-inner">
                      {pos.key}
                    </div>
                    {isCustom && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">(System)</span>
                    )}
                  </div>
                  {/* Label - editable only for non-custom positions */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 w-12">Label:</label>
                    {isCustom ? (
                      <div className="flex-1 px-2 py-1 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded text-xs text-gray-700 dark:text-gray-300">
                        {pos.label}
                      </div>
                    ) : (
                      <div className="flex-1">
                        <input
                          value={pos.label}
                          onFocus={() => handleLabelFocus(actualIdx, pos.label)}
                          onChange={(e) => onUpdateStartPosition(actualIdx, { label: e.target.value })}
                          onBlur={() => handleLabelBlur(actualIdx, pos.label)}
                          className={`w-full px-2 py-1 border ${
                            error?.index === actualIdx ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-slate-600'
                          } bg-white dark:bg-slate-900 dark:text-gray-100 rounded text-xs ${
                            error?.index === actualIdx ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'
                          } focus:ring-2`}
                          placeholder="Display label (app use only)"
                        />
                        {error?.index === actualIdx && (
                          <div className="flex items-start gap-1 mt-1 text-xs text-red-600 dark:text-red-400">
                            <svg className="w-3 h-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error.message}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Delete button - hidden for custom position */}
                {!isCustom && (
                  <button
                    onClick={() => onDeleteStartPosition(actualIdx)}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-red-600 flex-shrink-0"
                    title="Delete position"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                {isCustom && (
                  <div className="w-6 h-6 flex-shrink-0" />
                )}
              </div>
            </div>
          );
        })}

        <button
          onClick={() => onAddStartPosition()}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-sm font-semibold transition min-h-[40px] touch-manipulation"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Position
        </button>
      </div>

      <div className="p-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-800 dark:text-blue-200">
        <strong>Note:</strong> Position keys (S1, S2, etc.) are auto-generated and used in QR codes. Labels are for display in the app only. Custom position (S0) is reserved and always available.
      </div>
    </div>
  );
}
