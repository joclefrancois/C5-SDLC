import { defineConfig } from 'vitest/config';

// AI SDLC Level 2 coverage gate — the team's chosen percentage for this
// repo. Enforced by `npm test -- --coverage` itself, the same way locally
// and in CI — see docs/ai-generated-testing-standard.md §5b. Adjust these
// numbers for your own repo; they are not meant to be copied verbatim.
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 65,
        statements: 70,
      },
    },
  },
});
