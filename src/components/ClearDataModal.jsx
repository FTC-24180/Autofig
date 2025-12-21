export function ClearDataModal({ isOpen, onClose, onConfirm, options, onOptionsChange }) {
  if (!isOpen) return null;

  const handleToggle = (key) => {
    onOptionsChange({
      ...options,
      [key]: !options[key]
    });
  };

  const dataTypes = [
    { key: 'matches', label: 'Match Data', description: 'All configured matches and their actions' },
    { key: 'defaultMatchTemplate', label: 'Default Match Template', description: 'Saved default configuration for quick match creation' },
    { key: 'templates', label: 'Saved Configurations', description: 'Templates for action groups and positions' },
    { key: 'actionGroups', label: 'Custom Actions', description: 'Custom action groups and types' },
    { key: 'startPositions', label: 'Start Positions', description: 'Custom start position presets' },
    { key: 'themePreference', label: 'Theme Preference', description: 'Light/Dark mode settings' },
    { key: 'unitsPreference', label: 'DistanceUnits Preference', description: 'Inches/Meters unit settings' },
    { key: 'angleUnitsPreference', label: 'Angle Units Preference', description: 'Degrees/Radians angle settings' }
  ];

  const selectedCount = Object.values(options).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full max-h-full flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="bg-red-50 dark:bg-red-500/10 border-b border-red-200 dark:border-red-500/30 px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900 dark:text-red-100">Clear Data</h3>
              <p className="text-sm text-red-700 dark:text-red-300">Select data to delete</p>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
            Choose which data to permanently delete:
          </p>
          
          <div className="space-y-3 mb-6">
            {dataTypes.map(({ key, label, description }) => (
              <label
                key={key}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 transition cursor-pointer touch-manipulation ${
                  options[key]
                    ? 'border-red-500 bg-red-50 dark:bg-red-500/10'
                    : 'border-gray-300 dark:border-slate-700 bg-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={() => handleToggle(key)}
                  className="mt-1 w-5 h-5 text-red-600 border-gray-300 dark:border-slate-600 rounded focus:ring-red-500 focus:ring-2 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{label}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{description}</div>
                </div>
              </label>
            ))}
          </div>

          {selectedCount === 0 && (
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  No data types selected. Select at least one to continue.
                </p>
              </div>
            </div>
          )}

          {selectedCount > 0 && (
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong className="font-semibold">Warning:</strong> This action cannot be undone. The app will reload after clearing.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions - Fixed */}
        <div className="bg-gray-50 dark:bg-slate-800 px-6 py-4 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 active:bg-gray-100 text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={selectedCount === 0}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition min-h-[48px] touch-manipulation ${
              selectedCount === 0
                ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
