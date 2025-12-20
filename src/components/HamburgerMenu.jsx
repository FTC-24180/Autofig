import { useState, useImperativeHandle, forwardRef } from 'react';
import { VERSION } from '../../public/version.js';
import { ConfigurationMenu } from './menu/ConfigurationMenu';
import { MatchesMenu } from './menu/MatchesMenu';
import { SettingsMenu } from './menu/SettingsMenu';
import { TemplatesMenu } from './menu/TemplatesMenu';
import { ClearDataModal } from './ClearDataModal';
import { ConfirmClearDataModal } from './ConfirmClearDataModal';
import { ClearDataSuccessModal } from './ClearDataSuccessModal';
import { DeleteConfigurationModal } from './DeleteConfigurationModal';
import { DeleteMatchModal } from './DeleteMatchModal';
import { removeStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

export const HamburgerMenu = forwardRef(function HamburgerMenu({ 
  matches,
  currentMatchId,
  onSelectMatch,
  onAddMatch,
  onDeleteMatch,
  onDuplicateMatch,
  onExportJSON, 
  onSaveTemplate,
  onLoadTemplate,
  presets,
  onLoadPreset,
  onDeletePreset,
  themePreference = 'system',
  resolvedTheme = 'light',
  onThemeChange = () => {},
  useInches = true,
  onUnitsChange = () => {},
  useDegrees = true,
  onAngleUnitsChange = () => {},
  // Props for inline configuration
  actionGroups,
  onAddActionToGroup,
  onUpdateActionInGroup,
  onDeleteActionInGroup,
  getNextActionKey,
  actionsError,
  clearActionsError,
  onExportConfig,
  startPositions,
  onAddStartPosition,
  onUpdateStartPosition,
  onDeleteStartPosition,
  getNextStartKey,
  positionsError,
  clearPositionsError
}, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showActionsConfig, setShowActionsConfig] = useState(false);
  const [showPositionsConfig, setShowPositionsConfig] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [showConfirmClearModal, setShowConfirmClearModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteConfigModal, setShowDeleteConfigModal] = useState(false);
  const [configToDelete, setConfigToDelete] = useState(null);
  const [showDeleteMatchModal, setShowDeleteMatchModal] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);
  const [previewConfig, setPreviewConfig] = useState(null);
  const [showAddActionForm, setShowAddActionForm] = useState(false);
  const [showAddPositionForm, setShowAddPositionForm] = useState(false);
  const [clearDataOptions, setClearDataOptions] = useState({
    matches: true,
    templates: false,
    actionGroups: true,
    startPositions: true,
    themePreference: true,
    unitsPreference: true,
    angleUnitsPreference: true
  });

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    openToTemplates: () => {
      setIsOpen(true);
      setShowConfig(false);
      setShowActionsConfig(false);
      setShowPositionsConfig(false);
      setShowTemplates(true);
      setShowMatches(false);
      setShowSettings(false);
      setShowHelp(false);
    },
    openToActionsConfig: () => {
      setIsOpen(true);
      setShowConfig(false);
      setShowActionsConfig(true);
      setShowPositionsConfig(false);
      setShowTemplates(false);
      setShowMatches(false);
      setShowSettings(false);
      setShowHelp(false);
    }
  }));

  const closeMenu = () => {
    setIsOpen(false);
    setShowMatches(false);
    setShowConfig(false);
    setShowActionsConfig(false);
    setShowPositionsConfig(false);
    setShowTemplates(false);
    setShowSettings(false);
    setShowHelp(false);
    setShowAddActionForm(false); // Close add form when menu closes
    setShowAddPositionForm(false); // Close position add form when menu closes
  };

  const goBack = () => {
    if (showActionsConfig || showPositionsConfig || showTemplates) {
      setShowActionsConfig(false);
      setShowPositionsConfig(false);
      setShowTemplates(false);
      setShowConfig(true);
    } else if (showConfig || showSettings || showMatches) {
      setShowConfig(false);
      setShowSettings(false);
      setShowMatches(false);
    } else if (showHelp) {
      setShowHelp(false);
    }
  };

  const handleClearAllData = () => {
    setClearDataOptions({
      matches: true,
      templates: false,
      actionGroups: true,
      startPositions: true,
      themePreference: true,
      unitsPreference: true,
      angleUnitsPreference: true
    });
    setShowClearDataModal(true);
  };

  const handleFirstConfirmation = () => {
    setShowClearDataModal(false);
    setShowConfirmClearModal(true);
  };

  const handleFinalConfirmation = () => {
    setShowConfirmClearModal(false);
    
    try {
      if (clearDataOptions.matches) {
        removeStorageItem(STORAGE_KEYS.MATCHES);
        removeStorageItem(STORAGE_KEYS.CURRENT_MATCH);
      }
      
      if (clearDataOptions.templates) {
        removeStorageItem(STORAGE_KEYS.PRESETS);
      }
      
      if (clearDataOptions.actionGroups) {
        setStorageItem(STORAGE_KEYS.ACTIONS_INITIALIZED, 'cleared');
        setStorageItem(STORAGE_KEYS.ACTION_GROUPS, {
          actions: {
            label: 'Actions',
            icon: '\u26A1',
            actions: []
          },
          wait: {
            label: 'Wait',
            icon: '\u23F1\uFE0F',
            actions: [
              { id: 'W', label: 'Wait', config: { waitTime: 1000 } }
            ]
          }
        });
      }
      
      if (clearDataOptions.startPositions) {
        setStorageItem(STORAGE_KEYS.START_POSITIONS, []);
      }
      
      if (clearDataOptions.themePreference) {
        removeStorageItem(STORAGE_KEYS.THEME_PREFERENCE);
      }
      
      if (clearDataOptions.unitsPreference) {
        removeStorageItem(STORAGE_KEYS.UNITS_PREFERENCE);
      }
      
      if (clearDataOptions.angleUnitsPreference) {
        removeStorageItem(STORAGE_KEYS.ANGLE_UNITS_PREFERENCE);
      }
      
      setShowSuccessModal(true);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      alert('❌ Error clearing data: ' + error.message);
    }
  };

  const handleDeleteConfiguration = (preset) => {
    setConfigToDelete(preset);
    setShowDeleteConfigModal(true);
  };

  const confirmDeleteConfiguration = () => {
    if (configToDelete) {
      onDeletePreset(configToDelete.id);
      setShowDeleteConfigModal(false);
      setConfigToDelete(null);
    }
  };

  const handleDeleteMatch = (match) => {
    setMatchToDelete(match);
    setShowDeleteMatchModal(true);
  };

  const confirmDeleteMatch = () => {
    if (matchToDelete) {
      onDeleteMatch(matchToDelete.id);
      setShowDeleteMatchModal(false);
      setMatchToDelete(null);
    }
  };

  const handlePreviewClick = (preset) => {
    setPreviewConfig(preset);
  };

  const copyToClipboard = () => {
    if (previewConfig) {
      navigator.clipboard.writeText(JSON.stringify(previewConfig.config, null, 2));
    }
  };

  // Determine current view title
  const getTitle = () => {
    if (showMatches) return 'Matches';
    if (showActionsConfig) return 'Actions';
    if (showPositionsConfig) return 'Start Positions';
    if (showConfig) return 'Configuration';
    if (showTemplates) return 'Configurations';
    if (showSettings) return 'Settings';
    if (showHelp) return 'Help & Info';
    return 'Menu';
  };

  const showBackButton = showMatches || showConfig || showActionsConfig || showPositionsConfig || showTemplates || showSettings || showHelp;

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 z-50 p-2.5 bg-white dark:bg-slate-900 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-slate-800 active:bg-gray-100 dark:active:bg-slate-700 transition min-h-[44px] min-w-[44px] touch-manipulation"
        aria-label="Menu"
        style={{ top: 'calc(env(safe-area-inset-top) + 0.625rem)' }}
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className={`block h-0.5 bg-gray-800 dark:bg-gray-200 transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 bg-gray-800 dark:bg-gray-200 transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 bg-gray-800 dark:bg-gray-200 transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => {
          // Close add form if open, otherwise close entire menu
          if (showAddActionForm) {
            setShowAddActionForm(false);
          } else if (showAddPositionForm) {
            setShowAddPositionForm(false);
          } else {
            closeMenu();
          }
        }} />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-safe">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center gap-3 safe-top">
            {showBackButton && (
              <button
                onClick={goBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 active:bg-gray-200 rounded-lg touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex-1">
              {getTitle()}
            </h2>
          </div>

          {/* Menu Content */}
          <div 
            className="flex-1 overflow-y-auto p-4"
            onClick={(e) => {
              // Close add form when clicking on empty menu background
              if (showAddActionForm || showAddPositionForm) {
                // Check if click is not inside any add form
                const isInsideAddForm = e.target.closest('.add-action-form-panel') || 
                                         e.target.closest('.add-position-form-panel');
                if (!isInsideAddForm) {
                  if (showAddActionForm) setShowAddActionForm(false);
                  if (showAddPositionForm) setShowAddPositionForm(false);
                }
              }
            }}
          >
            {/* Main Menu */}
            {!showMatches && !showConfig && !showActionsConfig && !showPositionsConfig && !showTemplates && !showSettings && !showHelp && (
              <div className="space-y-2">
                {/* Matches Button */}
                <div className="mb-4">
                  <button
                    onClick={() => setShowMatches(true)}
                    className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition touch-manipulation min-h-[48px]"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">Matches</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {matches?.length || 0} match{matches?.length !== 1 ? 'es' : ''}
                        </div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Tools Section */}
                <div className="border-t border-gray-200 dark:border-slate-800 pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Tools</h3>
                  
                  <button
                    onClick={() => setShowConfig(true)}
                    className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition touch-manipulation min-h-[48px]"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 0112-1.227M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-gray-800 dark:text-gray-100">Configuration</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setShowSettings(true)}
                    className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition mt-2 touch-manipulation min-h-[48px]"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      <span className="font-medium text-gray-800 dark:text-gray-100">Settings</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setShowHelp(true)}
                    className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition mt-2 touch-manipulation min-h-[48px]"
                  >
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-gray-800 dark:text-gray-100">Help & Info</span>
                  </button>
                </div>
              </div>
            )}

            {/* Matches Submenu */}
            {showMatches && (
              <MatchesMenu
                matches={matches}
                currentMatchId={currentMatchId}
                onSelectMatch={onSelectMatch}
                onAddMatch={onAddMatch}
                onDuplicateMatch={onDuplicateMatch}
                onDeleteMatch={handleDeleteMatch}
                onExportJSON={onExportJSON}
                onClose={closeMenu}
              />
            )}

            {/* Configuration Submenu */}
            {(showConfig || showActionsConfig || showPositionsConfig) && (
              <ConfigurationMenu
                showActionsConfig={showActionsConfig}
                showPositionsConfig={showPositionsConfig}
                onShowActionsConfig={() => {
                  setShowConfig(false);
                  setShowActionsConfig(true);
                  setShowPositionsConfig(false);
                }}
                onShowPositionsConfig={() => {
                  setShowConfig(false);
                  setShowActionsConfig(false);
                  setShowPositionsConfig(true);
                }}
                presets={presets}
                onSaveTemplate={onSaveTemplate}
                onShowTemplates={() => {
                  setShowConfig(false);
                  setShowActionsConfig(false);
                  setShowPositionsConfig(false);
                  setShowTemplates(true);
                }}
                onExportConfig={onExportConfig}
                onClose={closeMenu}
                actionGroups={actionGroups}
                onAddActionToGroup={onAddActionToGroup}
                onUpdateActionInGroup={onUpdateActionInGroup}
                onDeleteActionInGroup={onDeleteActionInGroup}
                getNextActionKey={getNextActionKey}
                actionsError={actionsError}
                clearActionsError={clearActionsError}
                startPositions={startPositions}
                onAddStartPosition={onAddStartPosition}
                onUpdateStartPosition={onUpdateStartPosition}
                onDeleteStartPosition={onDeleteStartPosition}
                getNextStartKey={getNextStartKey}
                positionsError={positionsError}
                clearPositionsError={clearPositionsError}
                showAddActionForm={showAddActionForm}
                setShowAddActionForm={setShowAddActionForm}
                showAddPositionForm={showAddPositionForm}
                setShowAddPositionForm={setShowAddPositionForm}
                getNextStartKey={getNextStartKey}
              />
            )}

            {/* Templates Submenu */}
            {showTemplates && (
              <TemplatesMenu
                presets={presets}
                onLoadPreset={onLoadPreset}
                onDeletePreset={handleDeleteConfiguration}
                onPreviewPreset={handlePreviewClick}
                onSaveTemplate={() => {
                  setShowTemplates(false);
                  onSaveTemplate();
                }}
                onClose={closeMenu}
              />
            )}

            {/* Settings Submenu */}
            {showSettings && (
              <SettingsMenu
                themePreference={themePreference}
                resolvedTheme={resolvedTheme}
                onThemeChange={onThemeChange}
                useInches={useInches}
                onUnitsChange={onUnitsChange}
                useDegrees={useDegrees}
                onAngleUnitsChange={onAngleUnitsChange}
                onClearAllData={handleClearAllData}
              />
            )}

            {/* Help Submenu - Keep existing Help content from original file */}
            {showHelp && (
              <div className="space-y-6">
                <div className="text-center pb-4 border-b border-gray-200 dark:border-slate-800">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">FTC Autofig</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Version {VERSION} • PWA-Enabled
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                    Made with ❤️ by FTC Team 24180
                  </p>
                  <a
                    href="https://github.com/FTC-24180/Autofig"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    View on GitHub
                  </a>
                </div>

                {/* PWA Installation */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Install as App</h3>
                  </div>
                  <div className="space-y-4 bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">📱 iPhone/iPad</h4>
                      <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                        <li>Open in Safari browser</li>
                        <li>Tap the Share button (📤)</li>
                        <li>Scroll down and tap "Add to Home Screen"</li>
                        <li>Tap "Add"</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">🤖 Android</h4>
                      <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                        <li>Open in Chrome browser</li>
                        <li>Tap the menu (⋮)</li>
                        <li>Tap "Install app" or "Add to Home Screen"</li>
                        <li>Tap "Install"</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">💻 Desktop</h4>
                      <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                        <li>Open in Chrome or Edge</li>
                        <li>Click install icon (⊕) in address bar</li>
                        <li>Click "Install"</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Quick Tips</h3>
                  </div>
                  <div className="space-y-3 bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm">📱 Swipe Navigation</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300">On the QR Code step, swipe left/right to navigate between matches</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm">🔄 Drag to Reorder</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300">Long press and drag actions to reorder your autonomous sequence</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm">💾 Auto-Save</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300">All changes are automatically saved to your device</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm">📋 Duplicate Matches</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300">Tap the duplicate icon (📋) in the Matches menu to copy a match configuration</p>
                    </div>
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Keyboard Shortcuts</h3>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Next Step</span>
                        <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded text-xs font-mono">→</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Previous Step</span>
                        <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded text-xs font-mono">←</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Close Menu/Modal</span>
                        <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded text-xs font-mono">Esc</kbd>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Management */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7m-16 0c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Data Storage</h3>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      All data is stored locally on your device. Nothing is sent to a server.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">Works offline after first load</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">Private - your data never leaves your device</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">Persists across app closes</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-600 dark:text-amber-400">⚠</span>
                        <span className="text-gray-700 dark:text-gray-300">Clearing browser data will delete everything</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Backup Recommendation */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">💾 Backup Your Data</h4>
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        Regularly export your matches (Matches → Export All) and configurations (Configuration → Export) to save backups.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Troubleshooting */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 0112-1.227M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Troubleshooting</h3>
                  </div>
                  <div className="space-y-3 bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm">App won't load?</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300">Try a hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm">Changes not saving?</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300">Check if your browser's storage is full or disabled in settings</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm">QR code won't scan?</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300">Ensure good lighting and that the QR code fills most of the camera view. Try downloading JSON instead.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm">Lost all data?</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300">Check if you accidentally cleared browser data. Restore from your JSON backups if available.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ClearDataModal
        isOpen={showClearDataModal}
        onClose={() => setShowClearDataModal(false)}
        onConfirm={handleFirstConfirmation}
        options={clearDataOptions}
        onOptionsChange={setClearDataOptions}
      />

      <ConfirmClearDataModal
        isOpen={showConfirmClearModal}
        onClose={() => setShowConfirmClearModal(false)}
        onConfirm={handleFinalConfirmation}
        options={clearDataOptions}
      />

      <ClearDataSuccessModal
        isOpen={showSuccessModal}
      />

      <DeleteConfigurationModal
        isOpen={showDeleteConfigModal}
        configurationName={configToDelete?.name || ''}
        onClose={() => {
          setShowDeleteConfigModal(false);
          setConfigToDelete(null);
        }}
        onConfirm={confirmDeleteConfiguration}
      />

      <DeleteMatchModal
        isOpen={showDeleteMatchModal}
        matchNumber={matchToDelete?.matchNumber || 0}
        onClose={() => {
          setShowDeleteMatchModal(false);
          setMatchToDelete(null);
        }}
        onConfirm={confirmDeleteMatch}
      />

      {/* Preview Modal */}
      {previewConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4 safe-area">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-gray-200 dark:border-slate-800">
            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">JSON Preview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{previewConfig.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 active:bg-gray-300 text-gray-700 dark:text-gray-200 rounded-lg transition min-h-[44px] min-w-[44px] touch-manipulation"
                  title="Copy to clipboard"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setPreviewConfig(null)}
                  className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 active:bg-gray-300 text-gray-700 dark:text-gray-200 rounded-lg transition min-h-[44px] min-w-[44px] touch-manipulation"
                  title="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <pre className="bg-gray-50 dark:bg-slate-950 p-4 rounded-lg text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto border border-gray-200 dark:border-slate-800">
                {JSON.stringify(previewConfig.config, null, 2)}
              </pre>
            </div>
            <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-slate-800">
              <button
                onClick={() => setPreviewConfig(null)}
                className="w-full py-3 px-4 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 active:bg-gray-400 text-gray-700 dark:text-gray-100 rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
