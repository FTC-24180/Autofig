# FTC AutoConfig - Match Data Schema & Integration

This directory contains the complete schema definition and integration examples for FTC AutoConfig match data.

## ?? Contents

### Schema Definition
- **[ftc-match-data-schema.json](ftc-match-data-schema.json)** - Formal JSON Schema (v1.0.0)
- **[MATCH_DATA_SCHEMA.md](../docs/MATCH_DATA_SCHEMA.md)** - Human-readable schema documentation

### Java Integration
- **[AutoConfigParser.java](java/AutoConfigParser.java)** - JSON parser for match data
- **[MatchDataModels.java](java/MatchDataModels.java)** - Data model classes
- **[AutoConfigOpModeExample.java](java/AutoConfigOpModeExample.java)** - Complete OpMode example
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Step-by-step integration guide

## ?? Quick Start

### For OpMode Development

1. **Add Gson dependency** to your `build.gradle`:
   ```gradle
   dependencies {
       implementation 'com.google.code.gson:gson:2.10.1'
   }
   ```

2. **Copy helper classes** to your TeamCode project:
   ```
   TeamCode/src/main/java/org/firstinspires/ftc/teamcode/auto/config/
   ??? AutoConfigParser.java
   ??? MatchDataModels.java
   ```

3. **Export match data** from the web app and save to:
   ```
   /sdcard/FIRST/match-data.json
   ```

4. **Create your OpMode**:
   ```java
   @Autonomous(name = "Auto Match 1")
   public class AutoMatch1 extends LinearOpMode {
       @Override
       public void runOpMode() {
           AutoConfigParser parser = new AutoConfigParser();
           MatchDataConfig config = parser.parseFile("/sdcard/FIRST/match-data.json");
           Match match = parser.getMatchByNumber(config, 1);
           
           // Execute autonomous sequence
           for (Action action : match.alliance.auto.actions) {
               executeAction(action);
           }
       }
   }
   ```

### For Schema Validation

Use the JSON Schema to validate match data:

```bash
# Using ajv-cli (Node.js)
npm install -g ajv-cli
ajv validate -s ftc-match-data-schema.json -d your-match-data.json

# Using Python jsonschema
pip install jsonschema
python -c "import jsonschema, json; \
    schema = json.load(open('ftc-match-data-schema.json')); \
    data = json.load(open('your-match-data.json')); \
    jsonschema.validate(data, schema)"
```

## ?? Schema Version

**Current Version**: 1.0.0

The schema follows [Semantic Versioning](https://semver.org/):
- **MAJOR**: Incompatible changes
- **MINOR**: Backwards-compatible additions
- **PATCH**: Backwards-compatible fixes

## ?? Schema Structure

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
                "type": "wait",
                "label": "Wait",
                "config": {
                  "waitTime": 1000
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

## ?? Documentation

### Complete Documentation
- [Match Data Schema](../docs/MATCH_DATA_SCHEMA.md) - Full schema reference
- [Integration Guide](INTEGRATION_GUIDE.md) - Step-by-step OpMode integration
- [Example OpMode](java/AutoConfigOpModeExample.java) - Working example with comments

### Key Concepts

#### Start Position
Either a preset position identifier or custom coordinates:

```json
// Preset
{"type": "front"}

// Custom
{
  "type": "custom",
  "x": 12.5,
  "y": 24.0,
  "theta": 90
}
```

#### Actions
Actions have a type, label, and optional configuration:

```json
{
  "type": "wait",
  "label": "Wait",
  "config": {
    "waitTime": 1000
  }
}
```

#### Action Config
Configuration values can be numbers, strings, or booleans:

```java
// In OpMode
int waitTime = action.getConfigInt("waitTime", 0);
double speed = action.getConfigDouble("speed", 1.0);
String target = action.getConfigString("target", "");
boolean reversed = action.getConfigBoolean("reversed", false);
```

## ??? Features

### Schema Features
- ? Version field for backward compatibility
- ? Flexible start position (preset or custom)
- ? Extensible action configuration
- ? Support for multiple matches
- ? Alliance color and team number
- ? Formal JSON Schema validation

### Parser Features
- ? Version checking
- ? Error handling with detailed messages
- ? Type-safe data models
- ? Convenient helper methods
- ? Support for legacy formats
- ? Query matches by number or alliance

## ?? Advanced Usage

### Multiple Match Selection

```java
// Get specific match
Match match1 = parser.getMatchByNumber(config, 1);

// Get all red alliance matches
List<Match> redMatches = parser.getMatchesByAlliance(config, "red");

// Iterate all matches
for (MatchWrapper wrapper : config.matches) {
    Match match = wrapper.match;
    // Process match
}
```

### Custom Action Handling

```java
private void executeAction(Action action) {
    // Use action type for routing
    switch (action.type) {
        case "custom_action":
            handleCustomAction(action);
            break;
        // ... other actions
    }
}

private void handleCustomAction(Action action) {
    // Extract config with defaults
    double param1 = action.getConfigDouble("param1", 1.0);
    String param2 = action.getConfigString("param2", "default");
    
    // Execute with parameters
    myRobotMethod(param1, param2);
}
```

### Error Recovery

```java
try {
    MatchDataConfig config = parser.parseFile(FILE_PATH);
    Match match = parser.getMatchByNumber(config, MATCH_NUMBER);
    
    if (match == null) {
        // Fallback to default autonomous
        executeDefaultAuto();
        return;
    }
    
    executeConfiguredAuto(match);
    
} catch (IOException e) {
    telemetry.addData("Error", "File not found");
    telemetry.update();
    executeDefaultAuto();
} catch (IllegalArgumentException e) {
    telemetry.addData("Error", "Invalid data");
    telemetry.update();
    executeDefaultAuto();
}
```

## ?? Testing

### Sample Data
Create test match data for development:

```json
{
  "version": "1.0.0",
  "matches": [
    {
      "match": {
        "number": 999,
        "alliance": {
          "color": "red",
          "team_number": 0,
          "auto": {
            "startPosition": {"type": "front"},
            "actions": [
              {"type": "wait", "label": "Wait", "config": {"waitTime": 500}}
            ]
          }
        }
      }
    }
  ]
}
```

### Validation
Validate before using in OpMode:

```java
// Check version
if (!config.version.equals("1.0.0")) {
    telemetry.addData("Warning", "Schema version mismatch");
}

// Check match exists
if (match == null) {
    throw new IllegalStateException("Match not found");
}

// Check required fields
if (match.alliance == null || match.alliance.auto == null) {
    throw new IllegalStateException("Invalid match structure");
}
```

## ?? Best Practices

1. **Always check schema version** before parsing
2. **Validate data structure** before execution
3. **Provide defaults** for optional configuration
4. **Handle unknown action types** gracefully
5. **Log all parsing errors** with details
6. **Test with sample data** before competition
7. **Keep backups** of match configurations
8. **Use version control** for match data files

## ?? Contributing

To add new action types or modify the schema:

1. Update `ftc-match-data-schema.json`
2. Update `MATCH_DATA_SCHEMA.md` documentation
3. Add examples to integration guide
4. Update `MATCH_DATA_SCHEMA_VERSION` in web app
5. Test with example OpMode
6. Create migration guide if breaking changes

## ?? License

This schema and integration code is part of the FTC AutoConfig project.
Licensed for use in FIRST Tech Challenge robotics competition.

## ?? Support

- **Issues**: Create an issue on GitHub
- **Questions**: Check the integration guide
- **Schema Updates**: Follow semantic versioning
- **Examples**: See example OpMode for reference

---

**Schema Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained By**: FTC Team 24180
