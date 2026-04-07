import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '__FeedbackWidgetIIFE',
      formats: ['iife'],
      fileName: () => 'feedback-widget.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});
