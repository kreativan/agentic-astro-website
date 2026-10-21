---
name: project-handoff
description: >-
  Final step after building or converting a site on this Astro starter. Turns
  the finished project into documentation for developers and agents: writes
  DESIGN.md, builds a /guidelines/ style guide page with live component
  examples, adds project skills where they are needed, and rewrites AGENTS.md
  for this project. Use when the site build is done, when the user asks to
  "hand off", "document", or "finalize" the project, or asks for a style
  guide, design system doc, DESIGN.md or guidelines page. Re-run it after large
  design or component changes.
---

# Project handoff

Run this once every page is built and `astro build` passes. The goal is that
the next developer or agent can extend the site without reverse-engineering
it.

You produce four things, in this order:

1. `DESIGN.md`: the written design system (source of truth).
2. The guidelines page: `/guidelines/`, the visual, live version of `DESIGN.md`.
3. Project skills: only where they are needed.
4. `AGENTS.md`: rewritten for this project, pointing at all of the above.

Write the docs from the code. Do not document anything the code does not do,
and drop any section below that the project has nothing for. If the code and
the design disagree, document the code and tell the user about the mismatch.

## 1. Audit the project

Before writing anything, inventory what was actually built:

- **Pages:** every route in `src/pages/` and the sections each one uses.
- **Layout:** `src/layouts/Layout.astro` and its props (`title`,
  `description`, `scripts`, `styles`, `noindex`), plus any other layouts.
- **Components:** everything in `src/components/global/`, `ui/` and
  `<page>/`. For each one, note its props, its variants, and which pages use it.
  Include components from any npm package the site imports.
- **Tokens:** colors, font families, type scale, spacing, radii, shadows,
  breakpoints, container widths, z-index, transitions. Start with the `:root`
  tokens in `src/styles/global.css`, then look for any defined elsewhere: other
  CSS custom properties, Tailwind `@theme` or config, SCSS variables, and
  stylesheets carried over from a converted site. Remove starter tokens the
  site never uses, and ask before deleting anything else.
- **Assets:** fonts (`src/assets/fonts/`), icons and SVGs, images, and
  third-party CSS and JS in `public/`.
- **Behavior:** helpers in `src/lib/`, sliders, modals, animations, forms
  (submito, see the [submito skill](../submito/SKILL.md)), and external
  scripts.
- **Config:** `astro.config.mjs` (output mode, adapter, integrations, sitemap
  filter, `env.schema`), `tsconfig.json` aliases, and every env var
  (`SITE_URL`, `SITE_LANG`, `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_IMAGE`,
  `ASTRO_SSR`, and any added later). Check that `.env.example` lists them all.
  Document variable names, never their values.
- **i18n (if any):** where translations live, the key naming pattern, and the
  supported languages.

Hard-coded values that repeat (the same hex code in 5 files, for example) are
de facto tokens. Document them. Ask the user before refactoring them into
variables.

## 2. Write DESIGN.md

Create `DESIGN.md` in the repo root. Agents read this file instead of the CSS,
so make it exact: token names, real values, real import paths. Use this
structure and drop sections the project has nothing for:

```md
# <Brand> Design System

> Live examples: /guidelines/ (dev: http://localhost:4321/guidelines/)

## Direction
2–4 sentences: the visual tone, what the design is trying to feel like,
and what to avoid.

## Colors
| Token | Value | Use for |
|-------|-------|---------|
| `--color-primary` | `#0B5FFF` | CTAs, links, active states |

Approved text/background pairs (with WCAG contrast ratio).

## Typography
Families (and where each is loaded), weights in use, and the type scale as a
table: role (h1…h6, body, small, eyebrow, button) → size / line-height /
weight / letter-spacing / class or element.

## Layout & spacing
Spacing scale, container widths, grid, section padding, and breakpoints (name →
min-width).

## Surfaces
Radii, borders, shadows, overlays.

