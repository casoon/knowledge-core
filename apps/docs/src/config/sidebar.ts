import { defineSidebar } from '@knowledge-core/content-model/sidebar';

export const sidebar = defineSidebar([
  {
    label: 'Getting Started',
    autogenerate: { directory: 'getting-started' },
  },
  {
    label: 'Guides',
    autogenerate: { directory: 'guides' },
  },
  {
    label: 'API Reference',
    autogenerate: { directory: 'api' },
  },
  {
    label: 'Cookbook',
    autogenerate: { directory: 'cookbook' },
  },
  {
    label: 'Components',
    autogenerate: { directory: 'components' },
  },
]);
