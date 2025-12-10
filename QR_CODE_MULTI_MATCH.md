# QR Code: Individual Match Codes

## Overview

The QR Code step generates **individual QR codes per match**. Each match gets its own scannable code, ensuring reliable scanning regardless of configuration size.

## How It Works

### One QR Code Per Match
- ? Each match has its own dedicated QR code
- ? Match selector to switch between codes
- ? Always within QR code capacity limits
- ? Download button provides complete JSON with all matches

## Features

### Match Selector

Interactive grid to select which match's QR code to display:

```
????????????????????????????????????
? Select Match                     ?
????????????????????????????????????
? ??????????????  ??????????????  ?
? ? Match #1   ?  ? Match #2   ?  ?
? ? ?? RED • 1 ?  ? ?? BLUE • 2?  ?
? ??????????????  ??????????????  ?
? ??????????????  ??????????????  ?
? ? Match #3   ?  ? Match #4   ?  ?
? ? ?? RED • 3 ?  ? ?? BLUE • 4?  ?
? ??????????????  ??????????????  ?
????????????????????????????????????
```

- Grid layout (2 columns)
- Touch-friendly buttons (60px minimum height)
- Selected match highlighted with indigo ring
- Shows match number, alliance emoji/color, and team

### QR Code Display

```
????????????????????????????????????
?        Match #1                  ?
?      [QR Code]                   ?
?   QR Code 1 of 4                 ?
?                                  ?
?  Current Match                   ?
?  Match: #1                       ?
?  Alliance: RED                   ?
?  Partner: 12345                  ?
?  Actions: 5                      ?
?  Size: 567 bytes                 ?
????????????????????????????????????
```

### Info Banner

Blue info banner at top explains the system:

```
?? Individual Match QR Codes
Each match has its own QR code. Select a match below
to display its code, then scan it with your robot.
```

## User Workflow

### Scanning Multiple Matches

1. Navigate to Step 4 (QR Code)
2. See match selector grid
3. Tap Match #1
4. Scan QR code for Match #1 with robot
5. Tap Match #2
6. Scan QR code for Match #2
7. Repeat for all matches

### Alternative: Download JSON

1. Click "Download All Matches JSON" button
2. Complete JSON file downloads with all matches
3. Transfer to robot via USB or upload
4. Parse file directly in robot code

## JSON Structure

### Individual Match QR Code
Each QR code contains a single match:

```json
{
  "match": {
    "number": 1,
    "alliance": {
      "color": "red",
      "team_number": 12345,
      "auto": {
        "startPosition": {
          "type": "front"
        },
        "actions": [
          { "type": "spike_1" },
          { "type": "wait", "config": { "duration": 3 } }
        ]
      }
    }
  }
}
```

### Downloaded JSON File
Contains all matches:

```json
{
  "matches": [
    {
      "match": {
        "number": 1,
        "alliance": {
          "color": "red",
          "team_number": 12345,
          "auto": {
            "startPosition": { "type": "front" },
            "actions": [...]
          }
        }
      }
    },
    {
      "match": {
        "number": 2,
        "alliance": {
          "color": "blue",
          "team_number": 67890,
          "auto": {
            "startPosition": { "type": "back" },
            "actions": [...]
          }
        }
      }
    }
  ]
}
```

## Robot Code Integration

### Option 1: Scan Individual QR Codes

```java
// Scan each match one at a time
List<JSONObject> matchConfigs = new ArrayList<>();

for (int i = 0; i < expectedMatches; i++) {
    telemetry.addData("Status", "Scan Match #" + (i + 1));
    telemetry.update();
    
    String qrData = scanQRCode(); // Your QR scanning function
    
    if (qrData != null) {
        JSONObject matchObj = new JSONObject(qrData).getJSONObject("match");
        matchConfigs.add(matchObj);
        
        int matchNumber = matchObj.getInt("number");
        telemetry.addData("Scanned", "Match #" + matchNumber);
        telemetry.update();
    }
}

// Now you have all matches
processMatches(matchConfigs);
```

### Option 2: Load Downloaded JSON

```java
// Read the downloaded JSON file
// Transfer via USB or upload to robot controller
String jsonContent = readFile("/sdcard/FIRST/ftc-auto-all-matches.json");
JSONObject root = new JSONObject(jsonContent);
JSONArray matches = root.getJSONArray("matches");

// Process all matches
for (int i = 0; i < matches.length(); i++) {
    JSONObject matchObj = matches.getJSONObject(i).getJSONObject("match");
    int matchNumber = matchObj.getInt("number");
    
    // Store or process match
    processMatch(matchObj);
}
```

### Option 3: Hybrid Approach

```java
// Scan the match you're about to run
JSONObject currentMatch = null;

while (currentMatch == null) {
    String qrData = scanQRCode();
    if (qrData != null) {
        currentMatch = new JSONObject(qrData).getJSONObject("match");
        int matchNumber = currentMatch.getInt("number");
        
        telemetry.addData("Loaded", "Match #" + matchNumber);
        telemetry.update();
    }
}

// Use currentMatch for autonomous
runAutonomous(currentMatch);
```

## UI Components

### Match Selector
- **Layout**: 2-column grid
- **Button Size**: min-h-[60px]
- **States**:
  - Selected: Indigo border + ring + background
  - Unselected: Gray border + white background
- **Content**: Match #, alliance emoji, team number

