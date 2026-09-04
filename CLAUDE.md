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

## Recognizing when a change also needs an integration test

The Stop hook and CI gate only check for a paired **unit** test (see "Where tests live" above) — they have no concept of integration tests and won't ask for one. So this is on you, as a judgment call, not a mechanical check: when a change introduces or touches a real external dependency — a database, an HTTP/network call, the filesystem, a queue, or a new API/CLI boundary (including cloud SDK clients — Azure Service Bus, Blob Storage, Cosmos DB, Key Vault, etc. — even wrapped in a thin internal helper) — or wires multiple components together through real (non-mocked) dependency injection, generate or update the integration test yourself, the same way unit tests are non-optional above — don't just flag it and stop.

Before writing a new one, check whether one already exists: this repo's unit-test pairing pattern is an exact filename match, which is too narrow for integration tests — search more broadly (a loose pattern like `{ClassName}.*Tests?\.cs$` / `{module}.*\.test\.ts$` rather than the exact unit-test name), then look inside whatever that finds for this team's integration marker (a test-framework Trait/Category attribute, or a naming convention if the framework has no trait system). See `docs/ai-generated-testing-standard.md` §5a ("Adapting the pattern for integration tests") for the full technique with examples per test library — this repo hasn't picked one yet, so ask rather than guess if it's unclear which marker to use.

If no such dependency is involved, no need to say anything — don't manufacture an integration test for pure logic. (Nothing in this repo's Palindrome/Reverse code has this kind of dependency today, so this shouldn't trigger here yet.)

## Quality bar

This is the condensed checklist — see `docs/ai-generated-testing-standard.md` §6 for the full explanation and examples of what fails each point.

1. Asserts behavior, not implementation.
2. Covers the actual change, plus an edge case and a failure path.
3. Independent and deterministic — no shared state, no ordering dependence.
4. Readable on its own, without needing the PR description.
5. Never merged disabled/skipped without a linked reason.

## Demo stories in this repo

- **Story 1 — already implemented** (`dotnet/src/PalindromeChecker/Palindrome.cs`, `js/src/palindrome.ts`): a case-sensitive palindrome check with no punctuation/whitespace handling. Both have passing tests already. This is the "new class" story, shipped as the baseline so the demo can start from a green build.
- **Story 2 — open, not yet implemented**: see README.md's Demo 2 and Demo 3 sections for the full prompt (also postable as a real GitHub issue via the "Enhance / modify existing class" template). It asks for punctuation/case/whitespace-insensitive matching — a change to the *existing* `Palindrome`/`palindrome` code, which is what exercises the "existing test not updated" branch of the pairing check. Do not pre-solve this story when just exploring the repo — it's meant to be run live. See the root `README.md` for the full walkthrough.
