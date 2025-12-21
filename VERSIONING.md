# Automated Versioning with Release Please

This project uses **Release Please** for semi-automated version management with **manual control**. Release Please creates pull requests with version bumps and changelogs, which you review and merge when ready to release.

## Why Release Please?

### The Problem with Fully Automated Tools

Tools like semantic-release deploy **immediately** on every push to main:
- ? No review step before release
- ? Can't combine multiple changes into one release
- ? No control over timing
- ? Difficult to hold back WIP features
- ? Surprise releases from experimental commits

### The Release Please Solution

Release Please creates **Pull Requests** instead of immediate releases:
- ? **Review before releasing**: See exactly what's changing
- ? **Combine changes**: Multiple commits in one release
- ? **Control timing**: Merge PR when YOU'RE ready
- ? **Edit release notes**: Improve changelog before publishing
- ? **Prevent accidents**: WIP commits don't trigger releases

### What You Trade for Control

To be fair, here's what you give up:

**Slightly More Friction**:
- Need to merge a PR (vs automatic)
- But this is also a **feature** - it prevents accidents!

**Two-Step Process**:
- Push commits ? Review PR ? Merge PR
- vs semantic-release: Push commits ? Done
- But you get **control** in exchange

**Need to Remember to Merge**:
- Release PRs can accumulate if forgotten
- But this is usually **desired** (combine changes)

## How It Works

1. **You make commits** with conventional commit messages
2. **GitHub Actions** runs Release Please on push to `main`
3. **Release Please creates a PR** with version bump and changelog
4. **You review the PR** and merge it when ready to release
5. **On merge**, a GitHub Release is created and deployment happens
6. **App displays the version** in the Help & Info menu

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types and Version Bumps

| Commit Type | Description | Version Bump | Example |
|------------|-------------|--------------|---------|
| `fix:` | Bug fixes | PATCH (2.6.0 ? 2.6.1) | `fix: resolve QR code scan error` |
| `feat:` | New features | MINOR (2.6.0 ? 2.7.0) | `feat: add match duplication` |
| `BREAKING CHANGE:` | Breaking changes | MAJOR (2.6.0 ? 3.0.0) | `feat!: redesign configuration system` |
| `chore:` | Maintenance | No bump | `chore: update dependencies` |
| `docs:` | Documentation | No bump | `docs: update README` |
| `style:` | Code style | No bump | `style: format code` |
| `refactor:` | Code refactoring | No bump | `refactor: simplify storage utils` |
| `test:` | Tests | No bump | `test: add unit tests` |
| `perf:` | Performance | PATCH (2.6.0 ? 2.6.1) | `perf: optimize QR generation` |

### Examples

#### Bug Fix (PATCH: 2.6.0 ? 2.6.1)
```bash
git commit -m "fix: prevent crash when deleting last match

Adds validation to ensure at least one match exists
before attempting deletion."
```

#### New Feature (MINOR: 2.6.0 ? 2.7.0)
```bash
git commit -m "feat: add export all matches button

Users can now export all matches at once from the
Matches menu for easier backup and sharing."
```

#### Breaking Change (MAJOR: 2.6.0 ? 3.0.0)
```bash
git commit -m "feat!: redesign storage schema

BREAKING CHANGE: Old match data format is no longer
supported. Users must export and re-import matches."
```

Or:
```bash
git commit -m "feat: redesign storage schema

BREAKING CHANGE: Old match data format is no longer
supported. Users must export and re-import matches."
```

## Workflow

### Standard Development Flow

1. **Make changes** to your code
2. **Stage changes**: `git add .`
3. **Commit with semantic message**:
   ```bash
   git commit -m "feat: add new autonomous action type"
   ```
4. **Push to main**: `git push origin main`
5. **Release Please creates/updates PR**:
   - If no release PR exists, one is created
   - If one exists, it's updated with new changes
   - PR includes version bump and changelog entry
   - PR title: "chore(main): release 2.7.0"

6. **Review the Release PR**:
   - Check the version bump is correct
   - Review the auto-generated changelog
   - Make any manual edits to CHANGELOG.md if needed
   - Add more commits if you want to include them in this release

7. **Merge the Release PR when ready**:
   - Click "Merge pull request"
   - This triggers:
     - GitHub Release creation
     - Git tag creation (v2.7.0)
     - Deployment to GitHub Pages

