---
name: generate-tests
description: >
  Generate or update unit/integration/functional tests for the current
  branch's changes, per the org's AI-Generated Testing Standard (AI SDLC
  Level 2). Use when the user asks to "generate tests", "write tests for
  my changes", "cover this PR with tests", or runs /generate-tests before
  opening a pull request. Also appropriate to invoke proactively at the
  end of a coding task, right before telling the user the change is done.
---

# Generate tests for this change

This skill packages the org's AI-Generated Testing Standard into a repeatable procedure so any team can run it the same way. Full policy: `{{TESTING_STANDARD_LINK}}`.

## When to use this

- Before opening a PR, to make sure the diff includes the tests the PR template and CI gate will expect.
- Right after implementing a feature or fix, as the last step before calling the work done.
- When asked directly to add or generate tests for specific files or a specific PR.

## Steps

1. **Scope the change.** Determine the base branch (`main` or `develop` unless told otherwise) and get the diff: `git diff --name-only origin/<base>...HEAD`. Separate this into source files vs. existing test files vs. docs/config.

2. **Classify each source file.**
   - Has independent logic (branches, calculations, state transitions, error handling) → needs tests.
   - Is pure config, generated code with no independent logic, or docs → exempt; note it and move on (this matches the Testing Standard's exception list — don't invent new exemptions).

3. **For each file that needs tests**, delegate to (or follow the same procedure as) the `test-writer` subagent if this repo has one configured, or otherwise:
   - Find the repo's existing test naming/location convention (check `CLAUDE.md` first, then confirm against an existing test file — don't assume a convention that isn't already in use).
   - Design cases: happy path, an edge case, a failure path — before writing any code.
   - Write tests that assert behavior (not implementation), are deterministic, and are readable standalone.
   - Add or update the test file accordingly.

4. **Run the test suite** for the affected package(s) and confirm everything passes, including pre-existing tests (a new test breaking an old one is a signal the change has a side effect worth flagging, not something to paper over).

5. **Check coverage delta** if the repo's test runner reports it (`dotnet test /p:CollectCoverage=true`, `npm test -- --coverage`, etc.) against the repo's floor documented in `CLAUDE.md` / the CI coverage workflow.

6. **Prepare the PR-ready summary** — this is what goes into the pull request description under the "Testing (AI SDLC Level 2)" section:
   - Which behaviors are now covered (happy path / edge case / failure path, per file).
   - Coverage delta.
   - Any file left untested and why (must match an approved exception, or flag to the human that one may be needed).

## Quality bar (do not skip this)

A test that only exists to satisfy a coverage number, without a meaningful assertion, does not satisfy this skill's purpose even if CI would pass it. Before finishing, check every test written against:

- Fails if behavior changes; doesn't fail on harmless refactors.
- Covers at least one edge case and one failure/error path per changed unit of behavior, not just the happy path.
- No shared state between tests, no ordering dependence, no real network/clock/filesystem calls in a unit test.
- Understandable from its name and body alone, without the PR description.
- Not disabled/skipped — a skip needs a linked ticket, not silence.

## Output

End by stating plainly: which files now have tests, which (if any) are exempt and why, the coverage delta, and that the PR template's testing checklist can be filled in from this summary. If something couldn't be tested and doesn't match an approved exception, say so explicitly rather than leaving it ambiguous — that gap is what the CI presence gate and human review are there to catch, but flagging it here saves a review round-trip.
