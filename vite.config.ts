import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0, // never inline assets — keep all files as separate URLs for Phaser's loader
  },
});
