# Agentic Astro Website

An Astro 7 starter for marketing sites, set up to be built and maintained with AI coding agents (Cursor, Claude Code, Codex). This branch is the Bootstrap 6 variant. The conventions, skills and handoff process are written for agents.

## What's included

- **Layout and SEO:** `Layout.astro` renders the head, header, `<main>` and footer. `Meta.astro` handles the title, description, canonical URL, Open Graph, Twitter card, robots and favicons.
- **Styles:** Bootstrap 6 alpha, compiled from `src/assets/scss/bootstrap.scss`. `src/assets/css/global.css` only holds project extras (font stack, sticky footer).
- **Fonts:** Inter, self-hosted in `src/assets/fonts/`.
- **Forms:** [submito](https://submito.kreativan.dev) for AJAX forms with validation and captchas.
- **Sitemap:** `@astrojs/sitemap`, with `/guidelines/` excluded.
- **Static or SSR:** static by default, SSR with the Node adapter when `ASTRO_SSR=1`.
- **Agent setup:** `AGENTS.md` and skills in `.agents/skills/` (see below).

## Requirements

- Node.js 24 or newer

## Create a new site

```bash
npx create-agentic-astro-website my-site --template bootstrap --emdash
```

This downloads the starter, creates `.env` and installs dependencies. It does not create a Git repository unless you pass `--git`. `--template` is `default` (plain CSS, the `main` branch) or `bootstrap` (this branch). It then asks whether to add EmDash, which switches that project to server rendering and removes `ASTRO_SSR`. See [`create/README.md`](create/README.md). The CLI lives in `create/` and is not copied into new projects.

## Getting started (this repo)

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
  assets/
    css/global.css       Project extras on top of Bootstrap
    scss/bootstrap.scss  Bootstrap source entry (`@use "bootstrap/scss/bootstrap"`)
    fonts/               Self-hosted fonts and their @font-face CSS
  components/
    global/              Header, Footer, Meta
    ui/                  Reusable UI components
    <page>/              Sections of one page (e.g. home/Hero.astro)
  layouts/Layout.astro   Page shell
  lib/                   JS/TS helpers
  pages/                 Routes
public/                  Static files served as-is
```

## Working with agents

`AGENTS.md` holds the rules every agent follows: where components go, styling, env vars, SEO and how to verify work. Skills in `.agents/skills/` cover the bigger tasks (`.claude/skills` is a symlink to the same folder):

| Skill | Purpose |
|-------|---------|
| `build-site` | Build a new site from scratch, from an example, or by converting a site or URL |
| `frontend-design` | Design direction for from-scratch builds. Implement it with Bootstrap |
| `bootstrap-component` | Markup and CSS for a Bootstrap component |
| `bootstrap-component-js` | JavaScript behavior for a Bootstrap component |
| `bootstrap-color-system` | Theme colors and color modes |
| `bootstrap-utility-api` | Utility classes |
| `submito` | Wire up forms |
| `project-handoff` | Finish the build: writes `DESIGN.md`, the `/guidelines/` style guide and a project-specific `AGENTS.md` |

A typical flow: ask the agent to build the site (it follows `build-site`). When the pages are done, it runs `project-handoff`, which documents the finished design system for the next person or agent.

### Updating skills

- `submito` ships with the npm package. After upgrading `submito`, run `npx submito skill --codex` to refresh `.agents/skills/submito`.
- `frontend-design` and the `bootstrap-*` skills are tracked in `skills-lock.json`. The Bootstrap skills come from [twbs/bootstrap](https://github.com/twbs/bootstrap). `bootstrap-v6-install`, `bootstrap-npm`, and the Vite scaffold in `bootstrap-vite` do not apply here: Bootstrap is already loaded by `Layout.astro`.
- `build-site` and `project-handoff` belong to this starter. Edit them in place.
