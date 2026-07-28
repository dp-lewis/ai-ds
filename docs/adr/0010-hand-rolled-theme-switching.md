# 10. Hand-rolled Storybook brand/mode switching

- **Date:** 2026-07-29
- **Status:** Accepted
- **Amends:** [0004](./0004-storybook-as-showcase.md) — the `@storybook/addon-themes` decision only

## Context

[ADR 0009](./0009-two-axis-theming.md) introduced two independent theming axes: brand (four values) and mode (light/dark). The Storybook showcase needs a toolbar control for each.

[ADR 0004](./0004-storybook-as-showcase.md) chose `@storybook/addon-themes` for the original single light/dark toggle, explicitly rejecting a hand-rolled decorator as "code we would own and maintain for no gain". That reasoning was sound for one axis. It does not survive the second, because **the addon cannot provide two.**

Verified against the installed package (`node_modules/@storybook/addon-themes/dist/index.js`):

- `withThemeByDataAttribute` reads the selected value via `pluckThemeFromContext`, which returns `globals[GLOBAL_KEY]` — a **single hardcoded global key**.
- It calls `initializeThemeState`, which emits `REGISTER_THEMES` to the manager to register **one toolbar control**.

Two instances therefore collide twice over: both read the same global, and both register competing theme lists to the same control. There is no `globalName` or `attributeName`-scoped variant that separates them.

## Decision

Remove `@storybook/addon-themes` and declare both axes as `globalTypes` in `.storybook/preview.ts`, with one decorator writing both attributes to `document.documentElement`:

```ts
globalTypes: {
  theme: { defaultValue: BRANDS[0], toolbar: { title: 'Brand', items: […] } },
  mode:  { defaultValue: MODES[0],  toolbar: { title: 'Mode',  items: […] } },
}
```

The brand and mode value lists live in `src/styles/brands.ts`, shared with the side-by-side story so there is one source of truth.

## Consequences

- Two symmetric toolbar controls that compose freely — any brand in either mode.
- One dependency removed. The replacement is roughly 30 lines in a file that already existed.
- Symmetry is the real gain. Using the addon for brand and hand-rolling mode would have required the custom decorator *anyway*, while leaving two mechanisms doing one job.
- `src/styles/brands.ts` is deliberately not exported from `src/index.ts` — it is the system's own configuration, not consumer API. It exists so `.storybook/preview.ts` and `src/demo/Brands.stories.tsx` agree, and so `src/` never imports from `.storybook/`.
- Adding a fifth brand now touches four places: a stylesheet in `src/styles/themes/`, an import in `src/bundle.ts`, an import in `.storybook/preview.ts`, and the array in `src/styles/brands.ts`. `npm run validate:tokens` catches a stylesheet with an incomplete colour set, but nothing catches a brand missing from the arrays — it simply won't appear in the toolbar.
- We now own this code. If Storybook changes its `globalTypes` or `useEffect` preview API, this breaks and we fix it. That was 0004's argument against hand-rolling, and it remains a real cost — it is just outweighed now.

## Alternatives considered

**Addon for brand, hand-rolled for mode.** Would have kept 0004's decision partially intact. Rejected as the worst of both: the custom decorator is still required, so nothing is saved, and two different mechanisms then drive one conceptual feature.

**A single combined axis** (`broadsheet-light`, `broadsheet-dark`, `tabloid-light`, …) so the addon could drive it. Eight toolbar entries, one control, no custom code. Rejected because it flattens two independent axes into a cartesian product — exactly the conflation `docs/GLOSSARY.md` separates brand from mode to avoid, and it scales multiplicatively with every brand added.

**Patch or fork the addon** to accept a configurable global key. Rejected as disproportionate: maintaining a fork of a first-party addon to avoid 30 lines of local code is a bad trade.
