import { WizardStep } from '../WizardStep';

export function Step1MatchSetup({ matchNumber, partnerTeam, alliance, onMatchNumberChange, onPartnerTeamChange, onAllianceChange }) {
  return (
    <WizardStep 
      title="Match Setup"
      subtitle="Configure your match details"
    >
      <div className="space-y-6">
        {/* Match Number */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-3">
            Match Number
          </label>
          <input
            type="number"
            min="1"
            value={matchNumber}
            onChange={(e) => onMatchNumberChange(parseInt(e.target.value) || 1)}
            className="w-full text-2xl font-bold px-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px] touch-manipulation"
            placeholder="1"
          />
        </div>

        {/* Partner Team */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-3">
            Partner Team Number
          </label>
          <input
            type="text"
            value={partnerTeam}
            onChange={(e) => onPartnerTeamChange(e.target.value)}
            className="w-full text-xl font-bold px-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px] touch-manipulation"
            placeholder="Enter team number"
          />
          <p className="text-sm text-gray-500 mt-2">Optional - Leave blank if not yet assigned</p>
        </div>

        {/* Alliance Selection */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-3">
            Alliance Color
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onAllianceChange('red')}
              className={`py-6 px-4 rounded-lg font-bold text-lg transition-all min-h-[80px] touch-manipulation ${
                alliance === 'red'
                  ? 'bg-red-500 text-white ring-4 ring-red-300 scale-105'
                  : 'bg-red-100 text-red-700 hover:bg-red-200 active:bg-red-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">??</span>
                <span>RED</span>
              </div>
            </button>
            
            <button
              onClick={() => onAllianceChange('blue')}
              className={`py-6 px-4 rounded-lg font-bold text-lg transition-all min-h-[80px] touch-manipulation ${
                alliance === 'blue'
                  ? 'bg-blue-500 text-white ring-4 ring-blue-300 scale-105'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">??</span>
                <span>BLUE</span>
              </div>
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Match Information</h4>
              <p className="text-sm text-blue-800">
                This configuration will be used for Match #{matchNumber} on the {alliance.toUpperCase()} alliance
                {partnerTeam && ` with partner team ${partnerTeam}`}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </WizardStep>
  );
}
