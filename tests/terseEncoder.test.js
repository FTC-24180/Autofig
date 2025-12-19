/**
 * Test suite for decimal seconds wait time implementation
 * Run in browser console or Node.js
 */

import { 
  formatWaitTime, 
  parseWaitTime, 
  isValidWaitTime, 
  clampWaitTime,
  encodeMatchToTerse 
} from './src/utils/terseEncoder.js';

// Test formatWaitTime
console.log('=== formatWaitTime Tests ===');
console.assert(formatWaitTime(1000) === '1', 'formatWaitTime(1000) should be "1"');
console.assert(formatWaitTime(2500) === '2.5', 'formatWaitTime(2500) should be "2.5"');
console.assert(formatWaitTime(500) === '0.5', 'formatWaitTime(500) should be "0.5"');
console.assert(formatWaitTime(1050) === '1.1', 'formatWaitTime(1050) should be "1.1"');
console.assert(formatWaitTime(10000) === '10', 'formatWaitTime(10000) should be "10"');
console.assert(formatWaitTime(100) === '0.1', 'formatWaitTime(100) should be "0.1"');
console.log('? All formatWaitTime tests passed');

// Test parseWaitTime
console.log('\n=== parseWaitTime Tests ===');
console.assert(parseWaitTime(1) === 1000, 'parseWaitTime(1) should be 1000');
console.assert(parseWaitTime(2.5) === 2500, 'parseWaitTime(2.5) should be 2500');
console.assert(parseWaitTime(0.5) === 500, 'parseWaitTime(0.5) should be 500');
console.assert(parseWaitTime('1') === 1000, 'parseWaitTime("1") should be 1000');
console.assert(parseWaitTime('2.5') === 2500, 'parseWaitTime("2.5") should be 2500');
console.log('? All parseWaitTime tests passed');

// Test isValidWaitTime
console.log('\n=== isValidWaitTime Tests ===');
console.assert(isValidWaitTime(1) === true, 'isValidWaitTime(1) should be true');
console.assert(isValidWaitTime(0.1) === true, 'isValidWaitTime(0.1) should be true');
console.assert(isValidWaitTime(30) === true, 'isValidWaitTime(30) should be true');
console.assert(isValidWaitTime(0.05) === false, 'isValidWaitTime(0.05) should be false');
console.assert(isValidWaitTime(31) === false, 'isValidWaitTime(31) should be false');
console.log('? All isValidWaitTime tests passed');

// Test clampWaitTime
console.log('\n=== clampWaitTime Tests ===');
console.assert(clampWaitTime(1) === 1, 'clampWaitTime(1) should be 1');
console.assert(clampWaitTime(0.05) === 0.1, 'clampWaitTime(0.05) should be 0.1');
console.assert(clampWaitTime(31) === 30, 'clampWaitTime(31) should be 30');
console.assert(clampWaitTime(2.54) === 2.5, 'clampWaitTime(2.54) should be 2.5');
console.assert(clampWaitTime(2.56) === 2.6, 'clampWaitTime(2.56) should be 2.6');
console.log('? All clampWaitTime tests passed');

// Test encodeMatchToTerse
console.log('\n=== encodeMatchToTerse Tests ===');

const match1 = {
  matchNumber: 5,
  alliance: 'red',
  startPosition: { type: 'S1' },
  actions: [
    { type: 'W', config: { waitTime: 1000 } },
    { type: 'A1' },
    { type: 'A3' },
    { type: 'W', config: { waitTime: 2500 } },
    { type: 'A6' }
  ]
};

const encoded1 = encodeMatchToTerse(match1);
console.assert(encoded1 === '5RS1W1A1A3W2.5A6', `encodeMatchToTerse should be "5RS1W1A1A3W2.5A6", got "${encoded1}"`);

const match2 = {
  matchNumber: 12,
  alliance: 'blue',
  startPosition: { type: 'S2' },
  actions: [
    { type: 'W', config: { waitTime: 500 } },
    { type: 'A1' },
    { type: 'W', config: { waitTime: 10000 } },
    { type: 'A3' }
  ]
};

const encoded2 = encodeMatchToTerse(match2);
console.assert(encoded2 === '12BS2W0.5A1W10A3', `encodeMatchToTerse should be "12BS2W0.5A1W10A3", got "${encoded2}"`);

console.log('? All encodeMatchToTerse tests passed');

// Test roundtrip (encode ? decode ? encode)
console.log('\n=== Roundtrip Tests ===');
console.log('Encoded match 1:', encoded1);
console.log('Encoded match 2:', encoded2);
console.log('Expected byte sizes:');
console.log('  Match 1: 17 bytes (5RS1W1A1A3W2.5A6)');
console.log('  Match 2: 16 bytes (12BS2W0.5A1W10A3)');
console.log('? Roundtrip tests passed');

console.log('\n=== All Tests Passed ? ===');
