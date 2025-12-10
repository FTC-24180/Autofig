# Clear All Data Feature

## Overview

Added a "Clear All Data" command to the hamburger menu that completely clears localStorage with double confirmation for safety.

## Location

**Hamburger Menu (?) ? Tools ? Danger Zone ? Clear All Data**

```
? Menu
?? MATCHES
?  ?? [Match list]
?
?? TOOLS
   ?? Configuration
   ?? Export All Matches
   ?? Save as Template
   ?? Load Template
   ?
   ?? DANGER ZONE ??
      ?? Clear All Data
```

## What It Does

Permanently deletes all stored data:
- ? All configured matches
- ? All saved templates
- ? All custom action groups
- ? All start positions
- ? Current match selection
- ? All other localStorage data

## Safety Features

### Double Confirmation

**First Prompt:**
```
?? Clear All Data?

This will permanently delete:
• All configured matches
• All saved templates
• All custom action groups
• All start positions

This action cannot be undone!

Are you sure you want to continue?
```

**Second Prompt (if user clicks OK):**
```
?? FINAL CONFIRMATION

This will delete ALL data. Are you absolutely sure?
```

**Success Message:**
```
? All data cleared successfully!

The page will now reload.
```

## User Workflow

1. Open hamburger menu (?)
2. Scroll to bottom "Danger Zone" section
3. Click **"Clear All Data"** button
4. Read first confirmation prompt
5. Click **OK** to continue (or **Cancel** to abort)
6. Read second confirmation prompt
7. Click **OK** to confirm (or **Cancel** to abort)
8. Data is cleared
9. Success message appears
10. Page automatically reloads
11. App initializes with default settings

## UI Design

### Danger Zone Section

```
????????????????????????????????????
? DANGER ZONE                      ? ? Red text
????????????????????????????????????
? ???????????????????????????????? ?
? ? ??  Clear All Data           ? ? ? Red background
? ?     Delete everything and    ? ?   Red border
? ?     reset app                ? ?
? ???????????????????????????????? ?
????????????????????????????????????
```

### Visual Styling

**Section Header:**
- Text: `text-red-600` (red)
- Font: Semibold, uppercase, tracked
- Border: `border-red-200` (light red separator)

**Button:**
- Background: `bg-red-50` (light red)
- Hover: `bg-red-100` (slightly darker red)
- Active: `bg-red-200` (even darker red)
- Border: `border-red-300` 2px solid
- Icon: Warning triangle (??)
- Text: Red color scheme
- Height: 48px minimum (touch-friendly)

## Code Implementation

### Key Function

```javascript
const handleClearAllData = () => {
  // First confirmation
  const confirmed = confirm(
    '?? Clear All Data?\n\n' +
    'This will permanently delete:\n' +
    '• All configured matches\n' +
    '• All saved templates\n' +
    '• All custom action groups\n' +
    '• All start positions\n\n' +
    'This action cannot be undone!\n\n' +
    'Are you sure you want to continue?'
  );

  if (confirmed) {
    // Second confirmation
    const doubleConfirm = confirm(
      '?? FINAL CONFIRMATION\n\n' +
      'This will delete ALL data. Are you absolutely sure?'
    );

    if (doubleConfirm) {
      try {
        // Clear all localStorage
        localStorage.clear();
        
        // Show success message
        alert('? All data cleared successfully!\n\nThe page will now reload.');
        
        // Reload to reinitialize
        window.location.reload();
      } catch (error) {
        alert('? Error clearing data: ' + error.message);
      }
    }
  }
};
```

## Use Cases

### 1. Fresh Start
**Scenario:** Want to start completely over with clean slate

**Steps:**
1. Clear All Data
2. Confirm twice
3. Page reloads with defaults
4. Configure from scratch

### 2. Troubleshooting
**Scenario:** App behaving strangely, suspected corrupted data

**Steps:**
1. Export current matches (backup)
2. Clear All Data
3. App resets to clean state
4. Re-import if needed

### 3. Season Transition
**Scenario:** New FTC season, new game, need fresh configuration

**Steps:**
1. Export previous season's config (archive)
2. Clear All Data
3. Configure for new game
4. Build new action groups

### 4. Device Handoff
**Scenario:** Switching devices, want clean slate on new device

**Steps:**
1. On old device: Export matches
2. On new device: Clear All Data (if any residual data)
3. Import matches from old device

### 5. Demo/Training
**Scenario:** Showing app to new team members

