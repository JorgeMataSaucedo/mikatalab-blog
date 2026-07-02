// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mikatalab.com',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
