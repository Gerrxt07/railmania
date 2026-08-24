import { defineConfig } from 'vite';
import { hardenedBuild, obfuscateProductionBundle } from './vite.shared.config.js';

export default defineConfig(({ mode }) => ({
  build: {
    ...hardenedBuild,
    target: 'node24',
    rollupOptions: {
      output: {
        entryFileNames: 'main.cjs',
        format: 'cjs',
      },
    },
  },
  plugins: mode === 'production' ? [obfuscateProductionBundle('node')] : [],
}));
