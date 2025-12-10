import { WizardStep } from '../WizardStep';
import { ActionSequence } from '../ActionSequence';
import { ActionPicker } from '../ActionPicker';

const PICKUP_IDS = ['spike_1', 'spike_2', 'spike_3', 'corner'];

export function Step5Actions({ 
  actionList,
  actionGroups,
  expandedGroup,
  setExpandedGroup,
  onAddAction,
  onMoveAction,
  onRemoveAction,
  onUpdateActionConfig,
  onClearAll,
  dragHandlers
}) {
  return (
    <WizardStep 
      title="Configure Actions"
      subtitle="Build your autonomous sequence"
      className="pb-4"
    >
      <div className="space-y-4">
        {/* Action List */}
        <div>
          <ActionSequence
            actionList={actionList}
            dragIndex={dragHandlers.dragIndex}
            hoverIndex={dragHandlers.hoverIndex}
            dragPos={dragHandlers.dragPos}
            touchActiveRef={dragHandlers.touchActiveRef}
            startIndex={-1}
            parkIndex={-1}
            onMoveAction={onMoveAction}
            onRemoveAction={onRemoveAction}
            onUpdateActionConfig={onUpdateActionConfig}
            onClearAll={onClearAll}
            dragHandlers={dragHandlers}
          />
        </div>

        {/* Action Picker */}
        <div className="border-t-2 border-gray-200 pt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Add Actions</h3>
          <ActionPicker
            actionGroups={actionGroups}
            actionList={actionList}
            expandedGroup={expandedGroup}
            setExpandedGroup={setExpandedGroup}
            onAddAction={onAddAction}
            PICKUP_IDS={PICKUP_IDS}
          />
        </div>
      </div>
    </WizardStep>
  );
}
