import { Text } from '../components/Text';
import styles from './Byline.module.css';

export interface BylineProps {
  author: string;
  role?: string;
  readingTime?: string;
}

/**
 * Demo furniture — not part of the design system's public API.
 *
 * Picks up `--ds-text-transform-label`, so the author's name is uppercased
 * in the brands that shout and left alone in the ones that don't.
 */
export function Byline({ author, role, readingTime }: BylineProps) {
  return (
    <div className={styles.byline}>
      <Text as="span" size="sm" weight="medium" className={styles.name}>
        {author}
      </Text>
      {role ? (
        <Text as="span" size="sm" tone="muted">
          {role}
        </Text>
      ) : null}
      {readingTime ? (
        <Text as="span" size="sm" tone="muted" numeric>
          {readingTime}
        </Text>
      ) : null}
    </div>
  );
}
