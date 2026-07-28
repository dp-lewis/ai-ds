import type { ComponentPropsWithRef } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'solid' | 'outline' | 'muted';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  variant?: BadgeVariant;
}

/**
 * A short label — a section kicker, a status, a category.
 *
 * Reads `--ds-text-transform-label`, so brands that uppercase their labels
 * do so without the caller passing anything.
 */
export function Badge({ variant = 'solid', className, ...props }: BadgeProps) {
  const classes = [styles.badge, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes} {...props} />;
}
