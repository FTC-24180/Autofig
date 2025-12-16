# Limelight 3A QR Code Scanner OpMode Guide

## Overview

The `LimelightQRScannerOpMode` uses the goBILDA Limelight 3A camera to scan QR codes containing match data from the AutoConfig web app and saves a unified JSON file to the robot controller for use in autonomous OpModes.

## Features

? **Multiple QR Code Support** - Scan multiple QR codes and merge into single file  
? **Smart Merge** - Match numbers are primary keys; newer scans overwrite duplicates  
? **Real-time Preview** - View QR code data before saving  
? **Error Handling** - Validates JSON format and provides clear error messages  
? **Telemetry Feedback** - Shows scan status and match counts  
? **Easy Recovery** - Clear scans and retry if needed  

## Match Number as Primary Key

**Important:** The scanner uses **match number as the primary key** when merging QR codes.

### How It Works

When you scan multiple QR codes:
- Matches are merged based on match number
- **Later scans overwrite earlier scans** for the same match number
- This allows you to update specific matches without rescanning everything

### Example

**Scenario:**
1. First scan: Matches 1, 3, 4, 7
2. Second scan: Matches 1, 5, 6, 7, 8

**Result:** Matches 1 (from second), 3, 4 (from first), 5, 6, 7, 8 (from second)

- Match 1: Updated to second scan's version
- Match 3, 4: Kept from first scan
- Match 5, 6, 8: Added from second scan
- Match 7: Updated to second scan's version

### Use Cases

**Update Strategy for Specific Match:**
```
1. Already scanned matches 1-10
2. Need to change strategy for match 5
3. Generate QR code with only match 5
4. Scan it - match 5 is overwritten
5. Save - now have updated match 5 + unchanged 1-4, 6-10
```

**Incremental Addition:**
```
1. Morning: Scan matches 1-5
2. Afternoon: Scan matches 6-10
3. Save - have all 10 matches
```

**Fix Errors:**
```
1. Scanned match 3 with wrong configuration
2. Fix in web app, generate new QR for match 3
3. Scan updated QR
4. Match 3 is replaced, others unchanged
```

## Hardware Requirements

- goBILDA Limelight 3A camera
- Robot Controller phone with SD card access
- Properly configured Limelight in hardware map

## Setup Instructions

### 1. Hardware Configuration

Add the Limelight 3A to your robot configuration:

1. Open Robot Controller app ? Configure Robot
2. Add device: **Limelight 3A**
3. Set name: `limelight` (or update `LIMELIGHT_NAME` in code)
4. Save configuration

### 2. Limelight Pipeline Configuration

Configure Limelight for QR code detection:

1. Connect to Limelight web interface (usually `limelight.local:5801`)
2. Create or select Pipeline 0
3. Set mode to **Barcode/QR Code Detection**
4. Adjust camera settings:
   - **Exposure**: Auto or manual (500-1000 µs works well)
   - **Resolution**: 960x720 or higher for better QR scanning
   - **LED Mode**: On (helps with indoor lighting)
5. Save pipeline

### 3. Install Dependencies

Add Gson to your `build.gradle` (if not already present):

```gradle
dependencies {
    implementation 'com.google.code.gson:gson:2.10.1'
}
```

### 4. Copy Required Files

Copy these files to your TeamCode project:

```
TeamCode/
??? auto/
?   ??? LimelightQRScannerOpMode.java    (NEW - this file)
?   ??? config/
?       ??? AutoConfigParser.java        (existing helper)
?       ??? MatchDataModels.java         (existing helper)
```

## Usage Guide

### Step-by-Step Process

#### 1. Generate QR Codes

From the AutoConfig web app:
1. Configure your match(es)
2. Tap **"Generate QR Code"** or **"Export"**
3. Display QR code on screen or print it

**Tip**: Generate separate QR codes for each match or combine multiple matches into one QR code.

#### 2. Run Scanner OpMode

1. On Robot Controller: Select **"Limelight QR Scanner"** OpMode
2. Initialize and press **Play**
3. You'll see the control screen

#### 3. Scan QR Codes

1. **Position camera** to see QR code clearly
2. Wait for "QR Codes detected" on telemetry
3. Press **A button** to scan
4. Repeat for additional QR codes if needed

#### 4. Save Match Data

1. Review total match count on screen
2. Press **B button** to save unified JSON
3. File saved to: `/sdcard/FIRST/match-data.json`
4. Press **STOP** to exit

### Controls Reference

| Button | Action | Description |
|--------|--------|-------------|
| **A** | Scan QR Code | Captures and parses current QR code |
| **B** | Save & Finish | Saves all scanned matches to JSON file |
| **X** | Clear All | Removes all scanned data (restart) |
| **Y** | Preview QR | Shows raw QR data without saving |

## Telemetry Display

The OpMode provides real-time feedback:

```
Status: Ready / SCANNING...

Limelight: Target detected / No target
QR Codes: 2 detected / None detected

Scanned Matches: 5
Scans: 3

Controls:
> A: Scan QR code
> B: Save & finish
> X: Clear all
> Y: Preview QR
```

## Output Format

