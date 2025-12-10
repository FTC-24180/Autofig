export function WizardStep({ title, subtitle, children, className = '' }) {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-shrink-0 px-4 pt-4 pb-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
        {subtitle && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>}
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {children}
      </div>
    </div>
  );
}
