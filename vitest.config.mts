import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { loadEnv } from 'vite'

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
})