import { useState, useEffect } from 'react';

const MATCHES_STORAGE_KEY = 'ftc-autoconfig-matches';
const CURRENT_MATCH_KEY = 'ftc-autoconfig-current-match';

export function useMatches() {
  const [matches, setMatches] = useState(() => {
    try {
      const raw = localStorage.getItem(MATCHES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error('Failed to load matches:', e);
    }
    return [];
  });

  const [currentMatchId, setCurrentMatchId] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_MATCH_KEY);
      return saved ? saved : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(matches));
    } catch (e) {
      console.error('Failed to save matches:', e);
    }
  }, [matches]);

  useEffect(() => {
    try {
      if (currentMatchId) {
        localStorage.setItem(CURRENT_MATCH_KEY, currentMatchId);
      } else {
        localStorage.removeItem(CURRENT_MATCH_KEY);
      }
    } catch (e) {
      console.error('Failed to save current match:', e);
    }
  }, [currentMatchId]);

  const addMatch = () => {
    const newMatch = {
      id: crypto.randomUUID(),
      matchNumber: matches.length + 1,
      partnerTeam: '',
      alliance: 'red',
      startPosition: { type: 'front' },
      actions: []
    };
    setMatches(prev => [...prev, newMatch]);
    setCurrentMatchId(newMatch.id);
    return newMatch.id;
  };

  const deleteMatch = (matchId) => {
    setMatches(prev => {
      const newMatches = prev.filter(m => m.id !== matchId);
      // If we deleted the current match, select the first one or clear selection
      if (currentMatchId === matchId) {
        if (newMatches.length > 0) {
          setCurrentMatchId(newMatches[0].id);
        } else {
          setCurrentMatchId(null);
        }
      }
      return newMatches;
    });
  };

  const updateMatch = (matchId, updates) => {
    setMatches(prev => prev.map(match =>
      match.id === matchId ? { ...match, ...updates } : match
    ));
  };

  const getCurrentMatch = () => {
    if (!currentMatchId && matches.length > 0) {
      // Auto-select first match if none selected but matches exist
      setCurrentMatchId(matches[0].id);
      return matches[0];
    }
    return matches.find(m => m.id === currentMatchId);
  };

  const duplicateMatch = (matchId) => {
    const matchToDuplicate = matches.find(m => m.id === matchId);
    if (!matchToDuplicate) return;

    const newMatch = {
      ...matchToDuplicate,
      id: crypto.randomUUID(),
      matchNumber: matches.length + 1
    };
    setMatches(prev => [...prev, newMatch]);
    setCurrentMatchId(newMatch.id);
    return newMatch.id;
  };

  const exportAllMatches = () => {
    // Export in the correct hierarchical structure
    const config = {
      matches: matches.map(({ id, matchNumber, partnerTeam, alliance, startPosition, actions }) => ({
        match: {
          number: matchNumber,
          alliance: {
            color: alliance,
            team_number: partnerTeam ? parseInt(partnerTeam) || 0 : 0,
            auto: {
              startPosition: startPosition,
              actions: actions.map(({ id, label, ...rest }) => rest)
            }
          }
        }
      }))
    };
    return config;
  };

  const exportSingleMatch = (matchId) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return null;

    return {
      match: {
        number: match.matchNumber,
        alliance: {
          color: match.alliance,
          team_number: match.partnerTeam ? parseInt(match.partnerTeam) || 0 : 0,
          auto: {
            startPosition: match.startPosition,
            actions: match.actions.map(({ id, label, ...rest }) => rest)
          }
        }
      }
    };
  };

  const importMatches = (config) => {
    if (config.matches && Array.isArray(config.matches)) {
      // Handle new format
      const importedMatches = config.matches.map(item => {
        const matchData = item.match || item;
        return {
          id: crypto.randomUUID(),
          matchNumber: matchData.number || matchData.matchNumber || 1,
          partnerTeam: matchData.alliance?.team_number?.toString() || matchData.partnerTeam || '',
          alliance: matchData.alliance?.color || matchData.alliance || 'red',
          startPosition: matchData.alliance?.auto?.startPosition || matchData.startPosition || { type: 'front' },
          actions: (matchData.alliance?.auto?.actions || matchData.actions || []).map(action => ({
            ...action,
            id: crypto.randomUUID(),
            label: action.label || action.type
          }))
        };
      });
      setMatches(importedMatches);
      if (importedMatches.length > 0) {
        setCurrentMatchId(importedMatches[0].id);
      } else {
        setCurrentMatchId(null);
      }
    }
  };

  return {
    matches,
    currentMatchId,
    setCurrentMatchId,
    addMatch,
    deleteMatch,
    updateMatch,
    getCurrentMatch,
    duplicateMatch,
    exportAllMatches,
    exportSingleMatch,
    importMatches
  };
}
