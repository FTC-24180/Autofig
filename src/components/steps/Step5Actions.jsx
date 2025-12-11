import { useState } from 'react';
import { createPortal } from 'react-dom';
import { WizardStep } from '../WizardStep';
import { ActionSequence } from '../ActionSequence';
import { ActionPickerPanel } from '../ActionPickerPanel';

const PICKUP_IDS = ['spike_1', 'spike_2', 'spike_3', 'corner'];

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

  // Render both the button and panel using portals when active
  const fixedElements = isActive ? (
    <>
      {createPortal(
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="fixed left-4 z-50 p-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-lg transition min-h-[44px] min-w-[44px] touch-manipulation"
          aria-label="Add Action"
          style={{ top: 'calc(env(safe-area-inset-top) + 0.625rem)' }}
        >
          <svg 
            className={`w-6 h-6 text-white transition-transform ${isPanelOpen ? 'rotate-45' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>,
        document.body
      )}
      
      {createPortal(
        <ActionPickerPanel
          actionGroups={actionGroups}
          actionList={actionList}
          expandedGroup={expandedGroup}
          setExpandedGroup={setExpandedGroup}
          onAddAction={onAddAction}
          PICKUP_IDS={PICKUP_IDS}
          isOpen={isPanelOpen}
          onClose={closePanel}
        />,
        document.body
      )}
    </>
  ) : null;

  return (
    <WizardStep 
      title="Configure Actions"
      subtitle="Build your autonomous sequence"
      className="pb-4"
    >
      {/* Render button and panel via portals */}
      {fixedElements}

      <div className="space-y-4">
        {/* Action List */}
        <div>
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

        {/* Info message when no actions */}
        {actionList.length === 0 && (
          <div className="text-center py-8 bg-gray-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-700">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">No actions yet</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Tap the <span className="font-bold text-indigo-600 dark:text-indigo-400">+</span> button to add actions</p>
          </div>
        )}
      </div>
    </WizardStep>
  );
}