The scanner creates a unified JSON file combining all scanned matches:

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
            "startPosition": { "type": "front" },
            "actions": [...]
          }
        }
      }
    },
    {
      "match": {
        "number": 2,
        "alliance": { ... }
      }
    }
  ]
}
```

## Advanced Features

### Scanning Multiple QR Codes

**Scenario**: You have matches split across multiple QR codes (e.g., due to size limits).

1. Scan first QR code (Press A)
2. Scan second QR code (Press A)
3. Scan third QR code (Press A)
4. Save unified file (Press B)

All matches are merged into a single `match-data.json` file.

### Preview Before Saving

To verify QR code content without scanning:

1. Point camera at QR code
2. Press **Y button** (Preview)
3. Review data on telemetry
4. Press **A button** to actually scan if correct

### Recovery from Errors

**Wrong QR code scanned?**
- Press **X** to clear all scans
- Start over

**Limelight not detecting?**
- Check lighting conditions
- Verify QR code is in focus
- Ensure Limelight pipeline is configured for barcodes
- Try moving camera closer/farther

## Customization

### Change Output File Location

Edit the `OUTPUT_FILE` constant:

```java
private static final String OUTPUT_FILE = "/sdcard/FIRST/my-custom-path.json";
```

### Change Limelight Name

If your hardware config uses a different name:

```java
private static final String LIMELIGHT_NAME = "my_limelight";
```

### Process Multiple Barcodes Per Scan

By default, the scanner processes the first detected QR code. To process all:

```java
// In scanQRCode() method, replace:
LLResultTypes.BarcodeResult barcode = barcodes.get(0);

// With a loop:
for (LLResultTypes.BarcodeResult barcode : barcodes) {
    String qrData = barcode.getData();
    // Process each barcode...
}
```

## Troubleshooting

### "Failed to initialize Limelight"

**Cause**: Hardware not found in configuration  
**Solution**: 
- Verify hardware config name matches `LIMELIGHT_NAME`
- Check Limelight is powered and connected
- Restart robot controller

### "No QR codes detected"

**Cause**: Limelight pipeline not configured for barcodes  
**Solution**:
- Access Limelight web interface
- Set pipeline to Barcode/QR Code mode
- Ensure pipeline 0 is active
- Check camera focus and lighting

### "Parse Error"

**Cause**: QR code doesn't contain valid JSON  
**Solution**:
- Use Preview (Y button) to view raw data
- Verify QR code was generated from AutoConfig app
- Check QR code isn't damaged or partially obscured
- Try regenerating QR code from web app

### "No matches in QR code"

**Cause**: JSON is valid but contains no match data  
**Solution**:
- Verify QR code contains match configurations
- Check web app export included match data
- Try re-exporting from web app

### Save Error / "File not found"

**Cause**: Cannot write to file location  
**Solution**:
- Check SD card is mounted
- Verify `/sdcard/FIRST/` directory exists
- Check file permissions
- Try alternative path: `/storage/emulated/0/FIRST/`

### QR Code Too Large

**Cause**: QR code contains too much data  
**Solution**:
- Split matches into multiple QR codes
- Scan each separately (scanner merges them)
- Reduce the number of matches per QR code
- Simplify action configurations

## Best Practices

### Before Competition

1. **Test scan process** with sample QR codes
2. **Verify file location** matches your autonomous OpModes
3. **Check lighting** at competition venue
4. **Print backup QR codes** in case of display issues
5. **Practice scanning** with drive team

### During Competition

1. **Scan early** - Don't wait until last minute
2. **Verify match count** after scanning
3. **Back up previous data** before rescanning
4. **Test autonomous** after scanning new data
5. **Keep QR codes organized** by match number

### Quality Tips

1. **Good Lighting**: Avoid glare and shadows on QR code
2. **Steady Camera**: Hold robot still while scanning
3. **Focus Distance**: 6-12 inches usually works best
4. **QR Code Size**: Larger is better (but must fit on screen)
5. **Clear Display**: Use high brightness, clean screen

## Integration with Autonomous

After scanning and saving match data, use it in your autonomous OpModes:

```java
@Autonomous(name = "Auto Match 1", group = "Competition")
public class AutoMatch1 extends LinearOpMode {
    private static final String MATCH_DATA_FILE = "/sdcard/FIRST/match-data.json";
    private static final int MATCH_NUMBER = 1;
    
    @Override
    public void runOpMode() {
        // Load scanned match data
        AutoConfigParser parser = new AutoConfigParser();
        MatchDataConfig config = parser.parseFile(MATCH_DATA_FILE);
        Match match = parser.getMatchByNumber(config, MATCH_NUMBER);
        
        // Execute autonomous using match data
        waitForStart();
        executeAutonomous(match);
    }
}
```

See [AutoConfigOpModeExample.java](AutoConfigOpModeExample.java) for complete implementation.

## File Structure

After successful scan:

```
/sdcard/FIRST/
??? match-data.json    ? Unified match data (ready for autonomous)
```

Recommended backup structure:

```
/sdcard/FIRST/
??? match-data.json              ? Current/active data
??? backups/
    ??? match-data-2024-12-10-morning.json
    ??? match-data-2024-12-10-afternoon.json
    ??? match-data-2024-12-11.json
```

## Performance Notes

- **Scan Time**: ~1-2 seconds per QR code
- **QR Code Capacity**: Up to ~2000 characters (approx 5-10 matches)
- **Detection Range**: 6-24 inches depending on QR code size
- **Lighting**: Works in most indoor conditions

## Related Documentation

- [AutoConfig Integration Guide](INTEGRATION_GUIDE.md)
- [Match Data Schema](../docs/MATCH_DATA_SCHEMA.md)
- [Example Autonomous OpMode](AutoConfigOpModeExample.java)
- [JSON Schema Definition](../schemas/ftc-match-data-schema.json)

## Support

For issues or questions:
- Check telemetry display for specific error messages
- Review Limelight documentation for camera setup
- Verify JSON format matches AutoConfig schema
- Test with sample QR codes before competition

---

**Version**: 2.4.0  
**Compatible with**: AutoConfig Schema v1.0.0  
**Limelight**: 3A (goBILDA)  
**FTC SDK**: 9.0+
