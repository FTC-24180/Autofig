# JSON Export Format - Correct Structure

## Overview

The app now exports JSON in the correct hierarchical structure required by your robot code, with data nested under `match.alliance.auto`.

## Complete JSON Structure

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
            "startPosition": {
              "type": "front"
            },
            "actions": [
              {
                "type": "spike_1"
              },
              {
                "type": "wait",
                "config": {
                  "duration": 3
                }
              }
            ]
          }
        }
      }
    }
  ]
}
```

## Field Descriptions

### Top Level
- **matches** (array): Array of match configurations

### Match Level  
- **match.number** (integer): The match number (e.g., 1, 2, 34)

### Alliance Level
- **match.alliance.color** (string): Alliance color - either `"red"` or `"blue"`
- **match.alliance.team_number** (integer): Partner team number (0 if not set)

### Auto Level
- **match.alliance.auto.startPosition** (object): Starting position configuration
  - **type** (string): Position type (e.g., "front", "back", "left", "right")
  - May include additional fields like **x**, **y**, **heading** depending on configuration

- **match.alliance.auto.actions** (array): Array of autonomous actions to perform

### Action Format
Each action in the `actions` array has:
- **type** (string): Action identifier (required)
- **config** (object): Optional configuration parameters specific to the action

## Example: Single Match

```json
{
  "matches": [
    {
      "match": {
        "number": 34,
        "alliance": {
          "color": "red",
          "team_number": 1234,
          "auto": {
            "startPosition": {
              "type": "front"
            },
            "actions": [
              {
                "type": "spike_1"
              },
              {
                "type": "wait",
                "config": {
                  "duration": 3
                }
              },
              {
                "type": "drive_forward",
                "config": {
                  "distance": 24
                }
              }
            ]
          }
        }
      }
    }
  ]
}
```

## Example: Multiple Matches

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
            "startPosition": {
              "type": "front"
            },
            "actions": [
              { "type": "spike_1" },
              { "type": "score_basket" }
            ]
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
            "startPosition": {
              "type": "back"
            },
            "actions": [
              { "type": "spike_2" },
              { 
                "type": "wait",
                "config": { "duration": 2 }
              },
              { "type": "score_basket" }
            ]
          }
        }
      }
    }
  ]
}
```

## Data Flow in App

### Internal Storage (localStorage)
The app stores matches in a simplified format internally:
```javascript
{
  id: "uuid",
  matchNumber: 1,
  partnerTeam: "12345",
  alliance: "red",
  startPosition: { type: "front" },
  actions: [{ id: "uuid", type: "spike_1", label: "Spike Mark 1" }]
}
```

### Export Transformation
When exporting (Download JSON / QR Code), the app transforms to the hierarchical structure:
```javascript
{
  matches: [{
    match: {
      number: 1,
      alliance: {
        color: "red",
        team_number: 12345,
        auto: {
          startPosition: { type: "front" },
          actions: [{ type: "spike_1" }] // id and label removed
        }
      }
    }
  }]
}
```

## Robot Code Usage

Your robot code can parse this structure:

```java
// Java example
JSONObject root = new JSONObject(jsonString);
JSONArray matches = root.getJSONArray("matches");

for (int i = 0; i < matches.length(); i++) {
    JSONObject matchObj = matches.getJSONObject(i).getJSONObject("match");
    int matchNumber = matchObj.getInt("number");
    
    JSONObject alliance = matchObj.getJSONObject("alliance");
    String color = alliance.getString("color");
    int teamNumber = alliance.getInt("team_number");
    
    JSONObject auto = alliance.getJSONObject("auto");
    JSONObject startPos = auto.getJSONObject("startPosition");
    JSONArray actions = auto.getJSONArray("actions");
    
    // Process actions
    for (int j = 0; j < actions.length(); j++) {
        JSONObject action = actions.getJSONObject(j);
        String type = action.getString("type");
        
        if (action.has("config")) {
            JSONObject config = action.getJSONObject("config");
            // Read config values
        }
    }
}
```

## Validation Rules

### Required Fields
- ? `match.number` - Must be present
- ? `match.alliance.color` - Must be "red" or "blue"
- ? `match.alliance.auto.startPosition` - Must have at least `type`
- ? `match.alliance.auto.actions` - Must be an array (can be empty)

### Optional Fields
- ? `match.alliance.team_number` - Defaults to 0 if not set
- ? `action.config` - Only present if action has configuration

### Field Constraints
- **match.number**: Integer, typically 1-100
- **alliance.color**: String, only "red" or "blue"
- **team_number**: Integer, 0 or positive FTC team number
- **startPosition.type**: String, from configured position types
- **action.type**: String, from configured action types
- **action.config**: Object, structure depends on action type

## Accessing the Export

### Via UI
1. Navigate to **Step 6 (QR Code)**
2. Click **"Download JSON"** button
3. File saved as `ftc-auto-all-matches-[timestamp].json`

### Via Hamburger Menu
1. Open hamburger menu (?)
2. Click **"Export All Matches"**
3. File downloaded immediately

### Via QR Code
1. Navigate to **Step 6 (QR Code)**
2. Scan QR code with robot camera
3. JSON string embedded in QR code

## Import Back to App

The app can also **import** JSON in this format:

1. Open hamburger menu (?)
2. Click **"Load Template"**
3. Select saved template
4. Or manually import via browser developer tools:
   ```javascript
   localStorage.setItem('ftc-autoconfig-matches', JSON.stringify([...]))
   ```

## Migration from Old Format

If you have old exports without the hierarchical structure, they will be automatically converted on import:

**Old Format:**
```json
{
  "matchNumber": 1,
  "alliance": "red",
  "partnerTeam": "12345",
  "actions": [...]
}
```

**Automatically converts to:**
```json
{
  "match": {
    "number": 1,
    "alliance": {
      "color": "red",
      "team_number": 12345,
      "auto": {
        "startPosition": {...},
        "actions": [...]
      }
    }
  }
}
```

## Testing the Format

### Quick Test in Browser Console
```javascript
// Get current config
const config = JSON.parse(localStorage.getItem('ftc-autoconfig-matches'));

// Export it
async function exportConfig() {
  const response = await fetch('/api/export'); // Your export endpoint
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}
```

### Validate Structure
```javascript
function validateMatch(matchObj) {
  const match = matchObj.match;
  
  if (!match || !match.number) return false;
  if (!match.alliance || !match.alliance.color) return false;
  if (!match.alliance.auto) return false;
  if (!match.alliance.auto.startPosition) return false;
  if (!Array.isArray(match.alliance.auto.actions)) return false;
  
  return true;
}
```

## Summary

? **Correct Structure**: Matches spec exactly - `match.alliance.auto`
? **Multiple Matches**: Exports all configured matches
? **Clean Output**: Removes internal IDs and labels
? **Type Safety**: Converts team number to integer
? **Backward Compatible**: Can import old formats
? **QR Code Ready**: Compact enough for QR encoding
? **Robot Ready**: Structure matches your Java/Kotlin code expectations

Your robot code can now directly parse the exported JSON without any transformation! ??
