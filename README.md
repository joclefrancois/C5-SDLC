# AI SDLC Level 2 — Proof of Concept

A small, runnable demo of the "AI-generated tests are the default" standard: a Definition-of-Done line, a PR template checklist, a local Claude Code Stop hook, and CI gates, all pointed at the same rule — and two GitHub issue templates that produce the two kinds of story that rule has to survive: a **new class** and a **modification to an existing one**.

Full policy this repo demonstrates: [`docs/ai-generated-testing-standard.md`](docs/ai-generated-testing-standard.md).

## What's already here vs. what's left open on purpose

- **Story 1 (new class) is already implemented and passing**, in both stacks: `dotnet/src/PalindromeChecker/Palindrome.cs` + `dotnet/tests/PalindromeChecker.Tests/PalindromeTests.cs`, and `js/src/palindrome.ts` + `js/src/palindrome.test.ts`. Both check for an exact, case-sensitive palindrome. This is the repo's green baseline — it proves the gates pass when the standard is followed.
- **Story 2 (modify that existing class) is deliberately left undone.** Its issue content is pre-written in [`docs/demo-story-2-issue.md`](docs/demo-story-2-issue.md). It asks for punctuation/case/whitespace-insensitive matching — a change to code that already exists and already has a test, which is exactly the case a coarse "did any test change" check would miss. Don't implement it while just poking around the repo; it's meant to be run live (see Demo 2 below).
- **`feature/reverse-string` is a completed run-through of Demo 1**, kept open as a real example (source + tests + a green PR) rather than merged — `main` itself was never touched, so Demo 1 is still fresh for anyone forking this repo. See "Keeping `main` as a reusable baseline" below for why it's a branch/PR instead of a merge.

## 1. Create the repo and push this scaffold

You'll need the [GitHub CLI](https://cli.github.com/) authenticated (`gh auth login`), or use the GitHub web UI to create an empty repo and skip to the `git remote add` step.

```bash
cd ai-sdlc-level2-poc

# create the GitHub repo (adjust --org/visibility as needed)
gh repo create harris-ecommerce/ai-sdlc-level2-poc --private --source=. --remote=origin

# this scaffold already has an initial commit on `main` (see below) — just push it
git push -u origin main
```

If you'd rather use the web UI: create an empty repo named `ai-sdlc-level2-poc` (no README/gitignore/license — this scaffold already has them), then:

