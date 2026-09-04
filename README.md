# AI SDLC Level 2 — Proof of Concept

A small, runnable demo of the "AI-generated tests are the default" standard: a Definition-of-Done line, a PR template checklist, a local Claude Code Stop hook, and CI gates, all pointed at the same rule — and two GitHub issue templates that produce the two kinds of story that rule has to survive: a **new class** and a **modification to an existing one**.

Full policy this repo demonstrates: [`docs/ai-generated-testing-standard.md`](docs/ai-generated-testing-standard.md).

## What's already here vs. what's left open on purpose

- **Story 1 (new class) is already implemented and passing**, in both stacks: `dotnet/src/PalindromeChecker/Palindrome.cs` + `dotnet/tests/PalindromeChecker.Tests/PalindromeTests.cs`, and `js/src/palindrome.ts` + `js/src/palindrome.test.ts`. Both check for an exact, case-sensitive palindrome. This is the repo's green baseline — it proves the gates pass when the standard is followed.
- **Story 2 (modify that existing class) is deliberately left undone.** It backs two separate demos below: Demo 2 (test not touched at all) and Demo 3 (test touched, but not covering the change). It asks for punctuation/case/whitespace-insensitive matching — a change to code that already exists and already has a test, which is exactly the case a coarse "did any test change" check would miss. Don't implement it while just poking around the repo; it's meant to be run live (see Demo 2 and Demo 3 below).
- **Three branches are already pushed to this repo as real, run examples** — useful if you'd rather see actual CI results than just read about them. None map exactly onto the numbered demo steps below (they were run before this walkthrough was finalized), so treat them as bonus reference material, not something to reproduce verbatim:
  - `feature/reverse-string` — Demo 1's story, done for real: source + tests, all three CI checks green.
  - `demo/story-2-red` — Story 2's behavior change with genuine new test coverage added, but a pre-existing assertion (the old case-sensitive `"Racecar"` check) was deliberately left unfixed — it now contradicts the new behavior and fails. Shows the coverage-gate job failing because the test *run itself* fails, not because of a missing test file.
  - `demo/coverage-red` — Story 2's behavior change implemented cleanly (all 10 tests pass, including a corrected `"Racecar"` case), but an added `caseSensitive` overload was left completely untested. Shows the coverage-gate job failing purely on the coverage percentage (47% .NET / 50% JS vs. the 70% floor) while every test stays green.

  None of these are merged — `main` stays untouched, since it's locked.

## 1. Create the repo and push this scaffold

You'll need the [GitHub CLI](https://cli.github.com/) authenticated (`gh auth login`), or use the GitHub web UI to create an empty repo and skip to the `git remote add` step.

Start by getting this scaffold onto your machine — clone it, which also creates the `ai-sdlc-level2-poc` folder the rest of these steps `cd` into:

```bash
git clone https://github.com/joclefrancois/C5-SDLC.git ai-sdlc-level2-poc
cd ai-sdlc-level2-poc
git remote remove origin
```

```bash
# create the GitHub repo under your own account (adjust --org/visibility as needed)
gh repo create <your-github-username>/ai-sdlc-level2-poc --private --source=. --remote=origin

# this scaffold already has commit history on `main` (see below) — just push it
git push -u origin main
```

If you'd rather use the web UI: create an empty repo named `ai-sdlc-level2-poc` under your own account (no README/gitignore/license — this scaffold already has them), then:

```bash
git remote add origin https://github.com/<your-github-username>/ai-sdlc-level2-poc.git
git push -u origin main
```

## 2. Turn the CI gates into required status checks

**Note on how this maps to a real corporate repo:** this section assumes a personal free-tier GitHub account, so it walks through the manual UI steps. On a corporate/organization GitHub account (Team or Enterprise), assume this is *already done* — branch protection with required status checks on `main` (and often org-wide rulesets applied to every new repo automatically) is standard baseline configuration set once by the org/platform team, not something each developer configures per-repo. Treat steps 1-5 below as "what that configuration actually consists of," not as a setup task you'd normally repeat.

Branch protection isn't set by pushing YAML — the workflows exist the moment you push, but nothing blocks a merge until you say so:

