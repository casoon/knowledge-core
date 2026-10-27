// @ts-check
import casoonPages from '@casoon/pages-theme';
import { defineConfig } from 'astro/config';

// Project page: https://casoon.github.io/knowledge-core/ — `base` is the GitHub Pages path.
export default defineConfig({
  site: 'https://casoon.github.io/knowledge-core',
  base: '/knowledge-core/',
  integrations: [
    casoonPages({
      name: 'Knowledge Core',
      description:
        'Monorepo template for documentation and course platforms: Astro 7, MDX, Tailwind CSS 4 and an optional RAG chat assistant on Cloudflare.',
      tagline: 'Template for docs and course platforms',
      repo: 'casoon/knowledge-core',
      version: '0.3.1',
      license: 'MIT',
      docsGroups: {
        'getting-started': 'Getting started',
        guides: 'Guides',
        reference: 'Reference',
      },
      // No CHANGELOG.md and no release tags yet.
      changelog: false,
      // A template repo, not a renderer: there is no input → output to showcase.
      showcase: false,
    }),
  ],
});
