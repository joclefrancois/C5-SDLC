# Contributing

This repo is a proof of concept for the AI SDLC Level 2 testing standard. Full policy: [`docs/ai-generated-testing-standard.md`](docs/ai-generated-testing-standard.md) — see its "How it actually works, in one page" section for the mechanism, and "Pick what to turn on" for the full menu of options if you're setting this up in a different repo (this one runs everything, blocking; that's not required elsewhere). Short version of what's live here:

- Every source change needs a paired test change — enforced locally by a Claude Code Stop hook and in CI by the Test Presence Gate. This is a *presence* check only (a file changed and was paired), not a quality check — see the standard's §5a and §6.
- The `generate-tests` skill and the CLAUDE.md instructions help Claude draft good tests, but they're advisory — the hook and CI gate above are what actually block a turn or a merge if a test is missing.
- Coverage floor for this repo is 70%, enforced in `dotnet/tests/PalindromeChecker.Tests/PalindromeChecker.Tests.csproj` (`<Threshold>`) and `js/vitest.config.ts` (`thresholds`) — run the same commands locally before pushing:
  - .NET: `dotnet test dotnet/tests/PalindromeChecker.Tests /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura`
  - JS/TS: `cd js && npm test -- --coverage`
- Open a PR using the template — fill in the Testing section honestly, or cite an exception from §7.
- Genuine exceptions only: docs-only changes, config with no branching logic, generated code with no independent logic, an approved incident hotfix.
- Tests existing and passing is not the same as tests being *good* — that part is still on you and your reviewer (§6).
