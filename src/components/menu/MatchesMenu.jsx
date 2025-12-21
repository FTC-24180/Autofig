export function MatchesMenu({
  matches,
  currentMatchId,
  onSelectMatch,
  onAddMatch,
  onDuplicateMatch,
  onDeleteMatch,
  onExportJSON,
  onSaveDefaultTemplate,
  onLoadDefaultTemplate,
  hasDefaultTemplate,
  onClose
}) {
  return (
    <div className="space-y-4">
      {/* Add Match Button */}
      <button
        onClick={() => {
          onAddMatch();
          onClose();
        }}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 active:bg-green-700 text-white rounded-lg font-semibold min-h-[48px] touch-manipulation"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add New Match
      </button>

      {/* Add Match from Template Button - Only show if template exists */}
      {hasDefaultTemplate && (
        <button
          onClick={() => {
            onLoadDefaultTemplate();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 active:bg-indigo-700 text-white rounded-lg font-semibold min-h-[48px] touch-manipulation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Add Match from Template
        </button>
      )}

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
                onClose();
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {match.matchNumber === 0 ? (
                      <>
                        <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        <span className="text-base font-bold text-amber-800 dark:text-amber-100">
                          Default Template
                        </span>
                      </>
                    ) : (
                      <span className="text-base font-bold text-gray-800 dark:text-gray-100">
                        Match #{match.matchNumber}
                      </span>
                    )}
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
                    {' � '}
                    {match.actions?.length || 0} action{match.actions?.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  {/* Only show "Save as Template" button for non-template matches */}
                  {match.matchNumber !== 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSaveDefaultTemplate(match.id);
                      }}
                      className="p-2 hover:bg-amber-100 dark:hover:bg-amber-500/20 active:bg-amber-200 rounded-lg transition min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
                      title="Save as Default Template"
                    >
                      <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  )}
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
                      onDeleteMatch(match);
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
                onClose();
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
  );
}
