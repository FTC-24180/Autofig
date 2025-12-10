import { WizardStep } from '../WizardStep';

export function Step4StartPosition({ 
  startPosition, 
  onStartPositionChange,
  startPositions,
  onUpdateField
}) {
  const getStartPositionLabel = () => {
    const pos = startPositions.find(p => p.id === startPosition.type);
    if (pos) return pos.label;
    if (startPosition.type === 'custom') {
      const x = startPosition.x ?? 0;
      const y = startPosition.y ?? 0;
      const theta = startPosition.theta ?? 0;
      return `Custom (${x}, ${y}, ${theta}°)`;
    }
    return 'Unknown';
  };

  return (
    <WizardStep 
      title="Starting Position"
      subtitle="Choose your robot's starting position"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
            Select Position
          </label>
          <div className="grid grid-cols-2 gap-3">
            {startPositions.map(pos => (
              <button
                key={pos.id}
                onClick={() => onStartPositionChange({ type: pos.id })}
                className={`p-4 rounded-lg font-semibold transition-all ${
                  startPosition.type === pos.id
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-300 shadow-lg'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {pos.label}
              </button>
            ))}
            <button
              onClick={() => onStartPositionChange({ type: 'custom', x: 0, y: 0, theta: 0 })}
              className={`p-4 rounded-lg font-semibold transition-all ${
                startPosition.type === 'custom'
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-300 shadow-lg'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        {startPosition.type === 'custom' && (
          <div className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Custom Position</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  X Position
                </label>
                <input
                  type="number"
                  value={startPosition.x ?? 0}
                  onChange={(e) => onUpdateField('x', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Y Position
                </label>
                <input
                  type="number"
                  value={startPosition.y ?? 0}
                  onChange={(e) => onUpdateField('y', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Angle (?°)
                </label>
                <input
                  type="number"
                  value={startPosition.theta ?? 0}
                  onChange={(e) => onUpdateField('theta', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  step="1"
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">Current Position</h4>
              <p className="text-sm text-indigo-900 dark:text-indigo-200">
                {getStartPositionLabel()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </WizardStep>
  );
}
