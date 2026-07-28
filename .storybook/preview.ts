import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview, ReactRenderer } from '@storybook/react-vite';
import '../src/styles/tokens.css';
import './preview.css';

const preview: Preview = {
  // Applied to every story, so each component gets a generated docs page.
  tags: ['autodocs'],

  parameters: {
    controls: { expanded: true },
    // 'error' fails the story on an axe violation instead of quietly
    // reporting it in a panel nobody opens.
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: ['Introduction', 'Tokens', 'Components'],
      },
    },
  },

  decorators: [
    // Flips data-theme on <html>, which is the selector tokens.css keys off.
    withThemeByDataAttribute<ReactRenderer>({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
