import { defineConfig } from 'astro/config';

// `site` feeds canonical URLs, hreflang and the Open Graph image.
export default defineConfig({
  site: 'https://vlopez.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
