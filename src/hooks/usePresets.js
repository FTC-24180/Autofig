import { useState, useEffect } from 'react';

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

export function usePresets() {
  const [presets, setPresets] = useState(loadInitialPresets);

  useEffect(() => {
    if (presets.length > 0) {
      localStorage.setItem('ftc-autoconfig-presets', JSON.stringify(presets));
    }
  }, [presets]);

  const savePreset = (name, config) => {
    if (!name.trim()) {
      return false;
    }
    const newPreset = { id: Date.now(), name, config };
    setPresets([...presets, newPreset]);
    return true;
  };

  const deletePreset = (id) => {
    setPresets(presets.filter(p => p.id !== id));
  };

  return {
    presets,
    savePreset,
    deletePreset
  };
}