### Real-World Examples

#### Example 1: Feature Development

**Monday - Start new feature**:
```bash
git commit -m "feat: add user authentication UI"
git push
```
? Release Please creates PR for v2.7.0

**Tuesday - Continue development**:
```bash
git commit -m "feat: add login backend"
git push
```
? Same PR updated to include both commits

**Wednesday - Bug fix**:
```bash
git commit -m "fix: resolve login validation"
git push
```
? PR still at v2.7.0, now includes 3 commits

**Thursday - Testing complete, ready to release**:
? Merge the PR, all 3 changes release together as v2.7.0

#### Example 2: Emergency Hotfix

**Production issue discovered**:
```bash
git commit -m "fix: patch security vulnerability"
git push
```
? Release Please creates/updates PR

**Immediate action**:
? Review PR quickly, merge immediately
? Deployment starts within minutes

#### Example 3: Holding Back Experimental Features

**Working on major refactor**:
```bash
git commit -m "feat: refactor storage system (WIP)"
git push
```
? Release Please creates PR for v3.0.0 (breaking change)

**Continue experimenting**:
```bash
git commit -m "feat: add migration tools"
git push
```
? PR updated, but you DON'T merge it yet

**Weeks later, when ready**:
? Merge the PR to finally release v3.0.0

### Accumulating Changes

Release Please is smart about multiple commits:

```bash
# Monday
git commit -m "feat: add feature A"
git push  # Creates release PR for v2.7.0

# Tuesday  
git commit -m "feat: add feature B"
git push  # Updates same PR to include both features

# Wednesday
git commit -m "fix: bug fix"
git push  # PR still at v2.7.0 (features trump fixes)

# Thursday - Ready to release!
# Merge the PR ? v2.7.0 releases with all changes
```

### Holding Back a Release

Don't merge the release PR until you're ready:

```bash
# Keep pushing commits
git commit -m "feat: work in progress feature"
git push

# Release PR updates but you don't merge it yet
# Deploy when ready by merging the PR
```

## Team Workflow

### For Individual Developers

```bash
# 1. Work on features
git commit -m "feat: implement feature"
git push

# 2. Check GitHub PRs periodically
# 3. When ready to release, review and merge the PR
```

### For Teams

**Developer A** (Monday):
```bash
git commit -m "feat: add dashboard"
git push
```

**Developer B** (Tuesday):
```bash
git commit -m "feat: add reporting"
git push
```

**Team Lead** (Friday):
- Reviews the release PR
- Checks all commits from the week
- Edits changelog if needed
- Merges when ready for deployment

## What Gets Updated Automatically

When Release Please creates/updates a PR:

1. ? Calculates the new version number
2. ? Updates `package.json` and `package-lock.json`
3. ? Generates/updates `CHANGELOG.md`
4. ? Creates PR for you to review

When you merge the release PR:

1. ? Creates a Git tag (e.g., `v2.7.0`)
2. ? Creates a GitHub Release with release notes
3. ? Triggers deployment workflow
4. ? Injects version into `public/version.js` during build
5. ? Builds and deploys to GitHub Pages

## Checking the Current Version

### In the App
Open the app ? Hamburger Menu (?) ? Help & Info ? Version shown at top

### In the Repository
- Check `package.json`: The version field
- Check GitHub Releases: All versions with release notes
- Check Git tags: `git tag -l`
- Check open PRs: Look for "chore(main): release X.X.X"

## Managing Releases

### To Create a Release

1. Push semantic commits to `main`
2. Wait for Release Please to create/update PR
3. Review the PR
4. Merge when ready

### To Cancel a Release

Simply close the release PR without merging:
- Release Please will create a new PR for the next version
- Useful if you want to skip a release

### To Edit Release Notes

Before merging the release PR:
1. Check out the release PR branch
2. Edit `CHANGELOG.md` manually
3. Push changes to the PR
4. Merge when satisfied

### To Create an Emergency Release

```bash
# Make your fix
git commit -m "fix: critical security patch"
git push

# Release Please creates/updates PR
# Merge immediately without waiting
```

## When to Use What?

### Use Release Please When:
- ? You want control over release timing
- ? You want to review changes before releasing
- ? You want to combine multiple commits into releases
- ? You want to edit release notes before publishing
- ? You have a testing/QA process before production
- ? **This is YOUR case!**

