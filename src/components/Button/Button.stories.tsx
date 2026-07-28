import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    onClick: { table: { disable: true } },
  },
  args: {
    children: 'Save changes',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Emphasis descends from `primary` to `ghost`. A view should have at most one `primary` button.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' }}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: {
    docs: {
      description: {
        story: 'Fills its container. The wrapper below is constrained to 320px.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Icons are plain children — the base style supplies the gap. Decorative icons need `aria-hidden` so the label is announced once.',
      },
    },
  },
  render: (args) => (
    <Button {...args}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Save changes
    </Button>
  ),
};
