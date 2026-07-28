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

// Brand stylesheets. Order is irrelevant: tokens.css wraps its defaults in
// :where(:root) for zero specificity, so every [data-theme] block wins
// regardless of where it lands in the bundle.
import './styles/themes/broadsheet.css';
import './styles/themes/tabloid.css';
import './styles/themes/financial.css';
import './styles/themes/wireframe.css';

export * from './index';
