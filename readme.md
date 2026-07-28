# ai-ds

A React design system carrying four publication brands — **broadsheet**,
**tabloid**, **financial**, and **wireframe** — each in light and dark.

Components are styled with CSS Modules that read every value from a layer of CSS
custom properties. A brand is nothing but a set of token overrides: there is no
brand-conditional code anywhere in the system.

## Develop

```bash
npm install
npm run storybook   # showcase on http://localhost:6006
```

| Command | Purpose |
| --- | --- |
| `npm run storybook` | Dev server and component showcase |
| `npm run build` | Library build to `dist/` |
| `npm run build-storybook` | Static showcase to `storybook-static/` |
| `npm run typecheck` | Type check without emitting |
| `npm run validate:tokens` | Assert every brand defines the full colour set, both modes |

## Consume

```tsx
import { Badge, Button, Card, Text } from 'ai-ds';
import 'ai-ds/styles.css'; // once, at your app's entry point

<Card>
  <Card.Header>
    <Badge>Politics</Badge>
  </Card.Header>
  <Card.Body>
    <Text as="h3">Chancellor signals shift in fiscal policy</Text>
    <Button onClick={read}>Read more</Button>
  </Card.Body>
</Card>;
```

## Theming

Two independent axes, both attributes on the same element:

```html
<html data-theme="financial" data-mode="dark"></html>
```

| Brand | Character |
| --- | --- |
| `broadsheet` | Serif throughout, 1.25× space, hairline rules, no shadows |
| `tabloid` | Condensed headlines at weight 800, 0.75× space, thick rules, uppercase labels |
| `financial` | Salmon ground, serif over sans, `tabular-nums` for aligned figures |
| `wireframe` | Monospace, greyscale, zero radius, every edge drawn |

A brand may override **any** token, including `--ds-space-*`, so switching brand
changes typography and density rather than only palette. The one obligation is
the full colour set for both modes — `npm run validate:tokens` enforces it.

`data-mode` alone does nothing, since dark values differ per brand. Elements with
no `data-theme` get a neutral light fallback.

## Conventions

- Component CSS references `var(--ds-*)` only. Need a value the token layer
  doesn't have? Add a token.
- Components never branch on brand or mode. Token overrides are the entire
  mechanism.
- Font families are named by role (`--ds-font-heading`, `--ds-font-body`), not by
  classification.
- New components follow the shape of `src/components/Button/` and must be
  re-exported from `src/index.ts` to ship. Anything in `src/demo/` is showcase
  furniture and stays unexported.

See [CLAUDE.md](./CLAUDE.md) for the fuller architecture notes,
[docs/adr/](./docs/adr/README.md) for the decisions behind them, and
[docs/GLOSSARY.md](./docs/GLOSSARY.md) for the agreed terminology.
