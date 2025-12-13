export function loadPresetIntoMatches(preset, matchesHook, actionGroups) {
  if (preset.config.matches) {
    // New format - multiple matches
    matchesHook.importMatches(preset.config);
  } else {
    // Old format - single match
    const matchId = matchesHook.addMatch();
    matchesHook.updateMatch(matchId, {
      matchNumber: preset.config.matchNumber || 1,
      partnerTeam: preset.config.partnerTeam || '',
      alliance: preset.config.alliance || 'red',
      startPosition: preset.config.startPosition || { type: 'front' },
      actions: preset.config.actions?.map(action => {
        let label = action.type;
        for (const group of Object.values(actionGroups)) {
          const matchingAction = group.actions.find(a => a.id === action.type);
          if (matchingAction) {
            label = matchingAction.label;
            break;
          }
        }
        return { ...action, id: crypto.randomUUID(), label };
      }) || []
    });
    matchesHook.setCurrentMatchId(matchId);
  }
}

export function loadConfigPreset(preset, actionGroupsHook, startPositionsHook) {
  const config = preset.config;
  
  // Load action groups if they exist in the preset
  if (config.actionGroups) {
    // Store action groups to localStorage
    try {
      localStorage.setItem('ftc-autoconfig-action-groups', JSON.stringify(config.actionGroups));
      // Trigger a reload to apply the new configuration
      window.location.reload();
    } catch (e) {
      console.error('Failed to load action groups:', e);
    }
  }
  
  // Load start positions if they exist in the preset
  if (config.startPositions) {
    // Store start positions to localStorage
    try {
      localStorage.setItem('ftc-autoconfig-start-positions', JSON.stringify(config.startPositions));
      // If we didn't already trigger a reload for action groups, reload now
      if (!config.actionGroups) {
        window.location.reload();
      }
    } catch (e) {
      console.error('Failed to load start positions:', e);
    }
  }
}
