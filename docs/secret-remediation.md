# Secret Remediation Runbook

This document provides step-by-step instructions for removing leaked credentials from git history.

## Background

The security audit identified that `.agent/handoff.md` contained a plaintext database password that was committed to the repository. This runbook covers the complete remediation process.

## Prerequisites

Before proceeding, ensure you have:

- [ ] Access to all systems where the credential is used
- [ ] Ability to update credentials in those systems
- [ ] A backup of the repository (just in case)
- [ ] `git-filter-repo` installed

### Installing git-filter-repo

```bash
# Using pip (recommended)
pip install git-filter-repo

# Or using your package manager
# Fedora/RHEL
sudo dnf install git-filter-repo

# Ubuntu/Debian
sudo apt install git-filter-repo

# macOS
brew install git-filter-repo
```

## Step 1: Rotate Credentials (CRITICAL - DO FIRST)

**Before purging history, you MUST rotate the leaked credentials.** Purging history does not protect against credentials that have already been harvested.

### Database Credential Rotation

1. Generate a new strong password
2. Update the database user password:
   ```sql
   ALTER USER your_db_user WITH PASSWORD 'new_secure_password';
   ```
3. Update all services that use this credential:
   - Application `.env` files (local dev)
   - Vercel environment variables
   - DigitalOcean droplet environment
   - Any CI/CD secrets
4. Verify all services can still connect
5. Document the rotation in your secrets management system

### Other Credentials to Check

Review `.agent/handoff.md` for any other sensitive values:
- API keys
- OAuth secrets
- SSH keys or tokens
- Any other passwords

Rotate ALL identified credentials before proceeding.

## Step 2: Prepare the Repository

```bash
# Ensure you're on the correct branch
git checkout infra/split-vercel-terminal

# Ensure working tree is clean
git status

# Pull latest changes
git pull origin infra/split-vercel-terminal

# Verify git-filter-repo is installed
git-filter-repo --version
```

## Step 3: Run the Purge Script

The script is located at `scripts/purge-secret.sh`. Review it before running:

```bash
# Review the script
cat scripts/purge-secret.sh

# Run the script (interactive, requires confirmation)
bash scripts/purge-secret.sh
```

The script will:
1. Confirm prerequisites are met
2. Ask for confirmation that credentials have been rotated
3. Require typing "PURGE" to proceed
4. Remove `.agent/handoff.md` from all commits
5. Provide next steps

## Step 4: Force Push (MANUAL)

After the history rewrite, you must force-push:

```bash
# Force push all branches
git push --force --all

# Force push all tags
git push --force --tags
```

**Warning:** This will affect all collaborators. They will need to re-clone or reset their local copies.

## Step 5: Notify Collaborators

Send notification to all repository collaborators:

```
Subject: Repository History Rewritten - Action Required

The repository history has been rewritten to remove a leaked credential.

Required action:
1. Delete your local clone
2. Re-clone the repository:
   git clone <repo-url>

OR if you have local changes:
1. Backup any uncommitted work
2. Run:
   git fetch --all
   git reset --hard origin/<your-branch>
```

## Step 6: Verify Remediation

Confirm the file is completely removed from history:

```bash
# Should return nothing
git log --all --full-history -- .agent/handoff.md

# Double-check with grep across all refs
git grep -l "handoff.md" $(git rev-list --all) 2>/dev/null || echo "Not found (good)"
```

## Step 7: Post-Remediation Checklist

- [ ] Database credential rotated and verified
- [ ] All other identified credentials rotated
- [ ] History rewrite completed successfully
- [ ] Force push completed
- [ ] Collaborators notified
- [ ] Verification checks passed
- [ ] Old credential confirmed non-functional
- [ ] Incident documented (if required by policy)

## Troubleshooting

### "git-filter-repo not found"

Install using pip: `pip install git-filter-repo`

### "Working tree is not clean"

Commit or stash your changes before running the script.

### Force push rejected

If protected branch rules block force push:
1. Temporarily disable branch protection in GitHub settings
2. Force push
3. Re-enable branch protection

### Collaborator has old history

They must either re-clone or run:
```bash
git fetch --all
git reset --hard origin/main
```

## References

- [git-filter-repo documentation](https://github.com/newren/git-filter-repo)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
