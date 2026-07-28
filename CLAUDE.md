# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run storybook         # dev server + component showcase on :6006
npm run build             # library build → dist/ (vite build, then tsc for .d.ts)
npm run build-storybook   # static showcase → storybook-static/
npm run typecheck         # tsc --noEmit across src, .storybook, vite.config.ts
```

There is no test script and no linter yet — both were deliberately deferred. `npm test` will report a missing script.

## Decision records

`docs/adr/` holds the reasoning behind the choices below — including the alternatives that were rejected and why. Read the relevant record before reversing something; several constraints here look arbitrary and are not. [`docs/adr/README.md`](./docs/adr/README.md) is the index.

Most load-bearing: [0005](./docs/adr/0005-split-bundle-and-types-entry.md) (the entry split, easy to break by accident) and [0007](./docs/adr/0007-defer-tests-and-linting.md) (why there are no tests, and the triggers for adding them).

## Architecture

A React design system with a single-layer token system. The data flow is one-directional and worth preserving:

```
src/styles/tokens.css      --ds-* custom properties + [data-theme="dark"] override
  ↓ referenced by
src/components/*/*.module.css   component styles, var(--ds-*) only
  ↓ class names consumed by
src/components/*/*.tsx     maps props → class names
  ↓ re-exported through
src/index.ts               public API (types entry)
src/bundle.ts              Vite entry: index.ts + the CSS side-effect import
```

### Two invariants

These are what keep the system coherent as it grows. Breaking either one is the main way this codebase degrades:

1. **Component CSS references `var(--ds-*)` exclusively** — no raw hex values, no literal `px`/`rem` lengths. If a style needs a value the token layer lacks, add a token to `tokens.css` rather than hardcoding it. `Button.module.css` is the reference implementation.
2. **Components never branch on theme** — no `[data-theme]` selectors outside `tokens.css`, no theme value read in JS. Dark mode works by re-pointing colour tokens, nothing else. Only colour tokens are theme-scoped; spacing, radius, and type are theme-invariant so a theme switch can't reflow layout.

### Why `bundle.ts` exists

`src/index.ts` is the declarations entry and must stay free of CSS imports: TypeScript preserves side-effect imports in `.d.ts` output, and `dist/` has no `styles/` directory, so `import './styles/tokens.css'` in the emitted types would fail to resolve for any consumer not using `skipLibCheck`. `src/bundle.ts` adds that import and is Vite's entry; it's excluded from `tsconfig.build.json`. Vite emits `dist/index.js` from `bundle.ts`, `tsc` emits `dist/index.d.ts` from `index.ts`.

Corollary: **don't add a CSS import to `src/index.ts`.**

### Build specifics

- `cssCodeSplit: false` + `lib.cssFileName: 'ds'` collapse all component CSS into one `dist/ds.css`, exported as `ai-ds/styles.css`.
- `react`, `react-dom`, and `react/jsx-runtime` are external — bundling React would break hooks in consumers.
- CSS Module types come from `"types": ["vite/client"]` in `tsconfig.json`; without it `.module.css` imports don't typecheck.
- React 19, so `ref` is an ordinary prop — components extend `ComponentPropsWithRef<'element'>` and need no `forwardRef` wrapper.

## Adding a component

Copy the shape of `src/components/Button/` — it exists to be the template:

```
src/components/Card/
  Card.tsx           props → class names; extend the native element's props
  Card.module.css    tokens only
  Card.stories.tsx   tags: ['autodocs'], one story per meaningful state
  index.ts           re-export component + prop types
```

Then add the re-export to `src/index.ts` or it won't ship in the package.

## Storybook

Storybook 10. Autodocs is enabled globally via `tags: ['autodocs']` in `.storybook/preview.ts` — the older `docs: { autodocs: 'tag' }` option no longer exists in this major.

`parameters.a11y.test` is set to `'error'`. In the Storybook UI this surfaces violations in the Accessibility panel; the setting only becomes enforcing once a test runner is added (`@storybook/addon-vitest`), at which point violations fail the run. It's set now so that adding the runner later needs no config change. Fix violations rather than lowering this.

`.storybook/preview.css` holds canvas-only body styling. It stays separate from `tokens.css` because a published design system shouldn't impose body styles on consuming apps — but the story canvas does need to follow the theme toggle.

`reactDocgen` is left at its default (`react-docgen`, Babel-based) rather than `react-docgen-typescript`. It feeds the autodocs prop tables without invoking the TypeScript compiler API, which keeps docgen insulated from the TypeScript 7 native-port rewrite.
