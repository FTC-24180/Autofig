import { WizardStep } from '../WizardStep';
import { AllianceIcon } from '../AllianceIcon';

export function Step1MatchSetup({ matchNumber, partnerTeam, alliance, onMatchNumberChange, onPartnerTeamChange, onAllianceChange }) {
  const isDefaultTemplate = matchNumber === 0;
  
  return (
    <WizardStep 
      title={isDefaultTemplate ? "Default Template Setup" : "Match Setup"}
      subtitle={isDefaultTemplate ? "Configure your default template" : "Configure your match details"}
    >
      <div className="space-y-6">
        {/* Match Number - Show for all matches including template (match 0) */}
        <div>
          <label className="block text-base font-medium text-gray-700 dark:text-gray-200 mb-3">
            Match Number
          </label>
          <input
            type="number"
            min={isDefaultTemplate ? "0" : "1"}
            value={matchNumber}
            onChange={(e) => onMatchNumberChange(parseInt(e.target.value) || (isDefaultTemplate ? 0 : 1))}
            className="w-full text-2xl font-bold px-4 py-4 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px] touch-manipulation"
            placeholder={isDefaultTemplate ? "0" : "1"}
            disabled={isDefaultTemplate}
          />
          {isDefaultTemplate && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              This is your default template match (Match #0)
            </p>
          )}
        </div>

        {/* Partner Team */}
        <div>
          <label className="block text-base font-medium text-gray-700 dark:text-gray-200 mb-3">
            Partner Team Number
          </label>
          <input
            type="text"
            value={partnerTeam}
            onChange={(e) => onPartnerTeamChange(e.target.value)}
            className="w-full text-xl font-bold px-4 py-4 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px] touch-manipulation"
            placeholder="Enter team number"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Optional - Leave blank if not yet assigned</p>
        </div>

        {/* Alliance Selection */}
        <div>
          <label className="block text-base font-medium text-gray-700 dark:text-gray-200 mb-3">
            Alliance Color
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Red Alliance */}
            <button
              onClick={() => onAllianceChange('red')}
              className={`relative overflow-hidden rounded-xl transition-all min-h-[120px] touch-manipulation border-2 ${
                alliance === 'red'
                  ? 'border-red-600 shadow-xl shadow-red-500/30 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-600 hover:shadow-lg'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <AllianceIcon alliance="red" className="w-32 h-32" />
              </div>
              <div className="relative flex flex-col items-center justify-center gap-3 py-6 px-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  alliance === 'red'
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-red-100 dark:bg-red-950/50'
                }`}>
                  <AllianceIcon 
                    alliance="red" 
                    className={`w-7 h-7 ${
                      alliance === 'red' ? 'text-white' : 'text-red-600'
                    }`}
                  />
                </div>
                <div>
                  <div className={`text-xl font-bold ${
                    alliance === 'red' ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    RED
                  </div>
                  <div className={`text-xs font-medium ${
                    alliance === 'red' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    Alliance
                  </div>
                </div>
                {alliance === 'red' && (
                  <div className="absolute top-3 right-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Blue Alliance */}
            <button
              onClick={() => onAllianceChange('blue')}
              className={`relative overflow-hidden rounded-xl transition-all min-h-[120px] touch-manipulation border-2 ${
                alliance === 'blue'
                  ? 'border-blue-600 shadow-xl shadow-blue-500/30 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <AllianceIcon alliance="blue" className="w-32 h-32" />
              </div>
              <div className="relative flex flex-col items-center justify-center gap-3 py-6 px-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  alliance === 'blue'
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-blue-100 dark:bg-blue-950/50'
                }`}>
                  <AllianceIcon 
                    alliance="blue" 
                    className={`w-7 h-7 ${
                      alliance === 'blue' ? 'text-white' : 'text-blue-600'
                    }`}
                  />
                </div>
                <div>
                  <div className={`text-xl font-bold ${
                    alliance === 'blue' ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    BLUE
                  </div>
                  <div className={`text-xs font-medium ${
                    alliance === 'blue' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    Alliance
                  </div>
                </div>
                {alliance === 'blue' && (
                  <div className="absolute top-3 right-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                {isDefaultTemplate ? "Template Information" : "Match Information"}
              </h4>
              <p className="text-sm text-blue-900 dark:text-blue-200">
                {isDefaultTemplate 
                  ? `This is your default template (Match #0). It will be used as the starting configuration when creating new matches from the template.`
                  : `This configuration will be used for Match #${matchNumber} on the ${alliance.toUpperCase()} alliance${partnerTeam ? ` with partner team ${partnerTeam}` : ''}.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </WizardStep>
  );
}
