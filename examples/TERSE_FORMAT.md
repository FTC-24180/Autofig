# Terse Match Format for 100-Byte QR Codes

## Problem
QR code v4 maxes out at ~100 bytes. Even compact JSON is too large for complex sequences.

## Solution: Custom Terse Format

Ultra-compact string format - match number starts immediately with no prefix.

### Format Structure
```
{n}[R|B]S{startPos}[W{sec}|A{actionId}]*
```

### Components
- `{n}` = Match number (required, starts string, no prefix)
- `[R|B]` = Alliance color: R=red, B=blue (required)
- `S{n}` = Start position ID (required)
- `W{sec}` = Wait action in **decimal seconds** (optional, repeatable)
- `A{n}` = Action by ID (optional, repeatable)

### Example
```
5RS1W1A1A3W2.5A1A4W1A5A6
```

**Decoded:**
- Match 5
- Red alliance
- Start position 1
- Wait 1 second
- Action 1 (near_launch)
- Action 3 (spike_1)
- Wait 2.5 seconds
- Action 1 (near_launch)
- Action 4 (spike_2)
- Wait 1 second
- Action 5 (spike_3)
- Action 6 (near_park)

**Size:** 28 bytes! (72 bytes remaining)

## Format Specification

### Match Header
| Component | Format | Example | Bytes |
|-----------|--------|---------|-------|
| Match number | `{n}` | `5` | 1-2 |
| Alliance color | `R` or `B` | `R` | 1 |
| Start position | `S{n}` | `S1` | 2 |

### Start Position IDs
| ID | Position |
|----|----------|
| 1 | front |
| 2 | back |
| 3 | left |
| 4 | right |
| 9 | custom |

### Action IDs
| ID | Action Type | Bytes |
|----|-------------|-------|
| 1 | near_launch | 2 |
| 2 | far_launch | 2 |
| 3 | spike_1 | 2 |
| 4 | spike_2 | 2 |
| 5 | spike_3 | 2 |
| 6 | near_park | 2 |
| 7 | far_park | 2 |
| 8 | dump | 2 |
| 9 | corner | 2 |
| 10 | drive_to | 3 |

### Wait Action (Decimal Seconds)
| Format | Example | Meaning | Bytes |
|--------|---------|---------|-------|
| `W{sec}` | `W1` | Wait 1.0 second | 2 |
| `W{sec}` | `W2.5` | Wait 2.5 seconds | 4 |
| `W{sec}` | `W0.5` | Wait 0.5 seconds | 4 |
| `W{sec}` | `W10` | Wait 10.0 seconds | 3 |

**Format Details:**
- Wait times are in **decimal seconds** (e.g., `1`, `2.5`, `0.5`)
- Trailing zeros are removed (`1.0` ? `1`, `2.50` ? `2.5`)
- Precision: tenths of a second (0.1s = 100ms)
- Range: 0.1s to 30s
- Most common waits (integer seconds) use only 2-3 bytes
- Sub-second waits add 2 characters for decimal (`W2.5`)

**Examples:**
- `W1` = 1.0s = 1000ms (2 bytes)
- `W0.5` = 0.5s = 500ms (4 bytes)
- `W2.5` = 2.5s = 2500ms (4 bytes)
- `W10` = 10.0s = 10000ms (3 bytes)
- `W0.1` = 0.1s = 100ms (4 bytes)

## Size Analysis

### Minimal Match
```
1RS1
```
**Base overhead:** 4 bytes

### Typical Match (Integer Second Waits)
```
5RS1W1A1A3W1A1A4W1A1A5A6
```
**Breakdown:**
- Header: `5RS1` = 4 bytes
- Actions + Waits: 20 bytes (7 actions, 3 waits)
- **Total:** 24 bytes (76 bytes remaining!)

### With Sub-Second Waits
```
5RS1W0.5A1A3W2.5A1A4W1A5A6
```
**Breakdown:**
- Header: `5RS1` = 4 bytes
- Actions + Waits: 24 bytes (includes decimal waits)
- **Total:** 28 bytes (72 bytes remaining)

### Maximum Actions
With 100-byte limit and 4-byte header = **96 bytes for actions**

