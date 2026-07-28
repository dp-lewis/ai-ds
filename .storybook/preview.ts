import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'storybook/preview-api';
import { BRANDS, MODES } from '../src/styles/brands';
import '../src/styles/tokens.css';
import '../src/styles/themes/broadsheet.css';
import '../src/styles/themes/tabloid.css';
import '../src/styles/themes/financial.css';
import '../src/styles/themes/wireframe.css';
import './preview.css';

/*
 * Brand and mode are two independent axes, so they need two independent
 * toolbar controls. @storybook/addon-themes cannot provide that: its
 * withThemeByDataAttribute reads a single hardcoded global key and registers
 * one toolbar control, so two instances would collide on both. Hence
 * globalTypes plus this decorator — see
 * docs/adr/0010-hand-rolled-theme-switching.md.
 */
const withBrandAndMode: Decorator = (Story, context) => {
  const { theme, mode } = context.globals as { theme?: string; mode?: string };

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme ?? BRANDS[0];
    root.dataset.mode = mode ?? MODES[0];
  }, [theme, mode]);

  return Story();
};

const preview: Preview = {
  // Applied to every story, so each component gets a generated docs page.
  tags: ['autodocs'],

  globalTypes: {
    theme: {
      description: 'Publication brand',
      defaultValue: BRANDS[0],
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: BRANDS.map((value) => ({ value, title: value })),
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'Light or dark mode',
      defaultValue: MODES[0],
      toolbar: {
        title: 'Mode',
        icon: 'contrast',
        items: MODES.map((value) => ({ value, title: value })),
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    controls: { expanded: true },
    // 'error' fails the story on an axe violation instead of quietly
    // reporting it in a panel nobody opens.
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: ['Introduction', 'Tokens', 'Brands', 'Components'],
      },
    },
  },

  decorators: [withBrandAndMode],
};

export default preview;
