export function MatchManager({ 
  matches, 
  currentMatchId, 
  onSelectMatch, 
  onAddMatch, 
  onDeleteMatch,
  onDuplicateMatch
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-800">Your Matches</h3>
        <button
          onClick={onAddMatch}
          className="flex items-center gap-2 py-2.5 px-4 bg-green-600 active:bg-green-700 text-white rounded-lg font-semibold text-sm min-h-[44px] touch-manipulation"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Match
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No matches configured</p>
          <button
            onClick={onAddMatch}
            className="py-3 px-6 bg-indigo-600 active:bg-indigo-700 text-white rounded-lg font-semibold min-h-[48px] touch-manipulation"
          >
            Create First Match
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map(match => (
            <div
              key={match.id}
              className={`rounded-lg p-4 transition-all touch-manipulation ${
                currentMatchId === match.id
                  ? 'bg-indigo-100 ring-2 ring-indigo-500'
                  : 'bg-gray-50 active:bg-gray-100'
              }`}
              onClick={() => onSelectMatch(match.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-gray-800">
                      Match #{match.matchNumber}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                      match.alliance === 'red' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {match.alliance.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {match.partnerTeam ? `Partner: ${match.partnerTeam}` : 'No partner set'}
                    {' • '}
                    {match.actions?.length || 0} action{match.actions?.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateMatch(match.id);
                    }}
                    className="p-2.5 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
                    title="Duplicate match"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="p-2.5 hover:bg-red-100 active:bg-red-200 rounded-lg transition min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
                    title="Delete match"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
