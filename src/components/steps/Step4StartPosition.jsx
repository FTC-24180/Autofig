import { useState } from 'react';
import { createPortal } from 'react-dom';
import { WizardStep } from '../WizardStep';
import { StartPositionPickerPanel } from '../StartPositionPickerPanel';
import { getPoseResolution, roundToResolution } from '../../utils/poseEncoder';

export function Step4StartPosition({ 
  startPosition, 
  onStartPositionChange,
  startPositions,
  onUpdateField,
  isActive = false
}) {
  const [adjustmentMessage, setAdjustmentMessage] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const resolution = getPoseResolution();

  const closePanel = () => setIsPanelOpen(false);
  const openPanel = () => setIsPanelOpen(true);

  const getStartPositionLabel = () => {
    // Check configured positions
    const pos = startPositions.find(p => p.key === startPosition.type);
    if (pos) return pos.label;
    
    // Handle custom position (S0) - display to whole mm (3 decimal places)
    if (startPosition.type === 'S0') {
      const x = startPosition.x ?? 0;
      const y = startPosition.y ?? 0;
      const theta = startPosition.theta ?? 0;
      return `Custom (${x.toFixed(3)}m, ${y.toFixed(3)}m, ${theta.toFixed(1)}\u00B0)`;
    }
    
    return 'Unknown';
  };

  const handleFieldBlur = (field, rawValue) => {
    const value = parseFloat(rawValue);
    
    // If empty or invalid, set to 0
    if (isNaN(value)) {
      onUpdateField(field, '0');
      return;
    }

    let adjusted = value;
    let wasAdjusted = false;
    let reason = '';

    if (field === 'x' || field === 'y') {
      // Round to 0.893mm resolution and clamp to ±1.8288m
      const clamped = Math.max(-1.8288, Math.min(1.8288, value));
      adjusted = roundToResolution(clamped, 3.6576, 1.8288);
      
      if (Math.abs(value - clamped) > 0.0001) {
        wasAdjusted = true;
        reason = `${field.toUpperCase()} clamped to \u00B11.83m range`;
      } else if (Math.abs(value - adjusted) > 0.0001) {
        wasAdjusted = true;
        reason = `${field.toUpperCase()} rounded to ~1mm resolution`;
      }
      
      // Format to 3 decimal places (whole mm) for display
      adjusted = parseFloat(adjusted.toFixed(3));
    } else if (field === 'theta') {
      // Round to 0.088° resolution and clamp to ±180°
      const clamped = Math.max(-180, Math.min(180, value));
      adjusted = roundToResolution(clamped, 360, 180);
      
      if (Math.abs(value - clamped) > 0.001) {
        wasAdjusted = true;
        reason = 'Heading clamped to \u00B1180\u00B0 range';
      } else if (Math.abs(value - adjusted) > 0.001) {
        wasAdjusted = true;
        reason = 'Heading rounded to ~0.1\u00B0 resolution';
      }
      
      // Format to 1 decimal place for display
      adjusted = parseFloat(adjusted.toFixed(1));
    }

    // Update the field with adjusted value
    onUpdateField(field, adjusted.toString());

    // Show feedback if adjusted
    if (wasAdjusted) {
      setAdjustmentMessage(reason);
      setTimeout(() => setAdjustmentMessage(''), 3000);
    }
  };

  // Only render panel when active
  const panelElement = isActive && isPanelOpen ? createPortal(
    <StartPositionPickerPanel
      startPositions={startPositions}
      currentPosition={startPosition}
      onSelectPosition={onStartPositionChange}
      isOpen={isPanelOpen}
      onClose={closePanel}
    />,
    document.body
  ) : null;

  return (
    <WizardStep 
      title="Starting Position"
      subtitle="Choose your robot's starting position"
    >
      {/* Render panel via portal */}
      {panelElement}

      <div className="space-y-6">
        {/* Current Position Display with Change Button */}
        <div className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Current Position</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {getStartPositionLabel()}
              </p>
            </div>
          </div>
          
          <button
            onClick={openPanel}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Select Position
          </button>
        </div>

        {/* Custom Position Configuration */}
        {startPosition.type === 'S0' && (
          <>
            <div className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Custom Position Configuration</h4>
              
              {/* Resolution info */}
              <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-800 dark:text-blue-200">
                <strong>Resolution:</strong> X/Y: ~1mm, theta: ~0.1{'\u00B0'}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    X Position (meters)
                  </label>
                  <input
                    type="number"
                    value={startPosition.x ?? 0}
                    onChange={(e) => onUpdateField('x', e.target.value)}
                    onBlur={(e) => handleFieldBlur('x', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    step="0.001"
                    min="-1.8288"
                    max="1.8288"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{'\u00B1'}1.83m ({'\u00B1'}72")</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Y Position (meters)
                  </label>
                  <input
                    type="number"
                    value={startPosition.y ?? 0}
                    onChange={(e) => onUpdateField('y', e.target.value)}
                    onBlur={(e) => handleFieldBlur('y', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    step="0.001"
                    min="-1.8288"
                    max="1.8288"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{'\u00B1'}1.83m ({'\u00B1'}72")</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Angle (theta{'\u00B0'})
                  </label>
                  <input
                    type="number"
                    value={startPosition.theta ?? 0}
                    onChange={(e) => onUpdateField('theta', e.target.value)}
                    onBlur={(e) => handleFieldBlur('theta', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    step="0.1"
                    min="-180"
                    max="180"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{'\u00B1'}180{'\u00B0'}</p>
                </div>
              </div>

              {/* Adjustment feedback */}
              {adjustmentMessage && (
                <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    <strong>Adjusted:</strong> {adjustmentMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Encoding info */}
            <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
              <h5 className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 mb-2">Encoding Information</h5>
              <div className="space-y-1 text-xs text-indigo-900 dark:text-indigo-200">
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-mono">S0{'{6 base64 chars}'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Size:</span>
                  <span>8 bytes</span>
                </div>
                <div className="flex justify-between">
                  <span>Precision:</span>
                  <span>12 bits per value</span>
                </div>
                <div className="flex justify-between">
                  <span>Units:</span>
                  <span>Meters & Degrees</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </WizardStep>
  );
}
