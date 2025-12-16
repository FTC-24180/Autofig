# QR Scanner Update - Match Number as Primary Key

## Summary

Updated `LimelightQRScannerOpMode` to treat **match number as the primary key** when merging multiple scanned QR codes.

**Version**: 2.6.0  
**Date**: December 2024  
**Status**: Enhanced merge behavior

---

## What Changed

### Before (Simple Append)
```java
// Old behavior: just added all matches
for (MatchDataConfig config : configs) {
    unified.matches.addAll(config.matches);
}
// Result: Could have duplicate match numbers
```

### After (Smart Merge)
```java
// New behavior: match number is primary key
Map<Integer, MatchWrapper> matchMap = new LinkedHashMap<>();

for (MatchDataConfig config : configs) {
    for (MatchWrapper wrapper : config.matches) {
        int matchNumber = wrapper.match.number;
        matchMap.put(matchNumber, wrapper);  // Overwrites if exists
    }
}

unified.matches.addAll(matchMap.values());
// Result: Each match number appears exactly once
```

---

## Behavior

### Match Number as Primary Key

When scanning multiple QR codes, matches are merged based on their match number:
- **Later scans overwrite earlier scans** for the same match number
- Each match number appears exactly once in the final result
- Order is preserved (first occurrence)

### Example Scenario

**Step 1: First Scan**
- QR Code contains: Matches 1, 3, 4, 7
- Result: `{1, 3, 4, 7}`

**Step 2: Second Scan**
- QR Code contains: Matches 1, 5, 6, 7, 8
- Result: `{1(updated), 3, 4, 5, 6, 7(updated), 8}`

**Explanation:**
- Match 1: Overwritten by second scan
- Match 3, 4: Kept from first scan
- Match 5, 6, 8: Added from second scan
- Match 7: Overwritten by second scan

---

## Benefits

### 1. Incremental Updates ?
```
Morning: Scan matches 1-5
Afternoon: Scan matches 6-10
Result: All matches 1-10 saved
```

### 2. Error Correction ?
```
Problem: Match 3 has wrong configuration
Solution: 
  1. Fix match 3 in web app
  2. Generate QR with only match 3
  3. Scan it
  4. Match 3 updated, others unchanged
```

### 3. Selective Updates ?
```
Scenario: Strategy change for match 5 only
Solution:
  1. Update match 5 in web app
  2. Generate QR with only match 5
  3. Scan and save
  4. Match 5 updated, matches 1-4, 6+ unchanged
```

### 4. No Duplicate Matches ?
```
Before: Could accidentally have multiple Match #3
After: Only one Match #3, latest version
```

---

## Use Cases

### Use Case 1: Incremental Building
**Perfect for:** Building match schedule throughout competition day

```
9:00 AM:  Scan matches 1-3
11:00 AM: Scan matches 4-6
1:00 PM:  Scan matches 7-9
3:00 PM:  Scan matches 10-12

Result: Have all 12 matches, built incrementally
```

---

### Use Case 2: Quick Fix
**Perfect for:** Fixing mistakes without full rescan

```
Problem: Realized match 5 has wrong start position

Fix:
1. Update match 5 in AutoConfig app
2. Generate QR code with ONLY match 5
3. Scan QR code (30 seconds)
4. Press B to save

Result: Match 5 fixed, other 11 matches unchanged
Time: < 1 minute
```

---

### Use Case 3: Strategy Updates
**Perfect for:** Last-minute strategy changes

```
Between matches: Coach decides to change approach for next match

Quick update:
1. Modify match configuration in app
2. Generate QR code
3. Scan on robot
4. Updated and ready

No need to:
- Rescan all matches ?
- Connect USB cable ?
- Redeploy code ?
```

---

### Use Case 4: Multiple Strategy Iterations
**Perfect for:** Testing and refining strategies

```
Iteration 1: Scan matches 1-5 with initial strategy
Test Match 3, doesn't work well

Iteration 2: Update Match 3 strategy, rescan only Match 3
Test again

Iteration 3: Update Match 3 again, rescan only Match 3
Now it works!

Result: Refined Match 3 without touching Matches 1-2, 4-5
```

---

## Technical Details

### Implementation

```java
private MatchDataConfig mergeConfigs(List<MatchDataConfig> configs) {
    MatchDataConfig unified = new MatchDataConfig();
    unified.version = SCHEMA_VERSION;
    unified.matches = new ArrayList<>();
    
    // Use LinkedHashMap to maintain order + handle duplicates
    Map<Integer, MatchWrapper> matchMap = new LinkedHashMap<>();
    
    // Process configs in order
    for (MatchDataConfig config : configs) {
        if (config.matches != null) {
            for (MatchWrapper wrapper : config.matches) {
                if (wrapper.match != null) {
                    int matchNumber = wrapper.match.number;
                    // Overwrites if match number already exists
                    matchMap.put(matchNumber, wrapper);
                }
            }
        }
    }
    
    // Convert back to list (maintains insertion order)
    unified.matches.addAll(matchMap.values());
    
    return unified;
}
```

