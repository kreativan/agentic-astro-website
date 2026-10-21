import { defineConfig, envField } from 'astro/config';
import { loadEnv } from "vite";
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// Config can't import astro:env, so read the values it needs from .env directly
const { ASTRO_SSR, SITE_URL } = loadEnv(process.env, process.cwd(), "");

export default defineConfig({
  site: SITE_URL || 'http://localhost:4321',
  output: ASTRO_SSR == 1 ? 'server' : 'static',
  adapter: ASTRO_SSR == 1 ? node({ mode: 'standalone' }) : undefined,

  devToolbar: {
    enabled: false
  },

  env: {
    schema: {
      SITE_LANG: envField.string({ context: 'server', access: 'public', default: 'en' }),
      SITE_NAME: envField.string({ context: 'server', access: 'public', default: 'Agentic Astro Website' }),
      SITE_DESCRIPTION: envField.string({ context: 'server', access: 'public', default: '' }),
      SITE_IMAGE: envField.string({ context: 'server', access: 'public', default: '' }),
    },
  },

  integrations: [sitemap({
    filter: (page) => {
      const exclude = ['/guidelines/'];
      return !exclude.some(path => page.includes(path));
    }
  })],
});
