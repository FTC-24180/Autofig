# Branch Protection Configuration

This directory contains repository configuration files that define branch protection rules and other GitHub repository settings.

## Settings File: `settings.yml`

The `settings.yml` file defines branch protection rules that **require pull requests even for administrators** when merging into the `main` branch.

### Key Branch Protection Features

1. **Require Pull Request Reviews** (`required_pull_request_reviews`)
   - At least 1 approving review required before merging
   - Stale reviews are dismissed when new commits are pushed

2. **Enforce for Administrators** (`enforce_admins: true`)
   - **This is the critical setting** that ensures even repository administrators must create pull requests and cannot push directly to `main`
   - Administrators are subject to all the same branch protection rules as other contributors

3. **Additional Protections**
   - No force pushes allowed
   - No branch deletions allowed
   - Require branches to be up to date before merging

## How to Apply These Settings

There are several ways to apply these branch protection settings to your GitHub repository:

### Option 1: Using Probot Settings App (Recommended)

1. Install the [Probot Settings app](https://github.com/apps/settings) on your repository
2. The app will automatically read and apply the settings from `.github/settings.yml`
3. Any changes pushed to this file will be automatically applied

### Option 2: Using GitHub Web UI (Manual)

1. Go to your repository on GitHub
2. Click **Settings** → **Branches**
3. Under "Branch protection rules", click **Add rule**
4. For "Branch name pattern", enter: `main`
5. Enable the following options:
   - ✅ **Require a pull request before merging**
     - Require approvals: 1
     - Dismiss stale pull request approvals when new commits are pushed
   - ✅ **Require status checks to pass before merging**
     - Require branches to be up to date before merging
   - ✅ **Do not allow bypassing the above settings** (This enforces for admins)
   - ✅ Other settings as desired (see `settings.yml` for reference)
6. Click **Create** or **Save changes**

### Option 3: Using GitHub CLI

```bash
# This requires the gh CLI tool and appropriate permissions
# Update the rule to enforce admin restrictions
gh api -X PUT repos/FTC-24180/Autofig/branches/main/protection \
  --input .github/settings.yml
```

### Option 4: Using Terraform

If you use Terraform for infrastructure as code:

```hcl
resource "github_branch_protection" "main" {
  repository_id = "Autofig"
  pattern       = "main"
  
  enforce_admins = true  # Key setting for admin enforcement
  
  required_pull_request_reviews {
    required_approving_review_count = 1
    dismiss_stale_reviews           = true
  }
  
  required_status_checks {
    strict = true
  }
}
```

## Verifying Branch Protection

To verify that branch protection is correctly configured:

1. Go to: `https://github.com/FTC-24180/Autofig/settings/branches`
2. Look for the `main` branch protection rule
3. Verify that "Do not allow bypassing the above settings" is checked
4. Try to push directly to `main` as an admin - it should be blocked

## Impact on Workflow

With these settings enabled:

✅ **For all users (including admins)**:
- Must create a pull request to make changes to `main`
- Must get at least 1 approval before merging
- Cannot force push to `main`
- Cannot delete the `main` branch
- Must keep branch up to date before merging

✅ **Workflow remains unchanged**:
- Create a feature branch
- Make your changes
- Push to your branch
- Create a pull request
- Get approval (or approve your own PR if you have write access)
- Merge via GitHub UI

## Notes

- The `enforce_admins: true` setting is what ensures administrators must follow the same rules
- This prevents accidental direct pushes to `main` and maintains code review standards
- Emergency bypassing may require temporarily disabling branch protection (admin only)

## References

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Probot Settings App](https://github.com/probot/settings)
- [GitHub REST API - Branch Protection](https://docs.github.com/en/rest/branches/branch-protection)
