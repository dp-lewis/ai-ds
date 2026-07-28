# 5. Separate Vite bundle entry from the TypeScript declarations entry

- **Date:** 2026-07-29
- **Status:** Accepted

## Context

The package must ship a single stylesheet containing the token layer plus every component's CSS. For Vite to emit that file, the CSS has to be reachable from the module graph of the build entry — which in practice means some TypeScript file performs a side-effect import of `tokens.css`.

The obvious place for that import is the public barrel, `src/index.ts`. That is what the original plan specified, and the first build did exactly it. The output was broken:

```ts
// dist/index.d.ts, as originally emitted
import './styles/tokens.css';
export { Button } from './components/Button';
```

TypeScript preserves side-effect imports in emitted declarations, but `dist/` contains no `styles/` directory — the CSS is bundled into `dist/ds.css`. Any consumer typechecking without `skipLibCheck` would fail to resolve `./styles/tokens.css`. The defect was invisible in this repo, because the build and typecheck both pass; it would only appear in a consuming project.

## Decision

Split the two entries:

| File | Role | Emits |
| --- | --- | --- |
| `src/bundle.ts` | Vite's library entry. Imports `./styles/tokens.css`, re-exports `./index`. | `dist/index.js` |
| `src/index.ts` | Public API surface. No CSS imports. | `dist/index.d.ts` |

`src/bundle.ts` is excluded from `tsconfig.build.json`, so it produces no declarations. The filenames converge in `dist/` by design: Vite's `lib.fileName: 'index'` and `tsc`'s `rootDir: 'src'` both land on `index`.

## Consequences

- Every path in the emitted declarations resolves. Consumers need no `skipLibCheck` workaround.
- **`src/index.ts` must stay free of CSS imports.** This is the fragile part: adding one there is a natural thing to do, it will pass every check in this repo, and it will silently reintroduce the defect for consumers. The constraint is documented in `CLAUDE.md` and in a comment in both files.
- Adding a component means re-exporting it from `src/index.ts` as usual. `bundle.ts` needs no edit — it re-exports `./index` wholesale.
- A second, small indirection for a reader tracing the build. Mitigated by the comment at the top of `bundle.ts` explaining why it exists.

## Alternatives considered

**Import `tokens.css` from each component's `.module.css` via CSS `@import`.** Would keep all CSS out of the TypeScript graph entirely, which is arguably cleaner. Rejected because `postcss-import` deduplicates per processed file rather than globally, so the token block risked being duplicated once per component as the system grows.

**Rely on consumers setting `skipLibCheck: true`.** Common in practice and would have required no change. Rejected because it makes the package's correctness depend on the consumer's compiler configuration, and it degrades type checking across all of their dependencies to hide one avoidable bug in ours.

**Post-process `dist/index.d.ts` to strip the CSS import.** Rejected as a build step that exists solely to undo something the build just did.

**Ship no CSS from the JS entry and require consumers to import the stylesheet by path.** Consumers already import `ai-ds/styles.css` explicitly, so this is close to what happens — but the stylesheet still has to be *produced*, which requires the CSS to be in the build graph. Does not solve the problem.