### Key Points

1. **LinkedHashMap**: Maintains insertion order while allowing overwrites
2. **Match Number**: Extracted from `wrapper.match.number`
3. **Overwrite**: `map.put()` replaces if key exists
4. **Order Preserved**: First occurrence of match number determines position

---

## Telemetry Updates

### Success Message

```
SUCCESS!

Saved: 8 match(es)
Match Numbers: [1, 3, 4, 5, 6, 7, 8, 9]
File: /sdcard/FIRST/match-data.json

Note: Duplicate match numbers overwritten
Ready for autonomous!

Press STOP to exit
```

### What's New

- **Match Numbers**: Shows sorted list of final match numbers
- **Note**: Reminds user that duplicates were overwritten
- Clear indication of what was saved

---

## Migration

### No Code Changes Needed

Existing usage works exactly the same:
```java
// Your existing code still works
@Autonomous(name = "My Auto")
public class MyAuto extends SelectableConfigAutoOpMode {
    // No changes needed
}
```

### What's Better

1. **More flexible**: Can update individual matches
2. **More efficient**: No need to rescan everything
3. **Less error-prone**: No duplicate match numbers
4. **Better workflow**: Incremental building supported

---

## Documentation Updated

### Files Updated

1. **`LimelightQRScannerOpMode.java`**
   - Updated `mergeConfigs()` method
   - Updated `saveAndFinish()` telemetry
   - Added match number display

2. **`LIMELIGHT_QR_SCANNER_GUIDE.md`**
   - Added "Match Number as Primary Key" section
   - Added merge behavior explanation
   - Added use case examples

3. **`LIMELIGHT_WORKFLOW.md`**
   - Updated data flow diagram
   - Added new use cases (incremental, error correction)
   - Updated existing use cases

4. **`LIMELIGHT_QR_SCANNER_QUICKREF.md`**
   - Added merge behavior callout
   - Added example
   - Added use case summary

5. **`QR_SCANNER_MERGE_UPDATE.md`** (this file)
   - Complete update documentation

---

## Examples

### Example 1: Build Schedule Incrementally

```
Day Before Competition:
- Configure matches 1-5
- Generate QR, scan, save

Morning of Competition:
- Learn matches 6-10
- Generate QR, scan, save
- Now have all 1-10

Between Matches:
- Update match 3 strategy
- Generate QR with only match 3, scan, save
- Match 3 updated, all others unchanged
```

### Example 2: Fix Multiple Matches

```
Initial: Matches 1-10 configured

Realize:
- Match 3 has wrong start position
- Match 7 has wrong alliance color
- Match 9 needs extra action

Fix:
1. Update matches 3, 7, 9 in web app
2. Generate QR code with only matches 3, 7, 9
3. Scan QR code
4. Save

Result: Matches 3, 7, 9 updated, all others unchanged
```

### Example 3: A/B Testing Strategies

```
Test Strategy A for Match 5:
1. Configure match 5 with strategy A
2. Scan and save
3. Run in practice

Test Strategy B for Match 5:
4. Configure match 5 with strategy B
5. Scan and save (overwrites strategy A)
6. Run in practice

Choose best strategy:
7. Configure match 5 with winning strategy
8. Scan and save (final version)
```

---

## Backward Compatibility

? **Fully Backward Compatible**

- Existing QR codes work exactly the same
- No changes needed to autonomous OpModes
- Single-scan usage unchanged
- Multi-scan behavior improved

---

## Testing

### Test Scenario 1: Sequential Scans
```
Scan 1: Match 1, 2, 3
Scan 2: Match 4, 5, 6
Expected: [1, 2, 3, 4, 5, 6] ?
```

### Test Scenario 2: Overlapping Scans
```
Scan 1: Match 1, 2, 3
Scan 2: Match 3, 4, 5
Expected: [1, 2, 3(updated), 4, 5] ?
```

### Test Scenario 3: Complete Overwrite
```
Scan 1: Match 1, 2, 3
Scan 2: Match 1, 2, 3 (different configs)
Expected: [1(new), 2(new), 3(new)] ?
```

### Test Scenario 4: Single Update
```
Scan 1: Match 1-10
Scan 2: Match 5 only
Expected: [1, 2, 3, 4, 5(new), 6, 7, 8, 9, 10] ?
```

---

## Summary

### What You Get

? **Smart Merge**: Match numbers are primary keys  
? **Incremental Updates**: Add matches over time  
? **Selective Updates**: Update specific matches only  
? **Error Correction**: Fix mistakes without full rescan  
? **No Duplicates**: Each match number appears once  
? **Order Preserved**: Consistent ordering  
? **Better Telemetry**: See what was saved  

### What Changed

?? Merge logic improved  
?? Telemetry enhanced  
?? Documentation updated  
? Backward compatible  

---

**Version**: 2.6.0  
**Status**: Production Ready  
**Benefit**: More flexible and efficient match data management ??
