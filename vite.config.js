import { resolve } from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const githubRepository = process.env.GITHUB_REPOSITORY;
const repositoryName =
  process.env.VITE_PAGES_REPO ||
  (githubRepository ? githubRepository.split('/')[1] : 'verde-days');
const productionBasePath = `/${repositoryName}/`;

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : productionBasePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
}));
