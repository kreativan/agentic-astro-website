# Agentic Astro Website

An Astro 7 starter for marketing sites, set up to be built and maintained with AI coding agents (Cursor, Claude Code, Codex). The conventions, skills and handoff process are written for agents. The result is plain Astro that any developer can work on.

## What's included

- **Layout and SEO:** `Layout.astro` renders the head, header, `<main>` and footer. `Meta.astro` handles the title, description, canonical URL, Open Graph, Twitter card, robots and favicons.
- **Styles:** design tokens and base styles in `src/styles/global.css`, plain CSS, scoped component styles.
- **Fonts:** Inter, self-hosted in `src/assets/fonts/`.
- **Forms:** [submito](https://submito.kreativan.dev) for AJAX forms with validation and captchas.
- **Sitemap:** `@astrojs/sitemap`, with `/guidelines/` excluded.
- **Static or SSR:** static by default, SSR with the Node adapter when `ASTRO_SSR=1`.
- **Agent setup:** `AGENTS.md` and skills in `.agents/skills/` (see below).

## Requirements

- Node.js 24 or newer

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:4321
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SITE_URL` | `http://localhost:4321` | Production URL. Used for canonical URLs, Open Graph URLs and the sitemap |
| `SITE_LANG` | `en` | `<html lang>` |
| `SITE_NAME` | `Agentic Astro Website` | Page titles (`Page \| Site name`), `og:site_name`, header and footer |
| `SITE_DESCRIPTION` | empty | Fallback meta description for pages that don't set one |
| `SITE_IMAGE` | empty | Fallback social image: a path in `public/` or an absolute URL, ideally 1200×630 |
| `ASTRO_SSR` | `0` | `1` builds for SSR with the Node adapter, `0` builds a static site |

The site variables are validated by `env.schema` in `astro.config.mjs`. Read them in components with `import { SITE_NAME } from "astro:env/server"`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Build to `dist/` |
| `npm run preview` | Preview the static build |
| `npm run check` | Type-check `.astro` and `.ts` files |
| `npm run start` | Run the SSR build (`ASTRO_SSR=1`) on `0.0.0.0:4321` |

## Project structure

```
src/
  assets/fonts/          Self-hosted fonts and their @font-face CSS
  components/
    global/              Header, Footer, Meta
    ui/                  Reusable UI components
    <page>/              Sections of one page (e.g. home/Hero.astro)
  layouts/Layout.astro   Page shell
  lib/                   JS/TS helpers
  pages/                 Routes
  styles/global.css      Design tokens and base styles
public/                  Static files served as-is
```

## Working with agents

`AGENTS.md` holds the rules every agent follows: where components go, styling, env vars, SEO and how to verify work. Skills in `.agents/skills/` cover the bigger tasks (`.claude/skills` is a symlink to the same folder):

| Skill | Purpose |
|-------|---------|
| `build-site` | Build a new site from scratch, from an example, or by converting a site or URL |
| `frontend-design` | Design direction for from-scratch builds |
| `submito` | Wire up forms |
| `project-handoff` | Finish the build: writes `DESIGN.md`, the `/guidelines/` style guide and a project-specific `AGENTS.md` |

A typical flow: ask the agent to build the site (it follows `build-site`). When the pages are done, it runs `project-handoff`, which documents the finished design system for the next person or agent.

### Updating skills

- `submito` ships with the npm package. After upgrading `submito`, run `npx submito skill --codex` to refresh `.agents/skills/submito`.
- `frontend-design` comes from [anthropics/skills](https://github.com/anthropics/skills) and is tracked in `skills-lock.json`.
- `build-site` and `project-handoff` belong to this starter. Edit them in place.
