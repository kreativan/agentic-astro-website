import { defineConfig } from 'astro/config';
import { loadEnv } from "vite";
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// Get the value of the ASTRO_SSR environment variable from .env
const { ASTRO_SSR } = loadEnv(process.env, process.cwd(), "");

export default defineConfig({
  site: 'https://agentic.astro.kreativan.dev',
  output: ASTRO_SSR == 1 ? 'server' : 'static',
  adapter: ASTRO_SSR == 1 ? node({ mode: 'standalone' }) : undefined,

  devToolbar: {
    enabled: false
  },

  image: {
    domains: ["agentic.astro.kreativan.dev"],
  },

  integrations: [sitemap({
    filter: (page) => {
      const exclude = ['/guidelines/'];
      return !exclude.some(path => page.includes(path));
    }
  })],
});