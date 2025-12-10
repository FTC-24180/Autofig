# Troubleshooting: White Page Issue

## Problem
App shows only a white page after recent changes.

## Fixed Issues
? **Missing function** - Added `handleSelectMatch` function to App.jsx
? **Build successful** - No compilation errors

## Steps to Fix White Page

### 1. Clear Browser Cache
**Chrome/Edge:**
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"

**Or use Hard Refresh:**
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### 2. Check Browser Console
1. Open Developer Tools: `F12` or `Ctrl + Shift + I`
2. Go to **Console** tab
3. Look for any error messages (usually in red)
4. Share any errors you see

### 3. Check Network Tab
1. Open Developer Tools: `F12`
2. Go to **Network** tab
3. Refresh the page
4. Check if all files are loading (status should be 200)
5. Look for any failed requests (status 404 or 500)

### 4. Restart Dev Server
```bash
# Stop the current server (Ctrl + C)
# Then restart:
npm run dev
```

### 5. Delete node_modules and Rebuild
```bash
# Stop server if running
# Delete dependencies
rm -rf node_modules
rm -rf dist

# Reinstall
npm install

# Rebuild
npm run build

# Start dev server
npm run dev
```

### 6. Check for React Errors
Look for these common issues in console:

**Issue:** "Cannot read property 'X' of undefined"
- **Cause:** Missing prop or null data
- **Fix:** Check that all props are passed correctly

**Issue:** "X is not a function"
- **Cause:** Missing function or wrong prop name
- **Fix:** Verified - all functions now present in App.jsx

**Issue:** "Maximum update depth exceeded"
- **Cause:** Infinite loop in useEffect
- **Fix:** Check useEffect dependencies

### 7. Check index.html
Make sure `index.html` has the root div:

```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
```

### 8. Check main.jsx
Should mount React app:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## Common Causes of White Page

### 1. JavaScript Error
- **Symptom:** White page, errors in console
- **Solution:** Check console, fix errors

### 2. CSS Issue
- **Symptom:** White page, no errors
- **Solution:** Check if CSS is loading in Network tab

### 3. Routing Issue
- **Symptom:** White page on certain URLs
- **Solution:** Check vite.config.js base path

### 4. Build Path Issue
- **Symptom:** Works in dev, not in production
- **Solution:** Check public path configuration

## Verification Steps

### After Fixing:

1. **See the header?**
   - Should show "FTC AutoConfig"
   - Should show match number and alliance

2. **See the hamburger menu button?**
   - Should be in top-right corner
   - Should have ? icon

3. **See the step content?**
   - Should show "Match Configuration" 
   - Should have input field for match number

4. **See the navigation?**
   - Should be at bottom
   - Should have Back/Next buttons
   - Should show step dots

## What Should Be Visible

```
????????????????????????????????????
? FTC AutoConfig           [?]    ? ? Header
? Match #1 • ?? RED                ?
????????????????????????????????????
?                                  ?
? Match Configuration              ? ? Step content
?                                  ?
? [Input field]                    ?
?                                  ?
????????????????????????????????????
? [? Back]  ??????  [Next ?]      ? ? Navigation
????????????????????????????????????
```

## Quick Test Commands

```bash
# Check if dev server is running
curl http://localhost:3001/AutoConfig/

# Check build output
ls -la dist/

# Check for errors in build
npm run build 2>&1 | grep -i error

# Start fresh dev server
npm run dev
```

## If Still White Page

### Send These Details:

1. **Browser Console Output:**
   - Copy all errors from console
   - Include stack traces

2. **Network Tab:**
   - Screenshot of Network tab
   - Which files failed to load?

3. **Browser & OS:**
   - Browser name and version
   - Operating system

4. **Server Output:**
   - Copy output from `npm run dev`
   - Any errors or warnings?

5. **Build Output:**
   - Copy output from `npm run build`
   - Any errors or warnings?

## Recent Changes Made

### Files Modified:
- ? `src/App.jsx` - Added `handleSelectMatch` function
- ? `src/components/HamburgerMenu.jsx` - Complete rewrite with match management

### Changes Applied:
- ? Hamburger menu now shows matches first
- ? Configuration moved to submenu
- ? Removed separate Match Manager button
- ? Added missing function reference

### Build Status:
- ? No compilation errors
- ? Build successful (271.18 kB)
- ? All imports resolved

## Next Steps

1. **Clear browser cache** (most common fix)
2. **Hard refresh** with Ctrl+Shift+R
3. **Check console** for error messages
4. **Try different browser** to rule out browser-specific issues
5. **Restart dev server** if still running old code

If problem persists after these steps, please share:
- Console errors
- Network tab screenshot
- Output from `npm run dev`
