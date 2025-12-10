import { useState } from 'react';
import { WizardStep } from '../WizardStep';
import { QRCodeSVG } from 'qrcode.react';

export function Step6QRCode({ config, onDownload }) {
  const [showJSON, setShowJSON] = useState(false);
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0);
  
  const matchCount = config.matches?.length || 0;
  
  // Get individual match config
  const getMatchConfig = (index) => {
    if (!config.matches || !config.matches[index]) return null;
    return config.matches[index];
  };

  const currentMatchConfig = getMatchConfig(selectedMatchIndex);
  const currentMatchJSON = currentMatchConfig ? JSON.stringify(currentMatchConfig, null, 2) : '{}';

  return (
    <WizardStep 
      title="QR Codes"
      subtitle="Scan the QR code for each match"
    >
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Individual Match QR Codes</h4>
              <p className="text-sm text-blue-800">
                Each match has its own QR code. Select a match below to display its code, then scan it with your robot.
              </p>
            </div>
          </div>
        </div>

        {/* Match Selector */}
        {matchCount > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Match
            </label>
            <div className="grid grid-cols-2 gap-2">
              {config.matches.map((item, index) => {
                const matchData = item.match;
                const alliance = matchData?.alliance;
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedMatchIndex(index)}
                    className={`p-3 rounded-lg border-2 transition-all touch-manipulation min-h-[60px] ${
                      selectedMatchIndex === index
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                        : 'border-gray-300 bg-white active:bg-white'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-bold text-gray-800">Match #{matchData?.number}</div>
                      <div className="text-xs text-gray-600">
                        {alliance?.color === 'red' ? '??' : '??'} {alliance?.color?.toUpperCase()}
                        {alliance?.team_number > 0 && ` • ${alliance.team_number}`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QR Code Display */}
        {currentMatchConfig ? (
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200 flex flex-col items-center">
            <div className="mb-3 text-center">
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                Match #{currentMatchConfig.match?.number}
              </span>
            </div>
            <QRCodeSVG 
              value={currentMatchJSON} 
              size={Math.min(300, window.innerWidth - 100)} 
              level="M" 
              includeMargin={true} 
            />
            {matchCount > 1 && (
              <div className="mt-3 text-sm text-gray-600">
                QR Code {selectedMatchIndex + 1} of {matchCount}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">No matches configured</p>
          </div>
        )}

        {/* Match Summary */}
        {currentMatchConfig && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-800 mb-2">Current Match</h4>
            <div className="space-y-1 text-sm text-indigo-800">
              <div className="flex justify-between">
                <span className="font-medium">Match:</span>
                <span>#{currentMatchConfig.match?.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Alliance:</span>
                <span>{currentMatchConfig.match?.alliance?.color?.toUpperCase()}</span>
              </div>
              {currentMatchConfig.match?.alliance?.team_number > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Partner:</span>
                  <span>{currentMatchConfig.match?.alliance?.team_number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Actions:</span>
                <span>{currentMatchConfig.match?.alliance?.auto?.actions?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Size:</span>
                <span>{new Blob([currentMatchJSON]).size} bytes</span>
              </div>
            </div>
          </div>
        )}

        {/* All Matches List */}
        {config.matches && config.matches.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">All Matches</h4>
            <div className="space-y-2">
              {config.matches.map((item, index) => {
                const matchData = item.match;
                const alliance = matchData?.alliance;
                const auto = alliance?.auto;
                
                return (
                  <div 
                    key={index} 
                    className={`bg-white rounded p-3 text-sm transition-all cursor-pointer touch-manipulation ${
                      selectedMatchIndex === index ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    onClick={() => setSelectedMatchIndex(index)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-800">Match #{matchData?.number}</span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        alliance?.color === 'red' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {alliance?.color?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {alliance?.team_number > 0 && <div>Partner: {alliance.team_number}</div>}
                      <div>{auto?.actions?.length || 0} action(s) configured</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onDownload}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 active:bg-indigo-700 text-white rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download All Matches JSON
          </button>

          <button
            onClick={() => setShowJSON(!showJSON)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 active:bg-gray-200 text-gray-700 rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {showJSON ? 'Hide' : 'Show'} JSON
          </button>
        </div>

        {/* JSON Display */}
        {showJSON && currentMatchConfig && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800">
                Match #{currentMatchConfig.match?.number} JSON
              </h4>
              <button
                onClick={() => {
                  const fullJSON = JSON.stringify(config, null, 2);
                  navigator.clipboard.writeText(fullJSON);
                  alert('Full configuration copied to clipboard!');
                }}
                className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 active:bg-indigo-300 touch-manipulation"
              >
                Copy All
              </button>
            </div>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words">
              {currentMatchJSON}
            </pre>
          </div>
        )}

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-green-800 mb-1">Ready to Scan</h4>
              <p className="text-sm text-green-800">
                {matchCount === 1 
                  ? 'Your match is ready. Scan the QR code above with your robot\'s camera.'
                  : `${matchCount} matches configured. Select and scan each QR code, or download the complete JSON file with all matches.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </WizardStep>
  );
}
