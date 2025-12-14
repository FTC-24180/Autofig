# FTC AutoConfig Match Data Schema

## Overview
This document describes the JSON schema for match data exported from the FTC AutoConfig web application. The schema is designed to be robust, versioned, and easy to integrate into FTC OpModes.

## Schema Version
Current Version: **1.0.0**

The schema follows semantic versioning:
- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible functionality additions
- **PATCH**: Backwards-compatible bug fixes

## Root Structure

```json
{
  "version": "1.0.0",
  "matches": [ /* array of match objects */ ]
}
```

### Root Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `version` | string | Yes | Schema version (format: X.Y.Z) |
| `matches` | array | Yes | Array of match configurations |

## Match Structure

Each match is wrapped in a `match` object:

```json
{
  "match": {
    "number": 1,
    "alliance": { /* alliance configuration */ }
  }
}
```

### Match Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `number` | integer | Yes | Match number (1-based) |
| `alliance` | object | Yes | Alliance-specific configuration |

## Alliance Structure

```json
{
  "color": "red",
  "team_number": 24180,
  "auto": { /* autonomous configuration */ }
}
```

### Alliance Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `color` | string | Yes | Alliance color ("red" or "blue") |
| `team_number` | integer | Yes | Partner team number (0 if not specified) |
| `auto` | object | Yes | Autonomous period configuration |

## Autonomous Structure

```json
{
  "startPosition": { /* start position */ },
  "actions": [ /* array of actions */ ]
}
```

### Autonomous Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `startPosition` | object | Yes | Robot starting position |
| `actions` | array | Yes | Sequence of actions to execute |

## Start Position Structure

### Preset Position
```json
{
  "type": "front"
}
```

### Custom Position
```json
{
  "type": "custom",
  "x": 12.5,
  "y": 24.0,
  "theta": 90
}
```

### Start Position Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | Yes | Position identifier or "custom" |
| `x` | number | If custom | X coordinate in field units |
| `y` | number | If custom | Y coordinate in field units |
| `theta` | number | If custom | Heading angle in degrees |

**Note**: When `type` is "custom", the `x`, `y`, and `theta` fields are **required**.

## Action Structure

```json
{
  "type": "near_launch",
  "label": "Near Launch",
  "config": {
    "waitTime": 1000
  }
}
```

### Action Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | Yes | Action type identifier |
| `label` | string | Yes | Human-readable action label |
| `config` | object | No | Action-specific configuration parameters |

### Common Action Types

| Type | Label | Description | Common Config |
|------|-------|-------------|---------------|
| `near_launch` | Near Launch | Launch from near position | - |
| `far_launch` | Far Launch | Launch from far position | - |
| `spike_1` | Spike 1 | Navigate to spike mark 1 | - |
| `spike_2` | Spike 2 | Navigate to spike mark 2 | - |
| `spike_3` | Spike 3 | Navigate to spike mark 3 | - |
| `corner` | Corner | Navigate to corner | - |
| `near_park` | Park (Near) | Park in near zone | - |
| `far_park` | Park (Far) | Park in far zone | - |
| `dump` | Dump | Dump game elements | - |
| `drive_to` | DriveTo | Drive to coordinates | `x`, `y`, `target` |
| `wait` | Wait | Wait for duration | `waitTime` (ms) |

### Action Config Object

The `config` object can contain action-specific parameters. Common types:
- **number**: Numeric values (coordinates, times, speeds)
- **string**: Text values (target names, identifiers)
- **boolean**: True/false flags

Examples:
```json
// Wait action
{"waitTime": 1000}

// Drive to action
{"x": 24.0, "y": 12.0, "target": "basket"}

// Custom speed action
{"speed": 0.75, "reversed": false}
```

## Complete Example

```json
{
  "version": "1.0.0",
  "matches": [
    {
      "match": {
        "number": 1,
        "alliance": {
          "color": "red",
          "team_number": 24180,
          "auto": {
            "startPosition": {
              "type": "front"
            },
            "actions": [
              {
                "type": "near_launch",
                "label": "Near Launch"
              },
              {
                "type": "spike_1",
                "label": "Spike 1"
              },
              {
                "type": "wait",
                "label": "Wait",
                "config": {
                  "waitTime": 1000
                }
              },
              {
                "type": "near_park",
                "label": "Park (Near)"
              }
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
          "team_number": 0,
          "auto": {
            "startPosition": {
              "type": "custom",
              "x": 12.5,
              "y": 24.0,
              "theta": 90
            },
            "actions": [
              {
                "type": "far_launch",
                "label": "Far Launch"
              },
              {
                "type": "drive_to",
                "label": "DriveTo",
                "config": {
                  "x": 36.0,
                  "y": 12.0,
                  "target": "basket"
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

## Validation Rules

### Version Field
- Format: `X.Y.Z` where X, Y, Z are non-negative integers
- Example: `"1.0.0"`, `"2.1.3"`

### Match Number
- Must be positive integer (? 1)
- Typically sequential but not required

### Alliance Color
- Must be exactly `"red"` or `"blue"` (lowercase)

### Team Number
- Integer from 0 to 99999
- 0 indicates no partner team specified

### Start Position Type
- For preset: any non-empty string identifier
- For custom: must be exactly `"custom"`

### Custom Position Coordinates
- `x`, `y`: any numeric value (field coordinates)
- `theta`: -360 to 360 degrees

### Action Type
- Non-empty string identifier
- Should match configured action definitions

### Action Label
- Non-empty string
- Human-readable description

### Action Config
- Optional object
- Keys: string identifiers
- Values: number, string, or boolean

## Backward Compatibility

The schema supports importing legacy formats:

### Legacy Format (pre-versioning)
```json
{
  "matches": [ /* matches without version field */ ]
}
```

### Single Match Format
```json
{
  "match": { /* single match object */ }
}
```

The import function automatically handles these formats and normalizes them to the current schema.

## Best Practices for OpMode Integration

1. **Always check the version field** before parsing
2. **Validate required fields** before execution
3. **Handle missing config gracefully** (use defaults)
4. **Log schema version** for debugging
5. **Support multiple schema versions** for backward compatibility
6. **Validate action types** against known actions
7. **Sanitize coordinates** before robot execution

## Error Handling

When parsing match data, handle these error cases:

| Error Case | Suggested Handling |
|------------|-------------------|
| Missing version | Assume legacy format or latest |
| Unknown version | Log warning, attempt parsing |
| Missing required field | Abort parsing, show error |
| Invalid coordinates | Use defaults or skip action |
| Unknown action type | Log warning, skip or use fallback |
| Malformed config | Use action defaults |

## Schema Location

The formal JSON Schema definition is available at:
- **File**: `schemas/ftc-match-data-schema.json`
- **Schema ID**: `https://ftc-autoconfig.app/schemas/match-data/v1.0.0`

## Changelog

### Version 1.0.0 (Current)
- Initial schema definition
- Support for preset and custom start positions
- Flexible action configuration system
- Versioned export format
- Backward compatibility with legacy formats
