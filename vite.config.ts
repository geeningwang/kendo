import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0, // never inline assets — keep all files as separate URLs for Phaser's loader
  },
});
