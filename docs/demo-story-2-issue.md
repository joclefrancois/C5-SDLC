# Demo Story 2 — Enhance the existing palindrome check (ignore punctuation, spacing, and case)

> This is the second half of the live demo: a change to **existing** code, not new code — deliberately left unimplemented so the "modify an existing class" flow can be shown live. Post this as a real GitHub issue using the **"Enhance / modify existing class"** template (copy the fields below into it), or paste the body straight into Claude Code as a prompt. Either way, don't implement it ahead of time when you're just exploring the repo.

**Existing class(es) / file(s) affected:** `dotnet/src/PalindromeChecker/Palindrome.cs` and `js/src/palindrome.ts`

**Current behavior:** `IsPalindrome` / `isPalindrome` does an exact, case-sensitive character comparison. `"A man, a plan, a canal: Panama"` returns `false` today, even though most people would call that a palindrome.

**Desired behavior change:** Ignore case, spaces, and punctuation when checking — compare only alphanumeric characters, case-insensitively.

**Acceptance criteria:**
- `"A man, a plan, a canal: Panama"` → `true`
- `"Was it a car or a cat I saw?"` → `true`
- `"hello"` → `false`
- Existing baseline cases keep behaving as documented: `"racecar"` → `true`, `""` → `true`, `"a"` → `true`, `"hello"` → `false`, null/undefined input → still throws

**Regression risk:** The null/undefined failure-path behavior (throwing) must not change.

---

## What to actually do with this in the demo

1. Copy the fields above into a real GitHub issue via the "Enhance / modify existing class" template (this makes the walkthrough feel real — a story on a board, not just a prompt).
2. Open the repo in Claude Code. Prompt it with the issue content verbatim — do **not** add "and update the tests" yourself; the point is to show that nobody has to.
3. Watch Claude modify `Palindrome.cs`/`palindrome.ts`. When it tries to finish, the Stop hook should fire because the paired test file (`PalindromeTests.cs` / `palindrome.test.ts`) wasn't touched — it'll report *"Existing test file(s) found but NOT updated in this change."*
4. Claude updates the test file to cover the new cases (including the regression-risk case) and finishes.
5. Open a PR. Confirm the PR template's Testing section, the test-presence gate, and the coverage gate all reflect the change.

See the root `README.md` for the full walkthrough, including Demo 1 (the new-class flow) run the same way.
