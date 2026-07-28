import { Badge } from '../components/Badge';
import { Text } from '../components/Text';
import { Byline } from './Byline';
import styles from './StoryTile.module.css';

export interface StoryTileProps {
  section: string;
  headline: string;
  standfirst?: string;
  author: string;
  readingTime?: string;
  /** A lead story gets display-size type and a wider figure. */
  lead?: boolean;
  withFigure?: boolean;
  /** Shown right-aligned in the footer — exercises tabular figures. */
  figure?: string;
}

/**
 * Demo furniture — not part of the design system's public API.
 *
 * "Story" is the editorial sense here. The Storybook sense of the word is
 * what `StoryTile.stories.tsx` contains; the glossary records the split.
 */
export function StoryTile({
  section,
  headline,
  standfirst,
  author,
  readingTime,
  lead = false,
  withFigure = true,
  figure,
}: StoryTileProps) {
  const classes = [styles.tile, lead && styles.lead].filter(Boolean).join(' ');

  return (
    <article className={classes}>
      {withFigure ? <div className={styles.figure} /> : null}

      <div className={styles.kicker}>
        <Badge variant={lead ? 'solid' : 'outline'}>{section}</Badge>
      </div>

      <Text as={lead ? 'h2' : 'h3'} weight="bold">
        {headline}
      </Text>

      {standfirst ? (
        <Text as="p" size={lead ? 'lg' : 'md'} tone="muted">
          {standfirst}
        </Text>
      ) : null}

      <div className={styles.footer}>
        <Byline author={author} readingTime={readingTime} />
        {figure ? (
          <Text as="span" size="sm" weight="medium" tone="accent" numeric>
            {figure}
          </Text>
        ) : null}
      </div>
    </article>
  );
}
