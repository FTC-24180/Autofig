export function StartPositionPicker({
  startPositions,
  onSelectPosition,
  currentPosition
}) {
  return (
    <div className="space-y-2">
      {/* Preset Positions */}
      <div className="space-y-2">
        {startPositions.map(pos => {
          const isSelected = currentPosition?.type === pos.key;
          return (
            <button
              key={pos.key}
              onClick={() => onSelectPosition({ type: pos.key })}
              className={`w-full text-left p-4 min-h-[56px] touch-manipulation rounded-lg transition ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-gray-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1">
                  <div className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
                    {pos.label}
                  </div>
                  <div className={`text-xs font-mono ${isSelected ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {pos.key}
                  </div>
                </div>
                {isSelected && (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Position */}
      <button
        onClick={() => onSelectPosition({ type: 'S0', x: 0, y: 0, theta: 0 })}
        className={`w-full text-left p-4 min-h-[56px] touch-manipulation rounded-lg transition ${
          currentPosition?.type === 'S0'
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-gray-200 dark:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <div className="flex-1">
            <div className={`font-semibold ${currentPosition?.type === 'S0' ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
              Custom Position
            </div>
            <div className={`text-xs ${currentPosition?.type === 'S0' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
              Configure X, Y, and heading
            </div>
          </div>
          {currentPosition?.type === 'S0' && (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
}
