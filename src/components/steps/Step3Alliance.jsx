import { WizardStep } from '../WizardStep';

export function Step3Alliance({ alliance, onAllianceChange }) {
  return (
    <WizardStep 
      title="Alliance Color"
      subtitle="Select your alliance color for this match"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onAllianceChange('red')}
            className={`relative overflow-hidden rounded-xl p-8 transition-all ${
              alliance === 'red'
                ? 'ring-4 ring-red-500 shadow-xl scale-105'
                : 'ring-2 ring-gray-200 hover:ring-red-300 hover:scale-102'
            }`}
            style={{
              background: alliance === 'red'
                ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
                : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                alliance === 'red' ? 'bg-red-600' : 'bg-gray-300'
              }`}>
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={`text-2xl font-bold ${
                alliance === 'red' ? 'text-red-900' : 'text-gray-600'
              }`}>
                Red
              </span>
            </div>
            {alliance === 'red' && (
              <div className="absolute top-2 right-2">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>

          <button
            onClick={() => onAllianceChange('blue')}
            className={`relative overflow-hidden rounded-xl p-8 transition-all ${
              alliance === 'blue'
                ? 'ring-4 ring-blue-500 shadow-xl scale-105'
                : 'ring-2 ring-gray-200 hover:ring-blue-300 hover:scale-102'
            }`}
            style={{
              background: alliance === 'blue'
                ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                alliance === 'blue' ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={`text-2xl font-bold ${
                alliance === 'blue' ? 'text-blue-900' : 'text-gray-600'
              }`}>
                Blue
              </span>
            </div>
            {alliance === 'blue' && (
              <div className="absolute top-2 right-2">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        </div>

        <div className={`border-2 rounded-lg p-4 ${
          alliance === 'red' 
            ? 'bg-red-50 border-red-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-3">
            <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              alliance === 'red' ? 'text-red-600' : 'text-blue-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className={`font-semibold mb-1 ${
                alliance === 'red' ? 'text-red-900' : 'text-blue-900'
              }`}>
                {alliance === 'red' ? 'Red Alliance' : 'Blue Alliance'} Selected
              </h4>
              <p className={`text-sm ${
                alliance === 'red' ? 'text-red-800' : 'text-blue-800'
              }`}>
                Your robot will start on the {alliance} alliance side of the field.
              </p>
            </div>
          </div>
        </div>
      </div>
    </WizardStep>
  );
}
