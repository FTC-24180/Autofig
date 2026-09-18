# This repository is deprecated and inactive
# FTC Autofig

A Progressive Web App (PWA) for configuring FTC autonomous routines. Built with React and TailwindCSS, this mobile-first application helps teams quickly create, manage, and deploy autonomous configurations for multiple matches.

**Live App**: https://Autofig.bluebananas.org

---

## Table of Contents

### For Users
- [Quick Start](#quick-start)
- [Settings](#settings)
- [Advanced Configuration](#advanced-configuration)
- [QR Code Format](#qr-code-format)
- [Data Management](#data-management)
- [Troubleshooting](#troubleshooting)

### For Contributors
- [Contributing Guide](CONTRIBUTING.md) - Setup, development, and deployment
- [Versioning Guide](VERSIONING.md) - Commit message standards
- [Development Setup](#development-setup)

---

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
- Verify version was incremented during release
- Check browser console for service worker logs
- Try closing and reopening the app tab
- Wait a few moments after deployment (service worker needs time to register)

---

## Development Setup

**Quick Start for Contributors**:

```bash
# Clone and install
git clone https://github.com/FTC-24180/Autofig.git
cd Autofig
npm install

# Start dev server
npm run dev
# Open http://localhost:5173

# Build for production
npm run build
```

**For detailed contribution guidelines**, see [CONTRIBUTING.md](CONTRIBUTING.md), including:
- Deployment workflows
- Version management with Release Please
- Commit message standards
- Project architecture

### Project Structure

```
Autofig/
??? public/                      # Static assets
?   ??? manifest.json           # PWA manifest
?   ??? sw.js                   # Service worker
?   ??? version.js              # App version (auto-injected by CI/CD)
?   ??? icon-512.svg            # App icon
??? src/
?   ??? components/             # React components
?   ?   ??? common/            # Reusable components
?   ?   ??? config/            # Configuration management
?   ?   ??? menu/              # Menu components
?   ?   ??? steps/             # Wizard step components
?   ??? hooks/                  # Custom React hooks
?   ??? utils/                  # Utility functions
??? examples/                   # FTC OpMode integration examples
??? .github/workflows/          # CI/CD automation
?   ??? release-please.yml     # Creates release PRs
?   ??? deploy.yml             # Deploys on release
??? dist/                       # Production build (generated)
```

### Key Technologies

- **React 19**: UI framework with hooks
- **Vite 7**: Build tool and dev server
- **TailwindCSS 3**: Utility-first CSS with dark mode
- **qrcode.react**: QR code generation
- **Release Please**: Automated version management

---

## Support

For issues or questions:
- Create an issue: https://github.com/FTC-24180/Autofig/issues
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development help
- See `examples/` directory for OpMode integration

---

## License

This project is open source and available for FTC teams to use and modify.
