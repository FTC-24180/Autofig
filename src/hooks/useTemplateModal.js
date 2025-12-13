import { useState } from 'react';

export function useTemplateModal(savePreset, getConfig) {
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [showLoadTemplate, setShowLoadTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [saveError, setSaveError] = useState('');

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      setSaveError('Please enter a configuration name');
      return;
    }
    if (savePreset(templateName, getConfig())) {
      setTemplateName('');
      setSaveError('');
      setShowSaveTemplate(false);
    }
  };

  const closeSaveTemplate = () => {
    setShowSaveTemplate(false);
    setTemplateName('');
    setSaveError('');
  };

  return {
    showSaveTemplate,
    showLoadTemplate,
    templateName,
    saveError,
    setTemplateName,
    setShowSaveTemplate,
    setShowLoadTemplate,
    handleSaveTemplate,
    closeSaveTemplate
  };
}
