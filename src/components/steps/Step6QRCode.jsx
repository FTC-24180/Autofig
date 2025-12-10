import { useState } from 'react';
import { WizardStep } from '../WizardStep';
import { QRCodeSVG } from 'qrcode.react';

export function Step6QRCode({ config, onDownload }) {
  const [showJSON, setShowJSON] = useState(false);
  const configJSON = JSON.stringify(config, null, 2);
  const matchCount = config.matches?.length || 0;
  const totalActions = config.matches?.reduce((sum, match) => {
    const actions = match.match?.alliance?.auto?.actions?.length || 0;
    return sum + actions;
  }, 0) || 0;

  return (
    <WizardStep 
      title="QR Code"
      subtitle="Scan this code to transfer the configuration"
    >
      <div className="space-y-6">
        {/* QR Code */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200 flex justify-center">
          <QRCodeSVG 
            value={configJSON} 
            size={Math.min(300, window.innerWidth - 100)} 
            level="M" 
            includeMargin={true} 
          />
        </div>

        {/* Config Summary */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-semibold text-indigo-900 mb-2">Configuration Summary</h4>
          <div className="space-y-1 text-sm text-indigo-800">
            <div className="flex justify-between">
              <span className="font-medium">Total Matches:</span>
              <span>{matchCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Actions:</span>
              <span>{totalActions}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Size:</span>
              <span>{new Blob([configJSON]).size} bytes</span>
            </div>
          </div>
        </div>

        {/* Match Details */}
        {config.matches && config.matches.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Matches</h4>
            <div className="space-y-2">
              {config.matches.map((item, index) => {
                const matchData = item.match;
                const alliance = matchData?.alliance;
                const auto = alliance?.auto;
                
                return (
                  <div key={index} className="bg-white rounded p-3 text-sm">
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
            Download JSON
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
        {showJSON && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words">
              {configJSON}
            </pre>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-green-900 mb-1">Configuration Complete</h4>
              <p className="text-sm text-green-800">
                {matchCount === 1 
                  ? 'Your match configuration is ready.'
                  : `All ${matchCount} matches are configured and ready.`}
                {' '}Scan the QR code with your robot's camera or download the JSON file.
              </p>
            </div>
          </div>
        </div>
      </div>
    </WizardStep>
  );
}