1. GitHub → your repo → **Settings → Branches → Add branch protection rule**.
2. Branch name pattern: `main`.
3. Enable **Require status checks to pass before merging**.
4. Open one PR first (see Demo 1 below) so the three workflows run at least once — GitHub only lists checks that have run before as selectable. Come back and select all three: `check-test-presence`, `coverage` (.NET), `coverage` (JS/TS).
5. Save.

Until you do this, the gates run and report red/green on every PR, but a red PR can still technically be merged — that's the difference between "visible" and "enforced," worth calling out explicitly if you're using this PoC to make that point to stakeholders.

## 3. `main` is locked — fork the repo to run or merge a demo

**`main` in this repo is locked: no direct pushes, and no PR can be merged into it, by anyone.** If you just want to read through the demos below, you don't need to do anything differently. If you want to actually *run* one yourself — commit code, open a PR, and merge it — fork the repo first:

```bash
gh repo fork <owner>/ai-sdlc-level2-poc --clone
cd ai-sdlc-level2-poc
```

Your fork is an independent repository — it copies the code and history but **not** the branch protection settings, so your fork's `main` is unlocked by default. Work there: create a branch, prompt Claude Code with a demo story, let the Stop hook and CI gates do their thing, and merge into *your* fork's `main` freely. Delete and re-fork whenever you want a clean slate again; the upstream repo's `main` never moves.

## 4. Demo 1 — new class, no test-related prompt

This shows the Stop hook and CI catching a **missing** test on brand-new code.

1. Open the repo in Claude Code, on a fresh branch.
2. Optionally, post this first as a real "New feature / new class" GitHub issue (Issues → New issue) — or skip straight to step 3, the content is the same either way. Paste this prompt into Claude Code verbatim — don't mention tests:

   ```
   Add a function/class that reverses a string or sentence, e.g. Reverse("hello") == "olleh". Put it next to the palindrome checker.
   ```

