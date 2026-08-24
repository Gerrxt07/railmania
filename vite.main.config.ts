import { defineConfig } from 'vite';
import { hardenedBuild, obfuscateProductionBundle } from './vite.shared.config.js';

export default defineConfig(({ mode }) => ({
  build: {
    ...hardenedBuild,
    target: 'node24',
  },
  plugins: mode === 'production' ? [obfuscateProductionBundle('node')] : [],
}));
