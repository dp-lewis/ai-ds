# 4. Storybook as the showcase, with autodocs and enforced a11y checks

- **Date:** 2026-07-29
- **Status:** Accepted — amended by [0010](./0010-hand-rolled-theme-switching.md)

> **Amended.** The `@storybook/addon-themes` decision below was reversed by
> [ADR 0010](./0010-hand-rolled-theme-switching.md): the addon cannot drive two
> independent axes, so brand and mode switching is now hand-rolled and the
> dependency is gone. Everything else in this record — Storybook itself,
> autodocs, the a11y addon, `react-docgen` — still stands.

## Context

A design system needs somewhere its components can be seen, exercised in each state, and documented. Without that, the system's API is discoverable only by reading source, and visual regressions are found by consumers rather than authors. Storybook was a given in the original request; the open questions were how documentation gets written and how much is enforced automatically.

## Decision

Use **Storybook 10** with `@storybook/react-vite`. Specifically:

- **Autodocs enabled globally** via `tags: ['autodocs']` in `.storybook/preview.ts`, so every component gets a generated page with a prop table derived from its TypeScript types.
- **Hand-written MDX for what autodocs cannot derive:** `Introduction.mdx` (consumption, theming, how to add a component) and `Tokens.mdx`.
- **`Tokens.mdx` renders live values.** Every swatch and sample reads its own value through `var(--ds-*)` rather than restating it, so the page cannot drift from `tokens.css` and it re-renders correctly when the theme toggles.
- **`@storybook/addon-a11y` with `parameters.a11y.test = 'error'`.**
- **`@storybook/addon-themes`** providing a toolbar toggle that sets `data-theme` on `<html>` — the exact hook `tokens.css` keys off ([0003](./0003-semantic-token-naming.md)).

## Consequences

- Prop documentation is generated from the source of truth. A prop added to a component appears in its docs without a separate edit, so the two cannot disagree.
- Accessibility violations surface during development rather than in review. The `'error'` severity is currently advisory — it displays in the Accessibility panel but does not fail anything, because enforcement requires a test runner. It is set now so that adding `@storybook/addon-vitest` ([0007](./0007-defer-tests-and-linting.md)) turns on enforcement with no configuration change.
- The dark theme is demonstrable, which is what makes the token-override mechanism in [0003](./0003-semantic-token-naming.md) verifiable by eye rather than by reading CSS.
- `.storybook/preview.css` carries canvas-only body styling — background, foreground, base font. It is deliberately *not* in `tokens.css`, because a published design system should not impose body styles on a consuming app, but the story canvas does need to follow the theme toggle.
- `npm run build-storybook` produces a static site, so the showcase is publishable from CI as documentation.
- `reactDocgen` is left at its default (`react-docgen`, Babel-based) rather than `react-docgen-typescript`. It populates prop tables without invoking the TypeScript compiler API, which keeps docgen insulated from the TypeScript 7 rewrite discussed in [0006](./0006-tsc-for-declaration-emit.md). The trade-off is slightly less precise rendering of complex generic types.

## Alternatives considered

**`react-docgen-typescript` for prop tables.** More faithful for complex types since it uses the real type checker. Rejected because it couples docs generation to the TypeScript compiler API at exactly the moment that API is being rewritten ([0006](./0006-tsc-for-declaration-emit.md)), and it is noticeably slower. Revisit if prop tables prove inadequate.

**A hand-rolled `globalTypes` decorator instead of `@storybook/addon-themes`.** Would have avoided one dependency for roughly fifteen lines of custom code. Rejected because the addon is first-party, versioned with Storybook itself, and does exactly this job; the hand-rolled version is code we would own and maintain for no gain.

**Writing all documentation by hand in MDX.** Rejected for prop tables specifically — hand-maintained prop documentation drifts from the types it describes, and the drift is silent.
