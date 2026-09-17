import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { hardenedBuild, obfuscateProductionBundle } from './vite.shared.config.js';

const packageMetadata = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version?: unknown };
if (typeof packageMetadata.version !== 'string') {
  throw new Error('package.json must contain a string version');
}

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    ...hardenedBuild,
    target: 'chrome150',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        splash: resolve(import.meta.dirname, 'splash.html'),
      },
    },
  },
  define: {
    RAILMANIA_APP_VERSION: JSON.stringify(packageMetadata.version),
  },
  plugins: mode === 'production' ? [obfuscateProductionBundle('browser')] : [],
}));
