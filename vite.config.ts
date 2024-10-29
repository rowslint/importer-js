// vite.config.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'rowslint',
      formats: ['es', 'umd'],
      fileName: 'rowslint',
    },
    minify: 'esbuild',
  },
  plugins: [dts()],
});