## Imagery & icons
Where icons live and how to add one. Image aspect ratios, which image
component to use (`<Image />` / `<Picture />` from `astro:assets`, or the
project's own wrapper), and alt-text rules.

## Motion
Durations, easings, what animates, and how reduced-motion is handled.

## Components
One entry per reusable component:
### Button — `@src/components/ui/Button.astro`
- When to use / when not to
- Props: name, type, default, description
- Variants and states
- Example (copy-paste Astro snippet)
- Guidelines anchor: /guidelines/#button

## Section patterns
The page sections (hero, feature grid, CTA band…), their files, and how to
compose a new page from them.

## Forms
Field markup, error and busy styles, and which endpoint each form posts to.
Link the submito skill for wiring.

## Accessibility
Focus styles, minimum target size, contrast rules, landmark structure, and
anything the components handle for you.

## Do / Don't
Short, concrete rules that come from this design.
```

## 3. Build the guidelines page

The guidelines page is the live version of `DESIGN.md`. It renders the **real**
components with the **real** tokens, so it cannot drift from the site.

### Files

```
src/pages/guidelines/index.astro          # composes the sections below
src/components/guidelines/
  GuidelinesNav.astro                     # sticky table of contents (anchors)
  Example.astro                           # shared: title, notes, live preview slot, code
  PropsTable.astro                        # shared: props table from an array
  Colors.astro
  Typography.astro
  Spacing.astro
  Surfaces.astro
  Icons.astro
  Motion.astro
  components/Components.astro             # one Example per ui/ and global/ component
  sections/Sections.astro                 # page sections, rendered in place
  Forms.astro
  Accessibility.astro
```

Follow the AGENTS.md component rules: one section per file, and a folder for a
section that has subcomponents. If the page gets long (more than ~15
components), split it into routes: `src/pages/guidelines/index.astro`
(foundations), `components.astro`, `sections.astro`, with `GuidelinesNav`
linking them.

### Rules

- **Use the real components.** Import from `@src/components/...`. Never copy a
  component's markup into the guidelines page.
- **Data arrays + `.map()`.** Define the tokens and examples as arrays at the
  top of each file. A component reference can go in the array:

  ```astro
  ---
  import { Code } from "astro:components";
  import Example from "@src/components/guidelines/Example.astro";
  import Button from "@src/components/ui/Button.astro";

  const examples = [
    {
      id: "button-primary",
      title: "Primary button",
      notes: "One per view. Main call to action.",
      Component: Button,
      props: { variant: "primary", href: "#" },
      label: "Get started",
      code: `<Button variant="primary" href="/signup">Get started</Button>`,
    },
  ];
  ---

  {examples.map(({ id, title, notes, Component, props, label, code }) => (
    <Example id={id} title={title} notes={notes}>
      <Component {...props}>{label}</Component>
      <Code slot="code" code={code} lang="astro" />
    </Example>
  ))}
  ```

- **Tokens render from CSS variables.** Color swatches use
  `` style={`background: var(${token.name})`} ``. If you show resolved values, read
  them in the browser with `getComputedStyle` from a helper in
  `src/lib/guidelines.ts`. Do not type the values twice.
- **Show every variant and state** a component supports: sizes, colors,
  disabled, loading, error, hover/focus (describe or force with a class), plus
  long-text and empty cases.
- **Each component example shows:** a live preview, its import path, a props
  table, a copy-paste snippet, and when to use or avoid it. Match the
  `DESIGN.md` entry and use the same anchor id (`/guidelines/#button`).
- **Forms:** show the fields and their states (default, error with
  `.error-message` and `aria-invalid`, busy). Do not bind a form that posts to
  a real endpoint. Leave it unbound, or point it at a dummy `action`, and say
  why on the page.
- **English only.** The page is internal, so its copy is plain strings, even
  if the site is translated.
- **Keep it out of search:**
  - Render the page with `<Layout title="Guidelines" noindex>`.
  - Keep `/guidelines/` in the sitemap `exclude` list in `astro.config.mjs`.
  - Do not link the page from the site's header or footer.
- **Page chrome:** style the page in the project's own design language,
  scoped to `src/components/guidelines/`. Guideline-only styles must not leak
  into site components.

## 4. Create project skills (only if needed)

Add a skill only for a **repeatable, multi-step, project-specific** task that an
agent would likely get wrong without guidance. Examples:

- Adding a new landing page from the existing section patterns.
- Adding a language (translations, locale routing, per-locale assets).
- A custom slider, pricing table or CMS-driven block with non-obvious wiring.
- A design-specific animation system.

Skip it when a rule in AGENTS.md or an entry in `DESIGN.md` is enough, or when
the task is a one-off. Do not duplicate installed third-party skills (such as
`submito` or `frontend-design`); link them instead.

Format, matching the existing skills:

```md
---
name: kebab-case-name
description: >-
  What it does and exactly when to use it (trigger phrases). This text is
  what agents match on, so be specific.
---

# Title
Context, then steps, rules, a reference snippet, and a checklist.
```

- Write each skill to `.agents/skills/<name>/SKILL.md`. `.claude/skills` is a
  symlink to `.agents/skills`, so do not create files there.
- Link `DESIGN.md` and the other skills instead of repeating them.
- Put long reference material in `references/*.md` next to `SKILL.md`.

## 5. Rewrite AGENTS.md

Rewrite `AGENTS.md` so it describes **this project**, not the blank starter.
Keep it short; detail goes in `DESIGN.md` and the skills.

- **Keep and update:** Development, Project, Environment (add any new vars),
  Conventions, Styling, Head & SEO, Verify, and Documentation.
- **Add:**
  - A **Project overview**: brand, purpose, the page list with routes, and
    anything unusual (SSR, external content, external scripts).
  - **Design**: "Read `DESIGN.md` before changing UI. Live examples at
    `/guidelines/`."
  - **Where things are**: real paths for fonts, icons, images and `src/lib/`
    helpers, beyond what Styling already lists.
  - **Keeping docs in sync**: "When you add or change a component, token or
    section, update `DESIGN.md` and its `/guidelines/` example in the same
    change."
- **Skills table:** add every project skill you created, and remove
  `build-site` and the "Starting a new site" section. The site is built.
- **Replace** the "Finishing a build" section: say that handoff has been done
  and that agents should re-run this skill after large redesigns.

## 6. Verify

- [ ] `astro build` passes with no new warnings
- [ ] `/guidelines/` renders in the dev server (`astro dev --background`),
      every example shows, and there are no console errors
- [ ] The page has `noindex` and does not appear in `dist/sitemap-*.xml`
- [ ] Every component in `src/components/ui/` and `global/` has an entry in
      both `DESIGN.md` and `/guidelines/`, with matching anchors
- [ ] Every token in `DESIGN.md` exists in the code with the same value
- [ ] Every path, import and skill link in `AGENTS.md` / `DESIGN.md` resolves
- [ ] No env var values or secrets appear in `DESIGN.md` or `AGENTS.md`
- [ ] New skills are in `.agents/skills/`, and `.claude/skills` is still a symlink
- [ ] `npm run check` passes

Finish with a short summary for the user: the files you created or changed,
the skills you added (and why), and any design and code mismatches you found.
