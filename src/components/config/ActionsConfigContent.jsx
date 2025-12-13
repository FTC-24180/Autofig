import { useState } from 'react';

function AddGroupForm({ onAdd }) {
  const [key, setKey] = useState('');
  const [label, setLabel] = useState('');
  return (
    <div className="flex flex-col gap-2 border-t pt-3 mt-3">
      <input
        placeholder="group key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded text-xs w-full"
      />
      <input
        placeholder="label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded text-xs w-full"
      />
      <button
        onClick={() => {
          if (!key) return;
          onAdd(key, label);
          setKey('');
          setLabel('');
        }}
        className="flex items-center justify-center gap-1 py-1 px-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Group
      </button>
    </div>
  );
}

function AddActionForm({ groupKey, onAdd }) {
  const [id, setId] = useState('');
  const [label, setLabel] = useState('');
  const [configPairs, setConfigPairs] = useState([]);

  const addConfigPair = () => {
    setConfigPairs([...configPairs, { key: '', value: '', type: 'number' }]);
  };

  const updateConfigPair = (index, field, value) => {
    const updated = [...configPairs];
    updated[index][field] = value;
    setConfigPairs(updated);
  };

  const removeConfigPair = (index) => {
    setConfigPairs(configPairs.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-2 border-t border-gray-200 dark:border-slate-700 pt-2">
      <div className="space-y-2">
        <div className="flex flex-col gap-2">
          <input
            placeholder="action id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded text-xs w-full"
          />
          <input
            placeholder="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded text-xs w-full"
          />
        </div>

        {configPairs.length > 0 && (
          <div className="space-y-1 text-xs">
            {configPairs.map((pair, idx) => (
              <div key={idx} className="flex gap-1 items-center">
                <input
                  placeholder="key"
                  value={pair.key}
                  onChange={(e) => updateConfigPair(idx, 'key', e.target.value)}
                  className="px-1 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded w-16 text-xs"
                />
                <select
                  value={pair.type}
                  onChange={(e) => updateConfigPair(idx, 'type', e.target.value)}
                  className="px-1 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded text-xs"
                >
                  <option value="number">Num</option>
                  <option value="text">Text</option>
                </select>
                <input
                  placeholder="value"
                  type={pair.type === 'number' ? 'number' : 'text'}
                  value={pair.value}
                  onChange={(e) => updateConfigPair(idx, 'value', e.target.value)}
                  className="px-1 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded flex-1 text-xs min-w-0"
                />
                <button
                  onClick={() => removeConfigPair(idx)}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-red-600 flex-shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={addConfigPair}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add config
        </button>

        <button
          onClick={() => {
            if (!id) return;
            
            let config = undefined;
            if (configPairs.length > 0) {
              config = {};
              configPairs.forEach(pair => {
                if (pair.key.trim()) {
                  config[pair.key] = pair.type === 'number' 
                    ? (parseFloat(pair.value) || 0)
                    : pair.value;
                }
              });
              if (Object.keys(config).length === 0) config = undefined;
            }

            onAdd({ id, label: label || id, config });
            setId('');
            setLabel('');
            setConfigPairs([]);
          }}
          className="w-full py-1 px-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
        >
          Add Action
        </button>
      </div>
    </div>
  );
}

export function ActionsConfigContent({
  actionGroups,
  onRenameGroup,
  onDeleteGroup,
  onAddActionToGroup,
  onUpdateActionInGroup,
  onDeleteActionInGroup,
  onAddCustomGroup,
  onExportConfig
}) {
  const [expandedGroups, setExpandedGroups] = useState(() => {
    // All groups collapsed by default
    return {};
  });

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Manage action groups and types
      </p>

      {Object.entries(actionGroups).map(([gk, group]) => {
        const isExpanded = expandedGroups[gk] === true; // Only expanded if explicitly set to true
        const actionCount = group.actions?.length || 0;

        return (
          <div key={gk} className="border border-gray-300 dark:border-slate-700 rounded bg-gray-50 dark:bg-slate-800 overflow-hidden">
            {/* Group Header - Always Visible */}
            <div className="p-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleGroup(gk)}
                  className="flex items-center gap-2 flex-1 min-w-0 hover:bg-gray-100 dark:hover:bg-slate-700 rounded p-1 transition touch-manipulation"
                >
                  <svg 
                    className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-base flex-shrink-0">{group.icon}</span>
                  <input
                    value={group.label}
                    onChange={(e) => {
                      e.stopPropagation();
                      onRenameGroup(gk, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium text-sm text-gray-800 dark:text-gray-100 dark:bg-slate-700 px-2 py-1 border border-gray-300 dark:border-slate-600 rounded flex-1 min-w-0"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {actionCount} {actionCount === 1 ? 'action' : 'actions'}
                  </span>
                </button>
                <button 
                  onClick={() => onDeleteGroup(gk)} 
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-red-600 flex-shrink-0 touch-manipulation"
                  title="Delete group"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Collapsible Content */}
            {isExpanded && (
              <div className="px-2 pb-2 space-y-2">
                {group.actions.map((act, idx) => (
                  <div key={act.id + idx} className="border border-gray-200 dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-900">
                    <div className="flex gap-2 items-start mb-2">
                      <div className="flex-1 min-w-0 space-y-2">
                        <input
                          value={act.id}
                          onChange={(e) => onUpdateActionInGroup(gk, idx, { id: e.target.value })}
                          className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded w-full text-xs"
                          placeholder="ID"
                        />
                        <input
                          value={act.label}
                          onChange={(e) => onUpdateActionInGroup(gk, idx, { label: e.target.value })}
                          className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded w-full text-xs"
                          placeholder="Label"
                        />
                      </div>
                      <button
                        onClick={() => onDeleteActionInGroup(gk, idx)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-red-600 flex-shrink-0 touch-manipulation"
                        title="Delete action"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {act.config && Object.keys(act.config).length > 0 && (
                      <div className="mt-2 space-y-1 text-xs">
                        {Object.entries(act.config).map(([key, value], configIdx) => {
                          const isNumber = typeof value === 'number';
                          return (
                            <div key={configIdx} className="flex gap-1 items-center">
                              <input
                                value={key}
                                onChange={(e) => {
                                  const newConfig = { ...act.config };
                                  delete newConfig[key];
                                  newConfig[e.target.value] = value;
                                  onUpdateActionInGroup(gk, idx, { config: newConfig });
                                }}
                                className="px-1 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded w-16 text-xs"
                              />
                              <select
                                value={isNumber ? 'number' : 'text'}
                                onChange={(e) => {
                                  const newConfig = { ...act.config };
                                  if (e.target.value === 'number') {
                                    newConfig[key] = parseFloat(value) || 0;
                                  } else {
                                    newConfig[key] = String(value);
                                  }
                                  onUpdateActionInGroup(gk, idx, { config: newConfig });
                                }}
                                className="px-1 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded text-xs"
                              >
                                <option value="number">Num</option>
                                <option value="text">Text</option>
                              </select>
                              <input
                                type={isNumber ? 'number' : 'text'}
                                value={value}
                                onChange={(e) => {
                                  const newValue = isNumber 
                                    ? (parseFloat(e.target.value) || 0)
                                    : e.target.value;
                                  const newConfig = { ...act.config, [key]: newValue };
                                  onUpdateActionInGroup(gk, idx, { config: newConfig });
                                }}
                                className="px-1 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded flex-1 text-xs min-w-0"
                              />
                              <button
                                onClick={() => {
                                  const newConfig = { ...act.config };
                                  delete newConfig[key];
                                  onUpdateActionInGroup(gk, idx, { 
                                    config: Object.keys(newConfig).length > 0 ? newConfig : undefined 
                                  });
                                }}
                                className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-red-600 flex-shrink-0"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        const newConfig = act.config ? { ...act.config } : {};
                        newConfig[`field${Object.keys(newConfig).length + 1}`] = 0;
                        onUpdateActionInGroup(gk, idx, { config: newConfig });
                      }}
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mt-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add field
                    </button>
                  </div>
                ))}

                <AddActionForm groupKey={gk} onAdd={(a) => onAddActionToGroup(gk, a)} />
              </div>
            )}
          </div>
        );
      })}

      <AddGroupForm onAdd={onAddCustomGroup} />
    </div>
  );
}
