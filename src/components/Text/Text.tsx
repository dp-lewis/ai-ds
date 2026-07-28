import type { ComponentPropsWithRef, ElementType } from 'react';
import styles from './Text.module.css';

export type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
export type TextRole = 'heading' | 'body';
export type TextSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type TextWeight = 'regular' | 'medium' | 'bold';
export type TextTone = 'default' | 'muted' | 'accent';

const sizeClass: Record<TextSize, string> = {
  sm: styles.sizeSm!,
  md: styles.sizeMd!,
  lg: styles.sizeLg!,
  xl: styles.sizeXl!,
  '2xl': styles.size2xl!,
  '3xl': styles.size3xl!,
  '4xl': styles.size4xl!,
};

/** Sensible role per element, overridable via the `role` prop. */
const defaultRole: Record<TextElement, TextRole> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  p: 'body',
  span: 'body',
  div: 'body',
};

/** Sensible size per element, overridable via the `size` prop. */
const defaultSize: Record<TextElement, TextSize> = {
  h1: '4xl',
  h2: '3xl',
  h3: '2xl',
  h4: 'xl',
  p: 'lg',
  span: 'md',
  div: 'md',
};

export interface TextProps extends Omit<ComponentPropsWithRef<'p'>, 'color'> {
  /** Which element to render. Drives the default role and size. */
  as?: TextElement;
  /** Which font family role to use. Defaults from `as`. */
  role?: TextRole;
  /** Type scale step. Defaults from `as`. */
  size?: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  /** Apply `--ds-font-numeric` — use for figures that should align. */
  numeric?: boolean;
}

/**
 * Every piece of text in the system.
 *
 * The `as` prop picks the element and, with it, sensible role and size
 * defaults — so `<Text as="h1">` is a display heading without further
 * configuration, while both can still be overridden independently.
 */
export function Text({
  as = 'p',
  role,
  size,
  weight,
  tone = 'default',
  numeric = false,
  className,
  ...props
}: TextProps) {
  const Component = as as ElementType;
  const resolvedRole = role ?? defaultRole[as];
  const resolvedSize = size ?? defaultSize[as];

  const classes = [
    styles.text,
    styles[resolvedRole],
    sizeClass[resolvedSize],
    weight && styles[weight],
    tone !== 'default' && styles[tone],
    numeric && styles.numeric,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Component className={classes} {...props} />;
}
