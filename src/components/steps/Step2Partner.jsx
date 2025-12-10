import { WizardStep } from '../WizardStep';

export function Step2Partner({ partnerTeam, onPartnerTeamChange }) {
  return (
    <WizardStep 
      title="Alliance Partner"
      subtitle="Enter your alliance partner's team number"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-3">
            Partner Team Number
          </label>
          <input
            type="text"
            value={partnerTeam}
            onChange={(e) => onPartnerTeamChange(e.target.value)}
            className="w-full text-2xl font-bold px-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px] touch-manipulation"
            placeholder="Enter team number"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Alliance Partner</h4>
              <p className="text-sm text-blue-800">
                This information helps coordinate strategies with your alliance partner. 
                You can leave this blank if not yet assigned.
              </p>
            </div>
          </div>
        </div>
      </div>
    </WizardStep>
  );
}
