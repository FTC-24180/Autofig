import { useState, useRef, useMemo } from 'react';
import { WizardStep } from '../WizardStep';
import { QRCodeSVG } from 'qrcode.react';
import { AllianceIcon } from '../AllianceIcon';
import { encodeMatchToTerse, getTerseInfo } from '../../utils/terseEncoder';

export function Step6QRCode({ config, onDownload, matches, currentMatchId, onSelectMatch }) {
  const [showTerse, setShowTerse] = useState(false);
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(() => {
    // Initialize with the index of the current match
    if (!matches || !currentMatchId) return 0;
    const index = matches.findIndex(m => m.id === currentMatchId);
    return index >= 0 ? index : 0;
  });
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  
  const matchCount = config.matches?.length || 1;
  
  // Get match data from config structure
  const getMatchFromConfig = (index) => {
    const matchWrapper = config.matches?.[index];
    if (!matchWrapper?.match) return null;
    
    const m = matchWrapper.match;
    return {
      matchNumber: m.number,
      alliance: m.alliance?.color || 'red',
      partnerTeam: m.alliance?.team_number?.toString() || '',
      startPosition: m.alliance?.auto?.startPosition || { type: 'front' },
      actions: m.alliance?.auto?.actions || []
    };
  };

  const currentMatch = getMatchFromConfig(selectedMatchIndex);
  const terseInfo = currentMatch ? getTerseInfo(currentMatch) : { terse: '', size: 0, fitsInQRv4: true };

  const handleMatchIndexChange = (newIndex) => {
    setSelectedMatchIndex(newIndex);
    // Update the app's current match when swiping/navigating
    if (matches && matches[newIndex]) {
      onSelectMatch(matches[newIndex].id);
    }
  };

  const handlePrevMatch = () => {
    if (selectedMatchIndex > 0) {
      handleMatchIndexChange(selectedMatchIndex - 1);
    }
  };

  const handleNextMatch = () => {
    if (selectedMatchIndex < matchCount - 1) {
      handleMatchIndexChange(selectedMatchIndex + 1);
    }
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = Math.abs(touchStartY.current - touchEndY);

    // Only trigger swipe if horizontal movement is dominant
    if (Math.abs(diffX) > 50 && diffY < 100) {
      if (diffX > 0) {
        // Swipe left - next match
        handleNextMatch();
      } else {
        // Swipe right - previous match
        handlePrevMatch();
      }
    }
  };

  return (
    <WizardStep 
      title="QR Codes"
      subtitle="Scan with your robot's Limelight camera"
      className="pb-safe"
    >
      <div className="space-y-6 pb-6">
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                Ultra-Compact Terse Format
              </h4>
              <p className="text-sm text-blue-900 dark:text-blue-200">
                {matchCount === 1 
                  ? 'Scan the QR code below with your robot\'s Limelight camera.'
                  : 'Use arrows/dots to navigate between matches, then scan each QR code.'
                }
                {' '}QR codes use the terse format for maximum compatibility with low-capacity readers.
              </p>
            </div>
          </div>
        </div>

        {/* QR Code Display with Navigation */}
        {currentMatch ? (
          <div 
            className="bg-white dark:bg-slate-900 p-6 rounded-lg border-2 border-gray-200 dark:border-slate-700"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Match Header */}
            <div className="mb-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-semibold">
                <AllianceIcon 
                  alliance={currentMatch.alliance} 
                  className={`w-4 h-4 ${currentMatch.alliance === 'red' ? 'text-red-600' : 'text-blue-600'}`}
                />
                <span>Match #{currentMatch.matchNumber}</span>
                {currentMatch.partnerTeam && (
                  <>
                    <span className="text-indigo-600 dark:text-indigo-400">•</span>
                    <span>Team {currentMatch.partnerTeam}</span>
                  </>
                )}
              </div>
            </div>

            {/* Navigation Arrows (for desktop/larger screens) */}
            {matchCount > 1 && (
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={handlePrevMatch}
                  disabled={selectedMatchIndex === 0}
                  className={`p-2 rounded-lg transition touch-manipulation min-h-[44px] min-w-[44px] hidden sm:flex items-center justify-center ${
                    selectedMatchIndex === 0
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 active:bg-gray-200'
                  }`}
                  aria-label="Previous match"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {selectedMatchIndex + 1} of {matchCount}
                </div>

                <button
                  onClick={handleNextMatch}
                  disabled={selectedMatchIndex === matchCount - 1}
                  className={`p-2 rounded-lg transition touch-manipulation min-h-[44px] min-w-[44px] hidden sm:flex items-center justify-center ${
                    selectedMatchIndex === matchCount - 1
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 active:bg-gray-200'
                  }`}
                  aria-label="Next match"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* QR Code - using terse format */}
            <div className="flex justify-center mb-4">
              <QRCodeSVG 
                value={terseInfo.terse} 
                size={Math.min(300, window.innerWidth - 100)} 
                level="L"  // Low error correction for maximum data capacity
                includeMargin={true} 
              />
            </div>

            {/* Terse Format Preview */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 mb-4">
              <div className="text-xs font-mono text-gray-600 dark:text-gray-300 break-all text-center">
                {terseInfo.terse}
              </div>
            </div>

            {/* Dot Indicators */}
            {matchCount > 1 && (
              <div className="flex justify-center gap-2">
                {config.matches.map((item, index) => {
                  const matchData = item.match;
                  const alliance = matchData?.alliance?.color;
                  const isSelected = selectedMatchIndex === index;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleMatchIndexChange(index)}
                      className={`transition-all touch-manipulation rounded-full ${
                        isSelected
                          ? alliance === 'red'
                            ? 'w-8 h-2 bg-red-600 dark:bg-red-500'
                            : 'w-8 h-2 bg-blue-600 dark:bg-blue-500'
                          : alliance === 'red'
                            ? 'w-2 h-2 bg-red-200 dark:bg-red-900/40 hover:bg-red-300 dark:hover:bg-red-800/50'
                            : 'w-2 h-2 bg-blue-200 dark:bg-blue-900/40 hover:bg-blue-300 dark:hover:bg-blue-800/50'
                      }`}
                      aria-label={`Go to match ${index + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No matches configured</p>
          </div>
        )}

        {/* Match Summary */}
        {currentMatch && (
          <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">Current Match</h4>
            <div className="space-y-1 text-sm text-indigo-900 dark:text-indigo-200">
              <div className="flex justify-between">
                <span className="font-medium">Match:</span>
                <span>#{currentMatch.matchNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Alliance:</span>
                <span>{currentMatch.alliance.toUpperCase()}</span>
              </div>
              {currentMatch.partnerTeam && (
                <div className="flex justify-between">
                  <span className="font-medium">Partner:</span>
                  <span>{currentMatch.partnerTeam}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Actions:</span>
                <span>{currentMatch.actions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">QR Size:</span>
                <span className={terseInfo.fitsInQRv4 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {terseInfo.size} bytes {terseInfo.fitsInQRv4 ? '? Fits QR v4' : '? Too large'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onDownload}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 active:bg-indigo-700 text-white rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download JSON (Standard Format)
          </button>

          <button
            onClick={() => setShowTerse(!showTerse)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-slate-800 active:bg-gray-200 dark:active:bg-slate-700 text-gray-700 dark:text-gray-100 rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {showTerse ? 'Hide' : 'Show'} Terse Format
          </button>
        </div>

        {/* Terse Format Display */}
        {showTerse && currentMatch && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                Match #{currentMatch.matchNumber} Terse Format
              </h4>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(terseInfo.terse);
                  alert('Terse format copied to clipboard!');
                }}
                className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-200 rounded hover:bg-indigo-200 dark:hover:bg-indigo-900/50 active:bg-indigo-300 touch-manipulation"
              >
                Copy
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-slate-950 rounded-lg p-3">
              <pre className="text-sm font-mono overflow-x-auto whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
                {terseInfo.terse}
              </pre>
            </div>
            <div className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div><strong>Format:</strong> {'{n}[R|B]S{startPos}[W{sec}|A{actionId}]*'}</div>
              <div><strong>Size:</strong> {terseInfo.size} bytes</div>
              <div><strong>QR v4:</strong> {terseInfo.fitsInQRv4 ? '? Compatible' : '? Too large (max 100 bytes)'}</div>
            </div>
          </div>
        )}

        {/* Success Message */}
        <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-200 mb-1">Ready to Scan</h4>
              <p className="text-sm text-green-900 dark:text-green-200">
                {matchCount === 1 
                  ? 'Your match is ready in ultra-compact terse format. Scan the QR code with your robot\'s Limelight camera.'
                  : `${matchCount} matches configured. Navigate between matches and scan each QR code with your robot's Limelight camera.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </WizardStep>
  );
}