**2-byte actions (A{n}):** 48 actions!  
**With integer waits:** 30-40 actions typical  
**With decimal waits:** 25-35 actions typical

## Comparison

| Format | Example Size | Savings |
|--------|--------------|---------|
| Standard JSON | 300+ bytes | N/A |
| Compact JSON | 68 bytes | 77% smaller |
| **Terse (decimal seconds)** | **24-28 bytes** | **92% smaller** ? |

## Usage

### Java (Robot Controller)

```java
import org.firstinspires.ftc.teamcode.auto.config.TerseMatchCodec;

// Decode terse format
String scanned = "5RS1W1A1A3W2.5A6";
MatchDataConfig.Match decoded = TerseMatchCodec.decode(scanned);

// Wait times are parsed as doubles (seconds)
for (Action action : decoded.actions) {
    if (action.type.equals("wait")) {
        double seconds = action.waitTimeSeconds;  // e.g., 1.0, 2.5
        int milliseconds = (int)(seconds * 1000); // e.g., 1000, 2500
    }
}
```

### JavaScript (Web App)

```javascript
import { encodeMatchToTerse, formatWaitTime, parseWaitTime } from './utils/terseEncoder';

// Encode match to terse format
const match = {
  matchNumber: 5,
  alliance: 'red',
  startPosition: { type: 'S1' },
  actions: [
    { type: 'W', config: { waitTime: 1000 } },    // 1s ? W1
    { type: 'A1' },
    { type: 'W', config: { waitTime: 2500 } },    // 2.5s ? W2.5
    { type: 'A3' }
  ]
};

const terse = encodeMatchToTerse(match);
console.log(terse); // "5RS1W1A1W2.5A3"

// Convert between milliseconds and seconds
formatWaitTime(1000);  // "1"
formatWaitTime(2500);  // "2.5"
formatWaitTime(500);   // "0.5"

parseWaitTime(1);      // 1000
parseWaitTime(2.5);    // 2500
parseWaitTime(0.5);    // 500
```

## Parsing Algorithm

The parser uses a **character-by-character scan** approach:

```javascript
function parseWaitTime(input, startIndex) {
  let i = startIndex + 1; // Skip 'W'
  let numStr = '';
  
  // Continue while we have digits or decimal point
  while (i < input.length && /[0-9.]/.test(input[i])) {
    numStr += input[i];
    i++;
  }
  
  const seconds = parseFloat(numStr);
  const milliseconds = Math.round(seconds * 1000);
  
  return { milliseconds, nextIndex: i };
}
```

## Examples

### Example 1: Simple Sequence
```
1RS1W1A1A3A6
```
12 bytes - 1s wait, Launch, Spike, Park

### Example 2: Sub-Second Timing
```
5RS1W0.5A1W2.5A3W1A6
```
20 bytes - Precise timing with decimal waits

### Example 3: Two-Digit Match
```
12BS2W10A1A3A6
```
15 bytes - 10s wait (3 bytes)

## Auto-Detection

Scanner detects terse format: `^\d+[RB]S\d+.*$`

Pattern matches match number at start, no prefix needed!

## Advantages

? **Compact:** Integer seconds use only 2-3 bytes  
? **Precise:** Sub-second resolution when needed (0.1s)  
? **Flexible:** Decimal format adapts to precision required  
? **Human-readable:** `W1` and `W2.5` are intuitive  
? **Efficient:** Most waits are integers, rare decimals don't hurt much  
? **Simple parsing:** No special encoding, just parse decimal numbers  

## Disadvantages

? **Variable length:** Decimal waits take 2 more bytes than integers  
? **Parsing complexity:** Parser must handle decimals (not just integers)  

## Migration Note

**Breaking change from previous version:**
- Old: `W1` = 1 second (integer only)
- New: `W1` = 1 second, `W2.5` = 2.5 seconds (decimal support)

Regenerate all QR codes! Old integer-only QR codes will still work (backward compatible).

---

**Format:** `{n}[R|B]S{startPos}[W{sec}|A{actionId}]*`  
**Wait Format:** Decimal seconds (0.1-30s, tenths precision)  
**Typical Size:** 10-35 bytes  
**Max Actions:** 25-48 depending on wait times
