import { useState, useMemo, useRef, useEffect } from 'react';

export function ActionsConfigContent({
  actionGroups,
  onAddActionToGroup,
  onUpdateActionInGroup,
  onDeleteActionInGroup,
  getNextActionKey,
  error,
  clearError,
  showAddForm,
  setShowAddForm
}) {
  const [isInfoExpanded, setIsInfoExpanded] = useState(true);
  const [isActionsExpanded, setIsActionsExpanded] = useState(true);
  const [isWaitExpanded, setIsWaitExpanded] = useState(false);
  const [newActionLabel, setNewActionLabel] = useState('');
  const [addFormError, setAddFormError] = useState(null);
  
  // Track previous valid labels for each action
  const previousLabelsRef = useRef({});
  
  // Ref for the add form input
  const addInputRef = useRef(null);

  // Sort actions by their key (A1, A2, A3, etc.) - sorted by numeric value
  const sortedActionsWithIndices = useMemo(() => {
    if (!actionGroups.actions?.actions) return [];
    
    return actionGroups.actions.actions
      .map((action, originalIndex) => ({ action, originalIndex }))
      .sort((a, b) => {
        // Extract numbers from keys (e.g., "A1" -> 1, "A10" -> 10)
        const numA = parseInt(a.action.id.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.action.id.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });
  }, [actionGroups.actions?.actions]);
  
  // Get existing labels for duplicate checking
  const existingLabels = useMemo(() => {
    return actionGroups.actions?.actions.map(action => action.label) || [];
  }, [actionGroups.actions?.actions]);

  // Auto-focus and select text when add form opens
  useEffect(() => {
    if (showAddForm && addInputRef.current) {
      const nextKey = getNextActionKey();
      const defaultLabel = `Action ${nextKey}`;
      setNewActionLabel(defaultLabel);
      setAddFormError(null);
      
      setTimeout(() => {
        addInputRef.current?.focus();
        addInputRef.current?.select();
      }, 100);
    }
  }, [showAddForm, getNextActionKey]);

  // Validate label in real-time
  useEffect(() => {
    if (!showAddForm) return;
    
    const trimmedLabel = newActionLabel.trim();
    
    if (!trimmedLabel) {
      setAddFormError('Label cannot be empty');
      return;
    }

    const isDuplicate = existingLabels.some(
      existingLabel => existingLabel.trim().toLowerCase() === trimmedLabel.toLowerCase()
    );

    if (isDuplicate) {
      setAddFormError(`An action with the label "${trimmedLabel}" already exists. Please use a unique label.`);
    } else {
      setAddFormError(null);
    }
  }, [newActionLabel, existingLabels, showAddForm]);

  const handleLabelFocus = (originalIndex, currentLabel) => {
    // Store the current valid label when user starts editing
    previousLabelsRef.current[originalIndex] = currentLabel;
  };

  const handleLabelBlur = (originalIndex, currentLabel) => {
    // If there's an error on this field, revert to previous valid value
    if (error?.index === originalIndex) {
      const previousLabel = previousLabelsRef.current[originalIndex];
      if (previousLabel !== undefined) {
        onUpdateActionInGroup('actions', originalIndex, { label: previousLabel });
      }
      clearError();
    }
  };
  
  const handleAddAction = () => {
    if (addFormError || !newActionLabel.trim()) {
      return;
    }

    onAddActionToGroup('actions', { label: newActionLabel.trim() });
    setShowAddForm(false);
    setNewActionLabel('');
    setAddFormError(null);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewActionLabel('');
    setAddFormError(null);
  };

  const handleAddFormKeyDown = (e) => {
    if (e.key === 'Enter' && !addFormError && newActionLabel.trim()) {
      handleAddAction();
    } else if (e.key === 'Escape') {
      handleCancelAdd();
    }
  };

  return (
    <div className="space-y-4">
      {/* Collapsible Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsInfoExpanded(!isInfoExpanded)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition touch-manipulation"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-semibold text-blue-900 dark:text-blue-200">
              Action Keys
            </h4>
          </div>
          <svg 
            className={`w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 transition-transform ${isInfoExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isInfoExpanded && (
          <div className="px-4 pb-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              Actions use <span className="font-mono">A{'{n}'}</span> keys (A1, A2, A3...). Actions are displayed sorted by key number. New actions automatically get the lowest available number. Deleting A2 leaves A1 and A3, and the next action will become A2.
            </p>
          </div>
        )}
      </div>

      {/* Collapsible Actions Group */}
      {actionGroups.actions && (
        <div className="border border-gray-300 dark:border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setIsActionsExpanded(!isActionsExpanded)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 dark:hover:bg-slate-800 transition touch-manipulation"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xl flex-shrink-0">{actionGroups.actions.icon}</span>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{actionGroups.actions.label}</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {actionGroups.actions.actions.length} actions
              </span>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform ${isActionsExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isActionsExpanded && (
            <div className="p-4 pt-0">
              <div className="space-y-3 mb-4">
                {sortedActionsWithIndices.map(({ action, originalIndex }) => {
                  return (
                    <div key={`${action.id}-${originalIndex}`} className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
                      {/* Header row: Key badge and delete button */}
                      <div className="flex items-center justify-between mb-2">
                        {/* Action Key Badge */}
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950/50 rounded-md">
                          <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {action.id}
                          </span>
                        </div>

                        {/* Compact delete button */}
                        <button
                          onClick={() => onDeleteActionInGroup('actions', originalIndex)}
                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-500/20 active:bg-red-200 rounded-md transition flex-shrink-0 touch-manipulation"
                          title="Delete action"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Action Label Input - Full Width */}
                      <div className="w-full">
                        <input
                          type="text"
                          value={action.label}
                          onFocus={() => handleLabelFocus(originalIndex, action.label)}
                          onChange={(e) => onUpdateActionInGroup('actions', originalIndex, { label: e.target.value })}
                          onBlur={() => handleLabelBlur(originalIndex, action.label)}
                          className={`w-full px-3 py-2 border ${
                            error?.index === originalIndex ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-slate-600'
                          } dark:bg-slate-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 ${
                            error?.index === originalIndex ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                          placeholder="Action label"
                          title={action.label}
                        />
                        {error?.index === originalIndex && (
                          <div className="flex items-start gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400">
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error.message}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Truncated preview for long labels */}
                      {action.label && action.label.length > 40 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1" title={action.label}>
                          {action.label}
                        </div>
                      )}

                      {/* Config Fields */}
                      {action.config && Object.keys(action.config).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700 space-y-2">
                          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            Configuration Fields:
                          </div>
                          <div className="space-y-2">
                            {Object.entries(action.config).map(([key, value]) => {
                              const isNumber = typeof value === 'number';
                              return (
                                <div key={key} className="flex flex-col gap-2 p-2 bg-white dark:bg-slate-900 rounded">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={key}
                                      onChange={(e) => {
                                        const newConfig = { ...action.config };
                                        delete newConfig[key];
                                        newConfig[e.target.value] = value;
                                        onUpdateActionInGroup('actions', originalIndex, { config: newConfig });
                                      }}
                                      className="flex-1 px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-gray-100 rounded text-xs"
                                      placeholder="field name"
                                      title={key}
                                    />
                                    <select
                                      value={isNumber ? 'number' : 'text'}
                                      onChange={(e) => {
                                        const newConfig = { ...action.config };
                                        if (e.target.value === 'number') {
                                          newConfig[key] = parseFloat(value) || 0;
                                        } else {
                                          newConfig[key] = String(value);
                                        }
                                        onUpdateActionInGroup('actions', originalIndex, { config: newConfig });
                                      }}
                                      className="w-24 px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-gray-100 rounded text-xs"
                                    >
                                      <option value="number">Number</option>
                                      <option value="text">Text</option>
                                    </select>
                                    <button
                                      onClick={() => {
                                        const newConfig = { ...action.config };
                                        delete newConfig[key];
                                        onUpdateActionInGroup('actions', originalIndex, { 
                                          config: Object.keys(newConfig).length > 0 ? newConfig : undefined 
                                        });
                                      }}
                                      className="p-1 hover:bg-red-100 dark:hover:bg-red-500/20 active:bg-red-200 rounded transition flex-shrink-0 min-h-[28px] min-w-[28px] flex items-center justify-center"
                                      title="Remove field"
                                    >
                                      <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                  <input
                                    type={isNumber ? 'number' : 'text'}
                                    value={value}
                                    onChange={(e) => {
                                      const newValue = isNumber 
                                        ? (parseFloat(e.target.value) || 0)
                                        : e.target.value;
                                      const newConfig = { ...action.config, [key]: newValue };
                                      onUpdateActionInGroup('actions', originalIndex, { config: newConfig });
                                    }}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-gray-100 rounded text-xs"
                                    placeholder="value"
                                    title={String(value)}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <button
                            onClick={() => {
                              const newConfig = action.config ? { ...action.config } : {};
                              newConfig[`field${Object.keys(newConfig).length + 1}`] = 0;
                              onUpdateActionInGroup('actions', originalIndex, { config: newConfig });
                            }}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 mt-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add config field
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add New Action Button or Form */}
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Action
                </button>
              ) : (
                <div className="add-action-form-panel bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-4">
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="new-action-label" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Action Label
                      </label>
                      <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                        {getNextActionKey()}
                      </span>
                    </div>
                    <input
                      ref={addInputRef}
                      id="new-action-label"
                      type="text"
                      value={newActionLabel}
                      onChange={(e) => setNewActionLabel(e.target.value)}
                      onKeyDown={handleAddFormKeyDown}
                      className={`w-full px-3 py-2 border ${
                        addFormError ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-slate-600'
                      } dark:bg-slate-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 ${
                        addFormError ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                      placeholder="Enter action label"
                    />
                    {addFormError && (
                      <div className="flex items-start gap-1.5 mt-2 text-xs text-red-600 dark:text-red-400">
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{addFormError}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelAdd}
                      className="flex-1 py-2 px-4 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 active:bg-gray-400 text-gray-700 dark:text-gray-100 rounded-lg font-semibold transition min-h-[44px] touch-manipulation"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAction}
                      disabled={!!addFormError || !newActionLabel.trim()}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition min-h-[44px] touch-manipulation ${
                        addFormError || !newActionLabel.trim()
                          ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white'
                      }`}
                    >
                      Add Action
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Collapsible Wait Group (Read-Only) */}
      {actionGroups.wait && (
        <div className="border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800/50 overflow-hidden">
          <button
            onClick={() => setIsWaitExpanded(!isWaitExpanded)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition touch-manipulation"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xl flex-shrink-0">{actionGroups.wait.icon}</span>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{actionGroups.wait.label}</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 italic">Fixed action</span>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform ${isWaitExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isWaitExpanded && (
            <div className="px-4 pb-4">
              {actionGroups.wait.actions.map((action) => (
                <div key={action.id} className="bg-white dark:bg-slate-900 p-3 rounded-lg">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950/50 rounded-md">
                      <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {action.id}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {action.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Requires waitTime configuration field
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
