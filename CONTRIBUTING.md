# ?? Quick Start Guide for Contributors

## New to the Project?

Welcome! This guide will get you up and running quickly.

## Setup (5 minutes)

### 1. Clone and Install
```bash
git clone https://github.com/FTC-24180/Autofig.git
cd Autofig
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser. Changes auto-reload!

---

## Making Changes

### 1. Create Your Changes
Edit files in `src/` directory. The app will hot-reload automatically.

### 2. Commit with Semantic Messages

**Important**: Use conventional commit messages for automatic versioning!

```bash
# Bug fix ? Version 1.0.0 ? 1.0.1
git commit -m "fix: resolve QR scanning crash"

# New feature ? Version 1.0.0 ? 1.1.0
git commit -m "feat: add match export feature"

# Breaking change ? Version 1.0.0 ? 2.0.0
git commit -m "feat!: redesign storage system"
```

See [VERSIONING.md](VERSIONING.md) for more examples.

### 3. Push Your Changes
```bash
git push origin main
```

### 4. Review the Release PR

Release Please will automatically:
- ? Create or update a release PR
- ? Calculate the new version
- ? Update CHANGELOG.md
- ? Wait for your review

**Check GitHub PRs** for: "chore(main): release X.X.X"

### 5. Merge When Ready

- **Don't merge immediately!** Let changes accumulate
- Review the PR to see all changes since last release
- Edit CHANGELOG.md if needed
- **Merge the PR** when you're ready to deploy

Deployment happens automatically after merging!

---

## Release Control

### Accumulating Changes

Release Please is smart about multiple commits:

```bash
# Monday
git commit -m "feat: add feature A"
git push  # Creates release PR

# Tuesday
git commit -m "feat: add feature B"
git push  # Updates same PR

# Wednesday
git commit -m "fix: bug fix"
git push  # PR still open

# Thursday - Ready!
# Merge the PR ? All changes release together
```

### Emergency Release

```bash
# Push urgent fix
git commit -m "fix: critical security patch"
git push

# Release PR created/updated
# Merge immediately for fast deployment
```

---

## Automated Deployment

### How It Works

This project uses **Release Please** for version management and **GitHub Actions** for deployment.

**The Flow**:
1. You push commits with semantic messages (`feat:`, `fix:`, etc.)
2. Release Please creates/updates a PR with version bump
3. You review and merge the PR
4. GitHub Actions automatically:
   - Creates a GitHub Release
   - Builds the app
   - Injects the version number
   - Deploys to GitHub Pages

### GitHub Actions Workflows

#### `.github/workflows/release-please.yml`
Runs on every push to `main`. Creates or updates a release PR.

**What it does**:
- Analyzes commit messages since last release
- Calculates new version (semver)
- Updates `package.json`
- Generates/updates `CHANGELOG.md`
- Creates PR titled "chore(main): release X.X.X"

#### `.github/workflows/deploy.yml`
Runs when a release PR is merged (on release published).

**What it does**:
1. Checks out the code
2. Installs dependencies (`npm ci`)
3. Gets version from `package.json`
4. **Injects version** into `public/version.js`:
   ```javascript
   export const VERSION = '1.0.0';
   ```
5. Builds the app (`npm run build`)
6. Deploys to GitHub Pages
7. Live at: https://ftc-24180.github.io/Autofig/

**Typical deployment time**: 2-3 minutes from merge to live.

### Version Injection

**Source file** (`public/version.js` in repo):
```javascript
export const VERSION = '0.0.0-dev';
```

**During CI/CD build**:
```javascript
export const VERSION = '1.0.0';
```

**Why?**
- Source code always shows `0.0.0-dev` for local development
- CI/CD injects the real version from `package.json` during build
- Deployed app shows the actual release version
- Single source of truth: `package.json` version

### Checking Deployment Status

1. **Watch the Actions**: https://github.com/FTC-24180/Autofig/actions
2. **Check Releases**: https://github.com/FTC-24180/Autofig/releases
3. **Verify Live**: Open the app and check Help & Info

### Manual Deployment (Rare)

If you need to deploy without a release:

1. Go to: https://github.com/FTC-24180/Autofig/actions/workflows/deploy.yml
2. Click **"Run workflow"** dropdown
3. Click green **"Run workflow"** button

This builds and deploys the current `main` branch immediately.

---

## Auto-Update System

The app uses a smart update system:

**How it works**:
1. New version deployed ? Service worker detects it
2. User returns to app ? Update banner appears
3. User clicks "Update Now" ? App reloads with new version
4. All data preserved (matches, templates, settings)

**User Experience**:
- No manual cache clearing needed
- No hard refresh required
- One-click update
- Seamless transition

**Implementation**:
- Service worker checks version on load
- Compares deployed version vs cached version
- Shows `UpdateNotification` component if mismatch
- See `src/hooks/useServiceWorker.js` for details

---

## Common Tasks

### Check if Your Code Builds
```bash
npm run build
```

### Test the Production Build Locally
```bash
npm run preview
```

### Set Up Commit Template
```bash
git config commit.template .gitmessage
```

This gives you helpful hints when writing commits!

### Run Linter
```bash
npm run lint
```

---

## Project Structure

```
src/
??? components/     # React UI components
?   ??? common/    # Reusable components (forms, modals)
?   ??? config/    # Configuration management UI
?   ??? menu/      # Hamburger menu sections
?   ??? steps/     # Wizard step screens
??? hooks/          # Custom React hooks
?   ??? useMatches.js         # Match CRUD operations
?   ??? useActionGroups.js    # Action management
?   ??? useServiceWorker.js   # PWA updates
?   ??? ...
??? utils/          # Helper functions
    ??? terseEncoder.js       # QR code encoding
    ??? storageUtils.js       # LocalStorage wrapper
    ??? ...

