import mdx from '@astrojs/mdx';
import postAudit from '@casoon/astro-post-audit';
import siteFiles from '@casoon/astro-site-files';
import speedMeasure from '@casoon/astro-speed-measure';
import { shikiStyleToClass } from '@knowledge-core/styles/shiki.mjs';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://docs.knowledge-core.dev',
  trailingSlash: 'always',

  integrations: [
    mdx(),
    siteFiles({
      robots: {},
      llms: {
        title: 'Knowledge Core – Documentation',
        description:
          'Documentation platform for the Knowledge Core monorepo template. Built with Astro v7, MDX, and Tailwind CSS.',
        sections: [
          {
            title: 'Documentation',
            links: [
              { title: 'Overview', url: '/docs/getting-started/overview/' },
              { title: 'Installation', url: '/docs/getting-started/installation/' },
              { title: 'Project structure', url: '/docs/getting-started/structure/' },
              { title: 'Components', url: '/docs/components/overview/' },
              { title: 'AI chat integration', url: '/docs/guides/ai-chat/' },
            ],
          },
        ],
      },
    }),
    speedMeasure(),
    postAudit({
      rules: {
        filters: { exclude: ['404.html', 'de/**'] },
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
      transformers: [shikiStyleToClass],
    },
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  // Astro reads the CSP only under security; a top-level csp key is silently ignored.
  security: {
    checkOrigin: true,
    csp: {
      algorithm: 'SHA-256',
      // AppShell loads the Inter stylesheet from Google Fonts
      styleDirective: { resources: ["'self'", 'https://fonts.googleapis.com'] },
    },
  },

  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },

  vite: {
    plugins: [tailwindcss()],
    envDir: '../../',
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
