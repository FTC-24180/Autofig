import { BaseModal, ModalButton } from './common/BaseModal';

export function ConfirmClearDataModal({ isOpen, onClose, onConfirm, options }) {
  if (!isOpen) return null;

  const selectedItems = [];
  if (options?.matches) selectedItems.push('Match Data');
  if (options?.defaultMatchTemplate) selectedItems.push('Default Match Template');
  if (options?.templates) selectedItems.push('Saved Configurations');
  if (options?.actionGroups) selectedItems.push('Custom Actions');
  if (options?.startPositions) selectedItems.push('Start Positions');
  if (options?.themePreference) selectedItems.push('Theme Preference');
  if (options?.unitsPreference) selectedItems.push('Distance Units Preference');
  if (options?.angleUnitsPreference) selectedItems.push('Angle Units Preference');

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-sm"
      closeOnOverlay={true}
    >
      <div className="bg-red-600 -mx-6 -mt-6 px-6 py-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Final Confirmation</h3>
          </div>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 text-center text-lg font-semibold mb-3">
        Are you absolutely sure?
      </p>
      <p className="text-gray-600 dark:text-gray-400 text-center text-sm mb-4">
        This will permanently delete the following:
      </p>
      
      <ul className="space-y-2 mb-4">
        {selectedItems.map((item, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {item}
          </li>
        ))}
      </ul>

      <p className="text-red-600 dark:text-red-400 text-center text-sm font-semibold mb-6">
        This action cannot be undone!
      </p>

      <div className="flex gap-3">
        <ModalButton.Secondary onClick={onClose}>
          No, Keep Data
        </ModalButton.Secondary>
        <ModalButton.Danger onClick={onConfirm}>
          Yes, Delete
        </ModalButton.Danger>
      </div>
    </BaseModal>
  );
}
