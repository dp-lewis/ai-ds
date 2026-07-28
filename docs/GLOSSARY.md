# Glossary

Agreed terminology for this design system. The point is that a word means one thing here — when two reasonable terms existed, one was chosen and the other is recorded below as *not used*, so a reader who reaches for it finds out why.

Established 2026-07-29. Amend by pull request; if a term changes meaning, update every place it's used rather than leaving both senses in circulation.

---

## The system itself

| Term | Meaning |
| --- | --- |
| **the design system** | The whole thing: tokens, components, documentation, and the conventions that hold them together. Use this in prose. |
| **`ai-ds`** | The npm package specifically. Use when talking about installing, versioning, or importing. |
| **consumer** | An application or team that depends on the package. Already the term used throughout the ADRs. |
| **contributor** | Someone changing the design system itself, as opposed to consuming it. |
| **the showcase** | The Storybook site. Not "the docs" — that's ambiguous with the `docs/` directory. |

> *Not used:* "the library" (undersells it — the tokens, docs, and conventions aren't a library), "the kit" (vague about what's included), "client" (collides with HTTP client, API client).

---

## Tokens

| Term | Meaning |
| --- | --- |
| **token** | A named design value. The tool-independent term, and the canonical noun — use it in design and code conversations alike. |
| **CSS custom property** | The *implementation* of a token in this codebase: `--ds-color-brand`. Use when discussing the CSS mechanism specifically. |
| **Figma variable** | The representation of a token in Figma. Named distinctly so "token", "custom property", and "variable" each mean exactly one layer. |
| **semantic token** | A token named for its role: `--ds-color-brand`, `--ds-color-fg-muted`. The only tier that exists today, and the only tier components may reference. |
| **primitive token** | A raw value with no meaning attached: `--ds-blue-500`. **Does not exist in this system** — [ADR 0003](./adr/0003-semantic-token-naming.md) rejected the tier. Named so a future proposal has a word for it. |
| **foundations** | Colour, space, radius, typography, elevation, and motion as a group — the design decisions, distinct from the tokens encoding them. Use for doc sections not about a specific component. |

**`primitive` always carries the word `token`.** It refers exclusively to the token tier and never to a component — see the component-tier note below.

> *Not used:* "variable" as the canonical noun (collides with CSS, TypeScript, and Sass variables), "alias" / "global" / "core" for tiers, "scales" or "token groups" for foundations.

---

## Theming

Two independent axes. They compose, and conflating them is the mistake this section exists to prevent.

| Term | Meaning | Values |
| --- | --- | --- |
| **mode** | How a single brand adapts to a viewing context. | `light`, `dark` |
| **theme** | Whose brand is being rendered. Also called **brand** in prose; the two are interchangeable, and `theme` is what the attribute is called. | `broadsheet`, `tabloid`, `financial`, `wireframe` |
| **density** | How tightly spaced a brand is. **Not a separate axis** — a brand sets its own density by overriding `--ds-space-*`. | Expressed per brand, not selected independently |

So "financial in dark mode" is a theme and a mode together, not one compound thing. Both are attributes on the same element: `[data-theme="financial"][data-mode="dark"]`.

**`data-mode` alone does nothing.** Dark values differ per brand, so they are only defined in combination. An element with no `data-theme` gets the light fallback from `:where(:root)`.

