#!/usr/bin/env bash
# Stop hook — blocks Claude Code from ending its turn if a changed source
# file doesn't have a paired test file that was also touched in this
# change (new or existing). Delegates the actual pairing logic to
# check_test_pairing.py so the local hook and the CI presence gate can't
# drift apart — see that file for the matching rules.
#
# Registered in .claude/settings.json under hooks.Stop. Docs (verify
# against your installed Claude Code version — hook schemas do change):
# https://code.claude.com/docs/en/hooks
#
# Escape hatch: set SKIP_TEST_GATE=1 in the environment Claude Code runs in
# to bypass this check for one turn. Use only for the exceptions listed in
# the org's Testing Standard §7 (docs-only, config-only change with no
# independent logic, an approved incident hotfix) — and still note the
# exception in the PR, same as the CI gate expects. This is a convenience
# valve for humans, not something Claude should set on its own.

set -uo pipefail

if [ "${SKIP_TEST_GATE:-0}" = "1" ]; then
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${CLAUDE_PROJECT_DIR:-.}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  exit 0  # not a git repo — nothing to check
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "check-tests.sh: python3 not found — skipping the test pairing check this turn. Install python3 to enable this gate." >&2
  exit 0
fi

OUTPUT="$(python3 "$SCRIPT_DIR/check_test_pairing.py" --local 2>&1)"
CODE=$?

if [ "$CODE" -ne 0 ]; then
  echo "$OUTPUT" >&2
  echo "" >&2
  echo "Per this repo's AI-Generated Testing Standard (see CLAUDE.md), fix this before finishing this turn — add or update the missing test(s), or state explicitly why this change needs none (see the Testing Standard §7 exceptions)." >&2

  # Current contract (per code.claude.com/docs/en/hooks): JSON on stdout
  # can also carry a systemMessage. Emitted defensively in case this
  # Claude Code version reads it instead of, or in addition to, stderr.
  MSG="$OUTPUT

Per this repo's AI-Generated Testing Standard (see CLAUDE.md), fix this before finishing this turn — add or update the missing test(s), or state explicitly why this change needs none (see the Testing Standard §7 exceptions)."
  printf '{"systemMessage": %s}\n' "$(printf '%s' "$MSG" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')"

  exit 2
fi

exit 0