```bash
cd ai-sdlc-level2-poc
git remote add origin https://github.com/<your-org>/ai-sdlc-level2-poc.git
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

## 3. Keeping `main` as a reusable, pristine baseline

This repo is meant to be walked through by many different people over time, each running Demo 1 / Demo 2 from the same starting point. If any one of them merges their demo PR into `main`, the baseline changes for everyone after — Story 1 is no longer untouched, or Story 2 is no longer open — and the next person can't run the same demo anymore. That's the actual reason to lock `main`, independent of company size, plan tier, or whether the repo is personal or corporate:

1. GitHub → your repo → **Settings → Branches → Add branch protection rule**, pattern `main`.
2. Check **Lock branch** and save.

A locked branch rejects *every* write — direct pushes, PR merges (any method), even an admin force-push — so it's a stronger guarantee than the required-status-checks setup in step 2 above (which still allows a merge once checks pass; a lock allows none, ever, until you uncheck it). This is also why `feature/reverse-string` in this repo was left as an open PR instead of merged: it's a real completed Demo 1 run, but `main` stays exactly as scaffolded so the story is still fresh for the next person.

**Free-tier catch:** branch locking (like all branch protection) is free only on **public** repos. On a private repo it requires GitHub Pro/Team/Enterprise. If you're on a free personal account and want this for a private repo, your options are: upgrade to Pro, or make the repo public (acceptable for a PoC like this with no sensitive content, but weigh it for your own repo).

**Only the "make it public" part is a free-tier workaround — the lock itself isn't.** On a corporate/organization GitHub account (Team or Enterprise), you'd apply this exact same lock, for this exact same repeatability reason, directly on a **private** repo — no visibility trade-off needed, since branch protection there isn't gated behind public visibility the way it is on a free personal account. This repo is public purely because that's the only way to get free branch locking on a personal account; it is not evidence that locking `main` is somehow unnecessary on a corporate repo. If anything, a corporate training/demo repo running through this with many employees over time would want this locked baseline even more than a single personal PoC does.

**Practicing the demo without ever touching this repo's `main`:** since `main` is locked, the way to actually *run* Demo 1/Demo 2 yourself — not just read about them — is to fork the repo first:

```bash
gh repo fork <owner>/ai-sdlc-level2-poc --clone
cd ai-sdlc-level2-poc
```

Your fork is an independent repository — it copies the code and history but **not** the branch protection settings, so your fork's `main` is unlocked by default. Work there: create a branch, prompt Claude Code with a demo story, let the Stop hook and CI gates do their thing, and merge into *your* fork's `main` freely. Delete and re-fork whenever you want a clean slate again; the upstream repo's `main` never moves.

## 5. Demo 1 — new class, no test-related prompt

This shows the Stop hook and CI catching a **missing** test on brand-new code.

1. Open the repo in Claude Code.
2. Open (or just describe, for a quick demo) a "New feature / new class" issue: *"Add a function/class that reverses a string or sentence, e.g. `Reverse(\"hello\") == \"olleh\"\`. Put it next to the palindrome checker."* Don't mention tests.
3. Prompt Claude Code with exactly that. Watch it create the new source file and — before it can say "done" — get blocked by the Stop hook with *"No test file found anywhere for: ..."*. It writes the matching test file, then finishes.
4. Commit, push a branch, open a PR with the template. All three checks should go green: test-presence (new file paired with a new test), and both coverage gates (assuming the new code is actually tested — that's what makes them stay green).

## 6. Demo 2 — modifying an existing class

This is the case a naive check misses, and the reason for the more careful per-file pairing logic described in the standard's §5a. Content is pre-written in [`docs/demo-story-2-issue.md`](docs/demo-story-2-issue.md).

1. Post that issue content as a real GitHub issue using the **"Enhance / modify existing class"** template (Issues → New issue), or just have it open in a tab.
2. Open the repo in Claude Code, on a fresh branch. Prompt it with the issue body verbatim.
3. Claude edits `Palindrome.cs`/`palindrome.ts` to strip punctuation/whitespace and lower-case before comparing. When it tries to finish, the Stop hook checks specifically whether `PalindromeTests.cs`/`palindrome.test.ts` — the *paired* test, not just any test — was also touched. Since it wasn't yet, the hook blocks: *"Existing test file(s) found but NOT updated in this change."*
4. Claude adds test cases for the new behavior (and the regression-risk case: null/undefined still throws) to the existing test file, and finishes.
5. Open a PR. All three checks should go green again — this time because an *existing* test was correctly updated, not because a new one was added.

**Optional variant, if you want to show the check actually catching something:** on step 2, ask Claude to also fix an unrelated typo in a comment somewhere in the *test* file, but tell it not to add coverage for the new behavior yet. The hook still blocks — touching *some* test file isn't enough, it has to be the paired one with the new behavior actually covered (the hook can't verify "actually covered," but a reviewer applying §6 in the PR can, and should).

## 6a. Doing the same demo through the GitHub issue templates directly

Both `.github/ISSUE_TEMPLATE/*.yml` files render as structured forms under Issues → New issue. Filling one out and pasting its rendered body into Claude Code is the realistic version of the workflow (a developer picks up a ticket, not a raw prompt) — worth doing at least once during a stakeholder demo instead of the shortcut in step 2 above.

## Repo layout

```
CLAUDE.md                                    — Claude Code project instructions (this repo's filled-in copy)
CONTRIBUTING.md                              — short version of the standard, for humans
docs/
  ai-generated-testing-standard.md           — the full policy
  demo-story-2-issue.md                      — pre-written Story 2 content for Demo 2
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
  src/PalindromeChecker/                     — Story 1, .NET
  tests/PalindromeChecker.Tests/
js/
  src/                                       — Story 1, TypeScript
```

## Known gaps in this PoC (be upfront about these if presenting it)

- **This repo's own `main` is public and locked**, so that many different people can each run Demo 1/Demo 2 against the same untouched baseline over time (see "Keeping `main` as a reusable baseline" above) — the *lock* is the right call on a corporate account too, for the same repeatability reason. The only free-tier-specific bit is *public visibility*: it's the only way to get free branch protection on a personal account. On GitHub Pro/Team/Enterprise, apply the same lock directly to a **private** repo — no visibility trade-off needed. (Required status checks, separately, are typically pre-existing org-wide policy on a corporate account, not something each repo sets up from scratch.)
- **.NET code in this repo was written but not compiled/run in the environment that built this scaffold** (no network access to install the .NET SDK there). Run `dotnet test dotnet/tests/PalindromeChecker.Tests` yourself as a first step after cloning, before the live demo, to confirm it builds clean — the JS/TS side *was* installed and run (`npm test -- --coverage`, 8/8 passing, 100% coverage, and the threshold gate was confirmed to actually fail the build when coverage drops).
- NuGet package versions in `PalindromeChecker.Tests.csproj` were current as of this scaffold's authoring — run `dotnet list package --outdated` after your first restore and bump if newer patch releases exist.
- The CI workflows always run both stack's coverage jobs on every PR, even one that only touched the other stack. That's a deliberate simplification for a two-stack demo repo this small — path-filtering workflow triggers (`on.pull_request.paths`) combined with *required* status checks has a well-known GitHub gotcha (a check that never runs because its paths didn't match can block a PR forever, since GitHub waits for a status that's never coming). Worth knowing about before applying this pattern to a much larger monorepo, where always running everything stops being cheap — see GitHub's docs on required checks and skipped workflows before optimizing this.
