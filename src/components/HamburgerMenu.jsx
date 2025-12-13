import { useState, useImperativeHandle, forwardRef } from 'react';
import { ActionsConfigContent } from './config/ActionsConfigContent';
import { StartPositionsConfigContent } from './config/StartPositionsConfigContent';
import { ClearDataModal } from './ClearDataModal';
import { ConfirmClearDataModal } from './ConfirmClearDataModal';
import { ClearDataSuccessModal } from './ClearDataSuccessModal';
import { DeleteConfigurationModal } from './DeleteConfigurationModal';
import { DeleteMatchModal } from './DeleteMatchModal';

const THEME_OPTIONS = [
  { 
    id: 'system', 
    label: 'System', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    id: 'light', 
    label: 'Light', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  { 
    id: 'dark', 
    label: 'Dark', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    )
  },
];

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
  // Props for inline configuration
  actionGroups,
  onRenameGroup,
  onDeleteGroup,
  onAddActionToGroup,
  onUpdateActionInGroup,
  onDeleteActionInGroup,
  onAddCustomGroup,
  onExportConfig,
  startPositions,
  onAddStartPosition,
  onUpdateStartPosition,
  onDeleteStartPosition
}, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showActionsConfig, setShowActionsConfig] = useState(false);
  const [showPositionsConfig, setShowPositionsConfig] = useState(false);
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

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    openToActionsConfig: () => {
      setIsOpen(true);
      setShowConfig(false);
      setShowActionsConfig(true);
      setShowPositionsConfig(false);
      setShowTemplates(false);
      setShowMatches(false);
      setShowSettings(false);
      setShowHelp(false);
    },
    openToTemplates: () => {
      setIsOpen(true);
      setShowConfig(false);
      setShowActionsConfig(false);
      setShowPositionsConfig(false);
      setShowTemplates(true);
      setShowMatches(false);
      setShowSettings(false);
      setShowHelp(false);
    }
  }));

  const closeMenu = () => {
    setIsOpen(false);
    setShowMatches(false);
    setShowConfig(false);
    setShowTemplates(false);
    setShowActionsConfig(false);
    setShowPositionsConfig(false);
    setShowSettings(false);
    setShowHelp(false);
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
    setShowClearDataModal(true);
  };

  const handleFirstConfirmation = () => {
    setShowClearDataModal(false);
    setShowConfirmClearModal(true);
  };

  const handleFinalConfirmation = () => {
    setShowConfirmClearModal(false);
    
    try {
      // Clear all localStorage
      localStorage.clear();
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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

  const cancelDeleteConfiguration = () => {
    setShowDeleteConfigModal(false);
    setConfigToDelete(null);
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

  const cancelDeleteMatch = () => {
    setShowDeleteMatchModal(false);
    setMatchToDelete(null);
  };

  const handlePreviewClick = (preset) => {
    setPreviewConfig(preset);
  };

  const closePreview = () => {
    setPreviewConfig(null);
  };

  const copyToClipboard = () => {
    if (previewConfig) {
      navigator.clipboard.writeText(JSON.stringify(previewConfig.config, null, 2));
    }
  };

  const resolvedThemeLabel = resolvedTheme.charAt(0).toUpperCase() + resolvedTheme.slice(1);

  return (
    <>
      {/* Hamburger Button - Positioned within header safe area */}
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
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
            {(showMatches || showConfig || showTemplates || showActionsConfig || showPositionsConfig || showSettings || showHelp) && (
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
              {showMatches ? 'Matches' : showActionsConfig ? 'Configure Actions' : showPositionsConfig ? 'Start Positions' : showConfig ? 'Configuration' : showTemplates ? 'Configurations' : showSettings ? 'Settings' : showHelp ? 'Help & Info' : 'Menu'}
            </h2>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {!showMatches && !showConfig && !showTemplates && !showActionsConfig && !showPositionsConfig && !showSettings && !showHelp ? (
              // Main Menu
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
            ) : showMatches ? (
              // Matches Submenu
              <div className="space-y-4">
                {/* Add Match Button */}
                <button
                  onClick={() => {
                    onAddMatch();
                    closeMenu();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 active:bg-green-700 text-white rounded-lg font-semibold min-h-[48px] touch-manipulation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Match
                </button>

                {/* Matches List */}
                {matches && matches.length > 0 ? (
                  <div className="space-y-2">
                    {matches.map(match => (
                      <div
                        key={match.id}
                        className={`rounded-lg p-3 transition-all cursor-pointer touch-manipulation ${
                          currentMatchId === match.id
                            ? 'bg-indigo-100 dark:bg-indigo-900/40 ring-2 ring-indigo-500'
                            : 'bg-gray-50 dark:bg-slate-800 active:bg-gray-100'
                        }`}
                        onClick={() => {
                          onSelectMatch(match.id);
                          closeMenu();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base font-bold text-gray-800 dark:text-gray-100">
                                Match #{match.matchNumber}
                              </span>
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                                match.alliance === 'red' 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-100' 
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-100'
                              }`}>
                                {match.alliance.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              {match.partnerTeam ? `Partner: ${match.partnerTeam}` : 'No partner'}
                              {' • '}
                              {match.actions?.length || 0} action{match.actions?.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDuplicateMatch(match.id);
                              }}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 active:bg-gray-300 rounded-lg transition min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
                              title="Duplicate"
                            >
                              <svg className="w-4 h-4 text-gray-600 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMatch(match);
                              }}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-500/20 active:bg-red-200 rounded-lg transition min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
                              title="Delete"
                            >
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Export All Matches Button */}
                    <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                      <button
                        onClick={() => {
                          onExportJSON();
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition touch-manipulation min-h-[48px]"
                      >
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="font-medium text-gray-800 dark:text-gray-100">Export All Matches</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-300 text-sm mb-4">No matches yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Click "Add New Match" above to create your first match</p>
                  </div>
                )}
              </div>
            ) : showSettings ? (
              // Settings Submenu
              <div>
                {/* Theme Selector */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Appearance</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {THEME_OPTIONS.map(option => (
                      <button
                        key={option.id}
                        onClick={() => onThemeChange(option.id)}
                        className={`p-3 rounded-lg border text-sm font-semibold transition flex flex-col items-center gap-1 min-h-[72px] ${
                          themePreference === option.id
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100'
                        }`}
                      >
                        <span className={themePreference === option.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}>
                          {option.icon}
                        </span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    {themePreference === 'system'
                      ? `Following OS preference (currently ${resolvedThemeLabel}).`
                      : `Forced ${themePreference} mode.`}
                  </p>
                </div>

                {/* Clear All Data - Danger Zone */}
                <div className="pt-4 border-t border-red-200 dark:border-red-500/30 mt-4">
                  <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3">Danger Zone</h3>
                  <button
                    onClick={handleClearAllData}
                    className="w-full flex items-center gap-3 p-3 text-left bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 active:bg-red-200 rounded-lg transition touch-manipulation min-h-[48px] border-2 border-red-300 dark:border-red-500/40"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <div className="font-medium text-red-800 dark:text-red-200">Clear All Data</div>
                      <div className="text-xs text-red-600 dark:text-red-400">Delete everything and reset app</div>
                    </div>
                  </button>
                </div>
              </div>
            ) : showConfig ? (
              // Configuration Submenu
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowConfig(false);
                    setShowActionsConfig(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition touch-manipulation min-h-[48px]"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Configure Actions</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Manage action groups and types</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowConfig(false);
                    setShowPositionsConfig(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition touch-manipulation min-h-[48px]"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Start Positions</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Manage preset positions</div>
                  </div>
                </button>

                {/* Configurations Section */}
                <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Configurations</h4>
                  
                  <button
                    onClick={() => {
                      onSaveTemplate();
                    }}
                    className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition touch-manipulation min-h-[48px]"
                  >
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span className="font-medium text-gray-800 dark:text-gray-100">Save</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowConfig(false);
                      setShowTemplates(true);
                    }}
                    className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition mt-2 touch-manipulation min-h-[48px]"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium text-gray-800 dark:text-gray-100">Load</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {presets.length > 0 && (
                        <span className="text-xs bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-full font-semibold">
                          {presets.length}
                        </span>
                      )}
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onExportConfig();
                      closeMenu();
                    }}
                    className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition mt-2 touch-manipulation min-h-[48px]"
                  >
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-100">Export</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Download configurations as JSON</div>
                    </div>
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-slate-800 mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Advanced configuration for actions, positions, and saved configurations. Changes apply to all matches.</p>
                </div>
              </div>
            ) : showHelp ? (
              // Help & Info View
              <div className="space-y-6">
                {/* Help content - Add back full help section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Install as App</h3>
                  </div>
                  <div className="space-y-4 bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      This app can be installed on your device for offline use. See Help & Info for instructions.
                    </p>
                  </div>
                </div>
                <div className="text-center pt-4 border-t border-gray-200 dark:border-slate-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Version 2.0 • PWA-Enabled
                  </p>
                </div>
              </div>
            ) : showActionsConfig ? (
              // Actions Configuration View
              <ActionsConfigContent
                actionGroups={actionGroups}
                onRenameGroup={onRenameGroup}
                onDeleteGroup={onDeleteGroup}
                onAddActionToGroup={onAddActionToGroup}
                onUpdateActionInGroup={onUpdateActionInGroup}
                onDeleteActionInGroup={onDeleteActionInGroup}
                onAddCustomGroup={onAddCustomGroup}
                onExportConfig={onExportConfig}
              />
            ) : showPositionsConfig ? (
              // Start Positions Configuration View
              <StartPositionsConfigContent
                startPositions={startPositions}
                onAddStartPosition={onAddStartPosition}
                onUpdateStartPosition={onUpdateStartPosition}
                onDeleteStartPosition={onDeleteStartPosition}
                onExportConfig={onExportConfig}
              />
            ) : showTemplates ? (
              // Configurations Submenu
              <div>
                <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3">Saved Configurations</h3>

                {presets.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-300 text-sm">No configurations saved yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {presets.map(preset => (
                      <div key={preset.id} className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800 dark:text-gray-100 text-sm">{preset.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              onLoadPreset(preset);
                              closeMenu();
                            }}
                            className="flex-1 py-2 px-3 bg-indigo-600 active:bg-indigo-700 text-white text-sm rounded-lg transition min-h-[40px] touch-manipulation"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handlePreviewClick(preset)}
                            className="py-2 px-3 bg-gray-600 active:bg-gray-700 text-white text-sm rounded-lg transition min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation"
                            title="Preview JSON"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteConfiguration(preset)}
                            className="py-2 px-3 bg-red-600 active:bg-red-700 text-white text-sm rounded-lg transition min-h-[40px] touch-manipulation"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ClearDataModal
        isOpen={showClearDataModal}
        onClose={() => setShowClearDataModal(false)}
        onConfirm={handleFirstConfirmation}
      />

      <ConfirmClearDataModal
        isOpen={showConfirmClearModal}
        onClose={() => setShowConfirmClearModal(false)}
        onConfirm={handleFinalConfirmation}
      />

      <ClearDataSuccessModal
        isOpen={showSuccessModal}
      />

      <DeleteConfigurationModal
        isOpen={showDeleteConfigModal}
        configurationName={configToDelete?.name || ''}
        onClose={cancelDeleteConfiguration}
        onConfirm={confirmDeleteConfiguration}
      />

      <DeleteMatchModal
        isOpen={showDeleteMatchModal}
        matchNumber={matchToDelete?.matchNumber || 0}
        onClose={cancelDeleteMatch}
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
                  onClick={closePreview}
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
                onClick={closePreview}
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
