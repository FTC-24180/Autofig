import { useEffect, useState } from 'react';

const STORAGE_KEY = 'autoconfig-theme-preference';
const VALID_PREFERENCES = new Set(['light', 'dark', 'system']);

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const getStoredPreference = () => {
  if (!isBrowser()) {
    return 'system';
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  return VALID_PREFERENCES.has(stored) ? stored : 'system';
};

const getMediaQuery = () => {
  if (!isBrowser() || typeof window.matchMedia !== 'function') {
    return null;
  }
  return window.matchMedia('(prefers-color-scheme: dark)');
};

const resolveTheme = (preference, mediaQuery) => {
  if (preference === 'system') {
    if (mediaQuery) {
      return mediaQuery.matches ? 'dark' : 'light';
    }
    return 'light';
  }
  return preference;
};

export function useThemePreference() {
  const [preference, setPreference] = useState(() => getStoredPreference());
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const mediaQuery = getMediaQuery();
    return resolveTheme(getStoredPreference(), mediaQuery);
  });

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const mediaQuery = getMediaQuery();

    const applyTheme = (mode) => {
      setResolvedTheme(mode);
      document.documentElement.classList.toggle('dark', mode === 'dark');
      document.documentElement.dataset.theme = mode;
    };

    applyTheme(resolveTheme(preference, mediaQuery));

    if (!mediaQuery) {
      return;
    }

    const handleChange = (event) => {
      if (preference === 'system') {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference]);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    if (preference === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, preference);
    }
  }, [preference]);

  return {
    preference,
    setPreference,
    resolvedTheme,
  };
}
