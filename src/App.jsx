import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Grouped actions for better organization
const ACTION_GROUPS = {
  start: {
    label: 'Start Position',
    icon: '🏁',
    actions: [
      { id: 'start_front', label: 'Front', hasConfig: true, configType: 'start', positionType: 'front' },
      { id: 'start_back', label: 'Back', hasConfig: true, configType: 'start', positionType: 'back' },
      { id: 'start_custom', label: 'Custom', hasConfig: true, configType: 'start', positionType: 'custom' }
    ]
  },
  launch: {
    label: 'Launch',
    icon: '🚀',
    actions: [
      { id: 'near_launch', label: 'Near Launch' },
      { id: 'far_launch', label: 'Far Launch' }
    ]
  },
  pickup: {
    label: 'Pickup',
    icon: '📦',
    actions: [
      { id: 'spike_1', label: 'Spike 1' },
      { id: 'spike_2', label: 'Spike 2' },
      { id: 'spike_3', label: 'Spike 3' },
      { id: 'corner', label: 'Corner' }
    ]
  },
  parking: {
    label: 'Parking',
    icon: '🅿️',
    actions: [
      { id: 'near_park', label: 'Park (Near)' },
      { id: 'far_park', label: 'Park (Far)' }
    ]
  },
  other: {
    label: 'Other',
    icon: '⚙️',
    actions: [
      { id: 'dump', label: 'Dump' },
      { id: 'drive_to', label: 'DriveTo' },
      { id: 'wait', label: 'Wait', hasConfig: true, configType: 'wait' }
    ]
  }
};

// Load presets from localStorage
const loadInitialPresets = () => {
  const savedPresets = localStorage.getItem('ftc-autoconfig-presets');
  if (savedPresets) {
    try {
      return JSON.parse(savedPresets);
    } catch (e) {
      console.error('Failed to load presets:', e);
      return [];
    }
  }
  return [];
};

