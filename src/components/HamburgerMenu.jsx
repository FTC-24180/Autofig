import { useState } from 'react';
import { ActionsConfigContent } from './config/ActionsConfigContent';
import { StartPositionsConfigContent } from './config/StartPositionsConfigContent';

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

export function HamburgerMenu({ 
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
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showActionsConfig, setShowActionsConfig] = useState(false);
  const [showPositionsConfig, setShowPositionsConfig] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
    setShowConfig(false);
    setShowTemplates(false);
    setShowActionsConfig(false);
    setShowPositionsConfig(false);
    setShowHelp(false);
  };

  const goBack = () => {
    if (showActionsConfig || showPositionsConfig) {
      setShowActionsConfig(false);
      setShowPositionsConfig(false);
      setShowConfig(true);
    } else if (showTemplates) {
      setShowTemplates(false);
    } else if (showConfig) {
      setShowConfig(false);
    } else if (showHelp) {
      setShowHelp(false);
    }
  };

  const handleClearAllData = () => {
    const confirmed = confirm(
      '⚠️ Clear All Data?\n\n' +
      'This will permanently delete:\n' +
      '• All configured matches\n' +
      '• All saved templates\n' +
      '• All custom action groups\n' +
      '• All start positions\n\n' +
      'This action cannot be undone!\n\n' +
      'Are you sure you want to continue?'
    );

    if (confirmed) {
      // Double confirmation for safety
      const doubleConfirm = confirm(
        '⚠️ FINAL CONFIRMATION\n\n' +
        'This will delete ALL data. Are you absolutely sure?'
      );

      if (doubleConfirm) {
        try {
          // Clear all localStorage
          localStorage.clear();
          
          // Show success message
          alert('✅ All data cleared successfully!\n\nThe page will now reload.');
          
          // Reload the page to reinitialize with defaults
          window.location.reload();
        } catch (error) {
          alert('❌ Error clearing data: ' + error.message);
        }
      }
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
            {(showConfig || showTemplates || showActionsConfig || showPositionsConfig || showHelp) && (
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
              {showActionsConfig ? 'Configure Actions' : showPositionsConfig ? 'Start Positions' : showConfig ? 'Configuration' : showTemplates ? 'Templates' : showHelp ? 'Help & Info' : 'Menu'}
            </h2>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {!showConfig && !showTemplates && !showActionsConfig && !showPositionsConfig && !showHelp ? (
              // Main Menu - Matches First
              <div className="space-y-2">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matches</h3>
                    <button
                      onClick={() => {
                        onAddMatch();
                        closeMenu();
                      }}
                      className="flex items-center gap-1.5 py-1.5 px-3 bg-green-600 active:bg-green-700 text-white rounded-lg font-semibold text-sm min-h-[36px] touch-manipulation"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add
                    </button>
                  </div>

                  {matches && matches.length > 0 ? (
                    <div className="space-y-2 mb-2">
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
                                  if (confirm(`Delete Match #${match.matchNumber}?`)) {
                                    onDeleteMatch(match.id);
                                  }
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
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-300 text-sm mb-3">No matches yet</p>
                      <button
                        onClick={() => {
                          onAddMatch();
                          closeMenu();
                        }}
                        className="py-2 px-4 bg-indigo-600 active:bg-indigo-700 text-white rounded-lg font-semibold text-sm min-h-[40px] touch-manipulation"
                      >
                        Create First Match
                      </button>
                    </div>
                  )}
                </div>

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
                      <span className="font-medium text-gray-800 dark:text-gray-100">Configure Actions</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => {
                      onExportJSON();
                      closeMenu();
                    }}
                    className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition mt-2 touch-manipulation min-h-[48px]"
                  >
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="font-medium text-gray-800 dark:text-gray-100">Export All Matches</span>
                  </button>

                  <button
                    onClick={() => {
                      onSaveTemplate();
                    }}
                    className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition mt-2 touch-manipulation min-h-[48px]"
                  >
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span className="font-medium text-gray-800 dark:text-gray-100">Save as Template</span>
                  </button>

                  <button
                    onClick={() => setShowTemplates(true)}
                    className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition mt-2 touch-manipulation min-h-[48px]"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium text-gray-800 dark:text-gray-100">Load Template</span>
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

                  {/* Help Button */}
                  <button
                    onClick={() => setShowHelp(true)}
                    className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 rounded-lg transition mt-2 touch-manipulation min-h-[48px]"
                  >
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-gray-800 dark:text-gray-100">Help & Info</span>
                  </button>

                  {/* Theme Selector */}
                  <div className="mt-6">
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
                  <div className="mt-6 pt-4 border-t border-red-200 dark:border-red-500/30">
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
              </div>
            ) : showHelp ? (
              // Help & Info View
              <div className="space-y-6">
                {/* PWA Installation */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Install as App</h3>
                  </div>
                  
                  <div className="space-y-4 bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                    {/* iOS */}
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        iOS (iPhone/iPad)
                      </h4>
                      <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                        <li>Tap the <strong>Share</strong> button (square with arrow)</li>
                        <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                        <li>Tap <strong>"Add"</strong> in the top right</li>
                        <li>App icon appears on your home screen!</li>
                      </ol>
                    </div>

                    {/* Android */}
                    <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.43 11.43 0 00-8.94 0L5.65 5.67c-.19-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.8 11.16 3.5 13.84 3.5 16.5V19h17v-2.5c0-2.66-1.3-5.34-2.9-7.02zM7 17.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
                        </svg>
                        Android
                      </h4>
                      <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                        <li>Tap the <strong>3-dot menu</strong> (⋮) in Chrome</li>
                        <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong></li>
                        <li>Tap <strong>"Install"</strong> to confirm</li>
                        <li>App opens like a native app!</li>
                      </ol>
                    </div>

                    {/* Desktop */}
                    <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Desktop (Chrome/Edge)
                      </h4>
                      <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                        <li>Look for the <strong>install icon</strong> (⊕) in the address bar</li>
                        <li>Click <strong>"Install"</strong></li>
                        <li>App opens in its own window!</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Key Features</h3>
                  </div>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>Works Offline</strong> - All data stored locally on your device</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>Multiple Matches</strong> - Configure and manage several matches</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>QR Code Export</strong> - Scan with robot to load configuration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>Templates</strong> - Save and reuse common configurations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>Customizable</strong> - Configure action groups and start positions</span>
                    </li>
                  </ul>
                </div>

                {/* Quick Tips */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Quick Tips</h3>
                  </div>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">•</span>
                      <span>Swipe left/right on wizard to navigate between steps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">•</span>
                      <span>Drag actions to reorder them in your sequence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">•</span>
                      <span>Use templates to quickly set up common match configurations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">•</span>
                      <span>Export all matches to backup your configurations</span>
                    </li>
                  </ul>
                </div>

                {/* GitHub Link */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Open Source</h3>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      FTC AutoConfig is open source and developed by <strong>FTC Team 24180</strong>.
                    </p>
                    <a
                      href="https://github.com/FTC-24180/AutoConfig"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-2 px-4 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 active:bg-gray-950 text-white rounded-lg font-semibold text-sm min-h-[44px] touch-manipulation justify-center transition"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      View on GitHub
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                      Report issues, contribute, or star the project!
                    </p>
                  </div>
                </div>

                {/* Version */}
                <div className="text-center pt-4 border-t border-gray-200 dark:border-slate-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Version 2.0 • PWA-Enabled
                  </p>
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

                <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Advanced configuration for action types and starting positions. Changes apply to all matches.</p>
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
            ) : (
              // Templates Submenu
              <div>
                <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3">Saved Templates</h3>

                {presets.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-300 text-sm">No templates saved yet</p>
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
                            onClick={() => {
                              if (confirm(`Delete template "${preset.name}"?`)) {
                                onDeletePreset(preset.id);
                              }
                            }}
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
