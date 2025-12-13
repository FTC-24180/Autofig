import { useEffect, useState, useRef } from 'react';
import { useActionGroups } from './hooks/useActionGroups';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { usePresets } from './hooks/usePresets';
import { useStartPositions } from './hooks/useStartPositions';
import { useMatches } from './hooks/useMatches';
import { useThemePreference } from './hooks/useThemePreference';
import { useWizardActions } from './hooks/useWizardActions';
import { useMatchHandlers } from './hooks/useMatchHandlers';
import { useTemplateModal } from './hooks/useTemplateModal';
import { HamburgerMenu } from './components/HamburgerMenu';
import { ManageActionsModal } from './components/ManageActionsModal';
import { ManageStartPositionsModal } from './components/ManageStartPositionsModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MainWizardView } from './components/MainWizardView';
import { SaveTemplateModal } from './components/SaveTemplateModal';
import { LoadTemplateModal } from './components/LoadTemplateModal';
import { isValidReorder } from './utils/actionUtils';
import { exportMatchesJSON, exportConfigJSON } from './utils/configUtils';
import { loadPresetIntoMatches } from './utils/presetUtils';
import { getThemeForAlliance } from './utils/themeUtils';

function App() {
  // Modal state
  const [showManageActions, setShowManageActions] = useState(false);
  const [showManageStartPositions, setShowManageStartPositions] = useState(false);

  // Ref for HamburgerMenu
  const hamburgerMenuRef = useRef(null);

  // Hooks
  const { presets, savePreset, deletePreset } = usePresets();
  const actionGroupsHook = useActionGroups();
  const startPositionsHook = useStartPositions();
  const matchesHook = useMatches();
  const { preference: themePreference, setPreference: setThemePreference, resolvedTheme } = useThemePreference();

  const isDarkTheme = resolvedTheme === 'dark';

  // Wizard state and actions
  const wizardActions = useWizardActions(matchesHook);
  const {
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
  } = wizardActions;

  // Match handlers
  const matchHandlers = useMatchHandlers(matchesHook, setCurrentStep);
  const {
    handleAddMatch,
    handleSelectMatch,
    handleSelectMatchFromQRCode,
    handleDuplicateMatch
  } = matchHandlers;

  // Config management
  const getConfig = () => matchesHook.exportAllMatches();

  const exportConfig = () => {
    const config = {
      actionGroups: actionGroupsHook.actionGroups,
      startPositions: startPositionsHook.startPositions
    };
    exportConfigJSON(config);
  };

  const downloadJSON = () => {
    const config = getConfig();
    exportMatchesJSON(config);
  };

  // Template modal management
  const templateModal = useTemplateModal(savePreset, getConfig);
  const {
    showSaveTemplate,
    showLoadTemplate,
    templateName,
    saveError,
    setTemplateName,
    setShowSaveTemplate,
    setShowLoadTemplate,
    handleSaveTemplate,
    closeSaveTemplate
  } = templateModal;

  // Preset loading
  const loadPreset = (preset) => {
    loadPresetIntoMatches(preset, matchesHook, actionGroupsHook.actionGroups);
  };

  // Drag and drop
  const dragHandlers = useDragAndDrop(
    currentMatch?.actions || [],
    (newActions) => {
      if (matchesHook.currentMatchId) {
        matchesHook.updateMatch(matchesHook.currentMatchId, { actions: newActions });
      }
    },
    (from, to) => isValidReorder(currentMatch?.actions || [], from, to)
  );

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }, []);

  // Calculate theme
  const theme = getThemeForAlliance(currentMatch?.alliance, isDarkTheme);

  // Common menu props
  const menuProps = {
    matches: matchesHook.matches,
    currentMatchId: matchesHook.currentMatchId,
    onSelectMatch: handleSelectMatch,
    onAddMatch: handleAddMatch,
    onDeleteMatch: matchesHook.deleteMatch,
    onDuplicateMatch: handleDuplicateMatch,
    onExportJSON: downloadJSON,
    onSaveTemplate: () => setShowSaveTemplate(true),
    onLoadTemplate: () => setShowLoadTemplate(true),
    presets,
    onLoadPreset: loadPreset,
    onDeletePreset: deletePreset,
    themePreference,
    resolvedTheme,
    onThemeChange: setThemePreference,
    actionGroups: actionGroupsHook.actionGroups,
    onRenameGroup: actionGroupsHook.renameGroup,
    onDeleteGroup: actionGroupsHook.deleteGroup,
    onAddActionToGroup: actionGroupsHook.addActionToGroup,
    onUpdateActionInGroup: actionGroupsHook.updateActionInGroup,
    onDeleteActionInGroup: actionGroupsHook.deleteActionInGroup,
    onAddCustomGroup: actionGroupsHook.addCustomGroup,
    onExportConfig: exportConfig,
    startPositions: startPositionsHook.startPositions,
    onAddStartPosition: startPositionsHook.addStartPosition,
    onUpdateStartPosition: startPositionsHook.updateStartPosition,
    onDeleteStartPosition: startPositionsHook.deleteStartPosition
  };

  // Show welcome screen if no matches exist
  if (matchesHook.matches.length === 0) {
    return (
      <>
        <WelcomeScreen 
          isDarkTheme={isDarkTheme}
          onAddMatch={handleAddMatch}
          presets={presets}
          onShowSaveTemplate={() => hamburgerMenuRef.current?.openToTemplates()}
          onShowManageActions={() => hamburgerMenuRef.current?.openToActionsConfig()}
        />

        <HamburgerMenu ref={hamburgerMenuRef} {...menuProps} />

        {/* Save Template Modal */}
        {showSaveTemplate && (
          <SaveTemplateModal
            templateName={templateName}
            onTemplateNameChange={setTemplateName}
            onSave={handleSaveTemplate}
            onClose={closeSaveTemplate}
            error={saveError}
          />
        )}

        {/* Load Template Modal */}
        {showLoadTemplate && (
          <LoadTemplateModal
            presets={presets}
            onLoadPreset={loadPreset}
            onDeletePreset={deletePreset}
            onClose={() => setShowLoadTemplate(false)}
          />
        )}
      </>
    );
  }

  // Normal wizard view when matches exist
  return (
    <>
      <MainWizardView
        theme={theme}
        currentMatch={currentMatch}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        updateCurrentMatch={updateCurrentMatch}
        updateStartPositionField={updateStartPositionField}
        startPositions={startPositionsHook.startPositions}
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
        getConfig={getConfig}
        onDownload={downloadJSON}
        matches={matchesHook.matches}
        currentMatchId={matchesHook.currentMatchId}
        onSelectMatchFromQRCode={handleSelectMatchFromQRCode}
        canGoNext={canGoNext()}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      <HamburgerMenu ref={hamburgerMenuRef} {...menuProps} />

      {/* Remove Manage Actions and Start Positions Modals as they're now in the hamburger menu */}

      {/* Save Template Modal */}
      {showSaveTemplate && (
        <SaveTemplateModal
          templateName={templateName}
          onTemplateNameChange={setTemplateName}
          onSave={handleSaveTemplate}
          onClose={closeSaveTemplate}
          error={saveError}
        />
      )}

      {/* Load Template Modal */}
      {showLoadTemplate && (
        <LoadTemplateModal
          presets={presets}
          onLoadPreset={loadPreset}
          onDeletePreset={deletePreset}
          onClose={() => setShowLoadTemplate(false)}
        />
      )}
    </>
  );
}

export default App;
