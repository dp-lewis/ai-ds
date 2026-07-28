# ai-ds

A React design system. Components are styled with CSS Modules that read every
value from one layer of CSS custom properties, so the palette, spacing, and type
scale live in a single file.

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

## Consume

```tsx
import { Button } from 'ai-ds';
import 'ai-ds/styles.css'; // once, at your app's entry point

<Button variant="primary" size="md" onClick={save}>
  Save changes
</Button>;
```

## Theming

Tokens are defined on `:root` in `src/styles/tokens.css`, with a dark set under
`[data-theme="dark"]`. Switch by setting the attribute:

```ts
document.documentElement.dataset.theme = 'dark';
```

Only colour tokens are theme-scoped — spacing, radius, and type stay fixed so a
theme change can't reflow the layout.

## Conventions

- Component CSS references `var(--ds-*)` only. Need a value the token layer
  doesn't have? Add a token.
- Components never branch on theme. Re-pointing a colour token is the entire
  mechanism.
- New components follow the shape of `src/components/Button/` and must be
  re-exported from `src/index.ts` to ship.

See [CLAUDE.md](./CLAUDE.md) for the fuller architecture notes,
[docs/adr/](./docs/adr/README.md) for the decisions behind them, and
[docs/GLOSSARY.md](./docs/GLOSSARY.md) for the agreed terminology.
