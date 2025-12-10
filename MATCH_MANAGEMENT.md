# Match Management System - Documentation

## Overview

The FTC AutoConfig app now supports managing multiple matches with a hierarchical JSON structure. Each match contains its own configuration including alliance partner, color, starting position, and action sequence.

## JSON Structure

### New Hierarchical Format

```json
{
  "matches": [
    {
      "matchNumber": 1,
      "partnerTeam": "12345",
      "alliance": "red",
      "startPosition": {
        "type": "front"
      },
      "actions": [
        {
          "type": "near_launch",
          "config": {}
        },
        {
          "type": "spike_1",
          "config": {}
        }
      ]
    },
    {
      "matchNumber": 2,
      "partnerTeam": "67890",
      "alliance": "blue",
      "startPosition": {
        "type": "back"
      },
      "actions": [
        {
          "type": "far_launch",
          "config": {}
        }
      ]
    }
  ]
}
```

### Hierarchy

```
matches (array)
??? match 1
?   ??? matchNumber (property)
?   ??? partnerTeam (property)
?   ??? alliance (property: "red" or "blue")
?   ??? startPosition (child node)
?   ?   ??? type
?   ?   ??? x (for custom)
?   ?   ??? y (for custom)
?   ?   ??? theta (for custom)
?   ??? actions (array of child nodes)
?       ??? action 1
?       ?   ??? type
?       ?   ??? config (optional)
?       ??? action 2
?           ??? type
?           ??? config (optional)
??? match 2
    ??? ...
```

## Features

### Match Manager

Access the Match Manager from the header button (top-left):
- **View all matches** - See all configured matches at a glance
- **Switch matches** - Click on any match to edit it
- **Add new match** - Create additional matches
- **Delete match** - Remove matches you no longer need
- **Duplicate match** - Copy a match configuration

### Match Properties

Each match has the following properties:
1. **Match Number** - Unique identifier for the match
2. **Partner Team** - Alliance partner team number
3. **Alliance Color** - Red or Blue alliance
4. **Start Position** - Robot's starting position (preset or custom)
5. **Actions** - Sequential list of autonomous actions

### Adding Matches

1. Click the "Matches" button in the header
2. Click "Add Match" button
3. New match is created with default values
4. Configure the match through the wizard steps

### Deleting Matches

1. Open the Match Manager
2. Click the trash icon on the match you want to delete
3. Confirm deletion
4. Match is removed from the configuration

### Duplicating Matches

1. Open the Match Manager
2. Click the duplicate icon on the match you want to copy
3. A new match is created with the same configuration
4. The match number is automatically incremented

### Switching Between Matches

1. Open the Match Manager
2. Click on the match you want to edit
3. The wizard updates to show that match's configuration
4. Make changes as needed

## Export Format

### Single Export File

When you export or generate a QR code, **all matches** are included in a single JSON file:

- The file contains a `matches` array with all configured matches
- Each match preserves its complete configuration
- The QR code encodes the entire multi-match configuration

### File Naming

Exported files follow this pattern:
```
ftc-auto-all-matches-{timestamp}.json
```

## Templates

Templates now support both formats:

### Single Match Template (Legacy)
```json
{
  "matchNumber": 1,
  "partnerTeam": "12345",
  "alliance": "red",
  "startPosition": { "type": "front" },
  "actions": [...]
}
```

### Multiple Match Template (New)
```json
{
  "matches": [
    { "matchNumber": 1, ... },
    { "matchNumber": 2, ... }
  ]
}
```

The app automatically detects and handles both formats when loading templates.

## Use Cases

### Tournament Day Workflow

1. **Pre-tournament**: Configure all your qualification matches
   - Match 1: Red alliance, Partner: Team A
   - Match 2: Blue alliance, Partner: Team B
   - Match 3: Red alliance, Partner: Team C
   - etc.

2. **Between matches**: 
   - Open Match Manager
   - Select the current match
   - Review/adjust configuration if needed
   - Generate QR code for robot

3. **Quick adjustments**: 
   - Duplicate a similar match
   - Adjust only what's different
   - Save time on configuration

### Strategy Preparation

1. Create multiple match scenarios:
   - Defensive strategy (Match 1)
   - Offensive strategy (Match 2)
   - Balanced strategy (Match 3)

2. During driver meeting:
   - Discuss strategy with alliance partner
   - Select appropriate match configuration
   - Deploy to robot

## Storage

- All matches are stored in browser's localStorage
- Key: `ftc-autoconfig-matches`
- Data persists between sessions
- Clear browser data to reset

## Migration from Old Format

If you have existing templates in the old single-match format:
- They will still load correctly
- They are converted to the new multi-match format
- Save them again to update to the new format

## Tips

1. **Name matches strategically**: Use match numbers that correspond to your actual match schedule
2. **Duplicate wisely**: If you have similar strategies, duplicate and modify instead of starting from scratch
3. **Review before matches**: Always review the configuration in the Match Manager before your match
4. **Backup**: Periodically export your configuration as a backup
5. **QR code size**: With multiple matches, QR codes may become dense. Test scanning before competition day

## JSON Fields Reference

### Match Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| matchNumber | number | Yes | Match identifier (1, 2, 3, ...) |
| partnerTeam | string | No | Alliance partner team number |
| alliance | string | Yes | "red" or "blue" |
| startPosition | object | Yes | Starting position configuration |
| actions | array | Yes | Array of action objects |

### StartPosition Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Position type ("front", "back", "custom") |
| x | number | Conditional | X coordinate (required if type is "custom") |
| y | number | Conditional | Y coordinate (required if type is "custom") |
| theta | number | Conditional | Angle in degrees (required if type is "custom") |

### Action Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Action type (from action groups) |
| config | object | No | Action-specific configuration parameters |

## Troubleshooting

### Problem: Matches not saving
- **Solution**: Check browser's localStorage isn't full or disabled

### Problem: QR code won't scan
- **Solution**: Too much data. Reduce number of matches or actions

### Problem: Lost all matches
- **Solution**: Check if you cleared browser data. Export regularly as backup

### Problem: Can't delete last match
- **Solution**: App requires at least one match. Add a new one first, then delete the old one

## API for Developers

If you're integrating with this system:

```javascript
// Access matches
const matches = JSON.parse(localStorage.getItem('ftc-autoconfig-matches'));

// Each match structure
const match = {
  id: "uuid-string",
  matchNumber: 1,
  partnerTeam: "12345",
  alliance: "red",
  startPosition: { type: "front" },
  actions: [
    { type: "near_launch", config: {} }
  ]
};

// Export format (without internal IDs)
const exportFormat = {
  matches: matches.map(m => {
    const { id, ...match } = m;
    return match;
  })
};
```

## Future Enhancements

Potential features for future versions:
- Import/merge matches from multiple files
- Reorder matches
- Match validation and conflict detection
- Auto-fill partner team from schedule
- Match notes and comments
- Time estimation for autonomous routines
