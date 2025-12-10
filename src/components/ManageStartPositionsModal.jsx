import { useState } from 'react';

function AddStartPositionForm({ onAdd }) {
  const [id, setId] = useState('');
  const [label, setLabel] = useState('');
  return (
    <div className="flex gap-2 items-center mt-2">
      <input
        placeholder="position id (e.g. left)"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded w-40"
      />
      <input
        placeholder="label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded flex-1"
      />
      <button
        onClick={() => {
          if (!id) return;
          onAdd({ id, label: label || id });
          setId('');
          setLabel('');
        }}
        className="flex items-center gap-1 py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add
      </button>
    </div>
  );
}

export function ManageStartPositionsModal({
  startPositions,
  onClose,
  onExportConfig,
  onAddStartPosition,
  onUpdateStartPosition,
  onDeleteStartPosition
}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 flex items-start justify-center overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4 my-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Configure Start Positions</h3>
          <div className="flex gap-2">
            <button onClick={onExportConfig} className="flex items-center gap-1 py-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            <button onClick={onClose} className="py-1 px-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-gray-100 rounded transition">
              Close
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100">Available Start Positions</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Configure preset starting positions for your robot. Custom position is always available.
          </p>
        </div>

        <div className="space-y-2">
          {startPositions.map((pos, idx) => (
            <div key={pos.id + idx} className="flex gap-2 items-center border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 rounded">
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                value={pos.id}
                onChange={(e) => onUpdateStartPosition(idx, { id: e.target.value })}
                className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 rounded w-32"
                placeholder="ID"
              />
              <input
                value={pos.label}
                onChange={(e) => onUpdateStartPosition(idx, { label: e.target.value })}
                className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 rounded flex-1"
                placeholder="Label"
              />
              <button
                onClick={() => onDeleteStartPosition(idx)}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-red-600 transition"
                title="Delete position"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}

          <AddStartPositionForm onAdd={onAddStartPosition} />
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Start positions define preset locations. The &quot;Custom&quot; position with configurable X, Y, ? (theta) is always available and cannot be removed.
          </p>
        </div>
      </div>
    </div>
  );
}
