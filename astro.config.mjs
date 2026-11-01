import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://esdara.org', // absolute URLs (hreflang); keep in sync with the repo's SITE_URL variable
  integrations: [
    // sitemap-index.xml (linked from public/robots.txt), with each page's Arabic/English twin.
    sitemap({
      i18n: { defaultLocale: 'ar', locales: { ar: 'ar', en: 'en' } },
      filter: (url) => !url.endsWith('/404/'),
    }),
  ],
  // Downloaded from Google Fonts at build time and served from our own domain.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Readex Pro',
      cssVariable: '--font-readex',
      weights: ['300 700'],
      subsets: ['arabic', 'latin'],
      fallbacks: ['Tahoma', 'sans-serif'],
    },
  ],
});
