# 1. React 19 + Vite + TypeScript

- **Date:** 2026-07-29
- **Status:** Accepted

## Context

`ai-ds` began as an empty repository — a single 0-byte `readme.md` and an `npm init` default `package.json`. There was no existing code, no consuming application in the repo, and therefore no constraint inherited from either. The renderer choice was fully open, and it determines almost everything downstream: which Storybook framework package applies, how components are authored, and what consumers must have installed.

## Decision

Target **React 19** components, built with **Vite 8**, authored in **TypeScript**.

React is the peer dependency (`^18.0.0 || ^19.0.0`), so the package remains consumable by apps still on 18 even though the source targets 19's conventions.

## Consequences

- `@storybook/react-vite` is the framework package, which is Storybook's best-supported path — most addons are developed against it first.
- Under React 19, `ref` is an ordinary prop. Components extend `ComponentPropsWithRef<'element'>` and need no `forwardRef` wrapper, which removes a layer of boilerplate from every component.
- Consuming apps must provide React themselves. `react`, `react-dom`, and `react/jsx-runtime` are marked external in the build — bundling React would give consumers a second copy and break hooks.
- Components are not usable from Vue, Svelte, or plain HTML without a wrapper. This is the real cost of the decision, and it is accepted below.
- TypeScript is `strict`, with `noUncheckedIndexedAccess` and `verbatimModuleSyntax` on. Prop types are part of the public API and are emitted as declarations.

## Alternatives considered

**Web Components (Lit).** The genuinely framework-agnostic option: components would be consumable from React, Vue, or plain HTML, which is the strongest argument for a design system meant to outlive a single framework choice. Rejected because the Storybook addon ecosystem is materially thinner, typing is more manual, and there is no second consuming framework in play today to justify paying that cost up front. If a non-React consumer appears, this ADR should be revisited rather than worked around.

**Vue 3 / Svelte.** Both have solid Storybook support. Rejected only because no consuming app requires them; there is no technical objection.

## Notes

Versions verified against the npm registry on the decision date: `vite` 8.1.5, `react` 19.2.8, `@vitejs/plugin-react` 6.0.4.
