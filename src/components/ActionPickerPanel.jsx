import { ActionPicker } from './ActionPicker';

export function ActionPickerPanel({
  actionGroups,
  actionList,
  expandedGroup,
  setExpandedGroup,
  onAddAction,
  PICKUP_IDS,
  isOpen,
  onClose
}) {
  const handleAddAction = (action) => {
    onAddAction(action);
    // Optionally close the panel after adding an action
    // onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-safe">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center gap-3 safe-top">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 active:bg-gray-200 rounded-lg touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex-1">
              Add Actions
            </h2>
          </div>

          {/* Action Picker Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <ActionPicker
              actionGroups={actionGroups}
              actionList={actionList}
              expandedGroup={expandedGroup}
              setExpandedGroup={setExpandedGroup}
              onAddAction={handleAddAction}
              PICKUP_IDS={PICKUP_IDS}
            />
          </div>
        </div>
      </div>
    </>
  );
}
