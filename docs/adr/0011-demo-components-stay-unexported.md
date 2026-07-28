# 11. Demo components stay unexported

- **Date:** 2026-07-29
- **Status:** Accepted
- **Extends:** [0008](./0008-single-reference-component.md)

## Context

Showcasing four publication brands convincingly needs more than the design system's primitives. A front page wants a masthead, bylines, and story tiles — components that make the brands legible as *publications* rather than as four recolours of a component gallery.

These are a different kind of thing from `Button` or `Text`. Nobody installs a design system for a `Byline`. But they still need to be built from tokens and components, because their whole purpose is to demonstrate that the theming works on realistic composition rather than on isolated widgets.

## Decision

Split the two kinds by directory, and let `src/index.ts` be the boundary:

| Directory | Contents | Exported |
| --- | --- | --- |
| `src/components/` | `Button`, `Text`, `Card`, `Badge` | Yes — public API |
| `src/demo/` | `Masthead`, `Byline`, `StoryTile`, `FrontPage` | **No** |

Demo components follow exactly the same authoring discipline as real ones: CSS Modules referencing `var(--ds-*)` only, no brand-conditional code, no hardcoded values. They are simply not part of the package.

## Consequences

- The published API stays four components. `dist/index.d.ts` exposes `Badge`, `Button`, `Card`, `Text` and their prop types — nothing else.
- No stability obligation for demo furniture. `Masthead` can be reshaped freely to make the showcase better without it being a breaking change for anyone.
- The showcase still proves what it needs to. Because demo components obey the same token discipline, a front page that switches brand cleanly is real evidence the theming works in composition — arguably better evidence than a component gallery, since it exercises layout, rhythm, and density together.
- **`src/index.ts` is the only gate, and it is silent.** A demo component accidentally re-exported there ships to consumers, and nothing fails. The inverse is the more likely mistake: a genuinely reusable component built in `src/demo/` and never promoted. Both are review concerns, not automated ones.
- Promotion has a defined path: move the directory to `src/components/`, add stories with `tags: ['autodocs']`, re-export from `src/index.ts`, and label it per the lifecycle vocabulary in `docs/GLOSSARY.md`.
- This keeps [ADR 0008](./0008-single-reference-component.md)'s reasoning alive rather than overturning it. 0008 declined to build eight components in order to avoid inventing APIs without discussion. Four primitives were needed to show brand typography and density; the editorial three exist only to make the demo convincing, so they get built without incurring an API commitment.

## Alternatives considered

**Export all seven.** Consistent treatment — everything gets autodocs and a stability label. Rejected because it publishes domain-specific furniture as public API, and each export is then something owed a stable interface. A design system that ships `Byline` has taken a position on what a byline is.

**Export the four, mark the editorial three `experimental`.** Uses the lifecycle vocabulary already defined in the glossary and keeps everything visible in one place. Rejected because the label would be permanent rather than transitional — these are not primitives on their way to stability, they are demo scaffolding. `experimental` would be a euphemism.

**Build the front page as bespoke markup in a story file**, with no demo components at all. Fewer files and nothing to mistake for API. Rejected because a single large story file is harder to read than named components, and because composing from components is what makes the demo a genuine test of the token layer rather than a one-off illustration.