### Use Semantic Release When:
- Instant releases are acceptable
- No review process needed
- Every commit should deploy immediately
- Fully automated CI/CD is required

### Use Manual Releases When:
- Very irregular release schedule
- Complex release processes
- Non-semantic versioning needed

## Configuration

Release Please is configured in `.github/workflows/release-please.yml`:

```yaml
release-type: node        # For Node.js/npm projects
```

Advanced configuration can be added via `release-please-config.json` if needed.

## Troubleshooting

### Release PR not appearing

**Possible causes:**
- No semantic commits since last release
- Only `chore:`, `docs:`, or `style:` commits (these don't trigger releases)

**Solution:**
- Make a commit with `feat:` or `fix:`
- Check GitHub Actions logs for errors

### Version bump is wrong

**Possible causes:**
- Commit type doesn't match expected bump
- Previous release had a higher version

**Solution:**
- Close the PR and push a correcting commit
- Or manually edit `package.json` in the release PR

### Deployment not triggering after merge

**Possible causes:**
- Deploy workflow not configured for releases
- GitHub Release not created

**Solution:**
- Check `.github/workflows/deploy.yml` has `on: release:`
- Check GitHub Actions logs
- Verify release was created in Releases tab

### Want to skip CI/CD

To commit without triggering Release Please:

```bash
git commit -m "chore: update comments [skip ci]"
```

## Common Questions

**Q: What if I push non-releasable code?**  
A: Don't merge the release PR. Fix the code, push more commits, then merge when ready.

**Q: Can I skip a release?**  
A: Yes! Close the PR without merging. Future commits will create a new PR.

**Q: How do I release immediately?**  
A: Merge the release PR right away. Still faster than manual!

**Q: What if multiple people push commits?**  
A: They all go into the same release PR. Perfect for team collaboration.

**Q: Can I edit the version number?**  
A: You can edit `package.json` in the release PR if needed, but it's usually automatic.

**Q: What about hotfixes to old versions?**  
A: Create a branch from the old tag, commit, and manually release. (Advanced)

## Local Development

During local development (`npm run dev`), the app uses the fallback version defined in `public/version.js`:

```javascript
export const VERSION = '0.0.0-dev';
```

The actual version is only injected during the CI/CD build process.

## Migration from Manual Versioning

### Before (Manual)
1. Edit `public/version.js` manually
2. Commit: `git commit -m "Release v2.7.0"`
3. Push: `git push origin main`
4. Deployment happens automatically

### Now (Release Please)
1. Commit with semantic message: `git commit -m "feat: add new feature"`
2. Push: `git push origin main`
3. Review the release PR that Release Please creates
4. Merge the PR when ready to release
5. Deployment happens on merge

## Best Practices

### ? DO

- Use semantic commit messages consistently
- Review release PRs before merging
- Accumulate related changes into one release
- Edit CHANGELOG.md in the PR if needed
- Merge release PRs when ready to go live
- Let changes accumulate - don't merge PRs immediately
- Check GitHub PRs periodically
- Merge strategically - time releases with your schedule

### ? DON'T

- Manually edit version numbers in `package.json`
- Ignore release PRs for too long (they accumulate changes)
- Merge release PRs without reviewing
- Use vague commit messages
- Manually edit `public/version.js` (it's auto-generated)
- Merge release PRs immediately - let changes build up
- Skip reviews - always check the PR before merging

## Comparison: Release Please vs Semantic Release vs Manual

| Feature | Release Please | Semantic Release | Manual |
|---------|---------------|------------------|---------|
| **Control** | ? Full (PR-based) | ? None (automatic) | ? Full |
| **Review** | ? Before release | ? No review | ? Manual review |
| **Timing** | ? When you merge | ? Immediate | ? Manual |
| **Versioning** | ? Automatic | ? Automatic | ? Manual |
| **Changelog** | ? Auto-generated | ? Auto-generated | ? Manual |
| **Accumulation** | ? Yes | ? No | ? No |
| **Edit Notes** | ? In PR | ? After release | ? Manual |
| **Rollback** | ? Don't merge | ? Manual revert | ? Manual |

## Resources

- [Release Please Documentation](https://github.com/googleapis/release-please)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning (SemVer)](https://semver.org/)
