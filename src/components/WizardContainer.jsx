import { useState, useRef, useEffect } from 'react';

export function WizardContainer({ children, currentStep, onStepChange }) {
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isTransitioning) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = Math.abs(touchStartY.current - touchEndY);

    // Only trigger swipe if horizontal movement is dominant
    if (Math.abs(diffX) > 50 && diffY < 100) {
      setIsTransitioning(true);
      
      if (diffX > 0) {
        // Swipe left - go to next step
        if (currentStep < children.length - 1) {
          onStepChange(currentStep + 1);
        }
      } else {
        // Swipe right - go to previous step
        if (currentStep > 0) {
          onStepChange(currentStep - 1);
        }
      }

      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden h-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-300 ease-in-out h-full"
        style={{ transform: `translateX(-${currentStep * 100}%)` }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="min-w-full h-full"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