public/
??? version.js      # Auto-replaced by CI/CD
??? sw.js           # Service worker
??? manifest.json   # PWA manifest

.github/workflows/
??? release-please.yml  # Creates release PRs
??? deploy.yml          # Deploys on release
```

**Key Files**:
- **`public/version.js`**: Version shown in app (CI/CD injects real version)
- **`package.json`**: Single source of truth for version
- **`CHANGELOG.md`**: Auto-generated by Release Please
- **`.gitmessage`**: Commit message template (optional)

---

## Deployment Environments

### Production (GitHub Pages)
- **URL**: https://ftc-24180.github.io/Autofig/
- **Also available at**: https://Autofig.bluebananas.org
- **Deploy trigger**: Merge release PR
- **Branch**: `gh-pages` (auto-managed)

### Local Development
- **URL**: http://localhost:5173
- **Version shown**: `0.0.0-dev`
- **Hot reload**: Enabled

### Preview Production Build
```bash
npm run build
npm run preview
# Opens at http://localhost:4173
```

---

## PWA Installation

Once deployed, users can install the app:

- **iOS**: Safari ? Share ? Add to Home Screen
- **Android**: Chrome ? Menu ? Install App
- **Desktop**: Chrome ? Address bar ? Install icon

**What gets installed**:
- Offline-capable app
- App icon on home screen/desktop
- Standalone window (no browser UI)
- Service worker for background updates

---

## Need Help?

- **Versioning**: See [VERSIONING.md](VERSIONING.md)
- **Full docs**: See [README.md](README.md)
- **Issues**: Open an issue on GitHub

---

## Tips

? **DO**: Use semantic commit messages (`feat:`, `fix:`, etc.)  
? **DO**: Test your changes locally before pushing  
? **DO**: Keep commits focused and atomic  
? **DO**: Review release PRs before merging  
? **DO**: Accumulate related changes into one release  

? **DON'T**: Manually edit version numbers in `package.json`  
? **DON'T**: Edit `CHANGELOG.md` directly (Release Please manages it)  
? **DON'T**: Use vague commit messages like "update"  
? **DON'T**: Commit broken code to main  
? **DON'T**: Merge release PRs without reviewing  

---

## Release Flow

```
Your commits ? Push to main
    ?
Release Please creates/updates PR
    ?
You review the PR
    ?
You merge when ready
    ?
GitHub Release created
    ?
CI/CD injects version
    ?
Build & Deploy to GitHub Pages
    ?
Live on web! ??
```

**Time from merge to live**: ~2-3 minutes

---

## Key Difference from Auto-Release Tools

Unlike tools that release immediately on every commit:
- ? **You control timing**: Merge PR when ready
- ? **Review first**: See exactly what's releasing
- ? **Combine changes**: Multiple commits in one release
- ? **Edit notes**: Improve changelog before release
- ? **No surprises**: WIP commits won't trigger releases

---

## Troubleshooting Deployment

### Release PR not created
- Check commit messages use semantic format (`feat:`, `fix:`)
- Verify GitHub Actions workflow is enabled
- Check Actions tab for errors

### Deployment failed
- Check Actions tab: https://github.com/FTC-24180/Autofig/actions
- Common issues:
  - Node.js version mismatch
  - npm install failures
  - Build errors (check lint/syntax)
  - GitHub Pages not enabled

### Wrong version showing in app
- Version comes from last successful deployment
- Check when last deployment ran (Actions tab)
- Trigger manual deployment if needed
- Clear browser cache and reload

### Service worker not updating
- Check browser console (F12) for errors
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear site data: DevTools ? Application ? Clear storage
- Verify `public/sw.js` has correct cache name

---

Happy coding! ??
