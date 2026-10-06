#!/usr/bin/env python3
"""Commit staged project changes, up to a stable random daily limit of three."""

import argparse
import datetime
import hashlib
import subprocess
import sys
from pathlib import Path

REPOSITORY_ROOT = Path(__file__).resolve().parent
MAX_DAILY_COMMITS = 3
AUTOMATION_MARKER = "Automation: daily_commit.py"


def run_git(*arguments: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *arguments],
        cwd=REPOSITORY_ROOT,
        text=True,
        capture_output=True,
        check=False,
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Commit staged project changes, up to a stable random limit of 1-3 "
            "automation commits per UTC day. Each run creates at most one commit."
        )
    )
    parser.add_argument("--message", required=True, help="Describe the actual staged change")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be committed")
    args = parser.parse_args()

    message = args.message.strip()
    if not message:
        parser.error("--message must describe the actual change")

    repo_check = run_git("rev-parse", "--show-toplevel")
    if repo_check.returncode != 0:
        print(
            repo_check.stderr.strip() or "This directory is not inside a Git repository.",
            file=sys.stderr,
        )
        return repo_check.returncode

    today = datetime.datetime.now(datetime.timezone.utc).date()
    tomorrow = today + datetime.timedelta(days=1)
    daily_seed = hashlib.sha256(f"{REPOSITORY_ROOT}:{today.isoformat()}".encode()).digest()
    daily_limit = int.from_bytes(daily_seed[:8], "big") % MAX_DAILY_COMMITS + 1

    daily_history = run_git(
        "log",
        "HEAD",
        f"--since={today.isoformat()}T00:00:00Z",
        f"--until={tomorrow.isoformat()}T00:00:00Z",
        "--fixed-strings",
        f"--grep={AUTOMATION_MARKER}",
        "--format=%H",
    )
    if daily_history.returncode != 0:
        print(daily_history.stderr.strip(), file=sys.stderr)
        return daily_history.returncode
    commits_today = len(daily_history.stdout.splitlines())

    staged = run_git("diff", "--cached", "--name-only")
    if staged.returncode != 0:
        print(staged.stderr.strip(), file=sys.stderr)
        return staged.returncode

    print(f"Today's UTC automation commits: {commits_today}/{daily_limit}")
    if commits_today >= daily_limit:
        print("Today's commit limit has been reached. Staged changes were left untouched.")
        return 0

    if staged.stdout.strip():
        print("Staged files:")
        print(staged.stdout.strip())
    else:
        print("Nothing is staged. Stage real project changes before creating a commit.")

    print(f"Commit message: {message}")
    if args.dry_run:
        if staged.stdout.strip():
            print(f"Dry run: would create commit {commits_today + 1}/{daily_limit}; no commit created.")
        else:
            print("Dry run: no commit created.")
        return 0

    if not staged.stdout.strip():
        return 1

    commit = run_git("commit", "-m", message, "-m", AUTOMATION_MARKER)
    if commit.stdout:
        print(commit.stdout, end="")
    if commit.stderr:
        print(commit.stderr, end="", file=sys.stderr)
    if commit.returncode == 0:
        print(f"Created daily automation commit {commits_today + 1}/{daily_limit}.")
    return commit.returncode


if __name__ == "__main__":
    raise SystemExit(main())
