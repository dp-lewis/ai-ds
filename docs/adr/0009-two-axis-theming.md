# 9. Two-axis theming: brands × modes, any token overridable

- **Date:** 2026-07-29
- **Status:** Accepted
- **Supersedes:** [0003](./0003-semantic-token-naming.md)

## Context

The system needs to carry four publication brands — **broadsheet**, **tabloid**, **financial**, **wireframe** — each in light and dark, to demonstrate that the same components can wear genuinely different identities.

[ADR 0003](./0003-semantic-token-naming.md) blocked this in two ways. It declared **only colour tokens theme-scoped**, with typography and spacing explicitly theme-invariant, and it argued density belongs on a separate axis from theme. Both positions are defensible in general and wrong for this case: what distinguishes a broadsheet from a tabloid is overwhelmingly *typography and density*, not palette. Under 0003's constraint all four brands would have been recolours of one identical layout — technically four themes, visually one.

Separately, `tokens.css` implemented dark mode as `[data-theme="dark"]`, while `docs/GLOSSARY.md` defines `theme` as *brand* and `mode` as *light/dark*. That was recorded as a known inconsistency. With real brands arriving, `theme` is needed for its actual meaning, so the rename became mandatory rather than deferred.

## Decision

**Two independent axes, both as attributes on the same element:**

```css
:where(:root)                                { /* invariants + light fallback */ }
[data-theme='broadsheet']                    { /* brand, light */ }
[data-theme='broadsheet'][data-mode='dark']  { /* brand, dark */ }
```

**A brand may override any token, including `--ds-space-*`.** The only mandatory obligation is the full colour set for both modes; type, shape, and space overrides are optional.

Three supporting rules:

1. **`:where(:root)` wraps the base layer.** `:where()` contributes zero specificity, so every `[data-theme]` block wins regardless of stylesheet order. Brand files can be imported in any sequence.
2. **Brand selectors are bare `[data-theme='x']`, never `:root[data-theme='x']`.** A brand can therefore be scoped to any subtree, which is what makes the side-by-side comparison of all eight combinations possible on one page.
3. **`data-mode` alone is unsupported.** Dark values differ per brand, so dark is only defined in combination. `:where(:root)` is a working light fallback so unthemed components never look broken.

## Consequences

- Four visually distinct brands, differing in typeface, weight, tracking, letter case, radius, border weight, shadow, and density. `wireframe` deliberately does *not* override the space scale, demonstrating that only colour is mandatory.
- **Switching brand reflows layout.** This is the guarantee 0003 provided and this ADR gives up: tabloid at 0.75× the base space scale genuinely occupies less room than broadsheet at 1.25×. It is the intended effect — density is part of a brand's identity here — but it means a brand switch is not a purely cosmetic operation, and layouts must tolerate it.
- Density is no longer a separate axis. 0003 argued "density is not a theme"; for publication brands it is precisely part of the brand. `docs/GLOSSARY.md` records the change.
- **A missing colour token fails silently** — it falls back to `:where(:root)`, so a brand's dark mode forgetting `--ds-color-fg` produces dark-on-dark text rather than an error. `scripts/validate-tokens.mjs` (`npm run validate:tokens`) enforces the full colour set across all 8 combinations for this reason.
- Font families are now named by **role** (`--ds-font-heading`, `--ds-font-body`) rather than by classification. `--ds-font-sans` is gone. Components ask for a role and brands repoint it, so no component names a typeface — the same semantic-naming principle 0003 established for colour, which survives this supersession intact.
- New tokens exist for what brands need to vary: display sizes (`--ds-font-size-xl` … `-4xl`), `--ds-font-weight-bold`, `--ds-letter-spacing-*`, `--ds-font-numeric`, `--ds-text-transform-label`, `--ds-border-width-thick`.
- **Borders split into two roles.** `--ds-color-border` is decorative (card edges, dividers, rules) and may be a faint hairline; `--ds-color-border-strong` is the boundary that identifies an interactive control, and must clear 3:1 against the page per WCAG 1.4.11. The split was forced by this change: broadsheet and financial want delicate rules, but a secondary button outlined at 1.4:1 is not perceivable. One token could not serve both, and collapsing them makes a brand choose between visible controls and its own visual character.
- **Both invariants from [ADR 0002](./0002-css-custom-properties-and-css-modules.md) survive unchanged.** Component CSS still references `var(--ds-*)` exclusively, and components still never branch on theme or mode — the brands are pure token overrides, with no brand-conditional code anywhere, including in the demo front page.

## What carries over from 0003

Superseding 0003 does not discard all of it. Two of its arguments still hold and remain in force:

- **Semantic naming.** Tokens are named for their role (`--ds-color-surface`, `--ds-font-heading`), never their appearance. This is what let four palettes and four type systems drop in without editing a single component stylesheet.
- **Centralised `prefers-reduced-motion`.** Still handled once in `tokens.css`, and deliberately *not* wrapped in `:where()` so it beats any brand's duration override.

## Alternatives considered

**Keep 0003's colour-only constraint.** No architectural change, and it preserves the no-reflow guarantee. Rejected because it cannot express the brief: broadsheet and tabloid would differ only in accent colour, which is not what makes them different publications.

**Colour + typography, but keep space invariant.** The middle option, and genuinely tempting — it delivers most of the visual differentiation while keeping layout stable. Rejected because density is a real part of these brands' identities; a tabloid that occupies broadsheet whitespace does not read as a tabloid.

**Density as a third axis (`[data-density]`).** Preserves 0003's separation and would let density vary independently of brand. Rejected as unnecessary indirection here: no brand needs a density that differs from its own identity, so the axis would have exactly one sensible value per brand. Worth revisiting if a compact mode is ever wanted *within* a brand.