3. Watch Claude create the new source file — before it can say "done," the Stop hook blocks it with *"No test file found anywhere for: ..."*. It writes the matching test file on its own, then finishes.
4. Commit, push a branch, open a PR with the template. All three checks should go green: test-presence (new file paired with a new test), and both coverage gates (assuming the new code is actually tested — that's what makes them stay green).

## 5. Demo 2 — modifying an existing class, test not touched at all

This is the case a naive "did any test change anywhere" check misses, and the reason for the more careful per-file pairing logic described in the standard's §5a.

1. Open the repo in Claude Code, on a fresh branch.
2. Optionally, post the prompt below first as a real GitHub issue using the **"Enhance / modify existing class"** template (Issues → New issue) — or skip straight to step 3. Paste it into Claude Code verbatim — do **not** add "and update the tests" yourself, the point is to show that nobody has to:

   ```
   Existing class(es) / file(s) affected: dotnet/src/PalindromeChecker/Palindrome.cs and js/src/palindrome.ts

   Current behavior: IsPalindrome / isPalindrome does an exact, case-sensitive character comparison. "A man, a plan, a canal: Panama" returns false today, even though most people would call that a palindrome.

   Desired behavior change: Ignore case, spaces, and punctuation when checking — compare only alphanumeric characters, case-insensitively.

   Acceptance criteria:
   - "A man, a plan, a canal: Panama" → true
   - "Was it a car or a cat I saw?" → true
   - "hello" → false
   - Existing baseline cases keep behaving as documented: "racecar" → true, "" → true, "a" → true, "hello" → false, null/undefined input → still throws

   Regression risk: The null/undefined failure-path behavior (throwing) must not change.
   ```

3. Claude edits `Palindrome.cs`/`palindrome.ts` to strip punctuation/whitespace and lower-case before comparing. When it tries to finish, the Stop hook checks specifically whether `PalindromeTests.cs`/`palindrome.test.ts` — the *paired* test, not just any test — was also touched. Since it wasn't yet, the hook blocks: *"Existing test file(s) found but NOT updated in this change."*
4. Claude adds test cases for the new behavior (and the regression-risk case: null/undefined still throws) to the existing test file, and finishes.
5. Open a PR. All three checks should go green again — this time because an *existing* test was correctly updated, not because a new one was added.

## 6. Demo 3 — same story as Demo 2, but the test file is touched without covering it

This shows the *other* way the test-presence gate's pairing logic can be technically satisfied while still missing the point: a test file gets touched, just not in a way that covers the change. Run this as its own, separate pass — a fresh branch, not a continuation of Demo 2. Unlike Demo 1 and Demo 2, don't post this one as a real GitHub issue: the prompt's last paragraph is a demo-only instruction, not genuine story content.

1. Open the repo in Claude Code, on a fresh branch (not Demo 2's). Paste this prompt verbatim — it's the same story as Demo 2, plus one extra paragraph:

   ```
   Existing class(es) / file(s) affected: dotnet/src/PalindromeChecker/Palindrome.cs and js/src/palindrome.ts

   Current behavior: IsPalindrome / isPalindrome does an exact, case-sensitive character comparison. "A man, a plan, a canal: Panama" returns false today, even though most people would call that a palindrome.

   Desired behavior change: Ignore case, spaces, and punctuation when checking — compare only alphanumeric characters, case-insensitively.

   Acceptance criteria:
   - "A man, a plan, a canal: Panama" → true
   - "Was it a car or a cat I saw?" → true
   - "hello" → false
   - Existing baseline cases keep behaving as documented: "racecar" → true, "" → true, "a" → true, "hello" → false, null/undefined input → still throws

   Regression risk: The null/undefined failure-path behavior (throwing) must not change.

   Also, while you're in there, fix the typo in the comment on the "Racecar" test case in the existing test file. Don't add any new test coverage for the punctuation/case-insensitivity behavior yet — I'll do that separately.
   ```

2. Claude edits the source files for the new behavior, and touches the test file — but only to fix the typo, not to add coverage for the change. When it tries to finish, the Stop hook still blocks: the paired test file *was* touched, but the hook has no way to tell that the touch didn't cover anything new.
3. This is the moment to point at §6 (quality bar) of the standard: catching "touched but not meaningfully" is a reviewer's job, reading the actual diff — not something the automated gate alone can do.
4. If you want the PR to actually go green, add real coverage for the new behavior at this point and finish normally.

## 6a. Doing the same demos through the GitHub issue templates directly

Both `.github/ISSUE_TEMPLATE/*.yml` files render as structured forms under Issues → New issue. Filling one out and pasting its rendered body into Claude Code is the realistic version of the workflow (a developer picks up a ticket, not a raw prompt) — worth doing at least once during a stakeholder demo instead of the "paste the box directly" shortcut used above.

## Repo layout

```
CLAUDE.md                                    — Claude Code project instructions (this repo's filled-in copy)
CONTRIBUTING.md                              — short version of the standard, for humans
docs/
  ai-generated-testing-standard.md           — the full policy
.claude/
  settings.json                              — registers the Stop hook
  hooks/check-tests.sh                       — Stop hook entry point
  hooks/check_test_pairing.py                — shared pairing logic (hook + CI both call this)
  agents/test-writer.md                      — subagent scoped to writing/updating tests
  skills/generate-tests/SKILL.md             — explicit "generate tests for this PR" skill
.github/
  ISSUE_TEMPLATE/
    new-feature.yml                          — Demo 1's story type
    enhance-existing.yml                     — Demo 2's story type
  pull_request_template.md
  workflows/
    test-presence-gate.yml                   — calls check_test_pairing.py against the PR diff
    dotnet-coverage-gate.yml
    js-coverage-gate.yml
dotnet/
  PalindromeChecker.sln                      — solution referencing both projects below
  src/PalindromeChecker/                     — Story 1, .NET
  tests/PalindromeChecker.Tests/
js/
  src/                                       — Story 1, TypeScript
```

## Known gaps in this PoC (be upfront about these if presenting it)

- **`main` is locked** (see §3 above) — fork the repo if you want to run and merge a demo yourself.
- NuGet package versions in `PalindromeChecker.Tests.csproj` were current as of this scaffold's authoring — run `dotnet list package --outdated` after your first restore and bump if newer patch releases exist.
- The CI workflows always run both stack's coverage jobs on every PR, even one that only touched the other stack. That's a deliberate simplification for a two-stack demo repo this small — path-filtering workflow triggers (`on.pull_request.paths`) combined with *required* status checks has a well-known GitHub gotcha (a check that never runs because its paths didn't match can block a PR forever, since GitHub waits for a status that's never coming). Worth knowing about before applying this pattern to a much larger monorepo, where always running everything stops being cheap — see GitHub's docs on required checks and skipped workflows before optimizing this.
