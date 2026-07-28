# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run storybook         # dev server + component showcase on :6006
npm run build             # library build → dist/ (vite build, then tsc for .d.ts)
npm run build-storybook   # static showcase → storybook-static/
npm run typecheck         # tsc --noEmit across src, .storybook, vite.config.ts
npm run validate:tokens   # assert every brand defines the full colour set, both modes
```

There is no test script and no linter yet — both were deliberately deferred. `npm test` will report a missing script.

## Terminology

[`docs/GLOSSARY.md`](./docs/GLOSSARY.md) fixes the vocabulary. Use it — several words are deliberately narrowed, and a few common ones are explicitly rejected. The traps most likely to catch you:

- **`primitive` means a token tier, never a component.** The lowest component tier is **base component**.
- **Dark is a *mode*, not a theme.** `theme` means brand — one of `broadsheet`, `tabloid`, `financial`, `wireframe`.
- **`variant` is one specific prop**, not an umbrella for appearance props. A `size` is not a variant.
- **"Story" bare means a Storybook entry.** The editorial sense appears only inside component names (`StoryTile`); in prose write "news story".
- **Components** are experimental/stable/deprecated. **ADRs** are accepted/provisional/amended/superseded. Never cross the two.

## Decision records

`docs/adr/` holds the reasoning behind the choices below — including the alternatives that were rejected and why. Read the relevant record before reversing something; several constraints here look arbitrary and are not. [`docs/adr/README.md`](./docs/adr/README.md) is the index.

Most load-bearing: [0009](./docs/adr/0009-two-axis-theming.md) (how theming works and the guarantee it gave up), [0005](./docs/adr/0005-split-bundle-and-types-entry.md) (the entry split, easy to break by accident), and [0007](./docs/adr/0007-defer-tests-and-linting.md) (why there are no tests, and the triggers for adding them).

Note that 0003 is **superseded by 0009** and 0004 is **amended by 0010** — check status before treating a record as current.

## Architecture

A React design system carrying four publication brands. The data flow is one-directional and worth preserving:

```
src/styles/tokens.css           :where(:root) — base layer + light fallback
src/styles/themes/*.css         [data-theme='x'] and [data-theme='x'][data-mode='dark']
  ↓ referenced by
src/components/*/*.module.css   component styles, var(--ds-*) only
  ↓ class names consumed by
src/components/*/*.tsx          maps props → class names
  ↓ re-exported through
src/index.ts                    public API (types entry)
src/bundle.ts                   Vite entry: index.ts + all CSS side-effect imports

src/demo/                       showcase furniture — NOT exported (ADR 0011)
```

### Two invariants

These are what keep the system coherent as it grows. Breaking either one is the main way this codebase degrades:

1. **Component CSS references `var(--ds-*)` exclusively** — no raw hex values, no literal `px`/`rem` lengths. If a style needs a value the token layer lacks, add a token to `tokens.css` rather than hardcoding it. `Button.module.css` is the reference implementation.
2. **Components never branch on theme or mode** — no `[data-theme]` or `[data-mode]` selectors outside `src/styles/`, and no brand value read in JS. All four brands are pure token overrides; there is no brand-conditional code anywhere, including in `src/demo/`.

Both survived the theming change in [ADR 0009](./docs/adr/0009-two-axis-theming.md) unaltered. What did *not* survive is the old third claim that only colour is theme-scoped — **a brand may now override any token, including `--ds-space-*`**, so switching brand can reflow layout. That is intended: density is part of these brands' identities.

### Theming

Two independent axes, both attributes on the same element:

```html
<html data-theme="financial" data-mode="dark">
```

Three rules that are easy to break:

- **`tokens.css` wraps its defaults in `:where(:root)`** for zero specificity, so every `[data-theme]` block wins regardless of import order. Don't unwrap it — brand files would then depend on bundle ordering.
- **Brand selectors are bare `[data-theme='x']`, never `:root[data-theme='x']`.** That's what lets a brand scope to a subtree, which the side-by-side story relies on.
- **`data-mode` alone does nothing.** Dark values differ per brand, so dark is only defined in combination.

**Two border roles, don't conflate them.** `--ds-color-border` is decorative (card edges, dividers) and may be a faint hairline. `--ds-color-border-strong` is a control's identifying boundary — used by `Button`'s secondary variant — and must clear 3:1 against the page (WCAG 1.4.11). Reaching for `--ds-color-border` on an interactive outline will pass every automated check here and still be unperceivable in broadsheet and financial.

Adding a brand touches four places: a stylesheet in `src/styles/themes/`, an import in `src/bundle.ts`, an import in `.storybook/preview.ts`, and the array in `src/styles/brands.ts`. `npm run validate:tokens` catches an incomplete colour set; nothing catches a brand missing from the arrays — it just won't appear in the toolbar.

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
src/components/Select/
  Select.tsx           props → class names; extend the native element's props
  Select.module.css    tokens only
  Select.stories.tsx   tags: ['autodocs'], one story per meaningful state
  index.ts             re-export component + prop types
```

Then add the re-export to `src/index.ts` or it won't ship in the package.

`src/components/Card/` is the reference for a **compound component** — parts attached to the parent via `Object.assign`, reached as `Card.Header`.

**Decide first whether it belongs in `src/components/` or `src/demo/`.** Demo furniture is unexported ([ADR 0011](./docs/adr/0011-demo-components-stay-unexported.md)) and carries no API commitment; anything in `src/components/` is public API you owe consumers stability on. Both follow identical authoring discipline — the only difference is whether `src/index.ts` re-exports it.

## Storybook

Storybook 10. Autodocs is enabled globally via `tags: ['autodocs']` in `.storybook/preview.ts` — the older `docs: { autodocs: 'tag' }` option no longer exists in this major.

`parameters.a11y.test` is set to `'error'`. In the Storybook UI this surfaces violations in the Accessibility panel; the setting only becomes enforcing once a test runner is added (`@storybook/addon-vitest`), at which point violations fail the run. It's set now so that adding the runner later needs no config change. Fix violations rather than lowering this.

`.storybook/preview.css` holds canvas-only body styling. It stays separate from `tokens.css` because a published design system shouldn't impose body styles on consuming apps — but the story canvas does need to follow the brand and mode toggles.

**Brand and mode are hand-rolled `globalTypes`, not `@storybook/addon-themes`** ([ADR 0010](./docs/adr/0010-hand-rolled-theme-switching.md)). The addon reads one hardcoded global key and registers one toolbar control, so it cannot drive two independent axes — don't reintroduce it expecting to configure a second instance.

`reactDocgen` is left at its default (`react-docgen`, Babel-based) rather than `react-docgen-typescript`. It feeds the autodocs prop tables without invoking the TypeScript compiler API, which keeps docgen insulated from the TypeScript 7 native-port rewrite.
