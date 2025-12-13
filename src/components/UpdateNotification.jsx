export function UpdateNotification({ onUpdate, onDismiss, version }) {
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-[70] safe-bottom">
      <div className="bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg shadow-2xl p-4 animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold mb-1">Update Available!</h4>
            <p className="text-sm text-indigo-100 dark:text-indigo-200 mb-3">
              A new version {version ? `(${version}) ` : ''}is ready. Update now for the latest features and improvements.
            </p>
            <div className="flex gap-2">
              <button
                onClick={onUpdate}
                className="flex-1 py-2 px-4 bg-white text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 rounded-lg font-semibold transition min-h-[44px] touch-manipulation"
              >
                Update Now
              </button>
              <button
                onClick={onDismiss}
                className="py-2 px-4 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white rounded-lg font-medium transition min-h-[44px] touch-manipulation"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
