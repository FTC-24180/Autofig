import { useState, useEffect } from 'react';
import { useActionGroups } from './hooks/useActionGroups';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { usePresets } from './hooks/usePresets';
import { useStartPositions } from './hooks/useStartPositions';
import { useMatches } from './hooks/useMatches';
import { HamburgerMenu } from './components/HamburgerMenu';
import { WizardContainer } from './components/WizardContainer';
import { WizardNavigation } from './components/WizardNavigation';
import { ManageConfigModal } from './components/ManageConfigModal';
import { Step1Match } from './components/steps/Step1Match';
import { Step2Partner } from './components/steps/Step2Partner';
import { Step3Alliance } from './components/steps/Step3Alliance';
import { Step4StartPosition } from './components/steps/Step4StartPosition';
import { Step5Actions } from './components/steps/Step5Actions';
import { Step6QRCode } from './components/steps/Step6QRCode';
import { isValidReorder, createNewAction } from './utils/actionUtils';

function App() {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedGroup, setExpandedGroup] = useState(null);

  // Modal state
  const [showManageActions, setShowManageActions] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Hooks
  const { presets, savePreset, deletePreset } = usePresets();
  const actionGroupsHook = useActionGroups();
  const startPositionsHook = useStartPositions();
  const matchesHook = useMatches();

  // Get current match data
  const currentMatch = matchesHook.getCurrentMatch() || {
    matchNumber: 1,
    partnerTeam: '',
    alliance: 'red',
    startPosition: { type: 'front' },
    actions: []
  };

  const dragHandlers = useDragAndDrop(
    currentMatch.actions || [],
    (newActions) => {
      if (matchesHook.currentMatchId) {
        matchesHook.updateMatch(matchesHook.currentMatchId, { actions: newActions });
      }
    },
    (from, to) => isValidReorder(currentMatch.actions || [], from, to)
  );

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }, []);

  // Create first match if none exist
  useEffect(() => {
    if (matchesHook.matches.length === 0) {
      matchesHook.addMatch();
    }
  }, []);

  const updateCurrentMatch = (updates) => {
    if (matchesHook.currentMatchId) {
      matchesHook.updateMatch(matchesHook.currentMatchId, updates);
    }
  };

  const addAction = (action) => {
    const newAction = createNewAction(action);
    const updatedActions = [...(currentMatch.actions || []), newAction];
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
    const newStartPosition = { ...currentMatch.startPosition, [field]: parseFloat(value) || 0 };
    updateCurrentMatch({ startPosition: newStartPosition });
  };

  const getConfig = () => matchesHook.exportAllMatches();

  const downloadJSON = () => {
    const config = getConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ftc-auto-all-matches-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }
    if (savePreset(templateName, getConfig())) {
      setTemplateName('');
      setShowSaveTemplate(false);
    }
  };

  const loadPreset = (preset) => {
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
          for (const group of Object.values(actionGroupsHook.actionGroups)) {
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
  };

  const exportConfig = () => {
    const config = {
      actionGroups: actionGroupsHook.actionGroups,
      startPositions: startPositionsHook.startPositions
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ftc-config-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0: return currentMatch.matchNumber > 0;
      case 1: return true; // Partner is optional
      case 2: return currentMatch.alliance !== '';
      case 3: return currentMatch.startPosition?.type !== '';
      case 4: return true; // Actions are optional but recommended
      case 5: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddMatch = () => {
    const newMatchId = matchesHook.addMatch();
    setCurrentStep(0); // Reset to first step for new match
  };

  const handleSelectMatch = (matchId) => {
    matchesHook.setCurrentMatchId(matchId);
  };

  const handleDuplicateMatch = (matchId) => {
    const newMatchId = matchesHook.duplicateMatch(matchId);
    if (newMatchId) {
      matchesHook.setCurrentMatchId(newMatchId);
    }
  };

  const theme = currentMatch.alliance === 'red'
    ? { from: '#fff5f5', to: '#fff1f2', accent: '#ef4444' }
    : { from: '#eff6ff', to: '#eef2ff', accent: '#3b82f6' };

  return (
    <div 
      className="h-screen flex flex-col overflow-hidden touch-manipulation"
      style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
    >
      {/* Compact Mobile Header */}
      <header className="bg-white shadow-sm flex-shrink-0 safe-top">
        <div className="flex items-center justify-center px-3 py-2.5">
          <div className="text-center">
            <h1 className="text-lg font-bold text-indigo-900 leading-tight">
              FTC AutoConfig
            </h1>
            <p className="text-xs text-indigo-600 leading-none">
              Match #{currentMatch.matchNumber} • {currentMatch.alliance === 'red' ? '🔴' : '🔵'} {currentMatch.alliance.toUpperCase()}
            </p>
          </div>
        </div>
      </header>

      {/* Hamburger Menu with Match Management */}
      <HamburgerMenu
        matches={matchesHook.matches}
        currentMatchId={matchesHook.currentMatchId}
        onSelectMatch={handleSelectMatch}
        onAddMatch={handleAddMatch}
        onDeleteMatch={matchesHook.deleteMatch}
        onDuplicateMatch={handleDuplicateMatch}
        onConfigureActions={() => setShowManageActions(true)}
        onExportJSON={downloadJSON}
        onSaveTemplate={() => setShowSaveTemplate(true)}
        onLoadTemplate={() => {}}
        presets={presets}
        onLoadPreset={loadPreset}
        onDeletePreset={deletePreset}
      />

      {/* Main Content - Full Screen Wizard */}
      <div className="flex-1 overflow-hidden">
        <WizardContainer currentStep={currentStep} onStepChange={setCurrentStep}>
          <Step1Match
            matchNumber={currentMatch.matchNumber}
            onMatchNumberChange={(num) => updateCurrentMatch({ matchNumber: num })}
          />
          <Step2Partner
            partnerTeam={currentMatch.partnerTeam}
            onPartnerTeamChange={(team) => updateCurrentMatch({ partnerTeam: team })}
          />
          <Step3Alliance
            alliance={currentMatch.alliance}
            onAllianceChange={(alliance) => updateCurrentMatch({ alliance })}
          />
          <Step4StartPosition
            startPosition={currentMatch.startPosition}
            onStartPositionChange={(pos) => updateCurrentMatch({ startPosition: pos })}
            startPositions={startPositionsHook.startPositions}
            onUpdateField={updateStartPositionField}
          />
          <Step5Actions
            actionList={currentMatch.actions || []}
            actionGroups={actionGroupsHook.actionGroups}
            expandedGroup={expandedGroup}
            setExpandedGroup={setExpandedGroup}
            onAddAction={addAction}
            onMoveAction={moveAction}
            onRemoveAction={removeAction}
            onUpdateActionConfig={updateActionConfig}
            onClearAll={clearAll}
            dragHandlers={dragHandlers}
          />
          <Step6QRCode
            config={getConfig()}
            onDownload={downloadJSON}
          />
        </WizardContainer>
      </div>

      {/* Compact Bottom Navigation */}
      <WizardNavigation
        currentStep={currentStep}
        totalSteps={6}
        onNext={handleNext}
        onPrev={handlePrev}
        canGoNext={canGoNext()}
        nextLabel={currentStep === 5 ? 'Finish' : 'Next'}
      />

      {/* Manage Actions Modal */}
      {showManageActions && (
        <ManageConfigModal
          actionGroups={actionGroupsHook.actionGroups}
          startPositions={startPositionsHook.startPositions}
          onClose={() => setShowManageActions(false)}
          onExportConfig={exportConfig}
          onRenameGroup={actionGroupsHook.renameGroup}
          onDeleteGroup={actionGroupsHook.deleteGroup}
          onAddActionToGroup={actionGroupsHook.addActionToGroup}
          onUpdateActionInGroup={actionGroupsHook.updateActionInGroup}
          onDeleteActionInGroup={actionGroupsHook.deleteActionInGroup}
          onAddCustomGroup={actionGroupsHook.addCustomGroup}
          onAddStartPosition={startPositionsHook.addStartPosition}
          onUpdateStartPosition={startPositionsHook.updateStartPosition}
          onDeleteStartPosition={startPositionsHook.deleteStartPosition}
        />
      )}

      {/* Full Screen Save Template Modal */}
      {showSaveTemplate && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden safe-area">
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 py-3 flex justify-between items-center safe-top">
            <h3 className="text-lg font-bold text-gray-800">Save as Template</h3>
            <button
              onClick={() => {
                setShowSaveTemplate(false);
                setTemplateName('');
              }}
              className="text-gray-500 active:text-gray-700 text-3xl leading-none w-11 h-11 flex items-center justify-center touch-manipulation"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <label className="block text-base font-medium text-gray-700 mb-3">
                Template Name
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
                className="w-full text-lg px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[48px] touch-manipulation"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSaveTemplate();
                }}
              />
            </div>
          </div>
          <div className="flex-shrink-0 p-3 bg-white border-t border-gray-200 safe-bottom">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveTemplate(false);
                  setTemplateName('');
                }}
                className="flex-1 py-3 px-4 bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg font-semibold text-lg min-h-[48px] touch-manipulation"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="flex-1 py-3 px-4 bg-indigo-600 active:bg-indigo-700 text-white rounded-lg font-semibold text-lg min-h-[48px] touch-manipulation"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
