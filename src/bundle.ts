/*
 * Vite's library entry — not the types entry.
 *
 * The CSS side-effect import lives here rather than in index.ts so it stays out
 * of the emitted declarations. TypeScript preserves side-effect imports in
 * .d.ts output, and dist/ has no styles/ directory, so a consumer typechecking
 * without skipLibCheck would fail to resolve it.
 *
 * This file is excluded from tsconfig.build.json for that reason: vite builds
 * dist/index.js from here, tsc emits dist/index.d.ts from index.ts.
 */
import './styles/tokens.css';

export * from './index';
