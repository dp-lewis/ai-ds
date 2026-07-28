# 3. Semantic token names, and only colour tokens are theme-scoped

- **Date:** 2026-07-29
- **Status:** **Superseded by [0009](./0009-two-axis-theming.md)**

> **Superseded.** Two of this record's positions no longer hold: that only
> colour tokens are theme-scoped, and that density is not a theme. Four
> publication brands are differentiated chiefly by typography and density, so
> [ADR 0009](./0009-two-axis-theming.md) allows a brand to override any token.
> The word "theme" below also means what the glossary now calls **mode** —
> dark is a mode; `theme` means brand.
>
> Its semantic-naming argument survives intact and is still in force. The
> record is kept unedited because the reasoning, and what it cost to give up,
> is the useful part.

## Context

Having settled on custom properties as the token format ([0002](./0002-css-custom-properties-and-css-modules.md)), two questions remained: what the tokens are *called*, and which of them a theme is allowed to change. Both decisions are cheap now and expensive later — every component written against the token layer encodes the answers.

## Decision

**Name tokens by role, not by appearance.** `--ds-color-surface`, `--ds-color-brand`, `--ds-color-fg-muted` — never `--ds-color-grey-100` or `--ds-color-blue-500`.

**Scope themes to colour only.** The `[data-theme='dark']` block overrides colour tokens and shadows. Space, radius, typography, border width, and duration are theme-invariant.

Theme switching is a single attribute on `<html>`:

```ts
document.documentElement.dataset.theme = 'dark';
```

## Consequences

- The palette can be changed wholesale without editing a single component stylesheet, because no component names a colour it doesn't semantically need.
- Dark mode required no component changes at all — it is 10 re-pointed custom properties. This is the payoff of the second invariant in [0002](./0002-css-custom-properties-and-css-modules.md).
- A theme switch cannot reflow the layout. Because spacing and type are fixed, toggling light/dark changes colour and nothing else — no shifted text, no resized controls, no layout thrash.
- Adding a third theme (high contrast, a tenant brand) means adding one `[data-theme='…']` block. No component is involved.
- `prefers-reduced-motion` is handled once, in `tokens.css`, by collapsing `--ds-duration-fast` to `0ms`. Individual components inherit the behaviour without implementing it — the same override mechanism applied to motion.
- The cost is indirection: a developer wanting "the light grey one" has to know it is called `surface`. Semantic names require the `Tokens` docs page to be genuinely useful, which is part of why it renders live values ([0004](./0004-storybook-as-showcase.md)).
- Semantic naming needs discipline as the system grows. Each new token should describe a role; when no existing role fits, that is usually a sign the component needs rethinking rather than that a new colour is needed.

## Alternatives considered

**Literal scales (`--ds-grey-100` … `--ds-grey-900`) with semantic aliases layered on top.** The common two-tier approach, and defensible: it gives designers a familiar palette while components still consume aliases. Rejected for now because the alias layer is the only one components may touch, so the literal tier would add a second set of names with no consumer — and once literal names exist, components inevitably start reaching past the aliases to use them. Worth reconsidering if a design tool needs to import a full palette.

**Allowing themes to change spacing or type** (for example a "compact" theme). Rejected as a conflation of two independent axes: density is not a theme. If compact mode is needed, it should be a separate attribute or a component-level `size` prop, not a variant of the colour theme.