> *Not used:* "theme" as an umbrella for both axes, "dark theme" (it's a dark **mode**), "spacing scale" for density (that already means the `--ds-space-*` ramp), `density` as an independent axis or attribute.

**Changed 2026-07-29.** `density` originally read "independent of both mode and theme", following [ADR 0003](./adr/0003-semantic-token-naming.md). [ADR 0009](./adr/0009-two-axis-theming.md) superseded that: publication brands differ by density as much as by palette, so a brand overrides the space scale directly. If a compact mode is ever wanted *within* a single brand, density becomes a real third axis and this entry changes again.

---

## Components

Three tiers. The word **`primitive` is deliberately absent** — it belongs to tokens only, so "base" names the lowest component tier.

| Term | Meaning | Examples |
| --- | --- | --- |
| **base component** | Single-purpose, no domain knowledge, assembled from nothing else in the system. | `Button`, `Input`, `Text`, `Stack` |
| **component** | Built from base components, still generic. Also the umbrella term when the tier doesn't matter. | `SearchField`, `Card`, `Dialog` |
| **pattern** | A documented solution to a recurring problem. May be code, may be guidance only. | "empty states", "destructive confirmation" |

### Anatomy

| Term | Meaning |
| --- | --- |
| **compound component** | A parent exporting its parts as properties: `Card` with `Card.Header`. The established React term for the pattern. |
| **part** | One piece of a compound component — `Card.Header`. Not "sub-component". |
| **slot** | A named region a part or child fills. |
| **variant** | The `variant` prop specifically — visual emphasis, nothing else: `primary`, `secondary`, `ghost`. |
| **size** | One component's own scale: `sm`, `md`, `lg`. A size is *not* a variant, and not density. |
| **state** | A runtime condition, not a prop: hover, focus-visible, disabled, loading. |
| **story** | One Storybook entry showing a component in a particular configuration. |

### "Story" has two senses

Unavoidable in a newspaper design system. The split:

| Term | Meaning |
| --- | --- |
| **story** (bare) | A Storybook entry. This is the default reading. |
| **news story** | The editorial thing. Always qualified in prose. |
| `StoryTile` | A component; "story" in its name is the editorial sense. |

So "`StoryTile` has four stories" means four Storybook entries, and it is not ambiguous once written down. The editorial sense appears **only inside component names** — never bare in prose.

> *Not used:* "example" for a Storybook entry (fights the tool's own vocabulary, the `.stories.tsx` filename, and all of Storybook's documentation).

**"Variant" is never an umbrella term.** There's no collective noun for appearance-affecting props — they're just props. Ask "which props does `Button` take?", not "which modifiers?".

> *Not used:* "atoms" / "molecules" / "organisms", "primitive component", "sub-component", "modifier".

---

## Extending the system

| Term | Meaning |
| --- | --- |
| **escape hatch** | The `className` / `style` passthrough a consumer uses to override component styles. Supported — but each use signals the system is missing something. The right follow-up is "should this be a token or a variant instead?" |
| **override** | What an escape hatch does to a specific style. |
| **invariant** | A rule that must hold for the system to stay coherent. The two in [ADR 0002](./adr/0002-css-custom-properties-and-css-modules.md): component CSS references `var(--ds-*)` exclusively, and components never branch on theme or mode. |

> *Not used:* "customisation" (frames the workaround as an intended extension point, encouraging the drift the invariants prevent).

---

## Lifecycle

Two separate vocabularies. Components have readiness; decisions have status. Keeping them apart stops "superseded" from meaning two things.

**Components:**

| Label | Meaning for consumers |
| --- | --- |
| **experimental** | API may change without notice. Wrap it in your own code if you depend on it. |
| **stable** | Breaking changes only in a major version. |
| **deprecated** | Do not adopt. The deprecation note names the replacement. |

**Decisions (ADRs only):**

| Label | Meaning |
| --- | --- |
| **accepted** | In force. |
| **provisional** | Accepted, with explicit conditions for revisiting — as in [ADR 0007](./adr/0007-defer-tests-and-linting.md). |
| **amended by NNNN** | Still in force, but one specific decision within it was reversed — as in [ADR 0004](./adr/0004-storybook-as-showcase.md). |
| **superseded by NNNN** | Replaced wholesale. The record stays unedited; only its status changes. |

> *Not used:* "draft" / "beta" for components, "deprecated" for a decision (decisions are superseded), "superseded" for a component (components are deprecated).

### Current component labels

| Component | Label |
| --- | --- |
| `Button`, `Text`, `Card`, `Badge` | stable |
| `Masthead`, `Byline`, `StoryTile`, `FrontPage` | not applicable — demo furniture, unexported ([ADR 0011](./adr/0011-demo-components-stay-unexported.md)) |

---

## Resolved inconsistencies

This section previously listed three gaps between the glossary and the code. All three were closed on 2026-07-29 by the four-brand theming change ([ADR 0009](./adr/0009-two-axis-theming.md)). Kept as a record of what was fixed:

1. **`[data-theme="dark"]` → `[data-mode="dark"]`** — done. `theme` now means brand throughout, `mode` means light/dark, and the two compose as separate attributes.
2. **ADR 0003's "theme" wording** — resolved by superseding the record rather than rewording it. It carries a banner noting that its "theme" means what the glossary calls **mode**.
3. **`Button` had no lifecycle label** — now recorded in *Current component labels* above, along with the other three primitives.

New inconsistencies belong here as they are found. An empty section is the goal, not the expectation.
