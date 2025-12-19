import { useState, useRef, useEffect } from 'react';
import { ActionsConfigContent } from '../config/ActionsConfigContent';
import { StartPositionsConfigContent } from '../config/StartPositionsConfigContent';

export function ConfigurationMenu({
  // Display states
  showActionsConfig,
  showPositionsConfig,
  onShowActionsConfig,
  onShowPositionsConfig,
  onBack,
  // Presets
  presets,
  onSaveTemplate,
  onLoadTemplate,
  onShowTemplates,
  onExportConfig,
  onClose,
  // Actions config
  actionGroups,
  onAddActionToGroup,
  onUpdateActionInGroup,
  onDeleteActionInGroup,
  getNextActionKey,
  actionsError,
  clearActionsError,
  // Start positions config
  startPositions,
  onAddStartPosition,
  onUpdateStartPosition,
  onDeleteStartPosition,
  positionsError,
  clearPositionsError,
  // Form state
  showAddActionForm,
  setShowAddActionForm
}) {
  const contentRef = useRef(null);

  // Click outside handler for add form
  useEffect(() => {
    if (!showAddActionForm) return;

    const handleClickOutside = (e) => {
      // Check if click is outside the add form but inside the menu
      if (contentRef.current && contentRef.current.contains(e.target)) {
        // Check if the click target is not part of the add form
        const isInsideAddForm = e.target.closest('.add-action-form-panel');
        if (!isInsideAddForm) {
          setShowAddActionForm(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAddActionForm, setShowAddActionForm]);

  // If showing actions config
  if (showActionsConfig) {
    return (
      <div ref={contentRef}>
        <ActionsConfigContent
          actionGroups={actionGroups}
          onAddActionToGroup={onAddActionToGroup}
          onUpdateActionInGroup={onUpdateActionInGroup}
          onDeleteActionInGroup={onDeleteActionInGroup}
          getNextActionKey={getNextActionKey}
          error={actionsError}
          clearError={clearActionsError}
          showAddForm={showAddActionForm}
          setShowAddForm={setShowAddActionForm}
        />
      </div>
    );
  }

  // If showing positions config
  if (showPositionsConfig) {
    return (
      <StartPositionsConfigContent
        startPositions={startPositions}
        onAddStartPosition={onAddStartPosition}
        onUpdateStartPosition={onUpdateStartPosition}
        onDeleteStartPosition={onDeleteStartPosition}
        onExportConfig={onExportConfig}
        error={positionsError}
        clearError={clearPositionsError}
      />
    );
  }

  // Main configuration menu
  return (
    <div ref={contentRef} className="space-y-2">
      {/* Configure Actions */}
      <button
        onClick={onShowActionsConfig}
        className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition touch-manipulation min-h-[48px]"
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-100">Actions</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Manage action types (A1, A2, ...)
          </div>
        </div>
      </button>

      {/* Configure Start Positions */}
      <button
        onClick={onShowPositionsConfig}
        className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition touch-manipulation min-h-[48px]"
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 0112-1.227M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-100">Start Positions</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Manage preset positions (S1, S2, ...)</div>
        </div>
      </button>

      {/* Configurations Section */}
      <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Stored Configurations</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">
          Store named snapshot of current configuration.
        </p>
        
        <button
          onClick={() => {
            onSaveTemplate();
          }}
          className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition touch-manipulation min-h-[48px]"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
          </svg>
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-100">Store</div>                    
          </div>
        </button>

        <button
          onClick={onShowTemplates}
          className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition mt-2 touch-manipulation min-h-[48px]"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium text-gray-800 dark:text-gray-100">Load</span>
          </div>
          <div className="flex items-center gap-2">
            {presets.length > 0 && (
              <span className="text-xs bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-full font-semibold">
                {presets.length}
              </span>
            )}
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        <button
          onClick={() => {
            onExportConfig();
            onClose();
          }}
          className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition mt-2 touch-manipulation min-h-[48px]"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-100">Export</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Download configurations as JSON</div>
          </div>
        </button>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-slate-800 mt-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Configure actions (A1, A2, ...) and start positions (S1, S2, ...) with automatic key assignment using lowest available numbers.
        </p>
      </div>
    </div>
  );
}
