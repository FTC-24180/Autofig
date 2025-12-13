import { useState } from 'react';
import { DeleteConfigurationModal } from './DeleteConfigurationModal';

export function LoadTemplateModal({ 
  presets, 
  onLoadPreset,
  onDeletePreset,
  onClose 
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [configToDelete, setConfigToDelete] = useState(null);

  const handleDeleteClick = (preset) => {
    setConfigToDelete(preset);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (configToDelete) {
      onDeletePreset(configToDelete.id);
      setShowDeleteModal(false);
      setConfigToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setConfigToDelete(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-white dark:bg-slate-950 z-50 flex flex-col overflow-hidden safe-area">
        <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-3 py-3 flex justify-between items-center safe-top">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Load Configuration</h3>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-700 active:text-gray-700 text-3xl leading-none w-11 h-11 flex items-center justify-center touch-manipulation"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {presets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 mb-4">No configurations saved yet</p>
              <button
                onClick={onClose}
                className="py-2 px-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-gray-100 rounded-lg min-h-[44px] touch-manipulation"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {presets.map(preset => (
                <div key={preset.id} className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-gray-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700 dark:text-gray-200 text-base">{preset.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onLoadPreset(preset);
                        onClose();
                      }}
                      className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium rounded-lg transition min-h-[44px] touch-manipulation"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteClick(preset)}
                      className="py-2 px-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-medium rounded-lg transition min-h-[44px] touch-manipulation"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteConfigurationModal
        isOpen={showDeleteModal}
        configurationName={configToDelete?.name || ''}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
}
