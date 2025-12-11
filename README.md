# FTC AutoConfig

A Progressive Web App (PWA) for configuring FTC autonomous routines. Built with React and TailwindCSS, this mobile-first application helps teams quickly create, manage, and deploy autonomous configurations for multiple matches.

## Quick Start

### Using the App

1. **Create Your First Match**
   - Open the app and click "Create Your First Match"
   - Or use the hamburger menu (?) in the top-right to add matches

2. **Configure Match Details** (Step 1)
   - Enter the match number
   - Optionally add your partner team number
   - Select your alliance color (Red or Blue)

3. **Choose Starting Position** (Step 2)
   - Select from preset positions (Front, Back, or custom positions you've configured)
   - Or choose "Custom" to enter specific X, Y, and ? (theta) coordinates

4. **Build Action Sequence** (Step 3)
   - Tap action group headers to expand them (Pickup, Scoring, Movement, etc.)
   - Tap individual actions to add them to your sequence
   - Drag actions to reorder them in the sequence
   - Configure action-specific parameters (like wait times) using the inline fields
   - Use "Clear All" to start over if needed

5. **Generate QR Code** (Step 4)
   - View the QR code for the current match
   - If you have multiple matches, swipe left/right or use the dots to navigate between them
   - Scan the QR code with your robot's camera
   - Or download all matches as a JSON file

### Managing Multiple Matches

- **Add Match**: Use the hamburger menu (?) ? "Add" button
- **Switch Matches**: Tap any match in the hamburger menu list
- **Duplicate Match**: Tap the duplicate icon on any match in the menu
- **Delete Match**: Tap the delete (trash) icon on any match in the menu
- **QR Navigation**: On the QR Code step, swipe left/right between matches or tap the indicator dots

### Templates

Save time by creating reusable configurations:

1. Configure a match with your typical setup
2. Open hamburger menu (?) ? "Save as Template"
3. Enter a template name
4. Load templates later via hamburger menu ? "Load Template"

### Appearance

Change the app theme via hamburger menu ? Appearance:
- **System**: Follows your device's dark/light mode preference
- **Light**: Always use light mode
- **Dark**: Always use dark mode

## Advanced Configuration

### Managing Action Groups

Action groups organize related actions (like Pickup, Scoring, Movement). You can customize these:

1. Open hamburger menu (?) ? Configuration ? Configure Actions
2. **Rename a Group**: Edit the group name directly
3. **Delete a Group**: Tap the trash icon next to the group name
4. **Add Custom Group**: 
   - Scroll to the bottom
   - Enter a group key (e.g., "defense")
   - Enter a display label (e.g., "Defense")
   - Tap "Add Group"

### Managing Actions

Actions are the individual steps in your autonomous routine:

1. Navigate to Configure Actions (see above)
2. Expand the desired group
3. **Add an Action**:
   - Enter an action ID (e.g., "spike_1")
   - Enter a display label (e.g., "Spike 1")
   - Optionally add configuration fields (see below)
   - Tap "Add Action"
4. **Edit an Action**: Modify the ID or label fields directly
5. **Delete an Action**: Tap the trash icon next to the action

### Adding Action Configuration Fields

Configuration fields let you customize action behavior (like wait times, distances, etc.):

1. When adding or editing an action, tap "+ Add field" or "+ Add config"
2. **For each field**:
   - Enter a key name (e.g., "duration", "distance")
   - Select the type (Number or Text)
   - Enter a default value
   - Tap the + button to add it
3. **Remove a field**: Tap the × next to the field

**Example**: A "Wait" action might have a config field:
- Key: `duration`
- Type: Number
- Value: `2` (seconds)

### Managing Start Positions

Customize preset starting positions:

1. Open hamburger menu (?) ? Configuration ? Start Positions
2. **Add a Position**:
   - Enter position ID (e.g., "left")
   - Enter display label (e.g., "Left Side")
   - Tap "Add Position"
3. **Edit a Position**: Modify the ID or label directly
4. **Delete a Position**: Tap the trash icon

**Note**: The "Custom" position with X, Y, ? fields is always available and cannot be removed.

### Exporting Configuration

Export your custom action groups and start positions:

1. Navigate to Configure Actions or Start Positions
2. Tap "Export" in the top-right
3. A JSON file will download with your configuration
4. Share this file with your team or use it to restore configurations

## Development

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
??? public/              # Static assets
?   ??? manifest.json    # PWA manifest
?   ??? sw.js           # Service worker
??? src/
?   ??? components/      # React components
?   ?   ??? config/     # Configuration components
?   ?   ??? steps/      # Wizard step components
?   ??? hooks/          # Custom React hooks
?   ??? utils/          # Utility functions
?   ??? App.jsx         # Main app component
?   ??? main.jsx        # Entry point
?   ??? index.css       # Global styles (Tailwind)
??? dist/               # Production build output
??? index.html          # HTML template
```

### Key Technologies

- **React 19**: UI framework with hooks
- **Vite 7**: Build tool and dev server
- **TailwindCSS 3**: Utility-first CSS framework
- **qrcode.react**: QR code generation
- **LocalStorage**: Client-side data persistence

### Development Tips

- **Hot Reload**: Changes to `.jsx` and `.css` files reload instantly
- **Dark Mode**: Uses Tailwind's dark mode (class-based)
- **Touch-First**: All interactive elements have `min-h-[44px]` for touch targets
- **Safe Areas**: Uses `safe-top` and `safe-bottom` for notched devices
- **State Management**: Uses React hooks + localStorage for persistence

## Deployment

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

### PWA Installation

Once deployed, users can install the app:

- **iOS**: Safari ? Share ? Add to Home Screen
- **Android**: Chrome ? Menu ? Install App
- **Desktop**: Chrome ? Address bar ? Install icon

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

## Data Management

### Storage

All data is stored locally in the browser:
- **Matches**: `ftc-autoconfig-matches`
- **Templates**: `ftc-autoconfig-presets`
- **Action Groups**: `ftc-autoconfig-action-groups`
- **Start Positions**: `ftc-autoconfig-start-positions`
- **Theme Preference**: `autoconfig-theme-preference`

### Clearing Data

**Warning**: This permanently deletes all matches, templates, and configurations!

1. Hamburger menu (?) ? Scroll to "Danger Zone"
2. Tap "Clear All Data"
3. Confirm twice (safety check)
4. App reloads with default settings

### Backup & Restore

**Backup**:
1. Export all matches: Hamburger menu ? "Export All Matches"
2. Export configuration: Configuration ? "Export"
3. Save both JSON files

**Restore**:
- Matches: Use "Load Template" feature (imports the full match set)
- Configuration: Currently manual (copy action groups/positions from exported JSON)

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
- Increase QR code size (already optimized for mobile)
- Try downloading JSON instead

## Contributing

This is an internal tool for FTC Team 24180. For team members:

1. Create a feature branch
2. Make your changes
3. Test locally with `npm run dev`
4. Push and create a pull request
5. After review, merge to `main` for automatic deployment

## License

This project is part of FTC Team 24180's programming tools.

## Support

For issues or questions:
- Create an issue on GitHub
- Contact the programming team lead
- Check the wiki (if available) for additional documentation
