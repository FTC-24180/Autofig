# FTC AutoConfig OpMode Integration Guide

## Quick Start

### Step 1: Add Dependencies

Add Gson to your `build.gradle`:

```gradle
dependencies {
    implementation 'com.google.code.gson:gson:2.10.1'
}
```

### Step 2: Copy Helper Classes

Copy these files to your TeamCode:
- `AutoConfigParser.java` ? `org/firstinspires/ftc/teamcode/auto/config/`
- `MatchDataModels.java` ? `org/firstinspires/ftc/teamcode/auto/config/`

### Step 3: Export Match Data

1. Open the AutoConfig web app
2. Configure your match
3. Tap "Export JSON" or scan QR code
4. Save file to `/sdcard/FIRST/match-data.json` on your robot phone

### Step 4: Create OpMode

```java
@Autonomous(name = "Auto Match 1", group = "Competition")
public class AutoMatch1 extends LinearOpMode {
    private static final String FILE_PATH = "/sdcard/FIRST/match-data.json";
    private static final int MATCH_NUMBER = 1;
    
    @Override
    public void runOpMode() {
        // Parse match data
        AutoConfigParser parser = new AutoConfigParser();
        MatchDataConfig config = parser.parseFile(FILE_PATH);
        Match match = parser.getMatchByNumber(config, MATCH_NUMBER);
        
        // Initialize robot hardware
        // ... your hardware initialization ...
        
        waitForStart();
        
        // Execute autonomous
        executeAutonomous(match);
    }
    
    private void executeAutonomous(Match match) {
        // Set start position
        StartPosition start = match.alliance.auto.startPosition;
        if (start.isCustom()) {
            setPose(start.getX(), start.getY(), start.getTheta());
        }
        
        // Execute actions
        for (Action action : match.alliance.auto.actions) {
            executeAction(action);
        }
    }
    
    private void executeAction(Action action) {
        switch (action.type) {
            case "wait":
                sleep(action.getConfigInt("waitTime", 1000));
                break;
            // ... implement your actions ...
        }
    }
}
```

## Data Structure Reference

### Root Object
```json
{
  "version": "1.0.0",
  "matches": [ /* matches array */ ]
}
```

### Accessing Match Data

```java
// Get specific match
Match match = parser.getMatchByNumber(config, 1);

// Get match info
int matchNum = match.number;
String alliance = match.alliance.color;  // "red" or "blue"
int partner = match.alliance.team_number;

// Get start position
StartPosition start = match.alliance.auto.startPosition;
boolean isCustom = start.isCustom();
double x = start.getX();
double y = start.getY();
double heading = start.getTheta();

// Get actions
List<Action> actions = match.alliance.auto.actions;
for (Action action : actions) {
    String type = action.type;
    String label = action.label;
    
    // Get config values
    if (action.hasConfig()) {
        int waitTime = action.getConfigInt("waitTime", 0);
        double speed = action.getConfigDouble("speed", 1.0);
        String target = action.getConfigString("target", "");
    }
}
```

## Common Action Types

| Type | Description | Common Config |
|------|-------------|---------------|
| `wait` | Pause execution | `waitTime` (ms) |
| `drive_to` | Navigate to coordinates | `x`, `y`, `target` |
| `near_launch` | Launch from near position | - |
| `far_launch` | Launch from far position | - |
| `spike_1`, `spike_2`, `spike_3` | Navigate to spike marks | - |
| `near_park`, `far_park` | Park in zones | - |

## Action Implementation Examples

### Wait Action
```java
private void executeWait(Action action) {
    int duration = action.getConfigInt("waitTime", 1000);
    sleep(duration);
}
```

### Drive To Action
```java
private void executeDriveTo(Action action) {
    double x = action.getConfigDouble("x", 0);
    double y = action.getConfigDouble("y", 0);
    String target = action.getConfigString("target", "");
    
    Pose2d targetPose = new Pose2d(x, y, drive.getPoseEstimate().getHeading());
    drive.followTrajectory(
        drive.trajectoryBuilder(drive.getPoseEstimate())
            .lineToLinearHeading(targetPose)
            .build()
    );
}
```

### Custom Action with Config
```java
private void executeCustomAction(Action action) {
    // Get parameters with defaults
    double speed = action.getConfigDouble("speed", 0.75);
    boolean reversed = action.getConfigBoolean("reversed", false);
    String target = action.getConfigString("target", "default");
    
    // Execute based on config
    setDriveSpeed(speed);
    if (reversed) reverseDirection();
    navigateToTarget(target);
}
```

