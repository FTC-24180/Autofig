# FTC AutoConfig Integration Guide

## Quick Start - Terse Format (Recommended)

The terse format is the primary method for transferring match data via QR codes. It's compact, efficient, and designed specifically for FTC competitions.

### Step 1: Scan QR Code

Use the Limelight QR Scanner OpMode to scan QR codes from the AutoConfig web app:

1. **Configure Limelight** for barcode detection (Pipeline 0)
2. **Copy files** to TeamCode:
   - `LimelightQRScannerOpMode.java`
   - `TerseMatchCodec.java` or `TerseMatchDecoder.java`
   - `MatchDataConfig.java`
3. **Run OpMode** and scan QR codes
4. **Save** unified JSON to `/sdcard/FIRST/match-data.json`

### Step 2: Decode Terse Format

```java
@Autonomous(name = "Auto Match 1", group = "Competition")
public class AutoMatch1 extends LinearOpMode {
    @Override
    public void runOpMode() {
        // Terse format example: 5RS1W1A1A3W2.5A6
        String terseCode = "5RS1W1A1A3W2.5A6";
        
        // Decode
        TerseMatchDecoder.Match match = TerseMatchDecoder.decode(terseCode);
        
        waitForStart();
        
        // Use match data
        telemetry.addData("Match", match.matchNumber);
        telemetry.addData("Alliance", match.alliance);
        telemetry.addData("Start Pos", match.startPosition);
        
        // Execute actions
        for (TerseMatchDecoder.Action action : match.actions) {
            if (action.type.equals("wait")) {
                sleep(TerseMatchDecoder.secondsToMillis(action.waitTimeSeconds));
            } else {
                // Execute action based on type (e.g., "A1", "A3")
                executeAction(action.type);
            }
        }
    }
}
```

### Terse Format Specification

Format: `{n}[R|B]S{startPos}[W{sec}|A{actionId}]*`

- `{n}` - Match number
- `[R|B]` - Alliance (R=red, B=blue)
- `S{startPos}` - Start position number
- `W{sec}` - Wait action (seconds, supports decimals like `W2.5`)
- `A{actionId}` - Action by ID (e.g., `A1`, `A3`)

Examples:
- `5RS1W1A1A3W2.5A6` - Match 5, Red, Position 1, Wait 1s, A1, A3, Wait 2.5s, A6
- `12BS2W0.5A1W2A3` - Match 12, Blue, Position 2, Wait 0.5s, A1, Wait 2s, A3

See [TERSE_FORMAT.md](TERSE_FORMAT.md) for complete specification.

## QR Code Scanner with Limelight 3A

### Overview

Use the `LimelightQRScannerOpMode` to scan QR codes from the AutoConfig web app directly onto your robot controller using the goBILDA Limelight 3A camera.

### Quick Setup

1. **Configure Limelight** for barcode detection (Pipeline 0)
2. **Copy files** to TeamCode:
   - `LimelightQRScannerOpMode.java`
   - `TerseMatchCodec.java`
   - `MatchDataConfig.java`
3. **Run OpMode** and scan QR codes
4. **Save** unified JSON to `/sdcard/FIRST/match-data.json`

### Usage

```java
// No code needed! Use the scanner OpMode:
// 1. Select "Limelight QR Scanner" on Driver Station
// 2. Point camera at QR code
// 3. Press A to scan
// 4. Press B to save
```

### Benefits

- ? No manual file transfer needed
- ? Scan multiple QR codes and merge automatically
- ? Validate format before saving
- ? Real-time preview and error handling
- ? Perfect for quick match-to-match updates

**See full documentation**: [Limelight QR Scanner Guide](README-LIMELIGHT.md)

## Action Implementation Examples

### Wait Action
```java
private void executeWait(TerseMatchDecoder.Action action) {
    int duration = TerseMatchDecoder.secondsToMillis(action.waitTimeSeconds);
    sleep(duration);
}
```

### Custom Actions
```java
private void executeAction(String actionType) {
    switch (actionType) {
        case "A1":
            // Your A1 implementation
            break;
        case "A2":
            // Your A2 implementation
            break;
        case "A3":
            // Your A3 implementation
            break;
        default:
            telemetry.addData("Warning", "Unknown action: " + actionType);
    }
}
```

## Alternative: JSON Export

The web app can also export matches as JSON for backup or manual integration. This is optional and mainly for debugging or backup purposes.

### JSON Structure
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
            "startPosition": {"type": "front"},
            "actions": [
              {"type": "wait", "label": "Wait", "config": {"waitTime": 1000}},
              {"type": "A1", "label": "Action 1"}
            ]
          }
        }
      }
    }
  ]
}
```

## Error Handling

### Terse Decode Errors
```java
try {
    TerseMatchDecoder.Match match = TerseMatchDecoder.decode(terseCode);
} catch (IllegalArgumentException e) {
    telemetry.addData("Error", "Invalid terse format");
    telemetry.addData("Message", e.getMessage());
    telemetry.update();
    return;
}
```

### Unknown Action Type
```java
private void executeAction(String actionType) {
    switch (actionType) {
        case "A1":
            // handle action
            break;
        default:
            telemetry.addData("Warning", "Unknown action: " + actionType);
            telemetry.addLine("Skipping...");
            // Continue with next action
    }
}
```

## Best Practices

1. **Use terse format** for QR codes (compact and efficient)
2. **Define action mappings** in your OpMode comments
3. **Test with sample codes** before competition
4. **Keep QR scanner OpMode** available for quick updates
5. **Save JSON backups** for disaster recovery
6. **Log unknown actions** instead of crashing

## File Organization
```
/sdcard/FIRST/
??? match-data.json          (current matches, scanned from QR)
??? backup/
    ??? match-data-2024-01-15.json
    ??? match-data-2024-01-20.json
```

## See Also
- [Terse Format Specification](TERSE_FORMAT.md)
- [Limelight Scanner Guide](README-LIMELIGHT.md)
- [Terse Decoder](TerseMatchDecoder.java)
- [QR Scanner OpMode](LimelightQRScannerOpMode.java)
