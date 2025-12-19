import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

// Default start positions with S{n} keys - only used for first-time initialization
const DEFAULT_START_POSITIONS = [

];

export function useStartPositions() {
  const [startPositions, setStartPositions] = useState(() => {
    const stored = getStorageItem(STORAGE_KEYS.START_POSITIONS, null);
    
    // If storage has never been initialized (null), use defaults for first time
    if (stored === null) {
      return DEFAULT_START_POSITIONS;
    }
    
    // If storage exists but is empty array (after clear), keep it empty
    if (Array.isArray(stored) && stored.length === 0) {
      return [];
    }
    
    // One-time migration: convert old format if needed
    const needsMigration = stored.some(pos => !pos.key || pos.id);
    if (needsMigration) {
      const migrated = stored.map((pos, index) => {
        // If already has key, keep it
        if (pos.key) return pos;
        
        // Migrate from old id format
        return {
          key: `S${index + 1}`,
          label: pos.label || pos.id || 'Position'
        };
      });
      
      // Save migrated data immediately
      setStorageItem(STORAGE_KEYS.START_POSITIONS, migrated);
      return migrated;
    }
    
    return stored;
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.START_POSITIONS, startPositions);
  }, [startPositions]);

  /**
   * Get the next available S{n} key using lowest available ordinal
   */
  const getNextKey = () => {
    const existingNumbers = startPositions
      .map(pos => {
        const match = pos.key?.match(/^S(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => n > 0);
    
    if (existingNumbers.length === 0) return 'S1';
    
    // Find lowest available number
    existingNumbers.sort((a, b) => a - b);
    for (let i = 1; i <= existingNumbers[existingNumbers.length - 1]; i++) {
      if (!existingNumbers.includes(i)) {
        return `S${i}`;
      }
    }
    
    // If no gaps, use next number after max
    return `S${existingNumbers[existingNumbers.length - 1] + 1}`;
  };

  const addStartPosition = (label) => {
    const nextKey = getNextKey();
    const nextNumber = parseInt(nextKey.substring(1));
    
    const newPosition = {
      key: nextKey,
      // If no label provided, auto-generate "Start Position {n}"
      label: label || `Start Position ${nextNumber}`
    };
    setStartPositions(prev => [...prev, newPosition]);
  };

  const updateStartPosition = (index, updates) => {
    setStartPositions(prev => {
      const positions = [...prev];
      // Only allow updating the label, not the key
      positions[index] = { 
        ...positions[index], 
        label: updates.label !== undefined ? updates.label : positions[index].label
      };
      return positions;
    });
  };

  const deleteStartPosition = (index) => {
    setStartPositions(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Sort start positions by key (S1, S2, S3, etc.)
   */
  const sortedStartPositions = [...startPositions].sort((a, b) => {
    const aNum = parseInt(a.key.substring(1)) || 0;
    const bNum = parseInt(b.key.substring(1)) || 0;
    return aNum - bNum;
  });

  return {
    startPositions: sortedStartPositions,
    addStartPosition,
    updateStartPosition,
    deleteStartPosition
  };
}
