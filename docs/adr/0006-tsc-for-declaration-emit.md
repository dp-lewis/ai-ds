# 6. Emit declarations with `tsc`, not `vite-plugin-dts`

- **Date:** 2026-07-29
- **Status:** Accepted

## Context

Vite's library mode bundles JavaScript and CSS but does not emit TypeScript declarations. Something else has to produce `dist/index.d.ts`. The usual choice is `vite-plugin-dts`, which folds declaration emit into the Vite build as a single step.

The complicating factor is timing. TypeScript 7.0.2 was the current stable release at the time of this decision — the native (Go) port, with a substantially reworked programmatic compiler API. `vite-plugin-dts` drives that API internally, which makes it exposed to the rewrite in a way that first-party tooling is not.

## Decision

Emit declarations with `tsc` directly, as a second step in the build script:

```json
"build": "vite build && tsc -p tsconfig.build.json"
```

`tsconfig.build.json` sets `emitDeclarationOnly` with `declaration` and `declarationMap`, `rootDir: 'src'`, `outDir: 'dist'`, and excludes both stories and `src/bundle.ts` (see [0005](./0005-split-bundle-and-types-entry.md)).

Pin TypeScript at `^7.0.2`.

## Consequences

- One fewer dependency, and no third-party coupling to a compiler API in flux. Declaration emit is a first-party TypeScript feature and the most stable path available.
- Declarations mirror the source tree — `dist/components/Button/Button.d.ts` alongside `dist/index.d.ts` — rather than being rolled into a single flat file. Slightly more files, and it means the public API is defined by what `src/index.ts` re-exports rather than by what the declaration bundler chose to include. That is the more honest arrangement.
- `declarationMap` is on, so consumers' editors can navigate from the package's types back to its source.
- The build is two sequential steps rather than one. `tsc` on a project this size is fast enough that the difference is not worth optimising.
- Stories are excluded from declaration output, so `@storybook/*` types never leak into the published package.
- **Fallback:** if declaration emit misbehaves under TypeScript 7, `typescript@5.9` is a drop-in replacement. Nothing else in the scaffold depends on the TypeScript major version — deliberately, which is also why `react-docgen` was left Babel-based rather than TypeScript-based ([0004](./0004-storybook-as-showcase.md)).

## Alternatives considered

**`vite-plugin-dts`.** A single build step, and it can roll declarations into one bundled file. Rejected on the API-stability grounds above; this ADR should be revisited once the TypeScript 7 ecosystem has settled, since the single-step build is genuinely more convenient.

**`typescript@5.9` instead of 7.** The conservative choice, and it would have made `vite-plugin-dts` uncontroversial. Rejected because pinning to a superseded major at the very start of a project accrues an upgrade debt immediately, and the fallback direction is cheap.

## Notes

Related build decisions recorded here rather than in a separate ADR, being consequences of Vite's library mode rather than independent choices:

- `formats: ['es']` — ES modules only. No consumer needs CommonJS, and `"type": "module"` is set in `package.json`.
- `external: ['react', 'react-dom', 'react/jsx-runtime']` — bundling React would give consumers a duplicate copy and break hooks.
- `cssCodeSplit: false` with `lib.cssFileName: 'ds'` — collapses all component CSS into one `dist/ds.css`, exported as `ai-ds/styles.css`, so consumers make a single stylesheet import.
- `sideEffects: ["**/*.css"]` in `package.json` — tells consumer bundlers not to tree-shake the stylesheet away.
