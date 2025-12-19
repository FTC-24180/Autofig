/**
 * Terse Match Format Encoder for QR Codes
 * Format: {n}[R|B]S{startPos}[W{sec}|A{n}]*
 * 
 * Example: 5RS1W1A1A3W2.5A1A4W1A5A6
 * - Match 5, Red, Start position 1
 * - Wait 1s, Action A1, Action A3
 * - Wait 2.5s, Action A1, Action A4, etc.
 * 
 * Custom Position: S0{base64} where base64 is 6 characters encoding X, Y, ?
 * Example: 5RS0qqa8AAW1A1A3
 * - Match 5, Red, Custom position with encoded pose
 * 
 * Wait format: W{seconds} where seconds can be decimal (W1, W2.5, W0.5)
 * - Stored internally as milliseconds
 * - Displayed and encoded as decimal seconds
 * - Supports tenths precision (0.1s = 100ms)
 * - Range: 0.1s to 30s (100ms to 30000ms)
 * 
 * Actions use A{n} format (A1, A2, A3...)
 */

import { encodePose } from './poseEncoder';

/**
 * Convert milliseconds to decimal seconds, removing trailing zeros
 * @param {number} milliseconds - Wait time in milliseconds
 * @returns {string} Formatted seconds (e.g., "1", "2.5", "0.5")
 */
export function formatWaitTime(milliseconds) {
  const seconds = milliseconds / 1000;
  
  // Convert to string with 1 decimal place
  const formatted = seconds.toFixed(1);
  
  // Remove trailing zeros after decimal point
  // Also remove decimal point if it would be the last character
  return formatted.replace(/\.?0+$/, '');
}

/**
 * Convert decimal seconds to milliseconds
 * @param {number|string} seconds - Wait time in seconds (can be decimal)
 * @returns {number} Wait time in milliseconds
 */
export function parseWaitTime(seconds) {
  const sec = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
  return Math.round(sec * 1000);
}

/**
 * Validate wait time in seconds
 * @param {number} seconds - Wait time in seconds
 * @returns {boolean} True if valid (0.1 - 30 seconds)
 */
export function isValidWaitTime(seconds) {
  return seconds >= 0.1 && seconds <= 30;
}

/**
 * Clamp wait time to valid range and round to nearest 0.1s
 * @param {number} seconds - Wait time in seconds
 * @returns {number} Clamped and rounded wait time in seconds
 */
export function clampWaitTime(seconds) {
  // Round to nearest 0.1
  const rounded = Math.round(seconds * 10) / 10;
  // Clamp to range
  return Math.max(0.1, Math.min(30, rounded));
}

/**
 * Parse human-readable wait time text input
 * Supports various formats:
 * - "2.5" or "2.5s" ? 2.5 seconds
 * - "1" or "1s" ? 1 second
 * - "500ms" or "500" ? 0.5 seconds
 * - "2.5 seconds" ? 2.5 seconds
 * - "1 sec" ? 1 second
 * 
 * @param {string} text - User input text
 * @returns {Object} { value: number|null, error: string|null }
 */
