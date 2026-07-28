# 7. Defer tests and linting

- **Date:** 2026-07-29
- **Status:** Accepted — provisional, with explicit triggers to revisit

## Context

The initial scaffold could have included a test runner and a linter. Both were considered and both were deliberately left out. Recording this matters more than recording most decisions here: an absence leaves no trace in the codebase, so without this ADR a future reader cannot tell whether tests were considered and declined or simply never thought about.

## Decision

Ship no test runner and no linter/formatter in the initial scaffold.

`npm test` is absent from `package.json` rather than stubbed — the `npm init` default (`echo "Error: no test specified" && exit 1`) was removed outright, so `npm test` reports a missing script instead of a misleading failure.

What is in place instead:

- `npm run typecheck` (`tsc --noEmit`) covers the whole project, including `.storybook` and `vite.config.ts`.
- `parameters.a11y.test = 'error'` is already configured ([0004](./0004-storybook-as-showcase.md)), so accessibility enforcement switches on with no config change when a runner arrives.
- Stories are written as typed `StoryObj` values with one story per meaningful state, which is the shape Storybook's test runner consumes directly.

## Consequences

- No automated check that a component renders, and no regression safety net. For a single `Button` this is a small exposure; it grows with every component added.
- No enforced formatting. With one author this is invisible; it becomes noise in diffs as soon as a second author or editor configuration appears.
- **Adding tests requires no rewriting.** Installing `@storybook/addon-vitest` turns the existing stories into tests as they are — this is the reason for the story structure noted above, and the main thing that makes deferral safe rather than merely cheap.

## Triggers to revisit

This decision should be reversed when any of these becomes true, rather than at some unspecified later date:

1. **A second component is added** → add ESLint and Prettier. Formatting drift and unused-import noise start compounding at that point, and `noUnusedLocals` only catches part of it.
2. **A second contributor, or any CI pipeline** → add both. Neither is optional once changes arrive from more than one machine.
3. **The first visual or behavioural regression reaches a consumer** → add `@storybook/addon-vitest` immediately; the deferral has stopped being free.

## Alternatives considered

**Vitest in the initial scaffold.** Offered and declined during setup, in favour of a smaller initial surface to review. The reasoning holds only while the component count is this low — hence the triggers above.

**Keeping a stub `test` script that exits 0.** Rejected as actively harmful: a green `npm test` that asserts nothing is worse than a missing script, because CI would report success.
