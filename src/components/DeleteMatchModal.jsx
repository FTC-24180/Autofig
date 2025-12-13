export function DeleteMatchModal({ isOpen, matchNumber, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4 safe-area">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-red-300 dark:border-red-500/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200">Delete Match</h3>
            <p className="text-sm text-red-600 dark:text-red-400">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete <strong className="font-semibold text-gray-900 dark:text-gray-100">Match #{matchNumber}</strong>?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 active:bg-gray-400 text-gray-700 dark:text-gray-100 rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
