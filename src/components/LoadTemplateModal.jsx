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
  const [previewConfig, setPreviewConfig] = useState(null);

  const handleDeleteClick = (preset) => {
    setConfigToDelete(preset);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (configToDelete) {
      onDeletePreset(configToDelete.id);
      setShowDeleteModal(false);
      setConfigToDelete(null);
      // Close preview if deleting the previewed config
      if (previewConfig?.id === configToDelete.id) {
        setPreviewConfig(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setConfigToDelete(null);
  };

  const handlePreviewClick = (preset) => {
    setPreviewConfig(preset);
  };

  const closePreview = () => {
    setPreviewConfig(null);
  };

  const copyToClipboard = () => {
    if (previewConfig) {
      navigator.clipboard.writeText(JSON.stringify(previewConfig.config, null, 2));
    }
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
                      onClick={() => handlePreviewClick(preset)}
                      className="py-2 px-3 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white text-sm font-medium rounded-lg transition min-h-[44px] touch-manipulation"
                      title="Preview JSON"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
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

      {/* Preview Modal */}
      {previewConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4 safe-area">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-gray-200 dark:border-slate-800">
            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">JSON Preview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{previewConfig.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 active:bg-gray-300 text-gray-700 dark:text-gray-200 rounded-lg transition min-h-[44px] min-w-[44px] touch-manipulation"
                  title="Copy to clipboard"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={closePreview}
                  className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 active:bg-gray-300 text-gray-700 dark:text-gray-200 rounded-lg transition min-h-[44px] min-w-[44px] touch-manipulation"
                  title="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <pre className="bg-gray-50 dark:bg-slate-950 p-4 rounded-lg text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto border border-gray-200 dark:border-slate-800">
                {JSON.stringify(previewConfig.config, null, 2)}
              </pre>
            </div>
            <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-slate-800">
              <button
                onClick={closePreview}
                className="w-full py-3 px-4 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 active:bg-gray-400 text-gray-700 dark:text-gray-100 rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfigurationModal
        isOpen={showDeleteModal}
        configurationName={configToDelete?.name || ''}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
}
