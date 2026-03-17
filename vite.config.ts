// vite.config.ts
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'rowslint',
      formats: ['es', 'umd'],
      fileName: 'rowslint',
    },
    minify: true,
  },
  plugins: [dts()],
});