export function parseWaitTimeText(text) {
  if (!text || typeof text !== 'string') {
    return { value: null, error: null };
  }

  const trimmed = text.trim().toLowerCase();
  
  if (trimmed === '') {
    return { value: null, error: null };
  }

  // Match patterns:
  // - Number with optional decimal, optional units
  // Examples: "2.5", "2.5s", "500ms", "2.5 seconds", "1 sec"
  const patterns = [
    // Milliseconds: "500ms", "1000 ms", "500"
    { regex: /^(\d+(?:\.\d+)?)\s*ms?\s*$/i, unit: 'ms' },
    // Seconds: "2.5s", "2.5 sec", "2.5 seconds", "2.5"
    { regex: /^(\d+(?:\.\d+)?)\s*(?:s|sec|secs|second|seconds)?\s*$/i, unit: 's' }
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern.regex);
    if (match) {
      const numValue = parseFloat(match[1]);
      
      if (isNaN(numValue)) {
        return { 
          value: null, 
          error: 'Invalid number format' 
        };
      }

      // Convert to seconds
      let seconds;
      if (pattern.unit === 'ms') {
        seconds = numValue / 1000;
      } else {
        seconds = numValue;
      }

      // Round to nearest 0.1s
      const rounded = Math.round(seconds * 10) / 10;

      // Validate range
      if (rounded < 0.1) {
        return { 
          value: 0.1, 
          error: `Minimum wait time is 0.1s (100ms). Adjusted from ${formatWaitTime(Math.round(seconds * 1000))}.` 
        };
      }

      if (rounded > 30) {
        return { 
          value: 30, 
          error: `Maximum wait time is 30s. Adjusted from ${formatWaitTime(Math.round(seconds * 1000))}.` 
        };
      }

      // Success
      return { 
        value: rounded, 
        error: null 
      };
    }
  }

  // No pattern matched
  return { 
    value: null, 
    error: 'Invalid format. Examples: "2.5", "2.5s", "500ms", "1 second"' 
  };
}

/**
 * Format wait time for display in text input
 * @param {number} milliseconds - Wait time in milliseconds
 * @returns {string} Human-readable format (e.g., "2.5s", "1s")
 */
export function formatWaitTimeForDisplay(milliseconds) {
  const seconds = milliseconds / 1000;
  const formatted = formatWaitTime(milliseconds);
  return `${formatted}s`;
}

/**
 * Extract position ID from position type
 * @param {string} positionType - Position type in S{n} format (e.g., 'S0', 'S1', 'S2')
 * @returns {number} Position ID
 */
function getPositionId(positionType) {
  if (!positionType) return 1;
  
  // Extract numeric ID from S{n} format
  if (positionType.startsWith('S')) {
    const id = parseInt(positionType.substring(1));
    return isNaN(id) ? 1 : id;
  }
  
  // Fallback if format is unexpected
  return 1;
}

/**
 * Encode start position for terse format
 * @param {Object} startPosition - Start position object with type and optional x, y, theta
 * @returns {string} Encoded start position (e.g., "S1" or "S0qqa8AA")
 */
function encodeStartPosition(startPosition) {
  const posId = getPositionId(startPosition?.type);
  
  // Custom position (S0) - encode pose
  if (posId === 0) {
    const x = startPosition.x ?? 0;
    const y = startPosition.y ?? 0;
    const theta = startPosition.theta ?? 0;
    
    try {
      const poseEncoded = encodePose(x, y, theta);
      return `S0${poseEncoded}`;
    } catch (error) {
      console.error('Failed to encode custom position:', error);
      return 'S0AAAAAA'; // Fallback to origin (0, 0, 0)
    }
  }
  
  // Preset position (S1, S2, etc.)
  return `S${posId}`;
}

/**
 * Encode a match to terse format
 * @param {Object} match - Match object with matchNumber, alliance, startPosition, actions
 * @returns {string} Terse format string
 */
export function encodeMatchToTerse(match) {
  let terse = '';
  
  // Match number (no prefix, no zero padding)
  terse += match.matchNumber;
  
  // Alliance color: R or B
  terse += match.alliance[0].toUpperCase();
  
  // Start position: S{id} or S0{base64}
  terse += encodeStartPosition(match.startPosition);
  
  // Actions: [W{sec}|A{n}]*
  if (match.actions && match.actions.length > 0) {
    for (const action of match.actions) {
      // Action type is stored in action.type and should be 'W' or 'A{n}'
      const actionType = action.type;
      
      if (actionType === 'W') {
        // Wait: W{seconds} - convert ms to decimal seconds
        const waitTimeMs = action.config?.waitTime || 1000;
        const waitTimeFormatted = formatWaitTime(waitTimeMs);
        terse += `W${waitTimeFormatted}`;
      } else if (actionType && actionType.match(/^A\d+$/)) {
        // Action: A{n} - use the action type directly
        terse += actionType;
      } else {
        // Unknown action type - log warning and skip
        console.warn(`Unknown action type: ${actionType}`);
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
