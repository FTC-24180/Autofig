import { useState } from 'react';
import { createPortal } from 'react-dom';
import { WizardStep } from '../WizardStep';
import { ActionSequence } from '../ActionSequence';
import { ActionPickerPanel } from '../ActionPickerPanel';

export function Step5Actions({ 
  actionList,
  actionGroups,
  expandedGroup,
  setExpandedGroup,
  onAddAction,
  onMoveAction,
  onRemoveAction,
  onUpdateActionConfig,
  onClearAll,
  dragHandlers,
  isActive = false
}) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const closePanel = () => {
    setIsPanelOpen(false);
    setExpandedGroup(null);
  };

  const openPanel = () => {
    setIsPanelOpen(true);
  };

  // Only render panel when active
  const panelElement = isActive && isPanelOpen ? createPortal(
    <ActionPickerPanel
      actionGroups={actionGroups}
      actionList={actionList}
      expandedGroup={expandedGroup}
      setExpandedGroup={setExpandedGroup}
      onAddAction={onAddAction}
      isOpen={isPanelOpen}
      onClose={closePanel}
    />,
    document.body
  ) : null;

  return (
    <WizardStep 
      title="Configure Actions"
      subtitle="Build your autonomous sequence"
      className="pb-4 flex flex-col h-full"
    >
      {/* Render panel via portal */}
      {panelElement}

      <div className="flex-1 flex flex-col min-h-0 space-y-4">
        {/* Show large empty state when no actions */}
        {actionList.length === 0 ? (
          <div className="space-y-4">
            {/* Large clickable empty state */}
            <button
              onClick={openPanel}
              className="w-full text-center py-16 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 transition cursor-pointer touch-manipulation"
            >
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-gray-700 dark:text-gray-200 text-base font-semibold mb-1">No actions yet</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tap the <span className="font-bold text-indigo-600 dark:text-indigo-400">+</span> button to add actions
              </p>
            </button>
          </div>
        ) : (
          <>
            {/* Action List - scrolls when it would push the button off screen */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ActionSequence
                actionList={actionList}
                dragIndex={dragHandlers.dragIndex}
                hoverIndex={dragHandlers.hoverIndex}
                dragPos={dragHandlers.dragPos}
                touchActiveRef={dragHandlers.touchActiveRef}
                startIndex={-1}
                parkIndex={-1}
                onMoveAction={onMoveAction}
                onRemoveAction={onRemoveAction}
                onUpdateActionConfig={onUpdateActionConfig}
                onClearAll={onClearAll}
                dragHandlers={dragHandlers}
              />
            </div>

            {/* Add Action Button - stays fixed at bottom */}
            <button
              onClick={openPanel}
              className="flex-shrink-0 w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg font-semibold transition min-h-[56px] touch-manipulation shadow-md"
            >
              <svg 
                className="w-6 h-6"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Action</span>
            </button>
          </>
        )}
      </div>
    </WizardStep>
  );
}
