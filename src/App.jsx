import { useState, useEffect } from 'react';
import { useActionGroups } from './hooks/useActionGroups';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { usePresets } from './hooks/usePresets';
import { useStartPositions } from './hooks/useStartPositions';
import { useMatches } from './hooks/useMatches';
import { useThemePreference } from './hooks/useThemePreference';
import { HamburgerMenu } from './components/HamburgerMenu';
import { WizardContainer } from './components/WizardContainer';
import { WizardNavigation } from './components/WizardNavigation';
import { ManageActionsModal } from './components/ManageActionsModal';
import { ManageStartPositionsModal } from './components/ManageStartPositionsModal';
import { Step1MatchSetup } from './components/steps/Step1MatchSetup';
import { Step4StartPosition } from './components/steps/Step4StartPosition';
import { Step5Actions } from './components/steps/Step5Actions';
import { Step6QRCode } from './components/steps/Step6QRCode';
import { AllianceIcon } from './components/AllianceIcon';
import { isValidReorder, createNewAction } from './utils/actionUtils';

function App() {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedGroup, setExpandedGroup] = useState(null);

  // Modal state
  const [showManageActions, setShowManageActions] = useState(false);
  const [showManageStartPositions, setShowManageStartPositions] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Hooks
  const { presets, savePreset, deletePreset } = usePresets();
  const actionGroupsHook = useActionGroups();
  const startPositionsHook = useStartPositions();
  const matchesHook = useMatches();
  const { preference: themePreference, setPreference: setThemePreference, resolvedTheme } = useThemePreference();

  const isDarkTheme = resolvedTheme === 'dark';

  // Get current match data
  const currentMatch = matchesHook.getCurrentMatch();

  const dragHandlers = useDragAndDrop(
    currentMatch?.actions || [],
    (newActions) => {
      if (matchesHook.currentMatchId) {
        matchesHook.updateMatch(matchesHook.currentMatchId, { actions: newActions });
      }
    },
    (from, to) => isValidReorder(currentMatch?.actions || [], from, to)
  );

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }, []);

  // DO NOT automatically create matches - let user do it explicitly

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
    if (!currentMatch) return false;
    switch (currentStep) {
      case 0: return currentMatch.matchNumber > 0 && currentMatch.alliance !== '';
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

  const handleAddMatch = () => {
    const newMatchId = matchesHook.addMatch();
    setCurrentStep(0); // Reset to first step for new match
  };

  const handleSelectMatch = (matchId) => {
    matchesHook.setCurrentMatchId(matchId);
    setCurrentStep(0); // Reset to first step when switching matches
  };

  const handleSelectMatchFromQRCode = (matchId) => {
    // Switch match without changing the current step
    matchesHook.setCurrentMatchId(matchId);
  };

  const handleDuplicateMatch = (matchId) => {
    const newMatchId = matchesHook.duplicateMatch(matchId);
    if (newMatchId) {
      matchesHook.setCurrentMatchId(newMatchId);
      setCurrentStep(0); // Reset to first step for duplicated match
    }
  };
  
  //const theme = currentMatch?.alliance === 'red'
  //  ? isDarkTheme
  //    ? { from: '#3f1d1d', to: '#111827', accent: '#f87171' }
  //    : { from: '#fff5f5', to: '#fff1f2', accent: '#ef4444' }
  //  : isDarkTheme
  //    ? { from: '#1e293b', to: '#0f172a', accent: '#60a5fa' }
    //    : { from: '#dbeafe', to: '#e0e7ff', accent: '#3b82f6' };
    const theme = currentMatch?.alliance === 'red'
        ? isDarkTheme
            ? { from: '#3f1d1d', to: '#111827', accent: '#f87171' }
            : { from: '#fff5f5', to: '#fff1f2', accent: '#ef4444' }
        : isDarkTheme
            ? { from: '#1E3A78  ', to: '#0f172a', accent: '#60a5fa' }
            : { from: '#dbeafe', to: '#e0e7ff', accent: '#3b82f6' };

  // Show welcome screen if no matches exist
  if (matchesHook.matches.length === 0) {
    return (
      <div className={`h-screen flex flex-col overflow-hidden ${isDarkTheme ? 'bg-gradient-to-br from-slate-900 to-slate-950' : 'bg-gradient-to-br from-indigo-50 to-blue-50'}`}>
        <header className="bg-white dark:bg-slate-900 shadow-lg flex-shrink-0 safe-top border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center justify-center px-3 py-2.5">
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                FTC AutoConfig
              </h1>
              <p className="text-xs text-indigo-600 dark:text-indigo-300 leading-none">
                Autonomous Match Configuration
              </p>
            </div>
          </div>
        </header>

        <HamburgerMenu
          matches={matchesHook.matches}
          currentMatchId={matchesHook.currentMatchId}
          onSelectMatch={handleSelectMatch}
          onAddMatch={handleAddMatch}
          onDeleteMatch={matchesHook.deleteMatch}
          onDuplicateMatch={handleDuplicateMatch}
          onExportJSON={downloadJSON}
          onSaveTemplate={() => setShowSaveTemplate(true)}
          onLoadTemplate={() => {}}
          presets={presets}
          onLoadPreset={loadPreset}
          onDeletePreset={deletePreset}
          themePreference={themePreference}
          resolvedTheme={resolvedTheme}
          onThemeChange={setThemePreference}
          actionGroups={actionGroupsHook.actionGroups}
          onRenameGroup={actionGroupsHook.renameGroup}
          onDeleteGroup={actionGroupsHook.deleteGroup}
          onAddActionToGroup={actionGroupsHook.addActionToGroup}
          onUpdateActionInGroup={actionGroupsHook.updateActionInGroup}
          onDeleteActionInGroup={actionGroupsHook.deleteActionInGroup}
          onAddCustomGroup={actionGroupsHook.addCustomGroup}
          onExportConfig={exportConfig}
          startPositions={startPositionsHook.startPositions}
          onAddStartPosition={startPositionsHook.addStartPosition}
          onUpdateStartPosition={startPositionsHook.updateStartPosition}
          onDeleteStartPosition={startPositionsHook.deleteStartPosition}
        />

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-slate-800">
              <div className="mb-6">
                <div className="w-20 h-20 bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Welcome to FTC AutoConfig
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Configure your autonomous routines for FTC matches
                </p>
              </div>

              <button
                onClick={handleAddMatch}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-lg transition-colors min-h-[56px] touch-manipulation shadow-lg hover:shadow-xl"
              >
                Create Your First Match
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Or get started with:</p>
                <div className="space-y-2">
                  {presets.length > 0 && (
                    <button
                      onClick={() => setShowSaveTemplate(true)}
                      className="w-full py-2 px-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 active:bg-gray-300 text-gray-700 dark:text-gray-100 rounded-lg font-medium text-sm transition min-h-[44px] touch-manipulation"
                    >
                      📄 Load a Template
                    </button>
                  )}
                  <button
                    onClick={() => setShowManageActions(true)}
                    className="w-full py-2 px-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 active:bg-gray-300 text-gray-700 dark:text-gray-100 rounded-lg font-medium text-sm transition min-h-[44px] touch-manipulation"
                  >
                    ⚙️ Configure Actions
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-slate-800/70 border border-blue-200 dark:border-slate-700 rounded-lg p-4 text-left">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800 dark:text-blue-100">
                  <strong className="font-semibold">Quick Start:</strong> Create a match, configure your starting position and actions, then scan the QR code with your robot.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showManageActions && (
          <ManageActionsModal
            actionGroups={actionGroupsHook.actionGroups}
            onClose={() => setShowManageActions(false)}
            onExportConfig={exportConfig}
            onRenameGroup={actionGroupsHook.renameGroup}
            onDeleteGroup={actionGroupsHook.deleteGroup}
            onAddActionToGroup={actionGroupsHook.addActionToGroup}
            onUpdateActionInGroup={actionGroupsHook.updateActionInGroup}
            onDeleteActionInGroup={actionGroupsHook.deleteActionInGroup}
            onAddCustomGroup={actionGroupsHook.addCustomGroup}
          />
        )}

        {showManageStartPositions && (
          <ManageStartPositionsModal
            startPositions={startPositionsHook.startPositions}
            onClose={() => setShowManageStartPositions(false)}
            onExportConfig={exportConfig}
            onAddStartPosition={startPositionsHook.addStartPosition}
            onUpdateStartPosition={startPositionsHook.updateStartPosition}
            onDeleteStartPosition={startPositionsHook.deleteStartPosition}
          />
        )}


        {showSaveTemplate && (
          <div className="fixed inset-0 bg-white dark:bg-slate-950 z-50 flex flex-col overflow-hidden safe-area">
            <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-3 py-3 flex justify-between items-center safe-top">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Load Template</h3>
              <button
                onClick={() => setShowSaveTemplate(false)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-700 active:text-gray-700 text-3xl leading-none w-11 h-11 flex items-center justify-center touch-manipulation"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {presets.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">No templates saved yet</p>
                  <button
                    onClick={() => setShowSaveTemplate(false)}
                    className="py-2 px-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-gray-100 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {presets.map(preset => (
                    <div key={preset.id} className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-gray-200 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">{preset.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          loadPreset(preset);
                          setShowSaveTemplate(false);
                        }}
                        className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm rounded-lg transition min-h-[40px] touch-manipulation"
                      >
                        Load Template
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Normal wizard view when matches exist
  return (
    <div 
      className="h-screen flex flex-col overflow-hidden touch-manipulation"
      style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
    >
      {/* Compact Mobile Header */}
      <header className="bg-white dark:bg-slate-900 shadow-lg flex-shrink-0 safe-top border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center justify-center px-3 py-2.5">
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
              FTC AutoConfig
            </h1>
            <p className="text-xs text-indigo-600 dark:text-indigo-300 leading-none flex items-center justify-center gap-1">
              Match #{currentMatch?.matchNumber || '?'} •{' '}
              <AllianceIcon 
                alliance={currentMatch?.alliance} 
                className={`w-3 h-3 ${currentMatch?.alliance === 'red' ? 'text-red-600' : 'text-blue-600'}`}
              />
              {' '}{currentMatch?.alliance?.toUpperCase() || 'NONE'}
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
        onExportJSON={downloadJSON}
        onSaveTemplate={() => setShowSaveTemplate(true)}
        onLoadTemplate={() => {}}
        presets={presets}
        onLoadPreset={loadPreset}
        onDeletePreset={deletePreset}
        themePreference={themePreference}
        resolvedTheme={resolvedTheme}
        onThemeChange={setThemePreference}
        actionGroups={actionGroupsHook.actionGroups}
        onRenameGroup={actionGroupsHook.renameGroup}
        onDeleteGroup={actionGroupsHook.deleteGroup}
        onAddActionToGroup={actionGroupsHook.addActionToGroup}
        onUpdateActionInGroup={actionGroupsHook.updateActionInGroup}
        onDeleteActionInGroup={actionGroupsHook.deleteActionInGroup}
        onAddCustomGroup={actionGroupsHook.addCustomGroup}
        onExportConfig={exportConfig}
        startPositions={startPositionsHook.startPositions}
        onAddStartPosition={startPositionsHook.addStartPosition}
        onUpdateStartPosition={startPositionsHook.updateStartPosition}
        onDeleteStartPosition={startPositionsHook.deleteStartPosition}
      />

      {/* Main Content - Full Screen Wizard */}
      <div className="flex-1 overflow-hidden">
        <WizardContainer currentStep={currentStep} onStepChange={setCurrentStep}>
          <Step1MatchSetup
            matchNumber={currentMatch?.matchNumber || 1}
            partnerTeam={currentMatch?.partnerTeam || ''}
            alliance={currentMatch?.alliance || 'red'}
            onMatchNumberChange={(num) => updateCurrentMatch({ matchNumber: num })}
            onPartnerTeamChange={(team) => updateCurrentMatch({ partnerTeam: team })}
            onAllianceChange={(alliance) => updateCurrentMatch({ alliance })}
          />
          <Step4StartPosition
            startPosition={currentMatch?.startPosition || { type: 'front' }}
            onStartPositionChange={(pos) => updateCurrentMatch({ startPosition: pos })}
            startPositions={startPositionsHook.startPositions}
            onUpdateField={updateStartPositionField}
          />
          <Step5Actions
            actionList={currentMatch?.actions || []}
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
            matches={matchesHook.matches}
            currentMatchId={matchesHook.currentMatchId}
            onSelectMatch={handleSelectMatchFromQRCode}
          />
        </WizardContainer>
      </div>

      {/* Compact Bottom Navigation */}
      <WizardNavigation
        currentStep={currentStep}
        totalSteps={4}
        onNext={handleNext}
        onPrev={handlePrev}
        canGoNext={canGoNext()}
        nextLabel={currentStep === 3 ? 'Finish' : 'Next'}
      />

      {/* Manage Actions Modal */}
      {showManageActions && (
        <ManageActionsModal
          actionGroups={actionGroupsHook.actionGroups}
          onClose={() => setShowManageActions(false)}
          onExportConfig={exportConfig}
          onRenameGroup={actionGroupsHook.renameGroup}
          onDeleteGroup={actionGroupsHook.deleteGroup}
          onAddActionToGroup={actionGroupsHook.addActionToGroup}
          onUpdateActionInGroup={actionGroupsHook.updateActionInGroup}
          onDeleteActionInGroup={actionGroupsHook.deleteActionInGroup}
          onAddCustomGroup={actionGroupsHook.addCustomGroup}
        />
      )}

      {/* Manage Start Positions Modal */}
      {showManageStartPositions && (
        <ManageStartPositionsModal
          startPositions={startPositionsHook.startPositions}
          onClose={() => setShowManageStartPositions(false)}
          onAddStartPosition={startPositionsHook.addStartPosition}
          onUpdateStartPosition={startPositionsHook.updateStartPosition}
          onDeleteStartPosition={startPositionsHook.deleteStartPosition}
        />
      )}

      {/* Full Screen Save Template Modal */}
      {showSaveTemplate && (
        <div className="fixed inset-0 bg-white dark:bg-slate-950 z-50 flex flex-col overflow-hidden safe-area">
          <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-3 py-3 flex justify-between items-center safe-top">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Save as Template</h3>
            <button
              onClick={() => {
                setShowSaveTemplate(false);
                setTemplateName('');
              }}
              className="text-gray-500 dark:text-gray-300 active:text-gray-700 text-3xl leading-none w-11 h-11 flex items-center justify-center touch-manipulation"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <label className="block text-base font-medium text-gray-700 dark:text-gray-200 mb-3">
                Template Name
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
                className="w-full text-lg px-4 py-3 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[48px] touch-manipulation"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSaveTemplate();
                }}
              />
            </div>
          </div>
          <div className="flex-shrink-0 p-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 safe-bottom">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveTemplate(false);
                  setTemplateName('');
                }}
                className="flex-1 py-3 px-4 bg-gray-200 dark:bg-slate-800 active:bg-gray-300 text-gray-700 dark:text-gray-100 rounded-lg font-semibold text-lg min-h-[48px] touch-manipulation"
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
