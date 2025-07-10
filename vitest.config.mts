import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    {
      name: 'load-svg',
      enforce: 'pre',
      transform(_, id) {
        if (id.endsWith('.svg')) {
          return 'export default () => {}';
        }
      },
    },
  ],
  test: {
    environment: 'jsdom',
    env: loadEnv('test', process.cwd(), ''),
  },
});
