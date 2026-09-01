#!/usr/bin/env python3
"""
check_test_pairing.py — shared logic used by BOTH the Claude Code Stop
hook (locally, every turn) and the CI "Test Presence Gate" workflow (on
every PR). One script, two callers, so the two enforcement layers cannot
quietly drift apart.

What it checks: not just "did some test file change somewhere in this
diff" (too coarse — a developer touching an unrelated test would satisfy
that), but for EACH changed source file, whether that SPECIFIC file's
paired test file exists at all, and if it exists, whether it was also
part of this change. This is what makes it work for "modify an existing
class" stories, not just "add a new class" stories:

  - Source file changed, no test file matching it exists anywhere
    in the repo  -> FAIL: "no test found for X"
  - Source file changed, a matching test file exists but was NOT
    touched in this diff                    -> FAIL: "existing test for
                                                 X not updated"
  - Source file changed, matching test file also in the diff -> OK

Usage:
  Local, uncommitted changes (Stop hook):
      check_test_pairing.py --local
  CI, against a base branch:
      check_test_pairing.py --base origin/main

Exit 0 = pass (or nothing relevant changed). Exit 1 = fail; a report is
printed to stdout either way.
"""
import argparse
import pathlib
import re
import subprocess
import sys

# --- adjust these two things per repo -------------------------------
SOURCE_EXTENSIONS = {".cs", ".ts", ".tsx", ".js", ".jsx"}


def is_test_file(path: str) -> bool:
    return bool(re.search(r"(Tests?\.cs$|\.(test|spec)\.[jt]sx?$|(^|/)(tests?|__tests__)/)", path))


def test_name_patterns(src_path: str):
    """Regex patterns a paired test file for src_path is expected to match."""
    p = pathlib.PurePosixPath(src_path)
    stem, ext = p.stem, p.suffix
    if ext == ".cs":
        return [rf"(^|/){re.escape(stem)}Tests?\.cs$"]
    if ext in (".ts", ".tsx", ".js", ".jsx"):
        return [rf"(^|/){re.escape(stem)}\.(test|spec){re.escape(ext)}$"]
    return []


# ---------------------------------------------------------------------


def git(*args) -> str:
    return subprocess.run(
        ["git", *args], capture_output=True, text=True, check=True
    ).stdout


def has_head() -> bool:
    return subprocess.run(
        ["git", "rev-parse", "--verify", "HEAD"], capture_output=True
    ).returncode == 0


def changed_files_local():
    # A brand-new repo with no commits yet has no HEAD to diff against —
    # fall back to staged changes only in that case rather than failing.
    tracked_diff = git("diff", "--name-only", "HEAD") if has_head() else git("diff", "--name-only", "--cached")
    untracked = git("ls-files", "--others", "--exclude-standard")
    return sorted(set(filter(None, (tracked_diff + untracked).splitlines())))


def changed_files_ci(base: str):
    branch = base.split("/")[-1]
    subprocess.run(["git", "fetch", "origin", branch, "--depth=1"], check=False)
    out = git("diff", "--name-only", f"{base}...HEAD")
    return sorted(set(filter(None, out.splitlines())))


def universe_of_files():
    tracked = git("ls-files").splitlines()
    untracked = git("ls-files", "--others", "--exclude-standard").splitlines()
    return set(tracked) | set(untracked)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    group = ap.add_mutually_exclusive_group(required=True)
    group.add_argument("--local", action="store_true", help="check uncommitted changes vs HEAD")
    group.add_argument("--base", help="check changes vs this base ref, e.g. origin/main")
    args = ap.parse_args()

    try:
        changed = changed_files_local() if args.local else changed_files_ci(args.base)
    except subprocess.CalledProcessError as e:
        print(f"check_test_pairing: git command failed, skipping check: {e}")
        return 0

    if not changed:
        print("No changes detected — nothing to check.")
        return 0

    src_files = [
        f for f in changed
        if pathlib.PurePosixPath(f).suffix in SOURCE_EXTENSIONS and not is_test_file(f)
    ]
    if not src_files:
        print("No source files changed — nothing to check.")
        return 0

    changed_set = set(changed)
    universe = universe_of_files()

    missing_new = []
    missing_update = []

    for f in src_files:
        patterns = test_name_patterns(f)
        if not patterns:
            continue
        existing = [t for t in universe if any(re.search(p, t) for p in patterns)]
        if not existing:
            missing_new.append(f)
            continue
        touched = [t for t in existing if t in changed_set]
        if not touched:
            missing_update.append((f, existing))

    if not missing_new and not missing_update:
        print("OK — every changed source file has a paired test change.")
        return 0

    print("Test pairing check failed.\n")
    if missing_new:
        print("No test file found anywhere for these changed source files:")
        for f in missing_new:
            print(f"  - {f}")
        print()
    if missing_update:
        print("Existing test file(s) found but NOT updated in this change:")
        for f, existing in missing_update:
            print(f"  - {f}  (existing test: {', '.join(existing)})")
        print()
    print(
        "If an existing test still fully covers the change (e.g. a pure "
        "refactor with identical behavior), state that explicitly instead "
        "of editing it just to satisfy this check. Otherwise add or update "
        "the test before finishing."
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())
