import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Podmień na docelową domenę po jej wykupieniu (wymagane dla poprawnego sitemap.xml i tagów OG)
export default defineConfig({
  site: 'https://opifex.pl',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
});
