# Architecture Decision Records

Each file records one decision: the context that forced it, what was decided, what follows from it, and what was rejected. The rejected alternatives are the point — they're what stops a decision from being relitigated from scratch, and what tells you whether a constraint is load-bearing or incidental.

## Index

| # | Decision | Status |
| --- | --- | --- |
| [0001](./0001-react-vite-typescript.md) | React 19 + Vite + TypeScript | Accepted |
| [0002](./0002-css-custom-properties-and-css-modules.md) | CSS custom properties for tokens, CSS Modules for components | Accepted |
| [0003](./0003-semantic-token-naming.md) | Semantic token names, and only colour tokens are theme-scoped | **Superseded by 0009** |
| [0004](./0004-storybook-as-showcase.md) | Storybook as the showcase, with autodocs and enforced a11y checks | Accepted — amended by 0010 |
| [0005](./0005-split-bundle-and-types-entry.md) | Separate Vite bundle entry from the TypeScript declarations entry | Accepted |
| [0006](./0006-tsc-for-declaration-emit.md) | Emit declarations with `tsc`, not `vite-plugin-dts` | Accepted |
| [0007](./0007-defer-tests-and-linting.md) | Defer tests and linting | Accepted — provisional |
| [0008](./0008-single-reference-component.md) | Scope the initial system to one reference component | Accepted — extended by 0011 |
| [0009](./0009-two-axis-theming.md) | Two-axis theming: brands × modes, any token overridable | Accepted |
| [0010](./0010-hand-rolled-theme-switching.md) | Hand-rolled Storybook brand/mode switching | Accepted |
| [0011](./0011-demo-components-stay-unexported.md) | Demo components stay unexported | Accepted |

0001–0008 were taken on 2026-07-29 during the initial scaffold; 0009–0011 the same day, when four-brand theming was added.

## Reading order

If you only read two, read **[0009](./0009-two-axis-theming.md)** — how theming actually works, and the guarantee it gave up — and **[0005](./0005-split-bundle-and-types-entry.md)**, the constraint most easily broken by accident.

## Superseded and amended

Superseded records are kept unedited, with a banner at the top. The reasoning — and what it cost to give up — is the useful part.

- **[0003](./0003-semantic-token-naming.md) → [0009](./0009-two-axis-theming.md).** 0003 held that only colour is theme-scoped and that density is not a theme. Both fell to the four-brand requirement. Its semantic-naming argument survives and is still in force.
- **[0004](./0004-storybook-as-showcase.md) → amended by [0010](./0010-hand-rolled-theme-switching.md).** Only the `@storybook/addon-themes` choice was reversed; the rest of 0004 stands.

## Decisions carrying an expiry

Two are explicitly provisional, and worth checking before starting significant work:

- **[0007](./0007-defer-tests-and-linting.md)** lists three concrete triggers for adding tests and linting — a second component, a second contributor or CI, or the first regression to reach a consumer. Reverse it when one occurs, not at some unspecified later date.
- **[0006](./0006-tsc-for-declaration-emit.md)** avoids `vite-plugin-dts` because TypeScript 7's rewritten compiler API was new at the time. Revisit once that ecosystem settles.

## The constraint most easily broken by accident

[0005](./0005-split-bundle-and-types-entry.md) — **do not add a CSS import to `src/index.ts`.** It will pass typecheck, build, and every check in this repo, while emitting a declaration file that consumers cannot resolve. The CSS side-effect import belongs in `src/bundle.ts`.

## Adding a record

Copy the shape of an existing file: a numbered, kebab-case filename, then date and status, then `Context` / `Decision` / `Consequences` / `Alternatives considered`. Add a row to the table above.

Don't edit an accepted record to change its decision. Write a new one and set the old status to `Superseded by [NNNN]` — the history of what was believed, and why, is the reason these files exist.
