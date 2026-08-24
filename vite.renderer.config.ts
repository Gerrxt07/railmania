import { defineConfig } from 'vite';
import { hardenedBuild, obfuscateProductionBundle } from './vite.shared.config.js';

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    ...hardenedBuild,
    target: 'chrome150',
  },
  plugins: mode === 'production' ? [obfuscateProductionBundle('browser')] : [],
}));
