import type { ComponentPropsWithRef } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual emphasis. Use one `primary` per view. */
  variant?: ButtonVariant;
  /** Control height and type scale. */
  size?: ButtonSize;
  /** Stretch to fill the container — useful in narrow or stacked layouts. */
  fullWidth?: boolean;
}

/**
 * The primary way to trigger an action.
 *
 * Extends the native `<button>`, so `type`, `onClick`, `aria-*`, `ref`, and
 * every other button attribute pass straight through.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // `type` defaults to "button": the native default is "submit", which makes
  // any button inside a form submit it unless told otherwise.
  return <button type={type} className={classes} {...props} />;
}