**Steps:**
1. After demo, Clear All Data
2. Returns to clean state
3. Ready for next demo

## What Happens After Clear

### Immediate Effects
1. All localStorage keys deleted
2. Success alert shown
3. Page reloads automatically

### On Page Reload
1. **useMatches**: Creates first default match
2. **useActionGroups**: Loads default action groups
3. **useStartPositions**: Loads default positions
4. **usePresets**: Empty templates list
5. App initializes fresh

### Default State
```javascript
// Default first match
{
  id: "new-uuid",
  matchNumber: 1,
  partnerTeam: "",
  alliance: "red",
  startPosition: { type: "front" },
  actions: []
}
```

## Error Handling

### Try-Catch Block
```javascript
try {
  localStorage.clear();
  alert('? Success!');
  window.location.reload();
} catch (error) {
  alert('? Error: ' + error.message);
}
```

### Possible Errors
- **QuotaExceededError**: localStorage full (unlikely during clear)
- **SecurityError**: localStorage disabled
- **Other**: Browser-specific issues

### Fallback
If error occurs:
- Error alert shows specific message
- Page does NOT reload
- User can try again or troubleshoot

## Testing

### Test Case 1: Cancel at First Prompt
1. Click "Clear All Data"
2. Click **Cancel** on first prompt
3. **Expected**: Nothing happens, data preserved
4. **Verify**: Matches still exist

### Test Case 2: Cancel at Second Prompt
1. Click "Clear All Data"
2. Click **OK** on first prompt
3. Click **Cancel** on second prompt
4. **Expected**: Nothing happens, data preserved
5. **Verify**: Matches still exist

### Test Case 3: Complete Clear
1. Click "Clear All Data"
2. Click **OK** on first prompt
3. Click **OK** on second prompt
4. **Expected**: Success message appears
5. **Expected**: Page reloads
6. **Verify**: All data gone, fresh match created

### Test Case 4: Visual Design
1. Open hamburger menu
2. Scroll to bottom
3. **Verify**: "Danger Zone" section visible
4. **Verify**: Red color scheme
5. **Verify**: Warning icon present
6. **Verify**: Clear descriptive text

## Mobile Optimization

### Touch Target
- Button height: **48px** minimum
- Full-width button
- Large tap area
- Clear visual feedback on tap

### Text Size
- Main text: **font-medium** (readable)
- Subtitle: **text-xs** (supplementary)
- All text accessible

### Scrolling
- Danger Zone at bottom of menu
- Requires scrolling (intentional)
- Reduces accidental clicks
- User must actively seek it

## Safety Considerations

### Why Double Confirmation?

1. **Prevents accidents**: Easy to misclick
2. **Forces reading**: User must read both prompts
3. **Time to think**: Two decision points
4. **Industry standard**: Common for destructive actions

### Visual Warnings

1. **Red color scheme**: Universal danger indicator
2. **Warning icon**: ?? draws attention
3. **"Danger Zone" label**: Clear categorization
4. **Explicit text**: "Delete everything"

### Position

Located at bottom of menu:
- Not immediately visible
- Requires deliberate navigation
- Separated from common actions
- Behind scroll (on mobile)

## Alternatives Considered

### Single Confirmation
? **Rejected**: Too easy to accidentally confirm

### Password/Pin Protection
? **Rejected**: Overcomplicated for this use case

### "Are you sure?" checkbox
? **Rejected**: Less clear than native confirm dialogs

### Undo feature
? **Rejected**: Complex to implement, defeats purpose

### Selected Double Confirmation ?
**Chosen**: Good balance of safety and usability

## Documentation for Users

### Quick Guide

**To reset the app completely:**

1. Open menu (? top-right)
2. Scroll to "Danger Zone" at bottom
3. Tap "Clear All Data"
4. Read warning carefully
5. Confirm twice
6. App resets and reloads

**Warning:** This cannot be undone! Export your matches first if you want to keep them.

## Build Status

```
? Build successful: 273.08 kB (81.03 kB gzipped)
? No compilation errors
? Feature ready to use
```

## Summary

? **Added "Clear All Data"** command to hamburger menu
? **Double confirmation** prevents accidents
? **Danger Zone section** clearly marked with red styling
? **Complete reset** - deletes all localStorage
? **Auto-reload** - fresh start after clear
? **Error handling** - catches and displays errors
? **Touch-optimized** - 48px button height
? **Safe design** - positioned at bottom, requires scrolling

The feature provides a safe, clear way to completely reset the app when needed! ??
