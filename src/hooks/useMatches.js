import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

// Schema version for exported match data
const MATCH_DATA_SCHEMA_VERSION = '1.0.0';

export function useMatches() {
  const [matches, setMatches] = useState(() => {
    const parsed = getStorageItem(STORAGE_KEYS.MATCHES, []);
    return Array.isArray(parsed) ? parsed : [];
  });

  const [currentMatchId, setCurrentMatchId] = useState(() => {
    return getStorageItem(STORAGE_KEYS.CURRENT_MATCH, null);
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.MATCHES, matches);
  }, [matches]);

  useEffect(() => {
    if (currentMatchId) {
      setStorageItem(STORAGE_KEYS.CURRENT_MATCH, currentMatchId);
    } else {
      removeStorageItem(STORAGE_KEYS.CURRENT_MATCH);
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
    // Export in the correct hierarchical structure with schema version
    const config = {
      version: MATCH_DATA_SCHEMA_VERSION,
      matches: matches.map(({ id, matchNumber, partnerTeam, alliance, startPosition, actions }) => ({
        match: {
          number: matchNumber,
          alliance: {
            color: alliance,
            team_number: partnerTeam ? parseInt(partnerTeam) || 0 : 0,
            auto: {
              startPosition: startPosition,
              // Keep type (id) and label, omit only internal UUID
              actions: actions.map(({ id, ...rest }) => rest)
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
      version: MATCH_DATA_SCHEMA_VERSION,
      match: {
        number: match.matchNumber,
        alliance: {
          color: match.alliance,
          team_number: match.partnerTeam ? parseInt(match.partnerTeam) || 0 : 0,
          auto: {
            startPosition: match.startPosition,
            // Keep type (id) and label, omit only internal UUID
            actions: match.actions.map(({ id, ...rest }) => rest)
          }
        }
      }
    };
  };

  const importMatches = (config) => {
    // Handle both versioned and legacy formats
    const matchesArray = config.matches || (config.match ? [{ match: config.match }] : []);
    
    if (matchesArray && Array.isArray(matchesArray)) {
      const importedMatches = matchesArray.map(item => {
        const matchData = item.match || item;
        return {
          id: crypto.randomUUID(),
          matchNumber: matchData.number || matchData.matchNumber || 1,
          partnerTeam: matchData.alliance?.team_number?.toString() || matchData.partnerTeam || '',
          alliance: matchData.alliance?.color || matchData.alliance || 'red',
          startPosition: matchData.alliance?.auto?.startPosition || matchData.startPosition || { type: 'front' },
          actions: (matchData.alliance?.auto?.actions || matchData.actions || []).map(action => ({
            ...action,
            // Generate new internal UUID for this instance
            id: crypto.randomUUID(),
            // Ensure label exists (should always be present now)
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
    importMatches,
    SCHEMA_VERSION: MATCH_DATA_SCHEMA_VERSION
  };
}
