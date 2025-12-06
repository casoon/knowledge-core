import baseConfig from '@knowledge-core/styles/tailwind.config';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
    '../../packages/ui/src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
  ],
};
