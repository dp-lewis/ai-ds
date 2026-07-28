import type { ComponentPropsWithRef } from 'react';
import styles from './Card.module.css';

export type CardVariant = 'default' | 'emphasis' | 'plain';

export interface CardProps extends ComponentPropsWithRef<'div'> {
  variant?: CardVariant;
}

export type CardHeaderProps = ComponentPropsWithRef<'div'>;
export type CardBodyProps = ComponentPropsWithRef<'div'>;

function CardRoot({ variant = 'default', className, ...props }: CardProps) {
  const classes = [
    styles.card,
    variant !== 'default' && styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes} {...props} />;
}

function CardHeader({ className, ...props }: CardHeaderProps) {
  const classes = [styles.header, className].filter(Boolean).join(' ');
  return <div className={classes} {...props} />;
}

function CardBody({ className, ...props }: CardBodyProps) {
  const classes = [styles.body, className].filter(Boolean).join(' ');
  return <div className={classes} {...props} />;
}

/**
 * A bounded container. Compound: parts are reached through the parent, so
 * the relationship is visible at the call site.
 *
 * ```tsx
 * <Card>
 *   <Card.Header>…</Card.Header>
 *   <Card.Body>…</Card.Body>
 * </Card>
 * ```
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
});
