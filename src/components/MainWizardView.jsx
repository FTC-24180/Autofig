import { WizardContainer } from './WizardContainer';
import { WizardNavigation } from './WizardNavigation';
import { Step1MatchSetup } from './steps/Step1MatchSetup';
import { Step4StartPosition } from './steps/Step4StartPosition';
import { Step5Actions } from './steps/Step5Actions';
import { Step6QRCode } from './steps/Step6QRCode';
import { AllianceIcon } from './AllianceIcon';

export function MainWizardView({
  theme,
  currentMatch,
  currentStep,
  onStepChange,
  updateCurrentMatch,
  updateStartPositionField,
  startPositions,
  useInches,
  useDegrees,
  actionList,
  actionGroups,
  expandedGroup,
  setExpandedGroup,
  onAddAction,
  onMoveAction,
  onRemoveAction,
  onUpdateActionConfig,
  onClearAll,
  dragHandlers,
  getConfig,
  onDownload,
  matches,
  currentMatchId,
  onSelectMatchFromQRCode,
  canGoNext,
  onNext,
  onPrev
}) {
  return (
    <div 
      className="h-screen flex flex-col overflow-hidden touch-manipulation"
      style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
    >
      {/* Compact Mobile Header */}
      <header className="bg-white dark:bg-slate-900 shadow-lg flex-shrink-0 safe-top border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center justify-center px-3 py-2.5">
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
              FTC Autofig
            </h1>
            <p className="text-xs text-indigo-600 dark:text-indigo-300 leading-none flex items-center justify-center gap-1">
                          Match #{currentMatch?.matchNumber || '?'} {'\u2022'}{' '}
              <AllianceIcon 
                alliance={currentMatch?.alliance} 
                className={`w-3 h-3 ${currentMatch?.alliance === 'red' ? 'text-red-600' : 'text-blue-600'}`}
              />
              {' '}{currentMatch?.alliance?.toUpperCase() || 'NONE'}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content - Full Screen Wizard */}
      <div className="flex-1 overflow-hidden">
        <WizardContainer currentStep={currentStep} onStepChange={onStepChange}>
          <Step1MatchSetup
            matchNumber={currentMatch?.matchNumber || 1}
            partnerTeam={currentMatch?.partnerTeam || ''}
            alliance={currentMatch?.alliance || 'red'}
            onMatchNumberChange={(num) => updateCurrentMatch({ matchNumber: num })}
            onPartnerTeamChange={(team) => updateCurrentMatch({ partnerTeam: team })}
            onAllianceChange={(alliance) => updateCurrentMatch({ alliance })}
          />
          <Step4StartPosition
            startPosition={currentMatch?.startPosition || { type: 'front' }}
            onStartPositionChange={(pos) => updateCurrentMatch({ startPosition: pos })}
            startPositions={startPositions}
            onUpdateField={updateStartPositionField}
            useInches={useInches}
            useDegrees={useDegrees}
            isActive={currentStep === 1}
          />
          <Step5Actions
            actionList={actionList}
            actionGroups={actionGroups}
            expandedGroup={expandedGroup}
            setExpandedGroup={setExpandedGroup}
            onAddAction={onAddAction}
            onMoveAction={onMoveAction}
            onRemoveAction={onRemoveAction}
            onUpdateActionConfig={onUpdateActionConfig}
            onClearAll={onClearAll}
            dragHandlers={dragHandlers}
            isActive={currentStep === 2}
          />
          <Step6QRCode
            config={getConfig()}
            onDownload={onDownload}
            matches={matches}
            currentMatchId={currentMatchId}
            onSelectMatch={onSelectMatchFromQRCode}
          />
        </WizardContainer>
      </div>
      {/* Compact Bottom Navigation */}
      <WizardNavigation
        currentStep={currentStep}
        totalSteps={4}
        onNext={onNext}
        onPrev={onPrev}
        canGoNext={canGoNext}
        nextLabel={currentStep === 3 ? 'Finish' : 'Next'}
      />
    </div>
  );
}
