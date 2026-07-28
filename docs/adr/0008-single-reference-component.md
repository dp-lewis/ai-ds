# 8. Scope the initial system to one reference component

- **Date:** 2026-07-29
- **Status:** Accepted

## Context

The scaffold needed enough substance to prove the whole pipeline works — token layer, component authoring, stories, generated docs, library build — without pre-committing to component APIs that had not been discussed. The options ranged from a token layer alone to a set of roughly eight primitives.

## Decision

Build the token layer plus **`Button` only**, and treat that directory as the template every subsequent component copies:

```
src/components/Button/
  Button.tsx           props → class names; extends the native element's props
  Button.module.css    tokens only — the reference for how component CSS is written
  Button.stories.tsx   tags: ['autodocs'], one story per meaningful state
  index.ts             re-exports component + prop types
```

`Button` was the right single choice because it exercises every mechanism that matters: variants and sizes (prop-to-class mapping), a disabled state, focus-visible styling, an icon slot, and full pass-through of native element props.

## Consequences

- Every layer is proven end-to-end, and the patterns are demonstrated rather than described. A new component is a copy-and-adapt of four files, not a set of fresh decisions.
- No component API was invented without discussion. `Select`, `Checkbox`, and the rest get designed when there is a real use case, rather than guessed at now and reworked later.
- The initial diff is small enough to review closely — which is what surfaced the declaration-emit defect in [0005](./0005-split-bundle-and-types-entry.md) before any consumer existed.
- Layout and form-control patterns are unproven. `Button` does not exercise a controlled value, label association, or composition of children, so the first component needing those will break new ground. This is the accepted cost.
- **`src/index.ts` is the gate.** A new component that is not re-exported there does not ship, and nothing in the build will complain — see [0005](./0005-split-bundle-and-types-entry.md).

## Alternatives considered

**Tokens plus roughly eight primitives** (Button, Input, Select, Checkbox, Stack, Card, Badge, Text). More immediately useful. Rejected because it would have meant deciding eight component APIs without input, producing a large diff to review, and building layout and form abstractions before any real usage informed them.

**Tokens alone, with no component.** The smallest possible starting point. Rejected because a token layer with no consumer proves nothing — it would not have exercised CSS Modules, the docgen prop table, the a11y checks, or the CSS bundling that turned out to contain a real defect.
