# FTC AutoConfig

A Progressive Web App (PWA) for configuring FTC autonomous routines. Built with React and TailwindCSS, this mobile-first application helps teams quickly create, manage, and deploy autonomous configurations for multiple matches.

## Current Version: 2.6.0

**Live App**: https://AutoConfig.bluebananas.org

---

## Table of Contents

### For Users
- [Quick Start](#quick-start)
- [Settings](#settings)
- [Advanced Configuration](#advanced-configuration)
- [QR Code Format](#qr-code-format)
- [Data Management](#data-management)
- [Troubleshooting](#troubleshooting)

### For Developers
- [Development](#development)
- [Deployment & Versioning](#deployment--versioning)
- [Support](#support)

---

## Deployment & Versioning

### Releasing a New Version

**Quick Steps**:
1. **Edit** `public/version.js` and increment the version:
   ```javascript
   export const VERSION = '2.6.0'; // Change this number
   ```

2. **Commit and Push**:
   ```bash
   git add public/version.js
   git commit -m "Release v2.7.0"
   git push origin main
   ```

3. **Auto-Deploy**: GitHub Actions automatically builds and deploys to GitHub Pages
4. **Users Auto-Update**: Within minutes of returning to the app, users see an "Update Available" notification

**Version Guidelines** (Semantic Versioning):
- **PATCH** (2.6.0 ? 2.6.1): Bug fixes, typos, minor tweaks
- **MINOR** (2.6.0 ? 2.7.0): New features, improvements, UI changes
- **MAJOR** (2.6.0 ? 3.0.0): Breaking changes, major redesign, data structure changes

**Single Source of Truth**: `public/version.js` - Version is automatically injected into service worker during build

### Automatic Deployment (GitHub Pages)

The app automatically deploys to GitHub Pages when changes are pushed to the `main` branch:

1. **Push to Main**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **GitHub Actions**:
   - Workflow runs automatically (`.github/workflows/deploy.yml`)
   - Builds the app with `npm run build`
   - Deploys to `gh-pages` branch
   - Live at: `https://ftc-24180.github.io/AutoConfig/`

3. **Check Deployment**:
   - View progress: GitHub ? Actions tab
   - Typical deployment time: 2-3 minutes

### Manual Deployment

#### To GitHub Pages

```bash
npm run build
npm install -g gh-pages  # If not already installed
gh-pages -d dist
```

#### To Other Hosting Services

1. **Build the App**:
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to your hosting provider:
   - **Netlify**: Drag `dist/` to Netlify drop zone
   - **Vercel**: `vercel --prod`
   - **Firebase**: `firebase deploy`
   - **AWS S3**: Upload to S3 bucket with static hosting enabled

3. **Configure Base Path** (if not at root):
   - Edit `vite.config.js`
   - Set `base: '/your-path/'`
   - Rebuild

### Auto-Update System

The app uses a smart update system that eliminates the need for hard refreshes:

- **When Deployed**: New version is automatically detected when users return to the app
- **User Experience**: "Update Available" notification with one-click update
- **No Data Loss**: All matches, templates, and settings are preserved
- **No Manual Cache Clearing**: Service worker handles everything automatically

**What Users See**:
1. Deploy new version (after incrementing `public/version.js`)
2. User switches back to app tab ? Update detected
3. Banner appears: "Update Available! (v2.7.0)"
4. User clicks "Update Now" ? App reloads with new version
5. Done! No hard refresh or cache clearing needed

### PWA Installation

Once deployed, users can install the app:

- **iOS**: Safari ? Share ? Add to Home Screen
- **Android**: Chrome ? Menu ? Install App
- **Desktop**: Chrome ? Address bar ? Install icon

## Quick Start

### Using the App

1. **Create Your First Match**
   - Open the app and click "Create Your First Match"
   - Or use the hamburger menu (?) in the top-right to add matches

2. **Configure Match Details** (Step 1)
   - Enter the match number
   - Add your partner team number (optional)
   - Select your alliance color (Red or Blue)
   - All match setup combined in one convenient step

3. **Choose Starting Position** (Step 2)
   - Select from preset positions (or custom positions you've configured)
   - Or choose "Custom" to enter specific X, Y, and ? (theta) coordinates
   - Units display in your preference (inches/meters, degrees/radians)

4. **Build Action Sequence** (Step 3)
   - Tap action group headers to expand them (Actions or Wait)
   - Tap individual actions to add them to your sequence
   - Drag and drop actions to reorder them
   - Configure action-specific parameters (like wait times) using inline text fields
   - Wait times support natural language: "2.5s", "500ms", "1 second"
   - Use "Clear All" to start over if needed

5. **Generate QR Code** (Step 4)
   - View the QR code for the current match (terse format)
   - If you have multiple matches, swipe left/right or tap the indicator dots to navigate
   - Scan the QR code with your robot's Limelight camera
   - Or download all matches as JSON for backup/debugging

### Managing Multiple Matches

- **Add Match**: Use the hamburger menu (?) ? "Add" button
- **Switch Matches**: Tap any match in the hamburger menu list
- **Duplicate Match**: Tap the duplicate icon on any match in the menu
- **Delete Match**: Tap the delete (trash) icon on any match in the menu
- **QR Navigation**: On the QR Code step, swipe left/right between matches or tap the indicator dots

### Storing Configurations

Save time by creating reusable configurations (action groups and start positions):

1. Configure your actions and start positions
2. Open hamburger menu ? Configuration ? Save Template
3. Enter a name for the configuration
4. Tap "Save"
5. Load configurations later via hamburger menu ? Configuration ? Configurations

**What's Saved in Templates**:
- ? Action groups and custom actions
- ? Start positions
- ? Match data (matches are separate from templates)

## Settings

### Appearance

Change the app theme via hamburger menu ? Settings ? Appearance:
- **System**: Follows your device's dark/light mode preference
- **Light**: Always use light mode
- **Dark**: Always use dark mode

### Distance Units
Toggle display units between Inches and Meters via hamburger menu ? Settings

### Angle Units
Toggle between Degrees and Radians via hamburger menu ? Settings

## Advanced Configuration

### Managing Action Groups

Action groups organize related actions (Actions, Wait). The app comes with two fixed groups:

1. **Actions Group**: Custom actions you define (A1, A2, A3, etc.)
2. **Wait Group**: Contains the Wait action for pauses in your sequence

**Note**: Group structure is fixed to these two categories. You can add/remove actions within the Actions group.

### Managing Actions

Actions are the individual steps in your autonomous routine:

1. Open hamburger menu (?) ? Configuration ? Configure Actions
2. **Add an Action**:
   - Action ID is auto-generated (A1, A2, A3, etc.)
   - Enter a display label (e.g., "Score Specimen", "Park")
   - Optionally add configuration fields (parameters for the action)
   - Tap "Add"
3. **Edit an Action**: Modify the label or configuration fields
4. **Delete an Action**: Tap the trash icon next to the action
5. **Multiple Wait Actions**: You can add Wait actions multiple times in a sequence

### Exporting Configuration

Export your custom action groups and start positions (not match data):

1. Navigate to Configure Actions or Start Positions
2. Tap "Export" button
3. A JSON file will download with your configuration
4. Share this file with your team or use it to restore configurations

**Note**: This exports only action/position definitions, not your matches. To export matches, use "Matches ? Export All Matches" in the hamburger menu.

### Managing Start Positions

Customize preset starting positions:

1. Open hamburger menu (?) ? Configuration ? Start Positions
2. **Add a Position**:
   - Start Position ID is auto-generated (S1, S2, S3, etc.)
   - Enter display label (e.g., "Left Side", "Far Corner")
   - Tap "Add Position"
3. **Edit a Position**: Modify the label
4. **Delete a Position**: Tap the trash icon

**Note**: The "Custom" position (S0) with X, Y, ? fields is always available and cannot be removed.

### Backup & Restore

**Backup**:
1. **Matches**: Hamburger menu ? Matches ? "Export All Matches" (saves all match data as JSON)
2. **Configuration**: Hamburger menu ? Configuration ? "Export" (saves action groups and start positions)
3. Save both JSON files to a safe location (cloud storage, USB drive, etc.)

**Restore**:
- **Matches**: Currently no import feature (coming soon) - use Configuration templates for reusable setups
- **Configuration**: Hamburger menu ? Configuration ? Configurations ? Load a saved template

**Best Practice**: Export your matches before major changes or clearing data.

## Data Management

### Clearing Data

**Warning**: This permanently deletes all matches, templates, and configurations from your browser!

1. Hamburger menu (?) ? Settings ? Scroll to "Danger Zone"
2. Tap "Clear All Data"
3. Choose what to clear (matches, templates, action groups, start positions, preferences)
4. Confirm twice (safety mechanism)
5. App reloads with default settings

**What Gets Cleared**:
- ? All match configurations
- ? Configuration templates (optional)
- ? Custom action groups (optional)
- ? Custom start positions (optional)
- ? Theme preference (optional)
- ? Units preferences (optional)

## Troubleshooting

### App won't load / Blank screen
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Check browser console (F12) for errors

### Changes not appearing in dev mode
- Restart dev server: `Ctrl+C`, then `npm run dev`
- Check that you're editing files in the correct directory

### Build fails with Node.js version error
- Upgrade Node.js to version 20.19+ or 22.12+
- Check version: `node --version`

### QR code won't scan
- Ensure adequate lighting
- Hold camera steady and fill most of the viewfinder with the QR code
- Try increasing screen brightness
- For Limelight: Ensure pipeline 0 is configured for barcode detection
- Alternative: Download JSON instead and transfer via USB/ADB

### Terse format decode errors in OpMode
- Verify you're using the latest TerseMatchDecoder.java from examples/
- Check that action IDs in the app match your OpMode's switch statement
- Ensure start position keys (S1, S2, etc.) are configured correctly
- See examples/TERSE_FORMAT.md for format specification

### Update notification not appearing after deployment
- Verify you incremented the version in `public/version.js`
- Check browser console for service worker logs
- Try closing and reopening the app tab
- Wait a few moments after deployment (service worker needs time to register)

---

## Development

This section is for developers working on the AutoConfig codebase.

### Prerequisites

- **Node.js**: Version 20.19+ or 22.12+ (Vite requirement)
- **npm**: Comes with Node.js

### Setup

#### Using Visual Studio

1. **Open the Solution**:
   - Open Visual Studio
   - File ? Open ? Project/Solution
   - Select `AutoConfig.sln` (if present) or open the folder directly

2. **Install Dependencies**:
   - Open the integrated terminal (View ? Terminal)
   - Run: `npm install`

3. **Start Development Server**:
   - Run: `npm run dev`
   - Or use Task Runner Explorer if configured
   - App will be available at `http://localhost:5173/`

4. **Build for Production**:
   - Run: `npm run build`
   - Built files appear in the `dist/` directory

#### Using Command Line (Non-IDE)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/FTC-24180/AutoConfig.git
   cd AutoConfig
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   - App will be available at `http://localhost:5173/`
   - Hot Module Replacement (HMR) is enabled for instant updates

4. **Build for Production**:
   ```bash
   npm run build
   ```
   - Optimized files are generated in `dist/`
   - Includes tree-shaking, minification, and asset optimization

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```
   - Test the production build locally before deployment

### Project Structure

```
AutoConfig/
??? public/                      # Static assets
?   ??? manifest.json           # PWA manifest
?   ??? sw.js                   # Service worker
?   ??? version.js              # App version (single source of truth)
?   ??? icon-512.svg            # App icon
?   ??? vite.svg                # Vite logo
??? src/
?   ??? components/             # React components
?   ?   ??? common/            # Reusable components
?   ?   ?   ??? AddItemForm.jsx
?   ?   ?   ??? BaseModal.jsx
?   ?   ?   ??? InlineAddForm.jsx
?   ?   ??? config/            # Configuration management
?   ?   ?   ??? ActionsConfigContent.jsx
?   ?   ?   ??? StartPositionsConfigContent.jsx
?   ?   ??? menu/              # Menu components
?   ?   ?   ??? ConfigurationMenu.jsx
?   ?   ?   ??? MatchesMenu.jsx
?   ?   ?   ??? SettingsMenu.jsx
?   ?   ?   ??? TemplatesMenu.jsx
?   ?   ??? steps/             # Wizard step components
?   ?   ?   ??? Step1MatchSetup.jsx    # Match details (number, team, alliance)
?   ?   ?   ??? Step4StartPosition.jsx # Start position selection
?   ?   ?   ??? Step5Actions.jsx       # Action sequence builder
?   ?   ?   ??? Step6QRCode.jsx        # QR code generation
?   ?   ??? ActionPicker.jsx
?   ?   ??? ActionPickerPanel.jsx
?   ?   ??? ActionSequence.jsx
?   ?   ??? AllianceIcon.jsx
?   ?   ??? ClearDataModal.jsx
?   ?   ??? ClearDataSuccessModal.jsx
?   ?   ??? ConfirmClearDataModal.jsx
?   ?   ??? DeleteConfigurationModal.jsx
?   ?   ??? DeleteMatchModal.jsx
?   ?   ??? HamburgerMenu.jsx
?   ?   ??? LoadTemplateModal.jsx
?   ?   ??? MainWizardView.jsx
?   ?   ??? SaveTemplateModal.jsx
?   ?   ??? StartPositionPicker.jsx
?   ?   ??? StartPositionPickerPanel.jsx
?   ?   ??? UpdateNotification.jsx
?   ?   ??? WelcomeScreen.jsx
?   ?   ??? WizardContainer.jsx
?   ?   ??? WizardNavigation.jsx
?   ?   ??? WizardStep.jsx
?   ??? hooks/                  # Custom React hooks
?   ?   ??? useActionGroups.js       # Action groups management
?   ?   ??? useAngleUnitsPreference.js
?   ?   ??? useDragAndDrop.js
?   ?   ??? useMatches.js            # Match CRUD operations
?   ?   ??? useMatchHandlers.js
?   ?   ??? usePresets.js            # Configuration templates
?   ?   ??? useServiceWorker.js      # PWA update handling
?   ?   ??? useStartPositions.js
?   ?   ??? useTemplateModal.js
?   ?   ??? useThemePreference.js
?   ?   ??? useUnitsPreference.js
?   ?   ??? useWizardActions.js
?   ??? utils/                  # Utility functions
?   ?   ??? actionUtils.js          # Action validation & display
?   ?   ??? configUtils.js          # JSON export utilities
?   ?   ??? poseEncoder.js          # Position encoding
?   ?   ??? presetUtils.js          # Template loading
?   ?   ??? storageUtils.js         # LocalStorage wrapper
?   ?   ??? terseEncoder.js         # Compact format encoding
?   ?   ??? themeUtils.js           # Theme calculations
?   ??? App.jsx                 # Main app component
?   ??? main.jsx                # Entry point
?   ??? index.css               # Global styles (Tailwind)
??? examples/                   # Integration examples (Java)
?   ??? java/                   # Java OpMode examples
?   ??? INTEGRATION_GUIDE.md    # OpMode integration guide
?   ??? TERSE_FORMAT.md         # Terse format specification
??? dist/                       # Production build output (generated)
??? index.html                  # HTML template
??? vite.config.js              # Vite configuration
??? tailwind.config.js          # Tailwind CSS configuration
??? package.json                # Dependencies and scripts
```

**Key Directories**:
- **`components/common/`**: Shared UI components (forms, modals)
- **`components/config/`**: Configuration management UI
- **`components/menu/`**: Hamburger menu sections
- **`components/steps/`**: Wizard step screens (4 steps total)
- **`hooks/`**: Custom React hooks for state management
- **`utils/`**: Pure functions for encoding, storage, validation
- **`examples/`**: FTC OpMode integration code and docs

### Key Technologies

- **React 19**: UI framework with hooks
- **Vite 7**: Build tool and dev server with HMR
- **TailwindCSS 3**: Utility-first CSS framework with dark mode support
- **qrcode.react**: QR code generation library
- **LocalStorage API**: Client-side data persistence

### Code Architecture

- **Component-Based**: Modular React components with clear separation of concerns
- **Custom Hooks**: Reusable state management logic (matches, actions, positions, preferences)
- **Portal-Based Modals**: Action picker and modals use React portals
- **Terse Format**: Compact QR code encoding for efficient scanning
- **Progressive Web App**: Service worker for offline support and auto-updates

**Storage Limits**: ~5-10MB per domain (browser-dependent). This is sufficient for hundreds of matches.

### Environment Configuration

For different environments, create `.env` files:

```bash
# .env.production
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=FTC AutoConfig
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Support

For issues or questions:
- Create an issue on GitHub: https://github.com/FTC-24180/AutoConfig/issues
- Contact the programming team lead
- Check the `examples/` directory for OpMode integration help

## Recent Changes (v2.6.0)

### Code Cleanup
- Removed unused schema validation code (now focuses on terse format)
- Removed obsolete step components (consolidated into Step1MatchSetup)
- Removed unused modal components (ManageActionsModal, ManageStartPositionsModal)
- Cleaned up backwards compatibility code

### Architecture Improvements
- Streamlined wizard flow (4 steps instead of 6)
- Fixed action group structure (Actions + Wait only)
- Improved menu organization with dedicated submenu components
- Better separation between match data and configuration templates

### Current Step Flow
1. **Match Setup** - Match number, partner team, alliance color (consolidated)
2. **Start Position** - Position selection with custom coordinates
3. **Actions** - Action sequence builder with drag-and-drop
4. **QR Code** - Terse format QR generation and JSON export

---

## Version History
