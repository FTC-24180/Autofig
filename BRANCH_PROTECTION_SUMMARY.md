# Branch Protection Implementation Summary

## What Was Done

This PR implements branch protection rules that **require pull requests for merging into main even for administrators**.

## Files Created

### 1. `.github/settings.yml`
- Comprehensive branch protection configuration
- **Key setting:** `enforce_admins: true` - Ensures admins must also use PRs
- Requires at least 1 approval before merging
- Dismisses stale reviews on new commits
- Prevents force pushes and branch deletions
- Requires branches to be up to date before merging

### 2. `.github/README.md`
- Detailed documentation on the branch protection setup
- Multiple methods to apply the settings:
  - Probot Settings App (automatic)
  - GitHub Actions workflow (semi-automatic)
  - GitHub Web UI (manual)
  - GitHub CLI (scripted)
  - Terraform (infrastructure as code)
- Explanation of impact on workflow
- Verification steps

### 3. `.github/workflows/apply-branch-protection.yml`
- GitHub Actions workflow to programmatically apply settings
- Can be manually triggered
- Supports dry-run mode for testing
- Uses GitHub API to configure branch protection

## How to Apply (Choose One Method)

### Method 1: Probot Settings App (Recommended)
1. Go to https://github.com/apps/settings
2. Click "Install"
3. Select the FTC-24180/Autofig repository
4. The app will automatically read `.github/settings.yml` and apply it

**Pros:** Automatic, keeps settings in sync with the file
**Cons:** Requires installing a GitHub App

### Method 2: GitHub Actions Workflow
1. Go to https://github.com/FTC-24180/Autofig/actions
2. Click "Apply Branch Protection" workflow
3. Click "Run workflow"
4. (Optional) Check "Dry run" to preview changes
5. Click "Run workflow" button

**Pros:** Quick, built-in, no external apps
**Cons:** Requires manual triggering, needs appropriate permissions

### Method 3: GitHub Web UI
1. Go to https://github.com/FTC-24180/Autofig/settings/branches
2. Click "Add rule" (or edit existing rule for `main`)
3. Branch name pattern: `main`
4. Check these options:
   - ✅ Require a pull request before merging
     - Required approvals: 1
     - Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
     - Require branches to be up to date before merging
   - ✅ **Do not allow bypassing the above settings** (KEY SETTING)
5. Save changes

**Pros:** Visual, no code needed
**Cons:** Manual, settings not version-controlled

### Method 4: GitHub CLI
See `.github/README.md` for detailed CLI commands.

**Pros:** Scriptable, repeatable
**Cons:** Requires gh CLI tool and token

## Verification

After applying, verify the settings:

1. Go to: https://github.com/FTC-24180/Autofig/settings/branches
2. Look for branch protection rule on `main`
3. Verify "Do not allow bypassing the above settings" is checked
4. Try pushing directly to main as an admin - it should be rejected

## Impact on Workflow

### Before (Without Branch Protection)
- Admins could push directly to `main`
- No review required for any changes
- Risk of accidental direct commits

### After (With Branch Protection)
- **Everyone** (including admins) must:
  - Create a feature branch
  - Make changes on the branch
  - Push the branch
  - Create a pull request
  - Get at least 1 approval
  - Merge via GitHub UI
- No direct pushes to `main` allowed
- No force pushes allowed
- Branch must be up to date before merging

## Emergency Bypass

If an emergency requires bypassing branch protection:

1. Admin goes to: https://github.com/FTC-24180/Autofig/settings/branches
2. Click "Edit" on the main branch rule
3. Uncheck "Do not allow bypassing the above settings"
4. Make the emergency change
5. **Important:** Re-enable "Do not allow bypassing" after the emergency

## Testing

To test that the protection is working:

1. As an admin, try to push directly to main:
   ```bash
   git checkout main
   echo "test" >> test.txt
   git add test.txt
   git commit -m "test direct push"
   git push origin main
   ```
   
   Expected result: Push should be rejected with an error message about branch protection.

2. Verify the correct workflow:
   ```bash
   git checkout -b test-branch
   echo "test" >> test.txt
   git add test.txt
   git commit -m "test via PR"
   git push origin test-branch
   # Create PR on GitHub
   # Get approval
   # Merge via GitHub UI
   ```
   
   Expected result: PR can be created and merged successfully.

## Questions?

See `.github/README.md` for more detailed information about:
- Detailed explanation of each setting
- Alternative implementation methods
- Troubleshooting steps
- GitHub API documentation references
