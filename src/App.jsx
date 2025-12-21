import { useEffect, useState, useRef } from 'react';
import { useActionGroups } from './hooks/useActionGroups';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { usePresets } from './hooks/usePresets';
import { useStartPositions } from './hooks/useStartPositions';
import { useMatches } from './hooks/useMatches';
import { useThemePreference } from './hooks/useThemePreference';
import { useUnitsPreference } from './hooks/useUnitsPreference';
import { useAngleUnitsPreference } from './hooks/useAngleUnitsPreference';
import { useWizardActions } from './hooks/useWizardActions';
import { useMatchHandlers } from './hooks/useMatchHandlers';
import { useTemplateModal } from './hooks/useTemplateModal';
import { useServiceWorker } from './hooks/useServiceWorker';
import { HamburgerMenu } from './components/HamburgerMenu';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MainWizardView } from './components/MainWizardView';
import { SaveTemplateModal } from './components/SaveTemplateModal';
import { LoadTemplateModal } from './components/LoadTemplateModal';
import { UpdateNotification } from './components/UpdateNotification';
import { isValidReorder } from './utils/actionUtils';
import { exportMatchesJSON, exportConfigJSON } from './utils/configUtils';
import { loadConfigPreset } from './utils/presetUtils';
import { getThemeForAlliance } from './utils/themeUtils';

function App() {
  // Modal state
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  
  // Track default match template existence
  const [hasDefaultTemplate, setHasDefaultTemplate] = useState(false);

  // Ref for HamburgerMenu
  const hamburgerMenuRef = useRef(null);

  // Hooks
  const { presets, savePreset, deletePreset } = usePresets();
  const actionGroupsHook = useActionGroups();
  const startPositionsHook = useStartPositions();
  const matchesHook = useMatches();
  const { preference: themePreference, setPreference: setThemePreference, resolvedTheme } = useThemePreference();
  const { useInches, setUseInches } = useUnitsPreference();
  const { useDegrees, setUseDegrees } = useAngleUnitsPreference();
  const { updateAvailable, updateApp, currentVersion } = useServiceWorker();

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

  // Show update notification when update is available
  useEffect(() => {
    if (updateAvailable) {
      setShowUpdateNotification(true);
    }
  }, [updateAvailable]);

  // Check if default match template exists (match 0)
  useEffect(() => {
    setHasDefaultTemplate(matchesHook.hasDefaultMatchTemplate());
  }, [matchesHook.matches]); // Update when matches change

  // Config management for action groups and start positions (NOT match data)
  const getTemplateConfig = () => ({
    actionGroups: actionGroupsHook.actionGroups,
    startPositions: startPositionsHook.startPositions
  });

  const getConfig = () => matchesHook.exportAllMatches();

  const exportConfig = () => {
    const config = getTemplateConfig();
    exportConfigJSON(config);
  };

  const downloadJSON = () => {
    const config = getConfig();
    exportMatchesJSON(config);
  };

  // Template modal management
  const templateModal = useTemplateModal(savePreset, getTemplateConfig);
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

  // Preset loading - Load configuration preset (action groups and start positions)
  const loadPreset = (preset) => {
    loadConfigPreset(preset, actionGroupsHook, startPositionsHook);
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
    useInches,
    onUnitsChange: setUseInches,
    useDegrees,
    onAngleUnitsChange: setUseDegrees,
    actionGroups: actionGroupsHook.actionGroups,
    onAddActionToGroup: actionGroupsHook.addActionToGroup,
    onUpdateActionInGroup: actionGroupsHook.updateActionInGroup,
    onDeleteActionInGroup: actionGroupsHook.deleteActionInGroup,
    getNextActionKey: actionGroupsHook.getNextActionKey,
    actionsError: actionGroupsHook.error,
    clearActionsError: actionGroupsHook.clearError,
    onExportConfig: exportConfig,
    startPositions: startPositionsHook.startPositions,
    onAddStartPosition: startPositionsHook.addStartPosition,
    onUpdateStartPosition: startPositionsHook.updateStartPosition,
    onDeleteStartPosition: startPositionsHook.deleteStartPosition,
    getNextStartKey: startPositionsHook.getNextKey,
    positionsError: startPositionsHook.error,
    clearPositionsError: startPositionsHook.clearError,
    onSaveDefaultMatchTemplate: (matchId) => {
      if (matchesHook.saveMatchAsDefaultTemplate(matchId)) {
        setHasDefaultTemplate(true);
        alert('✓ Match saved as default template successfully');
      } else {
        alert('❌ Failed to save match as default template');
      }
    },
    onLoadDefaultMatchTemplate: () => {
      matchesHook.createMatchFromTemplate();
    },
    hasDefaultMatchTemplate: hasDefaultTemplate
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

        {/* Update Notification */}
        {showUpdateNotification && (
          <UpdateNotification
            onUpdate={updateApp}
            onDismiss={() => setShowUpdateNotification(false)}
            version={currentVersion}
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
        useInches={useInches}
        useDegrees={useDegrees}
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

      {/* Update Notification */}
      {showUpdateNotification && (
        <UpdateNotification
          onUpdate={updateApp}
          onDismiss={() => setShowUpdateNotification(false)}
          version={currentVersion}
        />
      )}
    </>
  );
}

export default App;
