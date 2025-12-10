# FTC AutoConfig - Mobile-First Wizard UI

A mobile-first autonomous configuration tool for FTC Team 24180 - DECODE Season.

## New Features

### ?? Multi-Match Management
Manage multiple matches in a single session with hierarchical JSON structure:
- **Add/Delete Matches** - Configure all your tournament matches in advance
- **Switch Between Matches** - Quick access to any match configuration
- **Duplicate Matches** - Copy similar configurations to save time
- **Match Properties** - Each match includes number, partner, alliance, position, and actions
- **Hierarchical Structure** - Matches contain alliance properties, which contain start position and actions

### ?? Wizard-Based Workflow
The app now uses a 6-step wizard interface optimized for mobile devices:

1. **Match Configuration** - Enter the match number
2. **Alliance Partner** - Specify your partner team number
3. **Alliance Color** - Choose Red or Blue alliance
4. **Starting Position** - Select preset or custom starting position
5. **Configure Actions** - Build your autonomous action sequence
6. **QR Code** - Generate and export your configuration

### ?? Mobile-First Design
- **Swipe Gestures** - Swipe left/right to navigate between wizard steps
- **Touch-Optimized** - Large buttons and touch-friendly controls
- **Responsive Layout** - Adapts seamlessly from mobile to desktop
- **Step Indicators** - Visual progress dots show your position in the wizard

### ?? Hamburger Menu
Access key features from the slide-out menu:
- **Configure Actions** - Manage action groups and custom actions
- **Export JSON** - Download configuration as JSON file (includes all matches)
- **Save as Template** - Save current config for reuse
- **Load Template** - Quickly load saved configurations

### ?? Match Manager
Access from the header button (top-left):
- View all configured matches at a glance
- See match number, alliance color, partner, and action count
- Switch between matches instantly
- Add, delete, or duplicate matches
- Visual indicators for current match

### ? Enhanced UX
- **Drag & Drop** - Reorder actions with touch or mouse
- **Visual Feedback** - Color-coded alliance themes
- **Configuration Summary** - See all details before generating QR code
- **Inline Editing** - Edit action parameters directly in the sequence
- **Multi-Match Export** - Single QR code/JSON for all matches

## Usage

### Managing Multiple Matches

#### Creating Matches
1. Click "Matches" button in the header
2. Click "Add Match" to create a new match
3. Configure the match through the wizard
4. Repeat for all tournament matches

#### Switching Matches
1. Open Match Manager from header
2. Click on any match to edit it
3. The wizard updates to show that match's configuration
4. Make changes and save

#### Duplicating Matches
1. Open Match Manager
2. Click the duplicate icon on a match
3. A copy is created with incremented match number
4. Modify as needed

### Starting a New Configuration
1. Open the app and start at Step 1
2. Enter your match number
3. Swipe left or tap "Next" to continue
4. Fill in each step of the wizard
5. Add actions in Step 5 by expanding action groups
6. Generate QR code in Step 6

### Saving Templates
1. Complete your configuration (can include multiple matches)
2. Tap the hamburger menu (?) in the top-right
3. Select "Save as Template"
4. Enter a name and save
5. Load templates later from the hamburger menu

### Managing Action Groups
1. Open the hamburger menu
2. Select "Configure Actions"
3. Add/edit/delete action groups
4. Customize available actions and their parameters
5. Export configuration to share with team

## JSON Structure

### Multi-Match Format
```json
{
  "matches": [
    {
      "matchNumber": 1,
      "partnerTeam": "12345",
      "alliance": "red",
      "startPosition": { "type": "front" },
      "actions": [...]
    },
    {
      "matchNumber": 2,
      "partnerTeam": "67890",
      "alliance": "blue",
      "startPosition": { "type": "back" },
      "actions": [...]
    }
  ]
}
```

### Hierarchy
- **matches** (top level array)
  - **match properties**: matchNumber, partnerTeam, alliance
  - **alliance children**:
    - startPosition (node)
    - actions (array of nodes)

See [MATCH_MANAGEMENT.md](./MATCH_MANAGEMENT.md) for detailed documentation.

## Navigation

### Mobile
- **Swipe Left** - Next step
- **Swipe Right** - Previous step
- **Tap Bottom Bar** - Manual step navigation
- **Tap Header "Matches"** - Open Match Manager

### Desktop
- Click "Next" / "Previous" buttons
- Click "Matches" button for Match Manager
- Step indicators still visible

## Technical Details

### Components Structure
```
src/
??? components/
?   ??? HamburgerMenu.jsx
?   ??? WizardContainer.jsx
?   ??? WizardNavigation.jsx
?   ??? WizardStep.jsx
?   ??? MatchManager.jsx          (NEW)
?   ??? ActionSequence.jsx
?   ??? ActionPicker.jsx
?   ??? ManageConfigModal.jsx
?   ??? steps/
?       ??? Step1Match.jsx
?       ??? Step2Partner.jsx
?       ??? Step3Alliance.jsx
?       ??? Step4StartPosition.jsx
?       ??? Step5Actions.jsx
?       ??? Step6QRCode.jsx
??? hooks/
?   ??? useActionGroups.js
?   ??? usePresets.js
?   ??? useStartPositions.js
?   ??? useMatches.js             (NEW)
?   ??? useDragAndDrop.js
??? App.jsx
```

### Storage
- **Matches** stored in `localStorage` as `ftc-autoconfig-matches`
- **Action groups** stored as `ftc-autoconfig-action-groups`
- **Templates** stored as `ftc-autoconfig-presets`
- **Start positions** stored as `ftc-autoconfig-start-positions`

### Match Object Structure
Each match contains:
- `id` - Internal UUID (not exported)
- `matchNumber` - Display number
- `partnerTeam` - Partner team number
- `alliance` - "red" or "blue"
- `startPosition` - Position object with type and optional x, y, theta
- `actions` - Array of action objects

## Use Cases

### Tournament Preparation
1. Pre-configure all qualification matches
2. Include partner team numbers
3. Set different strategies per match
4. Export once, scan before each match

### Strategy Flexibility
1. Create multiple match scenarios
2. Duplicate and modify for variations
3. Switch strategies based on alliance partner
4. Quick access during driver meetings

### Team Collaboration
1. Share exported JSON with team
2. Load templates for consistent strategies
3. Duplicate matches for different team members
4. Review all matches before competition

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Migration

### From Old Format
- Old single-match templates are automatically detected
- They load as a single match in the new system
- Re-save to update to new multi-match format

### Data Persistence
- All data persists in browser localStorage
- Export regularly as backup
- Clear browser data to reset

## Tips

1. **Number matches strategically** - Use actual match schedule numbers
2. **Duplicate similar matches** - Save time on configuration
3. **Review before competition** - Check all matches in Match Manager
4. **Export for backup** - Regularly download your configuration
5. **Test QR codes** - Verify scanning before competition day

## License
FTC Team 24180
