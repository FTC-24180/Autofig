import { useState } from 'react';

function AddGroupForm({ onAdd }) {
  const [key, setKey] = useState('');
  const [label, setLabel] = useState('');
  return (
    <div className="flex gap-2 items-center border-t pt-3 mt-3">
      <input
        placeholder="group key (e.g. custom)"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded"
      />
      <input
        placeholder="label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded"
      />
      <button
        onClick={() => {
          if (!key) return;
          onAdd(key, label);
          setKey('');
          setLabel('');
        }}
        className="flex items-center gap-1 py-1 px-3 bg-green-600 hover:bg-green-700 text-white rounded transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="mt-2 border-t pt-2">
      <div className="flex gap-2 items-start">
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <input
              placeholder="action id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded w-32 text-sm"
            />
            <input
              placeholder="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded flex-1 text-sm"
            />
          </div>

          {configPairs.length > 0 && (
            <div className="pl-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 font-semibold">Configuration Fields:</span>
                <span className="text-xs text-gray-500 italic">(default values)</span>
              </div>
              <div className="flex gap-2 text-xs text-gray-500 mb-1 font-semibold">
                <span className="w-24">Key Name</span>
                <span className="w-20">Type</span>
                <span className="flex-1">Default Value</span>
                <span className="w-6"></span>
              </div>
              {configPairs.map((pair, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    placeholder="e.g. waitTime"
                    value={pair.key}
                    onChange={(e) => updateConfigPair(idx, 'key', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded w-24 text-xs"
                  />
                  <select
                    value={pair.type}
                    onChange={(e) => updateConfigPair(idx, 'type', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded w-20 text-xs"
                  >
                    <option value="number">Number</option>
                    <option value="text">Text</option>
                  </select>
                  <input
                    placeholder={pair.type === 'number' ? 'e.g. 1000' : 'e.g. target1'}
                    type={pair.type === 'number' ? 'number' : 'text'}
                    value={pair.value}
                    onChange={(e) => updateConfigPair(idx, 'value', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded flex-1 text-xs"
                  />
                  <button
                    onClick={() => removeConfigPair(idx)}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-red-600 hover:text-red-700 transition"
                    title="Remove field"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={addConfigPair}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add config field
          </button>
        </div>

        <button
          onClick={() => {
            if (!id) return;
            
            // Build config object from pairs
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
          className="py-1 px-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function AddStartPositionForm({ onAdd }) {
  const [id, setId] = useState('');
  const [label, setLabel] = useState('');
  return (
    <div className="flex gap-2 items-center mt-2">
      <input
        placeholder="position id (e.g. left)"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded w-40"
      />
      <input
        placeholder="label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded flex-1"
      />
      <button
        onClick={() => {
          if (!id) return;
          onAdd({ id, label: label || id });
          setId('');
          setLabel('');
        }}
        className="flex items-center gap-1 py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add
      </button>
    </div>
  );
}

export function ManageConfigModal({
  actionGroups,
  startPositions,
  onClose,
  onExportConfig,
  onRenameGroup,
  onDeleteGroup,
  onAddActionToGroup,
  onUpdateActionInGroup,
  onDeleteActionInGroup,
  onAddCustomGroup,
  onAddStartPosition,
  onUpdateStartPosition,
  onDeleteStartPosition
}) {
  const [activeTab, setActiveTab] = useState('actions');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 flex items-start justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Manage Configuration</h3>
          <div className="flex gap-2">
            <button onClick={onExportConfig} className="flex items-center gap-1 py-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            <button onClick={onClose} className="py-1 px-2 bg-gray-200 hover:bg-gray-300 rounded transition">
              Close
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4 border-b">
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'actions'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Action Groups
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'positions'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Start Positions
          </button>
        </div>

        {activeTab === 'actions' && (
          <div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800">Available Actions</h4>
            </div>

            <div className="space-y-4">
              {Object.entries(actionGroups).map(([gk, group]) => (
                <div key={gk} className="border p-3 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{group.icon}</span>
                      <input
                        value={group.label}
                        onChange={(e) => onRenameGroup(gk, e.target.value)}
                        className="font-semibold text-gray-800 px-2 py-1 border border-gray-300 rounded"
                      />
                    </div>
                    <button 
                      onClick={() => onDeleteGroup(gk)} 
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-red-600 hover:text-red-700 transition"
                      title="Delete group"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {group.actions.map((act, idx) => (
                      <div key={act.id + idx} className="border p-2 rounded bg-white">
                        <div className="flex gap-2 items-start mb-2">
                          <input
                            value={act.id}
                            onChange={(e) => onUpdateActionInGroup(gk, idx, { id: e.target.value })}
                            className="px-2 py-1 border border-gray-300 rounded w-32 text-sm"
                            placeholder="ID"
                          />
                          <input
                            value={act.label}
                            onChange={(e) => onUpdateActionInGroup(gk, idx, { label: e.target.value })}
                            className="px-2 py-1 border border-gray-300 rounded flex-1 text-sm"
                            placeholder="Label"
                          />
                          <button
                            onClick={() => onDeleteActionInGroup(gk, idx)}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-red-600 hover:text-red-700 transition"
                            title="Delete action"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {act.config && Object.keys(act.config).length > 0 && (
                          <div className="pl-4 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600 font-semibold">Configuration Fields:</span>
                              <span className="text-xs text-gray-500 italic">(default values)</span>
                            </div>
                            <div className="flex gap-2 text-xs text-gray-500 mb-1 font-semibold">
                              <span className="w-24">Key Name</span>
                              <span className="w-20">Type</span>
                              <span className="flex-1">Default Value</span>
                              <span className="w-6"></span>
                            </div>
                            {Object.entries(act.config).map(([key, value], configIdx) => {
                              const isNumber = typeof value === 'number';
                              return (
                                <div key={configIdx} className="flex gap-2 items-center">
                                  <input
                                    value={key}
                                    onChange={(e) => {
                                      const newConfig = { ...act.config };
                                      delete newConfig[key];
                                      newConfig[e.target.value] = value;
                                      onUpdateActionInGroup(gk, idx, { config: newConfig });
                                    }}
                                    className="px-2 py-1 border border-gray-300 rounded w-24 text-xs"
                                    placeholder="key name"
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
                                    className="px-2 py-1 border border-gray-300 rounded w-20 text-xs"
                                  >
                                    <option value="number">Number</option>
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
                                    className="px-2 py-1 border border-gray-300 rounded flex-1 text-xs"
                                    placeholder="default value"
                                  />
                                  <button
                                    onClick={() => {
                                      const newConfig = { ...act.config };
                                      delete newConfig[key];
                                      onUpdateActionInGroup(gk, idx, { 
                                        config: Object.keys(newConfig).length > 0 ? newConfig : undefined 
                                      });
                                    }}
                                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-red-600 hover:text-red-700 transition"
                                    title="Remove field"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
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
                          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 ml-4 mt-1 font-semibold"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add config field
                        </button>
                      </div>
                    ))}

                    <AddActionForm groupKey={gk} onAdd={(a) => onAddActionToGroup(gk, a)} />
                  </div>
                </div>
              ))}

              <AddGroupForm onAdd={onAddCustomGroup} />
            </div>
          </div>
        )}

        {activeTab === 'positions' && (
          <div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800">Available Start Positions</h4>
            </div>

            <div className="space-y-2">
              {startPositions.map((pos, idx) => (
                <div key={pos.id + idx} className="flex gap-2 items-center border border-gray-300 p-3 rounded">
                  <span className="text-lg">&#127937;</span>
                  <input
                    value={pos.id}
                    onChange={(e) => onUpdateStartPosition(idx, { id: e.target.value })}
                    className="px-2 py-1 border border-gray-300 rounded w-32"
                    placeholder="ID"
                  />
                  <input
                    value={pos.label}
                    onChange={(e) => onUpdateStartPosition(idx, { label: e.target.value })}
                    className="px-2 py-1 border border-gray-300 rounded flex-1"
                    placeholder="Label"
                  />
                  <button
                    onClick={() => onDeleteStartPosition(idx)}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-red-600 hover:text-red-700 transition"
                    title="Delete position"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}

              <AddStartPositionForm onAdd={onAddStartPosition} />
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-gray-300 border-blue-200 rounded">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Start positions define preset locations. The &quot;Custom&quot; position with configurable X, Y, ? is always available and cannot be removed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
