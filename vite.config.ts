import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      // bundle.ts, not index.ts — it adds the CSS side-effect import that
      // must not reach the emitted .d.ts. Relative to the project root, so
      // this needs no node:path import.
      entry: 'src/bundle.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'ds',
    },
    rollupOptions: {
      // Consumers bring their own React; bundling it would break hooks.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    // Emit every component's CSS Module into a single dist/ds.css that
    // consumers import once, rather than a stylesheet per chunk.
    cssCodeSplit: false,
    cssMinify: true,
  },
});
