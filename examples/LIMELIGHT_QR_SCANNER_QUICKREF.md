# Limelight QR Scanner - Quick Reference

## Setup Checklist

- [ ] Limelight 3A configured in hardware map as `limelight`
- [ ] Pipeline 0 set to Barcode/QR Code detection mode
- [ ] Gson dependency added to build.gradle
- [ ] Helper classes copied to TeamCode
- [ ] QR codes generated from AutoConfig web app

## ? Match Number = Primary Key

**Important:** When scanning multiple QR codes:
- Match numbers are used as primary keys
- **Later scans OVERWRITE earlier scans** for same match number
- Allows incremental updates and corrections

**Example:**
```
Scan 1: Matches 1, 3, 4, 7
Scan 2: Matches 1, 5, 6, 7, 8
Result: 1(new), 3, 4, 5, 6, 7(new), 8
```

**Use Cases:**
- ? Update specific match without rescanning all
- ? Add matches incrementally
- ? Fix errors in individual matches

## Controls

| Button | Action |
|--------|--------|
| **A** | Scan current QR code |
| **B** | Save all & finish |
| **X** | Clear all scans |
| **Y** | Preview QR data |

## Workflow

```
1. Run "Limelight QR Scanner" OpMode
2. Point camera at QR code (6-12 inches)
3. Wait for "QR Codes detected"
4. Press A to scan
5. Repeat for more QR codes
6. Press B to save to /sdcard/FIRST/match-data.json
7. Use saved file in autonomous OpModes
```

## Telemetry Status

| Message | Meaning |
|---------|---------|
| "Target detected" | Limelight sees something |
| "QR Codes: X detected" | Ready to scan |
| "SCANNING..." | Processing QR code |
| "Success! Scanned X match(es)" | QR code added |
| "Scanned Matches: X" | Total matches collected |

## Common Issues

| Problem | Solution |
|---------|----------|
| No QR codes detected | Check pipeline mode, lighting, focus |
| Parse Error | Verify QR is from AutoConfig app |
| Save Error | Check /sdcard/FIRST/ directory exists |
| Limelight not found | Verify hardware config name |

## File Output

- **Location**: `/sdcard/FIRST/match-data.json`
- **Format**: Unified JSON with all scanned matches
- **Schema**: AutoConfig v1.0.0
- **Use in**: Any autonomous OpMode with AutoConfigParser

## Tips

? Scan in good lighting  
? Hold camera steady  
? Keep QR code flat and visible  
? Test scan before competition  
? Back up previous data  
? Verify match count after scanning  

## Limelight Pipeline Settings

```
Mode: Barcode/QR Code
Resolution: 960x720 or higher
Exposure: Auto or 500-1000 µs
LED Mode: On
Pipeline: 0
```

## Integration Example

```java
@Autonomous(name = "Auto Match 1")
public class AutoMatch1 extends LinearOpMode {
    // Use scanned data
    AutoConfigParser parser = new AutoConfigParser();
    MatchDataConfig config = parser.parseFile(
        "/sdcard/FIRST/match-data.json"
    );
    Match match = parser.getMatchByNumber(config, 1);
}
```

---

**For detailed documentation**, see: [LIMELIGHT_QR_SCANNER_GUIDE.md](LIMELIGHT_QR_SCANNER_GUIDE.md)
