export function SaveTemplateModal({ 
  templateName, 
  onTemplateNameChange, 
  onSave, 
  onClose,
  error
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-950 z-50 flex flex-col overflow-hidden safe-area">
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-3 py-3 flex justify-between items-center safe-top">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Save Configuration</h3>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-300 active:text-gray-700 text-3xl leading-none w-11 h-11 flex items-center justify-center touch-manipulation"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <label className="block text-base font-medium text-gray-700 dark:text-gray-200 mb-3">
            Configuration Name
          </label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => onTemplateNameChange(e.target.value)}
            placeholder="Enter configuration name"
            className={`w-full text-lg px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[48px] touch-manipulation ${
              error 
                ? 'border-red-500 dark:border-red-500 focus:border-red-500' 
                : 'border-gray-300 dark:border-slate-600 focus:border-indigo-500'
            } dark:bg-slate-900 dark:text-gray-100`}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 p-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 safe-bottom">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-200 dark:bg-slate-800 active:bg-gray-300 text-gray-700 dark:text-gray-100 rounded-lg font-semibold text-lg min-h-[48px] touch-manipulation"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-3 px-4 bg-indigo-600 active:bg-indigo-700 text-white rounded-lg font-semibold text-lg min-h-[48px] touch-manipulation"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