### QR Code Container
- **Size**: Responsive (max 300px or screen width - 100px)
- **Error Correction**: Level M (medium)
- **Margin**: Included automatically
- **Badge**: Shows current match number above code
- **Counter**: "QR Code X of Y" below code

### Match Summary Card
- **Background**: Indigo-50
- **Border**: Indigo-200
- **Content**:
  - Match number
  - Alliance color
  - Partner team (if set)
  - Action count
  - JSON size in bytes

### All Matches List
- **Background**: Gray-50
- **Items**: White cards with hover/active states
- **Selected**: Indigo ring around card
- **Clickable**: Tap to switch QR code
- **Info**: Match #, alliance, team, actions

## Benefits

### For Users
? **Always reliable** - QR codes never too large
? **Clear workflow** - Select match, scan code
? **Visual feedback** - Selected match highlighted
? **Flexible** - Scan codes OR download JSON
? **Touch optimized** - Large 60px buttons

### For Teams
? **Tournament ready** - Scan each match before you run it
? **Quick updates** - Modify strategy between matches
? **Backup option** - Download complete JSON file
? **No errors** - Individual codes always scannable

### For Robot Code
? **Simple parsing** - Single match structure
? **Flexible integration** - Scan or file-based
? **Reliable data** - No truncation or errors
? **Standard JSON** - Same format as downloaded file

## Size Comparison

Individual QR codes are much smaller and more reliable:

| Scenario | Combined Size | Individual Size | Scannable? |
|----------|---------------|-----------------|------------|
| 1 match | ~400 chars | ~400 chars | ? Both |
| 3 matches | ~1,200 chars | ~400 chars each | ? Individual only |
| 6 matches | ~2,400 chars | ~400 chars each | ? Individual only |
| 10 matches | ~4,000 chars | ~400 chars each | ? Individual only |

**Individual codes:** Always within QR capacity (2,331 chars with Medium error correction)

## Mobile Optimization

### Touch Targets
- Match selector buttons: **60px** minimum
- Download/JSON buttons: **48px** minimum
- List items: **Full card clickable**

### Responsive Design
```javascript
size={Math.min(300, window.innerWidth - 100)}
```
- QR code scales to screen
- Always leaves 50px margin
- Works on smallest phones (320px)

### Layout
- Vertical stack (mobile-first)
- 2-column grid for match selector
- Adequate spacing (24px gaps)
- Scrollable content area

## Testing

### Test Case 1: Single Match
1. Create 1 match with actions
2. Navigate to QR Code step
3. **Expected**: One match button (selected by default)
4. **Verify**: QR code displays
5. **Verify**: "QR Code 1 of 1" shown
6. **Verify**: Match summary shows details

### Test Case 2: Multiple Matches
1. Create 4 matches
2. Navigate to QR Code step
3. **Expected**: 4 match buttons in 2x2 grid
4. **Verify**: First match selected by default
5. **Verify**: Clicking changes QR code
6. **Verify**: Counter updates (1 of 4, 2 of 4, etc.)
7. **Verify**: Selected match has indigo ring

### Test Case 3: Match List
1. With multiple matches visible
2. Click on match in "All Matches" list
3. **Expected**: QR code updates
4. **Verify**: Match selector syncs
5. **Verify**: Both UIs stay in sync

### Test Case 4: JSON Display
1. Click "Show JSON"
2. **Expected**: Current match JSON displayed
3. **Verify**: "Copy All" button visible
4. **Verify**: Clicking copies all matches config
5. Select different match
6. **Verify**: JSON updates to new match

### Test Case 5: Download
1. Click "Download All Matches JSON"
2. **Expected**: File downloads immediately
3. **Verify**: Contains all matches
4. **Verify**: Proper hierarchical structure
5. **Verify**: Each match has correct format

## Error Handling

### No Matches
```javascript
if (matchCount === 0) {
  // Shows gray dashed box
  // "No matches configured" message
}
```

### Invalid Match Index
```javascript
const getMatchConfig = (index) => {
  if (!config.matches || !config.matches[index]) return null;
  return config.matches[index];
};
```
Returns null safely, prevents errors

### Missing Data
All accessors use optional chaining:
```javascript
matchData?.alliance?.auto?.actions?.length || 0
```

## Workflow Examples

### Tournament Day - Qualification Matches

**Scenario:** 5 qualification matches scheduled

1. **Before Tournament:**
   - Configure all 5 matches in app
   - Download JSON backup to robot

2. **Before Match 1:**
   - Open app on phone
   - Select Match #1
   - Scan QR code with robot camera
   - Robot loads Match #1 config
   - Run autonomous

3. **Before Match 2:**
   - Select Match #2
   - Scan QR code
   - Robot loads Match #2 config
   - Run autonomous

4. **Continue for remaining matches**

### Tournament Day - Last Minute Changes

**Scenario:** Need to modify strategy between matches

1. Between matches, update actions in app
2. Save changes
3. Navigate to QR Code step
4. Select updated match
5. Scan new QR code
6. Robot has updated strategy
7. Run with new configuration

## Summary

? **Individual QR codes** for every match
? **Always scannable** - never exceeds capacity
? **Match selector** for easy navigation
? **Visual feedback** - clear selection states
? **Download option** for complete JSON
? **Mobile optimized** - large touch targets
? **Tournament ready** - scan before each match
? **Build successful** - 271.66 kB (80.62 kB gzipped)

The QR code system is now simplified and optimized for individual match workflows! ??
