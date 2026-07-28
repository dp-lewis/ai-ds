import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'muted'] },
  },
  args: {
    children: 'Politics',
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-2)' }}>
      <Badge {...args} variant="solid">
        Solid
      </Badge>
      <Badge {...args} variant="outline">
        Outline
      </Badge>
      <Badge {...args} variant="muted">
        Muted
      </Badge>
    </div>
  ),
};

export const LabelCasing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Badge reads `--ds-text-transform-label`. Tabloid and wireframe uppercase it; broadsheet and financial leave the text as written. The caller passes nothing either way.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-2)' }}>
      <Badge>Politics</Badge>
      <Badge variant="outline">Markets</Badge>
      <Badge variant="muted">Sport</Badge>
    </div>
  ),
};
