import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Text } from '../components/Text';
import { Byline } from './Byline';
import { Masthead } from './Masthead';
import { StoryTile } from './StoryTile';
import styles from './FrontPage.module.css';

export interface FrontPageProps {
  /** Publication name shown in the masthead. */
  title?: string;
  strapline?: string;
}

/**
 * Demo furniture — not part of the design system's public API.
 *
 * A front page assembled entirely from design system components and demo
 * furniture, with no brand-specific code anywhere in it. Everything that
 * distinguishes the four brands comes from the token layer.
 */
export function FrontPage({
  title = 'The Daily Standard',
  strapline = 'Independent reporting since 1904',
}: FrontPageProps) {
  return (
    <div className={styles.page}>
      <Masthead
        title={title}
        strapline={strapline}
        date="Wednesday, 29 July 2026"
        edition="Late edition"
      />

      <div className={styles.grid}>
        <div className={styles.column}>
          <StoryTile
            lead
            section="Politics"
            headline="Chancellor signals shift in fiscal policy ahead of autumn statement"
            standfirst="The announcement follows weeks of speculation over borrowing limits, and marks the clearest break yet with the previous administration's approach."
            author="Helena Marsh"
            readingTime="6 min"
          />

          <StoryTile
            section="Markets"
            headline="Sterling steadies after three days of losses"
            standfirst="Traders pointed to firmer-than-expected manufacturing data as the driver of the recovery."
            author="Idris Okonjo"
            readingTime="4 min"
            figure="+1.24%"
            withFigure={false}
          />
        </div>

        <aside className={`${styles.column} ${styles.aside}`}>
          <Card variant="plain">
            <Card.Header>
              <Text as="span" size="sm" weight="bold">
                Also in the news
              </Text>
            </Card.Header>
            <Card.Body>
              {[
                'Transport plan approved after lengthy consultation',
                'Water companies face fresh scrutiny over discharge data',
                'Record entries for regional arts prize',
              ].map((headline) => (
                <div key={headline}>
                  <Text as="h4" size="lg" weight="medium">
                    {headline}
                  </Text>
                  <Byline author="Staff reporter" />
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card variant="emphasis">
            <Card.Header>
              <Text as="span" size="sm" weight="bold">
                Markets at close
              </Text>
            </Card.Header>
            <Card.Body>
              {[
                ['FTSE 100', '8,241.09'],
                ['S&P 500', '5,588.10'],
                ['Nikkei 225', '41,004.55'],
              ].map(([name, value]) => (
                <div
                  key={name}
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Text as="span" size="md">
                    {name}
                  </Text>
                  <Text as="span" size="md" weight="medium" numeric>
                    {value}
                  </Text>
                </div>
              ))}
            </Card.Body>
          </Card>
        </aside>
      </div>

      <div className={styles.strip}>
        {[
          {
            section: 'Sport',
            headline: 'Late equaliser keeps title race alive',
            author: 'Rosa Lindqvist',
          },
          {
            section: 'Culture',
            headline: 'A quieter kind of blockbuster',
            author: 'Tom Achebe',
          },
          {
            section: 'Science',
            headline: 'Mapping the seafloor, one pass at a time',
            author: 'Dr Wen Li',
          },
        ].map((story) => (
          <StoryTile
            key={story.headline}
            section={story.section}
            headline={story.headline}
            author={story.author}
            readingTime="3 min"
          />
        ))}
      </div>

      <div className={styles.actions}>
        <Button>Subscribe</Button>
        <Button variant="secondary">Today&rsquo;s paper</Button>
        <Button variant="ghost">Sign in</Button>
      </div>
    </div>
  );
}
