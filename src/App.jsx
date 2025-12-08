import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Available actions for the configuration
const ACTIONS = [
  { id: 'near_launch', label: 'Near Launch' },
  { id: 'far_launch', label: 'Far Launch' },
  { id: 'spike_1', label: 'Spike 1' },
  { id: 'spike_2', label: 'Spike 2' },
  { id: 'spike_3', label: 'Spike 3' },
  { id: 'corner', label: 'Corner' },
  { id: 'dump', label: 'Dump' },
  { id: 'near_park', label: 'Near Park' },
  { id: 'far_park', label: 'Far Park' },
  { id: 'wait', label: 'Wait (Configurable)', hasConfig: true }
];

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

  const addAction = (action) => {
    setActionList(prev => [...prev, {
      id: crypto.randomUUID(),
      type: action.id,
      label: action.label,
      config: action.hasConfig ? { waitTime: 0 } : null
    }]);
  };

  const removeAction = (id) => {
    setActionList(actionList.filter(action => action.id !== id));
  };

  const moveAction = (id, direction) => {
    const index = actionList.findIndex(action => action.id === id);
    if (direction === 'up' && index > 0) {
      const newList = [...actionList];
      [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
      setActionList(newList);
    } else if (direction === 'down' && index < actionList.length - 1) {
      const newList = [...actionList];
      [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
      setActionList(newList);
    }
  };

  const updateWaitTime = (id, waitTime) => {
    setActionList(actionList.map(action =>
      action.id === id
        ? { ...action, config: { ...action.config, waitTime: parseInt(waitTime) || 0 } }
        : action
    ));
  };

  const getConfig = () => ({
    alliance,
    startLocation,
    // eslint-disable-next-line no-unused-vars
    actions: actionList.map(({ id, ...rest }) => rest)
  });

  const exportJSON = () => {
    return JSON.stringify(getConfig(), null, 2);
  };

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
    if (!presetName.trim()) {
      alert('Please enter a preset name');
      return;
    }
    const newPreset = {
      id: Date.now(),
      name: presetName,
      config: getConfig()
    };
    setPresets([...presets, newPreset]);
    setPresetName('');
    alert('Preset saved!');
  };

  const loadPreset = (preset) => {
    setAlliance(preset.config.alliance);
    setStartLocation(preset.config.startLocation);
    setActionList(preset.config.actions.map(action => ({
      ...action,
      id: crypto.randomUUID()
    })));
  };

  const deletePreset = (id) => {
    if (confirm('Are you sure you want to delete this preset?')) {
      setPresets(presets.filter(p => p.id !== id));
    }
  };

  const clearAll = () => {
    if (confirm('Clear all actions?')) {
      setActionList([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            FTC AutoConfig
          </h1>
          <p className="text-indigo-600">DECODE Season Autonomous Configuration Builder</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuration</h2>
            
            {/* Alliance Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Alliance</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAlliance('red')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    alliance === 'red'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Red Alliance
                </button>
                <button
                  onClick={() => setAlliance('blue')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    alliance === 'blue'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Blue Alliance
                </button>
              </div>
            </div>

            {/* Start Location Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Location</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setStartLocation('near')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    startLocation === 'near'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Near
                </button>
                <button
                  onClick={() => setStartLocation('far')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    startLocation === 'far'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Far
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Actions</label>
              <div className="grid grid-cols-2 gap-2">
                {ACTIONS.map(action => (
                  <button
                    key={action.id}
                    onClick={() => addAction(action)}
                    className="py-2 px-3 bg-gray-100 hover:bg-indigo-100 text-gray-800 rounded-lg text-sm font-medium transition"
                  >
                    + {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action List */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Action Sequence</label>
                {actionList.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                )}
              </div>
              {actionList.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8 bg-gray-50 rounded-lg">
                  No actions added yet. Click the buttons above to add actions.
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {actionList.map((action, index) => (
                    <div key={action.id} className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-500 w-6">{index + 1}.</span>
                      <span className="flex-1 text-sm font-medium text-gray-800">{action.label}</span>
                      
                      {action.config && (
                        <input
                          type="number"
                          value={action.config.waitTime}
                          onChange={(e) => updateWaitTime(action.id, e.target.value)}
                          placeholder="ms"
                          className="w-20 px-2 py-1 text-sm border rounded"
                          min="0"
                        />
                      )}
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveAction(action.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-600 hover:text-indigo-600 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveAction(action.id, 'down')}
                          disabled={index === actionList.length - 1}
                          className="p-1 text-gray-600 hover:text-indigo-600 disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeAction(action.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Export and Presets Panel */}
          <div className="space-y-6">
            {/* Export Panel */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Export</h2>
              
              {/* JSON Text */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">JSON Configuration</label>
                <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto max-h-60 overflow-y-auto">
                  {exportJSON()}
                </pre>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={downloadJSON}
                  className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
                >
                  Download JSON
                </button>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                >
                  {showQR ? 'Hide' : 'Show'} QR Code
                </button>
              </div>

              {/* QR Code */}
              {showQR && (
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 flex justify-center">
                  <QRCodeSVG
                    value={exportJSON()}
                    size={256}
                    level="M"
                    includeMargin={true}
                  />
                </div>
              )}
            </div>

            {/* Presets Panel */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Presets</h2>
              
              {/* Save Preset */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Save Current Configuration</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Preset name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={savePreset}
                    className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Load Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saved Presets</label>
                {presets.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-lg">
                    No presets saved yet
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {presets.map(preset => (
                      <div key={preset.id} className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                        <span className="flex-1 text-sm font-medium text-gray-800">{preset.name}</span>
                        <button
                          onClick={() => loadPreset(preset)}
                          className="py-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deletePreset(preset.id)}
                          className="py-1 px-3 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-8 text-sm text-indigo-600">
          <p>FTC Team 24180 - DECODE Season Configuration Tool</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
