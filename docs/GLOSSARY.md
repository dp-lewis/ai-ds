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
| **mode** | How a single brand adapts to a viewing context. | `light`, `dark`, potentially `high-contrast` |
| **theme** | Whose brand is being rendered. | `default`, and any future brand |
| **density** | Spacing across a region of UI. Independent of both mode and theme — [ADR 0003](./adr/0003-semantic-token-naming.md) argues density is not a theme. **Not implemented.** | `compact`, `comfortable` |

So "the Acme brand in dark mode" is a theme and a mode together, not one compound thing.

⚠️ **The code does not yet match this.** `tokens.css` implements dark as `[data-theme="dark"]`, which under this glossary should be `[data-mode="dark"]`. See *Known inconsistencies* below.

> *Not used:* "theme" as an umbrella for both axes, "dark theme" (it's a dark **mode**), "spacing scale" for density (that already means the `--ds-space-*` ramp).

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
| **superseded by NNNN** | Replaced. The record stays; only its status changes. |

> *Not used:* "draft" / "beta" for components, "deprecated" for a decision (decisions are superseded), "superseded" for a component (components are deprecated).

---

## Known inconsistencies

Recorded rather than quietly fixed, because resolving them changes code and published API.

1. **`[data-theme="dark"]` should be `[data-mode="dark"]`.** Affects `tokens.css`, the `withThemeByDataAttribute` decorator in `.storybook/preview.ts`, ADR 0003, `CLAUDE.md`, and `readme.md`. It's a public API change for consumers who set the attribute themselves — cheapest to do now, while there are none.

2. **ADR 0003 is titled "Semantic token naming" and refers to themes throughout** where it now means modes. Its argument is unaffected; the wording isn't.

3. **`Button` has no lifecycle label.** Under this glossary it's *stable*. Nothing currently records that.

Fixing (1) and (2) together is a single coherent change. It hasn't been made yet.
