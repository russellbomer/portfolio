#!/usr/bin/env bash
# =============================================================================
# purge-secret.sh
#
# Removes .agent/handoff.md from git history to remediate leaked credentials.
#
# WARNING: This script rewrites git history. After running:
#   1. Force-push will be required
#   2. All collaborators must re-clone or rebase
#   3. This action is irreversible
#
# Prerequisites:
#   - git-filter-repo installed (pip install git-filter-repo)
#   - Clean working tree (no uncommitted changes)
#   - All remote work pulled
#
# See docs/secret-remediation.md for full runbook.
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}=============================================${NC}"
echo -e "${RED}  WARNING: DESTRUCTIVE GIT HISTORY REWRITE  ${NC}"
echo -e "${RED}=============================================${NC}"
echo ""
echo "This script will:"
echo "  1. Remove .agent/handoff.md from ALL commits in history"
echo "  2. Rewrite commit hashes (all commits will have new SHAs)"
echo "  3. Require force-push to update remote"
echo ""
echo -e "${YELLOW}Prerequisites:${NC}"
echo "  - git-filter-repo installed"
echo "  - Clean working tree"
echo "  - Credentials already rotated"
echo ""

# Check for git-filter-repo
if ! command -v git-filter-repo &> /dev/null; then
    echo -e "${RED}ERROR: git-filter-repo not found${NC}"
    echo "Install with: pip install git-filter-repo"
    exit 1
fi

# Check for clean working tree
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${RED}ERROR: Working tree is not clean${NC}"
    echo "Commit or stash changes before running this script."
    exit 1
fi

# Confirmation prompt
echo -e "${YELLOW}Have you already rotated the leaked credentials? (y/N)${NC}"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "Aborting. Rotate credentials first, then re-run this script."
    exit 1
fi

echo ""
echo -e "${YELLOW}Final confirmation: Type 'PURGE' to proceed:${NC}"
read -r confirm
if [[ "$confirm" != "PURGE" ]]; then
    echo "Aborting."
    exit 1
fi

echo ""
echo "Removing .agent/handoff.md from history..."

# Remove the file from all history
git filter-repo --path .agent/handoff.md --invert-paths --force

echo ""
echo -e "${YELLOW}=============================================${NC}"
echo -e "${YELLOW}  History rewritten successfully!            ${NC}"
echo -e "${YELLOW}=============================================${NC}"
echo ""
echo "Next steps (MANUAL):"
echo "  1. Force-push all branches:"
echo "     git push --force --all"
echo "     git push --force --tags"
echo ""
echo "  2. Notify collaborators to re-clone or:"
echo "     git fetch --all"
echo "     git reset --hard origin/<branch>"
echo ""
echo "  3. Verify the file is gone:"
echo "     git log --all --full-history -- .agent/handoff.md"
echo "     (should return nothing)"
echo ""
