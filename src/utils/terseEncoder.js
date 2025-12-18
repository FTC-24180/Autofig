/**
 * Terse Match Format Encoder for QR Codes
 * Format: {n}[R|B]S{startPos}[W{sec}|A{actionId}]*
 * 
 * Example: 5RS1W1A1A3A1A4W1A1A5A1A6
 * - Match 5, Red, Start position 1
 * - Wait 1s, Action 1, Action 3, etc.
 */

// Start position type to ID mapping
const POSITION_TO_ID = {
  'front': 1,
  'back': 2,
  'left': 3,
  'right': 4,
  'custom': 9
};

// Action type to ID mapping
const ACTION_TO_ID = {
  'near_launch': 1,
  'far_launch': 2,
  'spike_1': 3,
  'spike_2': 4,
  'spike_3': 5,
  'near_park': 6,
  'far_park': 7,
  'dump': 8,
  'corner': 9,
  'drive_to': 10
};

/**
 * Encode a match to terse format
 * @param {Object} match - Match object with matchNumber, alliance, startPosition, actions
 * @returns {string} Terse format string
 */
export function encodeMatchToTerse(match) {
  let terse = '';
  
  // Match number (no prefix)
  terse += match.matchNumber;
  
  // Alliance color: R or B
  terse += match.alliance[0].toUpperCase();
  
  // Start position: S{id}
  const posId = POSITION_TO_ID[match.startPosition?.type] || 1;
  terse += `S${posId}`;
  
  // Actions: [W{sec}|A{id}]*
  if (match.actions && match.actions.length > 0) {
    for (const action of match.actions) {
      if (action.type === 'wait') {
        // Wait: W{seconds} - convert ms to seconds, round to nearest int
        const waitTimeMs = action.config?.waitTime || 1000;
        const waitTimeSec = Math.round(waitTimeMs / 1000);
        terse += `W${waitTimeSec}`;
      } else {
        // Action: A{id}
        const actionId = ACTION_TO_ID[action.type] || 99;
        terse += `A${actionId}`;
      }
    }
  }
  
  return terse;
}

/**
 * Get the byte size of a terse-encoded match
 * @param {Object} match - Match object
 * @returns {number} Size in bytes
 */
export function getTerseSize(match) {
  return encodeMatchToTerse(match).length;
}

/**
 * Get display info for terse format
 * @param {Object} match - Match object
 * @returns {Object} { terse, size, fitsInQRv4 }
 */
export function getTerseInfo(match) {
  const terse = encodeMatchToTerse(match);
  const size = terse.length;
  const fitsInQRv4 = size <= 100;
  
  return { terse, size, fitsInQRv4 };
}
