# AI SDLC Level 2 — Proof of Concept

> This repo demonstrates the "AI-generated tests are the default" standard end to end: a Definition-of-Done line, a PR template checklist, a local Stop hook, and CI gates, working together across two demo stories. Full policy: `docs/ai-generated-testing-standard.md`.

## Project context

- **Stack:** two parallel demo trees — .NET 8 (`dotnet/`) and TypeScript (`js/`) — so both halves of the org can see their own toolchain in the walkthrough.
- **Test frameworks:** xUnit + Coverlet (`dotnet/`); Vitest (`js/`).
- **Build/test commands:**
  - .NET: `dotnet test dotnet/tests/PalindromeChecker.Tests /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura`
  - JS/TS: `cd js && npm test -- --coverage`
- **Where tests live:** `dotnet/tests/PalindromeChecker.Tests/*Tests.cs` mirrors `dotnet/src/PalindromeChecker/*.cs`; `js/src/*.test.ts` is co-located with its source file.
- **Coverage floor for this repo:** 70% (see `dotnet/tests/PalindromeChecker.Tests/PalindromeChecker.Tests.csproj`'s `<Threshold>` and `js/vitest.config.ts`'s `thresholds` — those are what's actually enforced; this line just documents the same number).

## Enforcement, not just instruction

This repo runs a **Stop hook** (`.claude/hooks/check-tests.sh` → `.claude/hooks/check_test_pairing.py`, registered in `.claude/settings.json`) that checks, every time you try to end a turn, whether a changed source file has a paired test file that was also changed. If not, it blocks the turn and tells you what's missing — for both a brand-new file and a modification to an existing one (see `docs/ai-generated-testing-standard.md` §5a for exactly how the pairing works). Treat a block as a hard requirement. If a change genuinely needs no test, say so explicitly rather than editing a test file just to get past the check.

## Testing is not optional — it's part of the change

Every time you write or modify logic in `dotnet/src/` or `js/src/`, generate or update the matching test in the same response, before considering the change finished. Cover the happy path, at least one edge case, and at least one failure/invalid-input path.

## Quality bar

1. Asserts behavior, not implementation.
2. Covers the actual change, plus an edge case and a failure path.
3. Independent and deterministic — no shared state, no ordering dependence.
4. Readable on its own, without needing the PR description.
5. Never merged disabled/skipped without a linked reason.

## Demo stories in this repo

- **Story 1 — already implemented** (`dotnet/src/PalindromeChecker/Palindrome.cs`, `js/src/palindrome.ts`): a case-sensitive palindrome check with no punctuation/whitespace handling. Both have passing tests already. This is the "new class" story, shipped as the baseline so the demo can start from a green build.
- **Story 2 — open, not yet implemented**: see the issue body in `docs/demo-story-2-issue.md` (also postable as a real GitHub issue via the "Enhance existing feature" template). It asks for punctuation/case/whitespace-insensitive matching — a change to the *existing* `Palindrome`/`palindrome` code, which is what exercises the "existing test not updated" branch of the pairing check. Do not pre-solve this story when just exploring the repo — it's meant to be run live. See the root `README.md` for the full walkthrough.
