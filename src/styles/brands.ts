/**
 * The brand and mode values the token layer implements.
 *
 * Lives here so both the Storybook toolbar config (.storybook/preview.ts) and
 * the side-by-side comparison story read the same list — src/ never has to
 * reach into .storybook/ for it. Adding a brand means adding a stylesheet in
 * ./themes/, an import in ../bundle.ts, and an entry here.
 *
 * Not exported from src/index.ts: these are the system's own values, not
 * something consumers need typed access to.
 */

export const BRANDS = ['broadsheet', 'tabloid', 'financial', 'wireframe'] as const;
export const MODES = ['light', 'dark'] as const;

export type Brand = (typeof BRANDS)[number];
export type Mode = (typeof MODES)[number];
