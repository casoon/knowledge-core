import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import postAudit from '@casoon/astro-post-audit';
import speedMeasure from '@casoon/astro-speed-measure';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://courses.knowledge-core.dev',

  integrations: [
    mdx(),
    sitemap(),
    speedMeasure(),
    postAudit({
      rules: {
        filters: { exclude: ['404.html'] },
        canonical: { self_reference: true },
        headings: { no_skip: true },
        html_basics: { meta_description_required: true },
        opengraph: {
          require_og_title: true,
          require_og_description: true,
          require_og_image: true,
        },
        a11y: { require_skip_link: true },
        links: { check_fragments: true },
        sitemap: { require: true },
      },
    }),
  ],

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  security: {
    checkOrigin: true,
  },

  csp: {
    algorithm: 'SHA-256',
  },

  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  build: {
    inlineStylesheets: 'auto',
  },
});
