import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

// Default action groups with A{n} keys
const DEFAULT_ACTION_GROUPS = {
  actions: {
    label: 'Actions',
    icon: '\u26A1',
    actions: []
  },
  wait: {
    label: 'Wait',
    icon: '\u23F1\uFE0F',
    actions: [
      { id: 'W', label: 'Wait', config: { waitTime: 1000 } }
    ]
  }
};

// Empty action groups structure for cleared state
const EMPTY_ACTION_GROUPS = {
  actions: {
    label: 'Actions',
    icon: '\u26A1',
    actions: []
  },
  wait: {
    label: 'Wait',
    icon: '\u23F1\uFE0F',
    actions: [
      { id: 'W', label: 'Wait', config: { waitTime: 1000 } }
    ]
  }
};

/**
 * useActionGroups - Manages action groups with sparse A{n} keys
 * Actions group uses A{n} format, Wait group uses fixed W key
 */
export function useActionGroups() {
  const [actionGroups, setActionGroups] = useState(() => {
    const stored = getStorageItem(STORAGE_KEYS.ACTION_GROUPS, null);
    const initialized = getStorageItem(STORAGE_KEYS.ACTIONS_INITIALIZED, null);
    
    // If storage has never been initialized (null), use defaults for first time
    if (stored === null && initialized === null) {
      setStorageItem(STORAGE_KEYS.ACTIONS_INITIALIZED, 'true');
      return DEFAULT_ACTION_GROUPS;
    }
    
    // If initialized flag is 'cleared', return empty structure and reset flag
    if (initialized === 'cleared') {
      setStorageItem(STORAGE_KEYS.ACTIONS_INITIALIZED, 'true');
      return EMPTY_ACTION_GROUPS;
    }
    
    // If we have stored data, use it
    if (stored && typeof stored === 'object') {
      // Make sure initialized flag is set
      if (!initialized) {
        setStorageItem(STORAGE_KEYS.ACTIONS_INITIALIZED, 'true');
      }
      return stored;
    }
    
    // Fallback to defaults
    setStorageItem(STORAGE_KEYS.ACTIONS_INITIALIZED, 'true');
    return DEFAULT_ACTION_GROUPS;
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ACTION_GROUPS, actionGroups);
  }, [actionGroups]);

  /**
   * Get the next available A{n} key for actions group
   * Uses lowest available ordinal in sparse array
   */
  const getNextActionKey = () => {
    const actionsGroup = actionGroups.actions;
    if (!actionsGroup) return 'A1';
    
    const existingNumbers = actionsGroup.actions
      .map(action => {
        const match = action.id?.match(/^A(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => n > 0);
    
    if (existingNumbers.length === 0) return 'A1';
    
    // Find lowest available number
    existingNumbers.sort((a, b) => a - b);
    for (let i = 1; i <= existingNumbers[existingNumbers.length - 1]; i++) {
      if (!existingNumbers.includes(i)) {
        return `A${i}`;
      }
    }
    
    // If no gaps, use next number after max
    return `A${existingNumbers[existingNumbers.length - 1] + 1}`;
  };

  const addActionToGroup = (groupKey, actionData) => {
    const group = actionGroups[groupKey];
    if (!group) return false;
    
    // For actions group, auto-assign next A{n} key if not provided or invalid
    let actionId = actionData.id;
    if (groupKey === 'actions') {
      if (!actionId || !actionId.match(/^A\d+$/)) {
        actionId = getNextActionKey();
      }
    }
    
    // Use provided label or generate default
    const label = actionData.label || `Action ${actionId}`;
    
    const newAction = {
      id: actionId,
      label: label,
      ...(actionData.config && { config: actionData.config })
    };
    
    setActionGroups(prev => ({
      ...prev,
      [groupKey]: {
        ...group,
        actions: [...group.actions, newAction]
      }
    }));
    
    return true;
  };

  const updateActionInGroup = (groupKey, actionIndex, updates) => {
    const group = actionGroups[groupKey];
    if (!group) return false;
    
    // Always allow the update to go through for typing
    const newActions = [...group.actions];
    newActions[actionIndex] = { ...newActions[actionIndex], ...updates };
    
    setActionGroups(prev => ({
      ...prev,
      [groupKey]: {
        ...group,
        actions: newActions
      }
    }));
    
    // Check for duplicates after update for error display only
    if (updates.label !== undefined) {
      const trimmedLabel = updates.label.trim();
      if (trimmedLabel.length > 0) {
        const isDuplicateLabel = group.actions.some(
          (action, idx) => 
            idx !== actionIndex && 
            action.label.trim().toLowerCase() === trimmedLabel.toLowerCase()
        );
        
        if (isDuplicateLabel) {
          setError({ index: actionIndex, message: `An action with the label "${trimmedLabel}" already exists. Please use a unique label.` });
        } else {
          setError(null);
        }
      }
    }
    
    return true;
  };

  const deleteActionInGroup = (groupKey, actionIndex) => {
    setError(null);
    
    const group = actionGroups[groupKey];
    if (!group) return false;
    
    setActionGroups(prev => ({
      ...prev,
      [groupKey]: {
        ...group,
        actions: group.actions.filter((_, i) => i !== actionIndex)
      }
    }));
    
    return true;
  };

  const clearError = () => setError(null);

  // Keep other group operations as no-ops (groups are fixed to 'actions' and 'wait')
  const addCustomGroup = () => {};
  const renameGroup = () => {};
  const deleteGroup = () => {};

  return {
    actionGroups,
    addActionToGroup,
    updateActionInGroup,
    deleteActionInGroup,
    addCustomGroup,
    renameGroup,
    deleteGroup,
    exportConfig: () => {},
    getNextActionKey,
    error,
    clearError
  };
}
