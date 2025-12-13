export function ConfirmClearDataModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex items-center justify-center p-4 safe-area">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border-2 border-red-500">
        {/* Header */}
        <div className="bg-red-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Final Confirmation</h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-700 dark:text-gray-300 text-center text-lg font-semibold mb-3">
            Are you absolutely sure?
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
            This will delete <strong className="text-red-600 dark:text-red-400">ALL</strong> of your data and cannot be recovered.
          </p>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 dark:bg-slate-800 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 active:bg-gray-100 text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
          >
            No, Keep Data
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg font-bold transition min-h-[48px] touch-manipulation"
          >
            Yes, Delete All
          </button>
        </div>
      </div>
    </div>
  );
}
