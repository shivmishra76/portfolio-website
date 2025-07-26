// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@vercel/analytics/integrations/astro';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [vercel()],
  vite: {
    plugins: [tailwindcss()]
  }
});