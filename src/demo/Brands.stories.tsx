import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Text } from '../components/Text';
import { BRANDS, MODES } from '../styles/brands';

/*
 * Side-by-side comparison.
 *
 * Each panel sets data-theme and data-mode on its own wrapper rather than
 * relying on the toolbar. This works because brand selectors are written as
 * bare [data-theme='x'] rather than :root[data-theme='x'] — so a brand can
 * be scoped to any subtree, and several can coexist on one page.
 */

interface PanelProps {
  brand: string;
  mode: string;
}

function Panel({ brand, mode }: PanelProps) {
  return (
    <div
      data-theme={brand}
      data-mode={mode}
      style={{
        background: 'var(--ds-color-bg)',
        color: 'var(--ds-color-fg)',
        fontFamily: 'var(--ds-font-body)',
        padding: 'var(--ds-space-4)',
        border: '1px solid #8884',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-3)',
      }}
    >
      <Text as="span" size="sm" tone="muted">
        {brand} / {mode}
      </Text>

      <Text as="h3" weight="bold">
        Chancellor signals shift
      </Text>

      <Text as="p" size="md" tone="muted">
        The announcement follows weeks of speculation over borrowing limits.
      </Text>

      <div style={{ display: 'flex', gap: 'var(--ds-space-2)' }}>
        <Badge>Politics</Badge>
        <Badge variant="outline">Markets</Badge>
      </div>

      <Card>
        <Card.Body>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text as="span" size="md">
              FTSE 100
            </Text>
            <Text as="span" size="md" weight="medium" numeric>
              8,241.09
            </Text>
          </div>
        </Card.Body>
      </Card>

      <div style={{ display: 'flex', gap: 'var(--ds-space-2)' }}>
        <Button size="sm">Subscribe</Button>
        <Button size="sm" variant="secondary">
          Sign in
        </Button>
      </div>
    </div>
  );
}

const meta = {
  title: 'Brands/Side by side',
  parameters: {
    layout: 'fullscreen',
    // The toolbar controls have no effect here: every panel scopes its own
    // brand, which is the point of the story.
    docs: {
      description: {
        component:
          'All brands rendered at once, each scoping its own tokens to a subtree. The toolbar controls deliberately have no effect on these panels.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
  gap: '1px',
} as const;

export const AllBrands: Story = {
  name: 'All brands (light)',
  render: () => (
    <div style={gridStyle}>
      {BRANDS.map((brand) => (
        <Panel key={brand} brand={brand} mode="light" />
      ))}
    </div>
  ),
};

export const LightAndDark: Story = {
  name: 'All brands × both modes',
  parameters: {
    docs: {
      description: {
        story:
          'Eight combinations at once. Brand and mode are independent axes that compose — each panel sets both attributes on the same element.',
      },
    },
  },
  render: () => (
    <div style={gridStyle}>
      {MODES.flatMap((mode) =>
        BRANDS.map((brand) => (
          <Panel key={`${brand}-${mode}`} brand={brand} mode={mode} />
        )),
      )}
    </div>
  ),
};
