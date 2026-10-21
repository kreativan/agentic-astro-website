---
name: build-site
description: >-
  Build a new website on this Astro starter: from scratch (a brief), from an
  example or reference design, or by converting an existing site or URL to
  Astro. Covers choosing the design source, reusing the original assets,
  mapping sections to components, env setup, page-by-page build and
  verification, ending with project-handoff. Use when the user asks to "build
  a site", "create the website", "convert this site/URL to Astro", "rebuild
  this page", or starts a new project from this starter. Not for small edits
  to an existing page.
---

# Build a site

The starter gives you `Layout` (head, header, `<main>`, footer), `Meta` (SEO
tags), global tokens in `src/assets/css/global.css`, the Inter font, and env-driven
site settings. Follow the conventions in `AGENTS.md` throughout. This skill is
the workflow around them.

## 1. Identify the mode

| Mode | Input | Design source |
|------|-------|---------------|
| **From scratch** | A brief, maybe some content | New design: use the [frontend-design](../frontend-design/SKILL.md) skill |
| **From an example** | A reference site, screenshot, Figma file or template | The example. Match it, do not reinvent it |
| **Convert** | An existing project, its files, or a URL | The original. Reproduce it faithfully |

Only the **from scratch** mode uses `frontend-design`. In the other two modes,
ignore it: the source's design wins, including choices that skill would call
generic.

If the mode, page list or content is unclear, ask before building.

## 2. Gather the inputs

- **Pages:** list every route and its sections, in order. Confirm the list with
  the user.
- **Content:** real copy, images, links. Use placeholders only where content is
  missing, and list them in the final summary.
- **Convert / example:** collect the source files. For a URL, read the page
  (fetch or browser), take screenshots of desktop and mobile, and download the
  assets the user owns or has the rights to use.

## 3. Set up the project

- Fill in `.env` (see `.env.example`): `SITE_URL`, `SITE_NAME`, `SITE_LANG`,
  `SITE_DESCRIPTION`, `SITE_IMAGE`. Add new vars to the `env.schema` in
  `astro.config.mjs` and to `.env.example`.
- Replace `public/favicon.svg` and `public/favicon.ico` if the brand has its own.
- Put the default social image (1200×630) in `public/og/` and point
  `SITE_IMAGE` to it.

## 4. Design tokens and assets

**From scratch:** run the frontend-design planning pass, then write the result
into the `:root` tokens in `src/assets/css/global.css`. Replace the starter
values rather than adding a second set. Swap the font if the plan calls for
it: add the files to `src/assets/fonts/`, a `@font-face` stylesheet next to
them, import it in `Layout.astro`, and update `--font-sans`.

**Convert / example:** reuse the original assets. Do not redraw icons, retype
SVGs or rebuild CSS from scratch.

| Source asset | Where it goes |
|--------------|---------------|
| Fonts | `src/assets/fonts/` + a `@font-face` CSS file imported in `Layout.astro` |
| Colors, sizes, spacing from the source CSS | `:root` tokens in `src/assets/css/global.css`, using the source's values |
| Base element styles | `src/assets/css/global.css` |
| Section and component styles | Scoped `<style>` in the matching component |
| Vendor CSS/JS (slider, lightbox…) | npm package if one exists, otherwise `public/` + Layout `styles` / `scripts` props |
| Custom JS | `src/lib/`, imported from a component `<script>` |
| Content images | `src/assets/` with `<Image />` from `astro:assets` |
| Images referenced by URL or CSS | `public/` |

## 5. Map the structure

Before writing pages, write down the component map and check it against the
AGENTS.md component rules:

```
global/   Header (nav, language switcher), Footer
ui/       Button, Card, ... (used by 2+ sections)
home/     Hero, feature-grid/FeatureGrid + Card, Testimonials, CtaBand
about/    ...
```

- One component per section. A section with subcomponents gets a folder.
- A piece used in two or more sections, or on two or more pages, goes in `ui/`.
- Repeated items are an array at the top of the component, rendered with `.map()`.

## 6. Build page by page

- Pages only compose sections: `<Layout title description image>` and the
  section components. `Layout` already renders `<main>`.
- Set `title`, `description` and, where it makes sense, `image` on every page.
  Do not add meta tags anywhere else.
- Forms use the [submito](../submito/SKILL.md) skill.
- Use the tokens (`var(--…)`) in component styles. A value that repeats across
  components becomes a new token.
- After each page: `astro build`, then check it in the browser at desktop and
  mobile widths. For conversions, compare it side by side with the original.

## 7. Finish

1. `npm run check` and `astro build` pass with no errors.
2. Every page from step 2 exists and works on mobile. Keyboard focus is visible.
3. Run the [project-handoff](../project-handoff/SKILL.md) skill. The build is
   not done until its checklist passes.

## Checklist

- [ ] Mode identified; `frontend-design` used only for from-scratch builds
- [ ] Page list confirmed with the user
- [ ] `.env`, `.env.example` and `env.schema` agree
- [ ] Original assets reused (convert / example); nothing redrawn
- [ ] Tokens live in `src/assets/css/global.css`; no repeated hard-coded values
- [ ] Every section is its own component, in the right folder
- [ ] Every page sets `title` and `description` through `Layout`
- [ ] Placeholders listed for the user
- [ ] `npm run check` and `astro build` pass; pages checked in the browser
- [ ] project-handoff completed
