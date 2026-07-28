import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { Text } from '../Text';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  subcomponents: { 'Card.Header': Card.Header, 'Card.Body': Card.Body },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'emphasis', 'plain'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: '28rem' }}>
      <Card.Header>
        <Badge>Politics</Badge>
      </Card.Header>
      <Card.Body>
        <Text as="h3">Chancellor signals shift in fiscal policy</Text>
        <Text tone="muted" size="md">
          The announcement follows weeks of speculation over the direction of
          the autumn statement.
        </Text>
      </Card.Body>
    </Card>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`emphasis` uses `--ds-border-width-thick`, which brands set very differently — tabloid draws 5px, the base scale 3px.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)', maxWidth: '28rem' }}>
      {(['default', 'emphasis', 'plain'] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <Card.Header>
            <Badge variant="outline">{variant}</Badge>
          </Card.Header>
          <Card.Body>
            <Text as="h4">Council approves transport plan</Text>
            <Text tone="muted" size="md">
              Work is expected to begin in the spring.
            </Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  ),
};

export const BodyOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The header is optional — `Card.Body` alone is a valid card.',
      },
    },
  },
  render: () => (
    <Card style={{ maxWidth: '28rem' }}>
      <Card.Body>
        <Text as="h4">Late results</Text>
        <Text tone="muted" size="md">
          Full coverage in tomorrow&rsquo;s edition.
        </Text>
      </Card.Body>
    </Card>
  ),
};
