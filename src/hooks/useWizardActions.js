import { useState } from 'react';
import { createNewAction } from '../utils/actionUtils';

export function useWizardActions(matchesHook) {
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedGroup, setExpandedGroup] = useState(null);

  const currentMatch = matchesHook.getCurrentMatch();

  const updateCurrentMatch = (updates) => {
    if (matchesHook.currentMatchId) {
      matchesHook.updateMatch(matchesHook.currentMatchId, updates);
    }
  };

  const addAction = (action) => {
    // Check if an action with this type already exists in the list
    // BUT allow multiple Wait actions (type 'W')
    const existingActions = currentMatch.actions || [];
    const isDuplicate = action.id !== 'W' && existingActions.some(existingAction => existingAction.type === action.id);
    
    if (isDuplicate) {
      // Show user feedback that this action is already in the list
      alert(`Action "${action.label}" (${action.id}) is already in your sequence. Each action type can only be added once.`);
      return;
    }
    
    const newAction = createNewAction(action);
    const updatedActions = [...existingActions, newAction];
    updateCurrentMatch({ actions: updatedActions });
  };

  const removeAction = (id) => {
    const updatedActions = (currentMatch.actions || []).filter(action => action.id !== id);
    updateCurrentMatch({ actions: updatedActions });
  };

  const moveAction = (id, direction) => {
    const actions = currentMatch.actions || [];
    const index = actions.findIndex(action => action.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= actions.length) return;
    
    const newList = [...actions];
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    updateCurrentMatch({ actions: newList });
  };

  const updateActionConfig = (id, key, value) => {
    const updatedActions = (currentMatch.actions || []).map(action =>
      action.id === id
        ? { ...action, config: { ...action.config, [key]: value } }
        : action
    );
    updateCurrentMatch({ actions: updatedActions });
  };

  const clearAll = () => {
    if (confirm('Clear all actions?')) {
      updateCurrentMatch({ actions: [] });
    }
  };

  const updateStartPositionField = (field, value) => {
    // Parse to number for storage (match state should have numbers)
    const numValue = parseFloat(value);
    const finalValue = isNaN(numValue) ? 0 : numValue;
    
    const newStartPosition = { ...currentMatch.startPosition, [field]: finalValue };
    updateCurrentMatch({ startPosition: newStartPosition });
  };

  const canGoNext = () => {
    if (!currentMatch) return false;
    switch (currentStep) {
      case 0: return currentMatch.matchNumber >= 0 && currentMatch.alliance !== '';
      case 1: return currentMatch.startPosition?.type !== '';
      case 2: return true; // Actions are optional but recommended
      case 3: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    expandedGroup,
    setExpandedGroup,
    currentMatch,
    updateCurrentMatch,
    addAction,
    removeAction,
    moveAction,
    updateActionConfig,
    clearAll,
    updateStartPositionField,
    canGoNext,
    handleNext,
    handlePrev
  };
}
