## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

On Windows, Astro does not background the server automatically. Pass `--background` yourself.

## Project

This is the Bootstrap variant of the starter (Bootstrap 6 alpha). Import app files with the `@src/` alias.

## Starting a new site

To build a site from scratch, from an example, or by converting an existing site or URL, follow the [build-site](.agents/skills/build-site/SKILL.md) skill.

## Environment

Site settings come from `.env` (see `.env.example`). Never commit `.env`.

| Variable | Used for |
|----------|----------|
| `SITE_URL` | `site` in `astro.config.mjs`: canonical URLs, Open Graph URLs, sitemap |
| `SITE_LANG` | `<html lang>`. Defaults to `en` |
| `SITE_NAME` | Page titles (`Page \| Site name`), `og:site_name`, header, footer |
| `SITE_DESCRIPTION` | Fallback meta description |
| `SITE_IMAGE` | Fallback social image (path in `public/` or absolute URL) |
| `ASTRO_SSR` | `1` = SSR with the Node adapter, `0` = static build |

- Read site settings in components with `import { SITE_NAME } from "astro:env/server"`.
- A new variable goes in `env.schema` in `astro.config.mjs` and in `.env.example`.

## Conventions

### TypeScript

- This is a marketing site. Do not define custom TypeScript types or interfaces. Let Astro and the compiler infer types.

### Components

| Kind | Where |
|------|--------|
| Global chrome (header, footer, navbar, language switcher) | `src/components/global/` |
| Reusable generic UI | `src/components/ui/` |
| One page’s sections | `src/components/<page>/` |

Split each page section into its own component.

- A simple section is a single file: `src/components/home/Hero.astro`.
- A complex section that has subcomponents gets its own folder. The folder is the section name; the entry file and its pieces live inside it:

```
src/components/home/feature-grid/FeatureGrid.astro
src/components/home/feature-grid/Card.astro
```

### Pages

- Pages only compose sections inside `<Layout>`. `Layout` already renders the header, `<main>` and the footer.

### JavaScript

- Do not put long JavaScript in `astro.config`, a component, or a layout.
- Put custom helpers in `src/lib/` and import them.

### Forms

- Submit forms with `submito` (npm). Follow the [submito](.agents/skills/submito/SKILL.md) skill.

### Repeating items

- For sliders, lists, and any repeated markup, define the items as an array or object at the top of the component and render them with `.map()`. Do not copy the same HTML block once per item.

## Styling

- Bootstrap 6 is the design system. `Layout.astro` imports `src/assets/scss/bootstrap.scss`, which loads Bootstrap and its components from Sass (`@use "bootstrap/scss/bootstrap"`). Do not import `bootstrap/dist/css`. CSS variables from this compile are unprefixed (`--body-font-family`), not `--bs-*`. JavaScript plugins still come from the `bootstrap` package.
- Mark up with Bootstrap classes: `container`, `navbar`, `btn-solid`, `theme-primary`, spacing utilities, and so on. Bootstrap 6 uses `theme-*` classes (`theme-primary`, `theme-muted`), not the old `text-primary` / `btn-primary` names.
- `src/assets/css/global.css` loads after Bootstrap and only holds project extras (the Inter font stack, the sticky footer). Do not rebuild Bootstrap's reboot, grid, or utilities there.
- A value that belongs to the theme (a color, a radius, a type size) is changed in `src/assets/scss/bootstrap.scss` through Bootstrap's Sass token maps. Follow the bootstrap skills below. Do not add a second copy of a Bootstrap partial.
- Component-specific CSS goes in the component's scoped `<style>` only when no Bootstrap class does the job.
- Fonts live in `src/assets/fonts/` and are imported in `Layout.astro`.

### Bootstrap JavaScript

- Plugins are already registered by the layout script. Use data attributes, or import a named plugin in a component `<script>` with no attributes: `import { Tooltip } from "bootstrap"`.
- Do not add a CDN build, and do not scaffold a separate Vite project. Astro bundles Bootstrap.

## Head and SEO

- Set `title`, `description` and optionally `image`, `type` and `noindex` on `<Layout>`. It passes them to `src/components/global/Meta.astro`.
- Do not add `<title>`, meta, Open Graph or favicon tags anywhere else.

## Verify

Before reporting work as done:

- `npm run check` (types) and `astro build` pass.
- UI changes: check the page in the browser at desktop and mobile widths.

## Skills

| Skill | Use when |
|-------|----------|
| [build-site](.agents/skills/build-site/SKILL.md) | Building a new site from scratch, from an example, or converting a site or URL |
| [frontend-design](.agents/skills/frontend-design/SKILL.md) | Only when designing a new site from scratch. Implement the direction with Bootstrap, not a second CSS system. Ignore it when converting, following an example, or changing an existing design |
| [bootstrap-component](.agents/skills/bootstrap-component/SKILL.md) | Markup and CSS for a Bootstrap component |
| [bootstrap-component-js](.agents/skills/bootstrap-component-js/SKILL.md) | JavaScript behavior for a Bootstrap component |
| [bootstrap-color-system](.agents/skills/bootstrap-color-system/SKILL.md) | Theme colors, color modes, and color tokens |
| [bootstrap-utility-api](.agents/skills/bootstrap-utility-api/SKILL.md) | Adding, changing, or removing utility classes |
| [submito](.agents/skills/submito/SKILL.md) | Adding or fixing a form |
| [project-handoff](.agents/skills/project-handoff/SKILL.md) | After the build is done, or after a large redesign |

Bootstrap is already installed and loaded. Ignore [bootstrap-v6-install](.agents/skills/bootstrap-v6-install/SKILL.md) and [bootstrap-npm](.agents/skills/bootstrap-npm/SKILL.md). Ignore the new-project scaffold in [bootstrap-vite](.agents/skills/bootstrap-vite/SKILL.md). Bootstrap Sass is already loaded from `src/assets/scss/bootstrap.scss`.

Skills live in `.agents/skills/`. `.claude/skills` is a symlink to it, so edit only `.agents/skills/`.

## Finishing a build

When every page is built and `astro build` passes, the build is not done yet. Run the [project-handoff](.agents/skills/project-handoff/SKILL.md) skill. It covers:

- Writing `DESIGN.md`: tokens, typography, layout, components and rules.
- Building the internal style guide at `src/pages/guidelines/`, with its sections in `src/components/guidelines/`. It shows live component examples, snippets and usage notes.
- Creating project skills for repeatable, project-specific tasks, when they are needed.
- Rewriting this file (`AGENTS.md`) so it describes the finished project.

Do not report the project as finished until the handoff checklist passes.

## Documentation

Full documentation: https://docs.astro.build

When the Astro docs MCP tool (`search_astro_docs`) is available, use it to check Astro APIs before relying on memory. This project runs Astro 7, and older patterns may be outdated.

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
- [Environment variables](https://docs.astro.build/en/guides/environment-variables/)
