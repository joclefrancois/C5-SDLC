# Contributing

This repo is a proof of concept for Harris E-commerce's AI SDLC Level 2 testing standard. Full policy: [`docs/ai-generated-testing-standard.md`](docs/ai-generated-testing-standard.md). Short version:

- Every source change needs a paired test change — enforced locally by a Claude Code Stop hook and in CI by the Test Presence Gate. See the standard's §5a and §6 (quality bar) before you argue with the gate.
- Coverage floor for this repo is 70%, enforced in `dotnet/tests/PalindromeChecker.Tests/PalindromeChecker.Tests.csproj` (`<Threshold>`) and `js/vitest.config.ts` (`thresholds`) — run the same commands locally before pushing:
  - .NET: `dotnet test dotnet/tests/PalindromeChecker.Tests /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura`
  - JS/TS: `cd js && npm test -- --coverage`
- Open a PR using the template — fill in the Testing section honestly, or cite an exception from §7.
- Genuine exceptions only: docs-only changes, config with no branching logic, generated code with no independent logic, an approved incident hotfix.
