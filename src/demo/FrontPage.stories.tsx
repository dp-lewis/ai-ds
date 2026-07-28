import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrontPage } from './FrontPage';

const meta = {
  title: 'Brands/Front Page',
  component: FrontPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A front page assembled only from design system components and demo furniture — no brand-specific code anywhere in it. Use the **Brand** and **Mode** toolbar controls to switch: everything you see change comes from the token layer.',
      },
    },
  },
} satisfies Meta<typeof FrontPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Current brand',
};

export const Broadsheet: Story = {
  globals: { theme: 'broadsheet' },
  parameters: {
    docs: {
      description: {
        story:
          'Serif throughout, 1.25× the base space scale, hairline rules, no shadows. Authority through whitespace.',
      },
    },
  },
};

export const Tabloid: Story = {
  globals: { theme: 'tabloid' },
  parameters: {
    docs: {
      description: {
        story:
          'Condensed headlines at weight 800, 0.75× space, thick black rules, uppercase labels. Note the layout genuinely tightens — brands may override `--ds-space-*`.',
      },
    },
  },
};

export const Financial: Story = {
  globals: { theme: 'financial' },
  parameters: {
    docs: {
      description: {
        story:
          'Salmon ground, serif headlines over a sans body, and `tabular-nums` so the market figures align in their column.',
      },
    },
  },
};

export const Wireframe: Story = {
  globals: { theme: 'wireframe' },
  parameters: {
    docs: {
      description: {
        story:
          'Monospace, greyscale, zero radius, every edge drawn. Deliberately does not override the space scale — proof that only the colour set is mandatory.',
      },
    },
  },
};
