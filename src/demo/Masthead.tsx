import { Text } from '../components/Text';
import styles from './Masthead.module.css';

export interface MastheadProps {
  title: string;
  strapline?: string;
  date: string;
  edition?: string;
}

/**
 * Demo furniture — not part of the design system's public API.
 *
 * Built only from `Text` and tokens, so it changes brand exactly the way a
 * real component would.
 */
export function Masthead({ title, strapline, date, edition }: MastheadProps) {
  return (
    <header className={styles.masthead}>
      <Text as="h1" size="4xl" weight="bold">
        {title}
      </Text>

      {strapline ? (
        <Text as="p" size="md" tone="muted">
          {strapline}
        </Text>
      ) : null}

      <div className={styles.meta}>
        <Text as="span" size="sm" tone="muted" numeric>
          {date}
        </Text>
        {edition ? (
          <Text as="span" size="sm" tone="muted">
            {edition}
          </Text>
        ) : null}
      </div>
    </header>
  );
}
