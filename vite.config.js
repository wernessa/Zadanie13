import tailwindcss from '@tailwindcss/vite';
import { glob } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

const inputs = [];

for await (const entry of glob('src/**/*.html')) {
  console.log(resolve(__dirname, entry));
  inputs.push(resolve(__dirname, entry));
}

export default defineConfig({
  base: '/Zadanie13/',
  plugins: [tailwindcss()],
  root: resolve(__dirname, 'src'),
  envDir: __dirname,
  build: {
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: inputs,
    },
    outDir: resolve(__dirname, 'dist'),
  },
});
