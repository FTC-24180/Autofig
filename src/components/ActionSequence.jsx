import { useState } from 'react';
import { getActionDisplayLabel } from '../utils/actionUtils';
import { parseWaitTimeText, formatWaitTimeForDisplay, parseWaitTime } from '../utils/terseEncoder';

export function ActionSequence({
  actionList,
  dragIndex,
  hoverIndex,
  dragPos,
  touchActiveRef,
  startIndex,
  parkIndex,
  onMoveAction,
  onRemoveAction,
  onUpdateActionConfig,
  onClearAll,
  dragHandlers
}) {
  const [editingWaitId, setEditingWaitId] = useState(null);
  const [waitTextInput, setWaitTextInput] = useState('');
  const [waitTextError, setWaitTextError] = useState(null);

  const handleWaitInputFocus = (actionId, currentMs) => {
    setEditingWaitId(actionId);
    setWaitTextInput(formatWaitTimeForDisplay(currentMs));
    setWaitTextError(null);
  };

  const handleWaitInputChange = (e) => {
    const text = e.target.value;
    setWaitTextInput(text);
    
    const result = parseWaitTimeText(text);
    if (result.error) {
      setWaitTextError(result.error);
    } else {
      setWaitTextError(null);
    }
  };

  const handleWaitInputBlur = (actionId) => {
    const result = parseWaitTimeText(waitTextInput);
    
    if (result.value !== null) {
      const milliseconds = parseWaitTime(result.value);
      onUpdateActionConfig(actionId, 'waitTime', milliseconds);
      
      // Show warning if value was adjusted
      if (result.error) {
        setWaitTextError(result.error);
        setTimeout(() => {
          setWaitTextError(null);
          setEditingWaitId(null);
        }, 3000);
      } else {
        setWaitTextError(null);
        setEditingWaitId(null);
      }
    } else if (result.error) {
      // Keep showing error
      setWaitTextError(result.error);
    } else {
      // Empty input - keep current value
      setWaitTextError(null);
      setEditingWaitId(null);
    }
  };

  const handleWaitInputKeyDown = (e, actionId) => {
    if (e.key === 'Enter') {
      e.target.blur();
    } else if (e.key === 'Escape') {
      setWaitTextError(null);
      setEditingWaitId(null);
      setWaitTextInput('');
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action Sequence</label>
        {actionList.length > 0 && (
          <button onClick={onClearAll} className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {actionList.map((action, index) => (
          <div
            key={action.id}
            className={`bg-gray-50 dark:bg-slate-800 rounded-lg p-3 transition-transform duration-150 ease-out ${
              hoverIndex === index ? 'border-t-2 border-indigo-400' : ''
            } ${index === dragIndex ? 'opacity-30 scale-95' : ''}`}
            draggable={true}
            onDragStart={(e) => dragHandlers.handleDragStart(e, index)}
            onDragOver={(e) => dragHandlers.handleDragOver(e, index)}
            onDrop={(e) => dragHandlers.handleDrop(e, index)}
            data-action-index={index}
            onTouchStart={(e) => dragHandlers.handleTouchStart(e, index)}
            onPointerDown={(e) => dragHandlers.handlePointerDown(e, index)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400 w-6">{index + 1}.</span>
              <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">
                {getActionDisplayLabel(action)}
              </span>

              {action.config && Object.keys(action.config).length > 0 && (
                <div className="flex gap-2 items-center flex-wrap">
                  {Object.entries(action.config).map(([key, value]) => {
                    // Special handling for waitTime - text input
                    if (key === 'waitTime') {
                      const isEditing = editingWaitId === action.id;
                      const displayValue = isEditing 
                        ? waitTextInput 
                        : formatWaitTimeForDisplay(value);
                      
                      return (
                        <div key={key} className="flex flex-col gap-1 min-w-[140px]">
                          <div className="flex items-center gap-1">
                            <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">wait:</label>
                            <input
                              type="text"
                              value={displayValue}
                              onFocus={() => handleWaitInputFocus(action.id, value)}
                              onChange={handleWaitInputChange}
                              onBlur={() => handleWaitInputBlur(action.id)}
                              onKeyDown={(e) => handleWaitInputKeyDown(e, action.id)}
                              placeholder="e.g., 2.5s"
                              className={`flex-1 px-2 py-1 text-xs border rounded dark:bg-slate-900 dark:text-gray-100 ${
                                isEditing && waitTextError 
                                  ? 'border-red-500 dark:border-red-400' 
                                  : 'border-gray-300 dark:border-slate-600'
                              }`}
                            />
                          </div>
                          {isEditing && waitTextError && (
                            <div className="text-xs text-red-600 dark:text-red-400 leading-tight">
                              {waitTextError}
                            </div>
                          )}
                          {!isEditing && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                              Click to edit
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    // Default handling for other config fields
                    const isNumber = typeof value === 'number';
                    return (
                      <div key={key} className="flex items-center gap-1">
                        <label className="text-xs text-gray-600 dark:text-gray-400">{key}:</label>
                        <input
                          type={isNumber ? 'number' : 'text'}
                          value={value}
                          onChange={(e) => {
                            const newValue = isNumber 
                              ? (parseFloat(e.target.value) || 0)
                              : e.target.value;
                            onUpdateActionConfig(action.id, key, newValue);
                          }}
                          className="w-20 md:w-24 px-2 py-1 text-xs border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-gray-100"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => onMoveAction(action.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30"
                  title="Move up"
                >
                  &#8593;
                </button>
                <button
                  onClick={() => onMoveAction(action.id, 'down')}
                  disabled={index === actionList.length - 1}
                  className="p-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30"
                  title="Move down"
                >
                  &#8595;
                </button>
                <button 
                  onClick={() => onRemoveAction(action.id)} 
                  className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        <div
          className={`drop-zone h-10 ${hoverIndex === actionList.length ? 'bg-indigo-50 dark:bg-indigo-950/50 border-t-2 border-indigo-400' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            dragHandlers.handleDragOver(e, actionList.length);
          }}
          onDrop={dragHandlers.handleDropAtEnd}
        />

        {(dragIndex !== -1 || touchActiveRef.current) && dragIndex >= 0 && actionList[dragIndex] && (
          <div
            className="pointer-events-none fixed z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-lg shadow-2xl px-3 py-2 text-sm font-medium"
            style={{ left: dragPos.x + 'px', top: dragPos.y + 'px', transition: 'transform 0.08s ease-out' }}
          >
            {getActionDisplayLabel(actionList[dragIndex])}
          </div>
        )}
      </div>
    </div>
  );
}
