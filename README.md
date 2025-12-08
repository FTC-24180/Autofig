# FTC AutoConfig - DECODE Season

A Progressive Web App (PWA) for configuring FTC DECODE season autonomous opmodes. Built with React and TailwindCSS, deployed as a static site on GitHub Pages.

## Features

- **Alliance Selection**: Choose between Red or Blue alliance
- **Start Location**: Select Near or Far starting position
- **Action Builder**: Create ordered sequences of autonomous actions including:
  - Near Launch / Far Launch
  - Spike 1, 2, 3
  - Corner
  - Dump
  - Near Park / Far Park
  - Configurable Wait (with custom wait time)
- **Action Management**: Reorder actions with up/down arrows, remove individual actions, or clear all
- **Export Options**:
  - View JSON configuration in real-time
  - Download configuration as JSON file
  - Generate QR code containing the full configuration
- **Presets**: Save and load configurations using browser LocalStorage
- **PWA Support**: Install as a standalone app on mobile and desktop devices

## Development

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5173/AutoConfig/` to view the app.

### Build

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment workflow is configured in `.github/workflows/deploy.yml`.

## Technology Stack

- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **qrcode.react**: QR code generation
- **PWA**: Service worker for offline support and installability

## Usage

1. Select your alliance color (Red/Blue)
2. Choose your start location (Near/Far)
3. Add actions to your sequence by clicking the action buttons
4. Reorder actions using the up/down arrows
5. Configure wait times for Wait actions
6. Export your configuration as JSON or QR code
7. Save frequently used configurations as presets for quick access

## License

This project is part of FTC Team 24180's tools for the DECODE season.
