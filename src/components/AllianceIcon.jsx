export function AllianceIcon({ alliance, className = "w-4 h-4" }) {
  if (alliance === 'red') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  }
  
  if (alliance === 'blue') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  }
  
  return null;
}