## Error Handling

### File Not Found
```java
try {
    MatchDataConfig config = parser.parseFile(FILE_PATH);
} catch (IOException e) {
    telemetry.addData("Error", "Match data file not found");
    telemetry.addData("Path", FILE_PATH);
    telemetry.update();
    return;
}
```

### Invalid JSON
```java
try {
    MatchDataConfig config = parser.parseJson(jsonString);
} catch (IllegalArgumentException e) {
    telemetry.addData("Error", "Invalid match data");
    telemetry.addData("Message", e.getMessage());
    telemetry.update();
    return;
}
```

### Missing Match
```java
Match match = parser.getMatchByNumber(config, matchNumber);
if (match == null) {
    telemetry.addData("Error", "Match " + matchNumber + " not found");
    telemetry.update();
    return;
}
```

### Unknown Action Type
```java
private void executeAction(Action action) {
    switch (action.type) {
        case "known_action":
            // handle action
            break;
        default:
            telemetry.addData("Warning", "Unknown action: " + action.type);
            telemetry.addLine("Skipping...");
            telemetry.update();
            // Continue with next action
    }
}
```

## Advanced Features

### Filter by Alliance
```java
// Get all red alliance matches
List<Match> redMatches = parser.getMatchesByAlliance(config, "red");

// Get all blue alliance matches
List<Match> blueMatches = parser.getMatchesByAlliance(config, "blue");
```

### Multiple Match Support
```java
// Create separate OpModes for each match
@Autonomous(name = "Auto Match 1")
public class AutoMatch1 extends AutoConfigOpModeBase {
    protected int getMatchNumber() { return 1; }
}

@Autonomous(name = "Auto Match 2")
public class AutoMatch2 extends AutoConfigOpModeBase {
    protected int getMatchNumber() { return 2; }
}
```

### Custom Start Position Mapping
```java
private void setStartPosition(StartPosition position) {
    if (position.isCustom()) {
        // Use exact coordinates
        drive.setPoseEstimate(new Pose2d(
            position.getX(),
            position.getY(),
            Math.toRadians(position.getTheta())
        ));
    } else {
        // Map preset names to poses
        Pose2d pose = switch (position.type) {
            case "front" -> FRONT_START_POSE;
            case "back" -> BACK_START_POSE;
            case "left" -> LEFT_START_POSE;
            case "right" -> RIGHT_START_POSE;
            default -> DEFAULT_POSE;
        };
        drive.setPoseEstimate(pose);
    }
}
```

## Best Practices

1. **Always validate data** before execution
2. **Use try-catch blocks** for file operations
3. **Provide defaults** for optional config values
4. **Log unknown actions** instead of crashing
5. **Test with sample data** before competition
6. **Keep match files organized** by date/event
7. **Back up match data** before each match

## Troubleshooting

### "File not found" Error
- Check file path matches your device
- Verify file is in `/sdcard/FIRST/` directory
- Ensure file has `.json` extension
- Check file permissions

### "Unsupported version" Error
- Update parser classes to latest version
- Check schema version in JSON matches parser
- Regenerate match data from web app

### Actions Not Executing
- Verify action types match your switch statement
- Check for typos in action type strings
- Add logging to see which actions are received
- Ensure `opModeIsActive()` checks are present

### Config Values Wrong Type
- Use appropriate getter methods:
  - `getConfigInt()` for integers
  - `getConfigDouble()` for decimals
  - `getConfigString()` for text
  - `getConfigBoolean()` for true/false
- Always provide default values

## File Location Tips

### Recommended Structure
```
/sdcard/FIRST/
  ??? match-data.json          (current matches)
  ??? backup/
  ?   ??? match-data-2024-01-15.json
  ?   ??? match-data-2024-01-20.json
  ??? testing/
      ??? test-match-data.json
```

### Transferring Files
1. **USB**: Connect phone, copy to `/sdcard/FIRST/`
2. **ADB**: `adb push match-data.json /sdcard/FIRST/`
3. **QR Code**: Scan in web app, save directly
4. **Cloud**: Download from Drive/Dropbox to phone

## See Also
- [Match Data Schema Documentation](MATCH_DATA_SCHEMA.md)
- [JSON Schema Definition](../schemas/ftc-match-data-schema.json)
- [Example OpMode](AutoConfigOpModeExample.java)
