# 2. CSS custom properties for tokens, CSS Modules for components

- **Date:** 2026-07-29
- **Status:** Accepted

## Context

A design system needs a styling mechanism that answers three questions: where design values live, how components consume them, and what a consuming app has to adopt in order to use the package. These are coupled — the token format largely dictates the component styling approach, and both dictate the consumer's obligations.

## Decision

Define tokens as **CSS custom properties** in a single `:root` block (`src/styles/tokens.css`), and style components with **CSS Modules** (`Button.module.css`) that reference those properties via `var(--ds-*)`.

Two invariants make this work, and are recorded in `CLAUDE.md` because they are the ones most likely to erode:

1. **Component CSS references `var(--ds-*)` exclusively.** No raw hex values, no literal `px`/`rem` lengths. A style that needs an unavailable value requires a new token, not a literal.
2. **Components never branch on theme.** No `[data-theme]` selectors outside `tokens.css`, no theme value read in JavaScript.

## Consequences

- Zero styling runtime. Nothing computes styles during render; the browser resolves custom properties natively.
- Theming is a token override, not a code path — see [0003](./0003-semantic-token-naming.md).
- CSS Module class names are hashed and locally scoped, so component styles cannot collide with consumer styles.
- The token layer is portable. Custom properties are plain CSS, so the tokens survive intact if the renderer decision in [0001](./0001-react-vite-typescript.md) is ever revisited.
- Consumers import one stylesheet (`ai-ds/styles.css`) and need no build-tool configuration, plugin, or theme provider.
- Type safety for class names depends on `"types": ["vite/client"]` in `tsconfig.json`, which supplies the ambient `*.module.css` declarations. Without it, CSS Module imports do not typecheck.
- Tokens are not typed. A typo in `var(--ds-colour-bg)` fails silently at runtime rather than at build time. This is the main weakness of the approach and the strongest argument for the vanilla-extract alternative below.

## Alternatives considered

**Tailwind v4 with `@theme` tokens.** Fast to author and tokens generate utilities directly. Rejected on two grounds: component styles would leak into consumer markup as long utility strings, making the package's rendered output part of its API surface; and consumers would have to run Tailwind themselves, which is a significant adoption requirement for a shared library.

**vanilla-extract.** The most technically appealing rejected option — TypeScript-authored styles compiled to static CSS, with typed token contracts that would eliminate the silent-typo weakness noted above. Rejected because it adds a build plugin and a less familiar authoring model, and because typed tokens matter more at a scale this system has not reached. Worth revisiting if token typos become a recurring problem.

**CSS-in-JS (styled-components / emotion).** Familiar, co-located, with a theme provider. Rejected for the runtime cost on every render and the friction with React Server Components.
