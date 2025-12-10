import { WizardStep } from '../WizardStep';

export function Step1Match({ matchNumber, onMatchNumberChange }) {
  return (
    <WizardStep 
      title="Match Configuration"
      subtitle="Enter the match number you're configuring"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-3">
            Match Number
          </label>
          <input
            type="number"
            min="1"
            value={matchNumber}
            onChange={(e) => onMatchNumberChange(parseInt(e.target.value) || 1)}
            className="w-full text-3xl font-bold px-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px] touch-manipulation"
            placeholder="1"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Match Information</h4>
              <p className="text-sm text-blue-800">
                This helps you keep track of which configuration is for which match. 
                You can configure multiple matches and save them as templates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </WizardStep>
  );
}
