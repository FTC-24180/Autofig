import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

// Fixed action groups - no customization allowed
const FIXED_ACTION_GROUPS = {
  actions: {
    label: 'Actions',
    icon: '⚡',
    actions: [
      { id: 'near_launch', label: 'Near Launch' },
      { id: 'far_launch', label: 'Far Launch' },
      { id: 'spike_1', label: 'Spike 1' },
      { id: 'spike_2', label: 'Spike 2' },
      { id: 'spike_3', label: 'Spike 3' },
      { id: 'near_park', label: 'Park (Near)' },
      { id: 'far_park', label: 'Park (Far)' },
      { id: 'dump', label: 'Dump' },
      { id: 'corner', label: 'Corner' },
      { id: 'drive_to', label: 'Drive To' }
    ]
  },
  wait: {
    label: 'Wait',
    icon: '⏱️',
    actions: [
      { id: 'wait', label: 'Wait', config: { waitTime: 1000 } }
    ]
  }
};

/**
 * useActionGroups - Simplified version with fixed groups
 * Only provides actions and wait groups
 * No add/delete/rename functionality
 */
export function useActionGroups() {
  // Always return fixed groups, ignore any stored customizations
  const [actionGroups] = useState(FIXED_ACTION_GROUPS);

  // Clear any old custom groups from storage on mount
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ACTION_GROUPS, FIXED_ACTION_GROUPS);
    setStorageItem(STORAGE_KEYS.ACTIONS_INITIALIZED, 'true');
  }, []);

  // Return fixed groups with no-op mutation functions
  return {
    actionGroups: FIXED_ACTION_GROUPS,
    // These functions are no-ops now - kept for backwards compatibility
    addCustomGroup: () => {},
    renameGroup: () => {},
    deleteGroup: () => {},
    addActionToGroup: () => {},
    updateActionInGroup: () => {},
    deleteActionInGroup: () => {},
    exportConfig: () => {}
  };
}