function App() {
  const [alliance, setAlliance] = useState('red');
  const [startLocation, setStartLocation] = useState('near');
  const [actionList, setActionList] = useState([]);
  const [presets, setPresets] = useState(loadInitialPresets);
  const [presetName, setPresetName] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);

  // Drag state
  const [dragIndex, setDragIndex] = useState(-1);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const touchActiveRef = useRef(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });

  // Derived flags
  const hasStart = actionList.some(a => a.configType === 'start');
  const hasPark = actionList.some(a => a.type === 'near_park' || a.type === 'far_park');
  const PICKUP_IDS = ['spike_1', 'spike_2', 'spike_3', 'corner'];

  // Indexes for special positions
  const startIndex = actionList.findIndex(a => a.configType === 'start');
  const parkIndex = actionList.findIndex(a => a.type === 'near_park' || a.type === 'far_park');

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }, []);

  // Save presets to localStorage whenever they change
  useEffect(() => {
    if (presets.length > 0) {
      localStorage.setItem('ftc-autoconfig-presets', JSON.stringify(presets));
    }
  }, [presets]);

  const isValidReorder = (fromIndex, toIndex) => {
    if (fromIndex === -1 || toIndex === -1) return false;
    const dragged = actionList[fromIndex];
    if (!dragged) return false;
    if (dragged.configType === 'start') return false;
    if (dragged.type === 'near_park' || dragged.type === 'far_park') return false;

    // simulate list
    const without = actionList.filter((_, i) => i !== fromIndex);
    let insertIndex = toIndex;
    if (fromIndex < toIndex) insertIndex = toIndex - 1;
    without.splice(insertIndex, 0, dragged);

    // start must be at index 0
    const newStartIndex = without.findIndex(a => a.configType === 'start');
    if (newStartIndex !== 0) return false;
    // park if present must be last
    const newParkIndex = without.findIndex(a => a.type === 'near_park' || a.type === 'far_park');
    if (newParkIndex !== -1 && newParkIndex !== without.length - 1) return false;
    // cannot insert at front (index 0) unless dragged is start (we already blocked dragging start)
    if (insertIndex === 0) return false;
    return true;
  };

  // Desktop drag handlers
  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', String(index)); } catch (err) {}
    // set initial drag position
    setDragPos({ x: e.clientX, y: e.clientY });
  };
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setHoverIndex(index);
    setDragPos({ x: e.clientX, y: e.clientY });
  };
  const handleDrop = (e, index) => {
    e.preventDefault();
    const from = dragIndex !== -1 ? dragIndex : parseInt(e.dataTransfer.getData('text/plain'), 10);
    const to = index;
    if (isValidReorder(from, to)) {
      const item = actionList[from];
      const copy = actionList.filter((_, i) => i !== from);
      let insertIndex = to;
      if (from < to) insertIndex = to - 1;
      copy.splice(insertIndex, 0, item);
      setActionList(copy);
    }
    setDragIndex(-1);
    setHoverIndex(-1);
    setDragPos({ x: 0, y: 0 });
  };
  const handleDropAtEnd = (e) => {
    e.preventDefault();
    const from = dragIndex !== -1 ? dragIndex : parseInt(e.dataTransfer.getData('text/plain'), 10);
    const to = actionList.length; // drop at end
    if (isValidReorder(from, to)) {
      const item = actionList[from];
      const copy = actionList.filter((_, i) => i !== from);
      let insertIndex = to;
      if (from < to) insertIndex = to - 1;
      copy.splice(insertIndex, 0, item);
      setActionList(copy);
    }
    setDragIndex(-1);
    setHoverIndex(-1);
    setDragPos({ x: 0, y: 0 });
  };

  // Touch handlers for mobile
  const handleTouchStart = (e, index) => {
    const action = actionList[index];
    if (!action) return;
    if (action.configType === 'start') return;
    if (action.type === 'near_park' || action.type === 'far_park') return;

    touchActiveRef.current = true;
    setDragIndex(index);
    setHoverIndex(index);

    const touch = e.touches[0];
    if (touch) setDragPos({ x: touch.clientX, y: touch.clientY });

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    if (!touchActiveRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    setDragPos({ x: touch.clientX, y: touch.clientY });
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el) return;
    const itemEl = el.closest('[data-action-index]');
    if (itemEl) {
      const idx = parseInt(itemEl.getAttribute('data-action-index'), 10);
      setHoverIndex(idx);
    } else {
      setHoverIndex(actionList.length);
    }
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!touchActiveRef.current) return;
    touchActiveRef.current = false;
    const from = dragIndex;
    const to = hoverIndex === -1 ? actionList.length : hoverIndex;
    if (isValidReorder(from, to)) {
      const item = actionList[from];
      const copy = actionList.filter((_, i) => i !== from);
      let insertIndex = to;
      if (from < to) insertIndex = to - 1;
      copy.splice(insertIndex, 0, item);
      setActionList(copy);
    }
    setDragIndex(-1);
    setHoverIndex(-1);
    setDragPos({ x: 0, y: 0 });

    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  const addAction = (action) => {
    // If no start has been added yet, only allow adding start actions
    if (!hasStart && action.configType !== 'start') {
      alert('Please add a Start action first.');
      return;
    }

    // Check if trying to add a start action when one already exists
    if (action.configType === 'start') {
      if (hasStart) {
        alert('Only one Start action is allowed. Please remove the existing start action first.');
        return;
      }
    }

    // Check if trying to add a park action when one already exists
    if (action.id === 'near_park' || action.id === 'far_park') {
      if (hasPark) {
        alert('Only one Park action is allowed. Please remove the existing park action first.');
        return;
      }
    }

    // Prevent duplicate pickup sub-actions
    if (PICKUP_IDS.includes(action.id)) {
      const exists = actionList.some(a => a.type === action.id);
      if (exists) {
        alert('This pickup action is already added. Duplicate pickup actions are not allowed.');
        return;
      }
    }

    let config = null;
    if (action.hasConfig) {
      if (action.configType === 'wait') {
        config = { waitTime: 0 };
      } else if (action.configType === 'start') {
        if (action.positionType === 'custom') {
          config = {
            positionType: 'custom',
            x: 0,
            y: 0,
            theta: 0
          };
        } else {
          config = {
            positionType: action.positionType
          };
        }
      }
    }

    const newAction = {
      id: crypto.randomUUID(),
      type: action.id,
      label: action.label,
      config: config,
      configType: action.configType
    };

    // If a park action exists, insert the new action just before the park (keep park last)
    if (hasPark) {
      const parkIndex = actionList.findIndex(a => a.type === 'near_park' || a.type === 'far_park');
      if (parkIndex === -1) {
        setActionList(prev => [...prev, newAction]);
      } else {
        setActionList(prev => {
          const copy = [...prev];
          copy.splice(parkIndex, 0, newAction);
          return copy;
        });
      }
    } else {
      setActionList(prev => [...prev, newAction]);
    }

    // keep modal open
    setExpandedGroup(expandedGroup);
  };

  const removeAction = (id) => {
    setActionList(actionList.filter(action => action.id !== id));
  };

  const moveAction = (id, direction) => {
    const index = actionList.findIndex(action => action.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= actionList.length) return;
    const item = actionList[index];
    const targetItem = actionList[targetIndex];
    if (item.configType === 'start' && direction === 'down') return;
    if ((item.type === 'near_park' || item.type === 'far_park') && direction === 'up') return;
    if (targetItem && targetItem.configType === 'start') return;
    if (targetItem && (targetItem.type === 'near_park' || targetItem.type === 'far_park')) return;
    const newList = [...actionList];
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setActionList(newList);
  };

  const updateWaitTime = (id, waitTime) => {
    setActionList(actionList.map(action =>
      action.id === id
        ? { ...action, config: { ...action.config, waitTime: parseInt(waitTime) || 0 } }
        : action
    ));
  };

  const updateStartPositionNumeric = (id, field, value) => {
    setActionList(actionList.map(action =>
      action.id === id
        ? { ...action, config: { ...action.config, [field]: parseFloat(value) || 0 } }
        : action
    ));
  };

  const getActionDisplayLabel = (action) => {
    if (action.configType === 'start' && action.config) {
      const posType = action.config.positionType;
      if (posType === 'front') return 'Start (Front)';
      if (posType === 'back') return 'Start (Back)';
      if (posType === 'custom') {
        const x = action.config.x ?? 0;
        const y = action.config.y ?? 0;
        const theta = action.config.theta ?? 0;
        return `Start (${x}, ${y}, ${theta}°)`;
      }
    }
    return action.label;
  };

  const getConfig = () => ({
    alliance,
    startLocation,
    actions: actionList.map(({ id, ...rest }) => rest)
  });

  const exportJSON = () => JSON.stringify(getConfig(), null, 2);

  const downloadJSON = () => {
    const config = getConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ftc-auto-${alliance}-${startLocation}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const savePreset = () => {
    if (!presetName.trim()) { alert('Please enter a preset name'); return; }
    const newPreset = { id: Date.now(), name: presetName, config: getConfig() };
    setPresets([...presets, newPreset]);
    setPresetName('');
    alert('Preset saved!');
  };

  const loadPreset = (preset) => {
    setAlliance(preset.config.alliance);
    setStartLocation(preset.config.startLocation);
    setActionList(preset.config.actions.map(action => ({ ...action, id: crypto.randomUUID() })));
  };

  const deletePreset = (id) => { if (confirm('Are you sure you want to delete this preset?')) setPresets(presets.filter(p => p.id !== id)); };
  const clearAll = () => { if (confirm('Clear all actions?')) setActionList([]); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4">
      <div className="max-w-6xl mx-auto relative">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-2">FTC AutoConfig</h1>
          <p className="text-sm md:text-base text-indigo-600">DECODE Season Autonomous Configuration Builder</p>
        </header>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Configuration</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Alliance</label>
              <div className="flex gap-2">
                <button onClick={() => setAlliance('red')} className={`flex-1 py-2 md:py-3 px-3 md:px-4 rounded-lg font-semibold transition text-sm md:text-base ${alliance === 'red' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Red</button>
                <button onClick={() => setAlliance('blue')} className={`flex-1 py-2 md:py-3 px-3 md:px-4 rounded-lg font-semibold transition text-sm md:text-base ${alliance === 'blue' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Blue</button>
              </div>
            </div>

            <div className="mb-4">
              <button onClick={() => setShowActionModal(true)} className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-md text-base md:text-lg">+ Add Action</button>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Action Sequence</label>
                {actionList.length > 0 && (<button onClick={clearAll} className="text-sm text-red-600 hover:text-red-800">Clear All</button>)}
              </div>

              {actionList.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8 bg-gray-50 rounded-lg">No actions added yet. Tap "Add Action" above to get started.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {actionList.map((action, index) => (
                    <div key={action.id}
                      className={`bg-gray-50 rounded-lg p-3 transition-transform duration-150 ease-out ${hoverIndex === index ? 'border-t-2 border-indigo-400' : ''} ${index===dragIndex ? 'opacity-30 scale-95' : ''}`}
                      draggable={!(action.configType==='start' || action.type==='near_park' || action.type==='far_park')}
                      onDragStart={(e)=>handleDragStart(e,index)}
                      onDragOver={(e)=>handleDragOver(e,index)}
                      onDrop={(e)=>handleDrop(e,index)}
                      data-action-index={index}
                      onTouchStart={(e)=>handleTouchStart(e,index)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-500 w-6">{index + 1}.</span>
                        <span className="flex-1 text-sm font-medium text-gray-800">{getActionDisplayLabel(action)}</span>

                        {action.configType === 'wait' && action.config && (
                          <input type="number" value={action.config.waitTime} onChange={(e) => updateWaitTime(action.id, e.target.value)} placeholder="ms" className="w-16 md:w-20 px-2 py-1 text-sm border rounded" min="0" />
                        )}

                        <div className="flex gap-1">
                          {(() => {
                            const isStartItem = action.configType === 'start';
                            const isParkItem = action.type === 'near_park' || action.type === 'far_park';
                            const upDisabled = index === 0 || isParkItem || (startIndex !== -1 && index === startIndex + 1);
                            const downDisabled = index === actionList.length - 1 || isStartItem || (parkIndex !== -1 && index === parkIndex - 1);
                            return (
                              <>
                                <button onClick={() => moveAction(action.id, 'up')} disabled={upDisabled} className="p-1 text-gray-600 hover:text-indigo-600 disabled:opacity-30">↑</button>
                                <button onClick={() => moveAction(action.id, 'down')} disabled={downDisabled} className="p-1 text-gray-600 hover:text-indigo-600 disabled:opacity-30">↓</button>
                              </>
                            );
                          })()}
                          <button onClick={() => removeAction(action.id)} className="p-1 text-red-600 hover:text-red-800">×</button>
                        </div>
                      </div>

                      {action.configType === 'start' && action.config && action.config.positionType === 'custom' && (
                        <div className="mt-2 ml-8">
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-xs text-gray-600">X:</label>
                              <input type="number" value={action.config.x ?? 0} onChange={(e) => updateStartPositionNumeric(action.id, 'x', e.target.value)} className="w-full px-2 py-1 text-xs border rounded" step="0.1" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-600">Y:</label>
                              <input type="number" value={action.config.y ?? 0} onChange={(e) => updateStartPositionNumeric(action.id, 'y', e.target.value)} className="w-full px-2 py-1 text-xs border rounded" step="0.1" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-600">θ (deg):</label>
                              <input type="number" value={action.config.theta ?? 0} onChange={(e) => updateStartPositionNumeric(action.id, 'theta', e.target.value)} className="w-full px-2 py-1 text-xs border rounded" step="1" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className={`drop-zone h-10 ${hoverIndex===actionList.length ? 'bg-indigo-50 border-t-2 border-indigo-400' : ''}`} onDragOver={(e)=>{e.preventDefault(); handleDragOver(e, actionList.length);}} onDrop={(e)=>{handleDropAtEnd(e);}} />

                  {(dragIndex !== -1 || touchActiveRef.current) && dragIndex >= 0 && actionList[dragIndex] && (
                    <div className="pointer-events-none fixed z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl px-3 py-2 text-sm font-medium" style={{ left: dragPos.x + 'px', top: dragPos.y + 'px', transition: 'transform 0.08s ease-out' }}>
                      {getActionDisplayLabel(actionList[dragIndex])}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Export</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">JSON Configuration</label>
                <pre className="bg-gray-50 p-3 md:p-4 rounded-lg text-xs overflow-x-auto max-h-40 md:max-h-60 overflow-y-auto">{exportJSON()}</pre>
              </div>

              <div className="flex gap-2 mb-4">
                <button onClick={downloadJSON} className="flex-1 py-2 px-3 md:px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition text-sm md:text-base">Download</button>
                <button onClick={() => setShowQR(!showQR)} className="flex-1 py-2 px-3 md:px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm md:text-base">{showQR ? 'Hide QR' : 'Show QR'}</button>
              </div>

              {showQR && (
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 flex justify-center">
                  <QRCodeSVG value={exportJSON()} size={Math.min(256, window.innerWidth - 100)} level="M" includeMargin={true} />
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Presets</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Save Current Configuration</label>
                <div className="flex gap-2">
                  <input type="text" value={presetName} onChange={(e)=>setPresetName(e.target.value)} placeholder="Preset name" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base" />
                  <button onClick={savePreset} className="py-2 px-3 md:px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition text-sm md:text-base">Save</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saved Presets</label>
                {presets.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-lg">No presets saved yet</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {presets.map(preset => (
                      <div key={preset.id} className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                        <span className="flex-1 text-sm font-medium text-gray-800 truncate">{preset.name}</span>
                        <button onClick={() => loadPreset(preset)} className="py-1 px-2 md:px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm rounded transition">Load</button>
                        <button onClick={() => deletePreset(preset.id)} className="py-1 px-2 md:px-3 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm rounded transition">Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-6 md:mt-8 text-xs md:text-sm text-indigo-600"><p>FTC Team 24180 - DECODE Season Configuration Tool</p></footer>
      </div>

      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e)=>{ if(e.target===e.currentTarget){ setShowActionModal(false); setExpandedGroup(null); } }}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Add Action</h3>
              <button onClick={()=>{ setShowActionModal(false); setExpandedGroup(null); }} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">×</button>
            </div>

            <div className="p-4">
              {Object.entries(ACTION_GROUPS).map(([groupKey, group]) => {
                const childStates = group.actions.map(action => {
                  const disabledPickup = PICKUP_IDS.includes(action.id) && actionList.some(a => a.type === action.id);
                  const disabledStart = (groupKey === 'start') && hasStart;
                  const disabledPark = (groupKey === 'parking') && hasPark;
                  const disabledBecauseNoStart = !hasStart && groupKey !== 'start';
                  const disabled = disabledPickup || disabledStart || disabledPark || disabledBecauseNoStart;
                  return !disabled;
                });

                const groupHasEnabledChild = childStates.some(Boolean);

                return (
                  <div key={groupKey} className="mb-3">
                    <button onClick={() => groupHasEnabledChild && setExpandedGroup(expandedGroup === groupKey ? null : groupKey)} className={`w-full flex items-center justify-between p-3 ${groupHasEnabledChild ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-100 opacity-50 cursor-not-allowed'} rounded-lg transition`} aria-disabled={!groupHasEnabledChild}>
                      <div className="flex items-center gap-2"><span className="text-xl">{group.icon}</span><span className="font-semibold text-gray-800">{group.label}</span></div>
                      <span className="text-gray-500 text-xl">{expandedGroup === groupKey ? '−' : '+'}</span>
                    </button>

                    {expandedGroup === groupKey && (
                      <div className="mt-2 space-y-2 pl-4">
                        {group.actions.map(action => {
                          const disabledPickup = PICKUP_IDS.includes(action.id) && actionList.some(a => a.type === action.id);
                          const disabledStart = (groupKey === 'start') && hasStart;
                          const disabledPark = (groupKey === 'parking') && hasPark;
                          const disabledBecauseNoStart = !hasStart && groupKey !== 'start';
                          const disabled = disabledPickup || disabledStart || disabledPark || disabledBecauseNoStart;
                          return (
                            <button key={action.id} onClick={() => { if (disabled) return; addAction(action); }} className={`w-full text-left p-3 ${disabled ? 'bg-gray-50 opacity-50 cursor-not-allowed' : 'bg-white hover:bg-indigo-50'} border border-gray-200 rounded-lg transition`} aria-disabled={disabled}>
                              <span className="text-sm font-medium text-gray-800">{action.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
