import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'div'],
    },
    role: { control: 'inline-radio', options: ['heading', 'body'] },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
    },
    weight: { control: 'inline-radio', options: ['regular', 'medium', 'bold'] },
    tone: { control: 'inline-radio', options: ['default', 'muted', 'accent'] },
  },
  args: {
    children: 'Chancellor signals shift in fiscal policy',
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Scale: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Switch brand in the toolbar to see this scale change typeface. Broadsheet and financial are serif, tabloid is condensed, wireframe is monospace.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
      <Text as="h1">Display 4xl</Text>
      <Text as="h2">Heading 3xl</Text>
      <Text as="h3">Heading 2xl</Text>
      <Text as="h4">Heading xl</Text>
      <Text as="p">Body lg — the standard reading size for article text.</Text>
      <Text as="span" size="md">
        UI md
      </Text>
      <Text as="span" size="sm">
        UI sm
      </Text>
    </div>
  ),
};

export const Roles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Heading and body are separate family tokens, so a brand can set them to different typefaces — financial pairs a serif headline with a sans body.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
      <Text as="div" role="heading" size="2xl">
        Heading role — var(--ds-font-heading)
      </Text>
      <Text as="div" role="body" size="2xl">
        Body role — var(--ds-font-body)
      </Text>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-2)' }}>
      <Text>Default — var(--ds-color-fg)</Text>
      <Text tone="muted">Muted — var(--ds-color-fg-muted)</Text>
      <Text tone="accent">Accent — var(--ds-color-brand)</Text>
    </div>
  ),
};

export const Numeric: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With `numeric`, figures use `--ds-font-numeric`. Only the financial brand sets it to `tabular-nums` — switch brands and watch the columns align.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-1)' }}>
      {['1,241.09', '88.10', '10,004.55', '7.42'].map((figure) => (
        <Text key={figure} numeric size="lg">
          {figure}
        </Text>
      ))}
    </div>
  ),
};
