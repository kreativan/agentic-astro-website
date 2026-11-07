---
name: project-handoff
description: >-
  Final step after building or converting a site on this Astro starter. Writes
  down the site's style so the next developer or agent can build new pages and
  sections that look like they belong: DESIGN.md (direction, colors, type,
  spacing, surfaces, motion, building blocks, page and section recipes), a
  /guidelines/ page that shows the same thing live, and an AGENTS.md rewritten
  for this project. Use when the site build is done, when the user asks to
  "hand off", "document" or "finalize" the project, or asks for a style guide,
  design system doc, DESIGN.md or guidelines page. Re-run it after a large
  redesign.
---

# Project handoff

The goal is one thing: someone who has never seen this site can add a new
page or section, and it looks like it was always there.

So document the **style and the rules**, not every file. A short guide that
people read beats a complete catalogue that nobody does. Skip anything a
developer learns by opening the component.

You produce, in this order:

1. `DESIGN.md`: the written style guide (source of truth).
2. `/guidelines/`: one page that shows `DESIGN.md` live.
3. Project skills, only if a repeatable task needs one.
4. `AGENTS.md`, rewritten for this project.

Write from the code. Don't document anything the code doesn't do. If the code
and the design disagree, document the code and tell the user.

## 1. Look at what was built

Spend a short pass, not an inventory:

- **Tokens:** start with the `:root` tokens in `src/assets/css/global.css`, then any defined elsewhere (other custom properties, SCSS variables, CSS carried over from a converted site). Note colors, fonts, type scale, spacing, radii,
  shadows, breakpoints and the container width. Hard-coded values that repeat
  across files are tokens in disguise: list them and ask the user before
  turning them into variables.
- **The look:** open the home page and two or three other pages. What makes
  them recognisable? Background bands, heading style, card style, how images
  or illustrations are done, how much white space, what moves.
- **Building blocks:** the 4–8 pieces that sections are made of again and
  again (button, eyebrow, section heading, card, CTA panel, image or
  illustration frame). Ignore one-off components.
- **Page skeleton:** how a page is put together (`Layout`, the order of
  sections, how backgrounds alternate) and how a section is put together
  (container, heading, content grid).
- **Config that affects new pages:** env vars (`SITE_URL`, `SITE_LANG`,
  `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_IMAGE`, `ASTRO_SSR` and any added
  later; names only, never values), the sitemap filter, and any page list
  that feeds meta, llms.txt or schema.

## 2. Write DESIGN.md

Aim for 150–300 lines. Real token names and values, real import paths, short
sentences. Drop any section the site has nothing for.

```md
# <Brand> Design

> Live: /guidelines/ (dev: http://localhost:4321/guidelines/)

## Direction
2–4 sentences: what the site should feel like, and what to avoid.

## Colors
| Token | Value | Use for |
Brand colors first, then neutrals, then state colors (success, warning).
Which text/background pairs are allowed (with contrast ratio), and which
are not.

## Typography
Font families and where they load. The scale as a table:
role (h1, h2, h3, lead, body, small, eyebrow, button) → token or size /
weight / line-height. One line on how headings are written (case, full stop).

## Space & layout
Spacing scale, container width and side padding, section padding, grid
gaps, breakpoints. How section backgrounds alternate.

## Surfaces
Radius, borders, shadows (when, and when not), overlays.

## Imagery & icons
Photos, illustrations or neither; aspect ratios; where icons live and how to
add one; alt-text rule.

## Motion
What moves, durations and easing, reduced-motion handling.

## Building blocks
The 4–8 shared pieces only. For each: one line on when to use it, the import
or class, and a copy-paste snippet. No props tables unless a prop changes
the look.

## New page
Step by step: route file, page meta (title, description, page list if the
site has one), Layout, sections, header/footer links. A skeleton snippet.

## New section
Step by step: component file and folder, `<section>` with the right
background, container, heading block, content grid, aria-labelledby, mobile
check. A skeleton snippet. When to make a new block vs reuse one.

## Do / Don't
6–12 short, concrete rules that come from this design.
```

## 3. Build the guidelines page

`/guidelines/` is `DESIGN.md` you can look at. Same chapters, same order,
same anchors. It renders the real tokens and the real building blocks, so it
can't drift from the site.

### Files

```
src/pages/guidelines/index.astro        # composes the chapters
src/components/guidelines/
  GuidelinesNav.astro                   # sticky list of chapters (anchors)
  Colors.astro
  Typography.astro
  Space.astro                           # spacing scale, container, section rhythm
  Surfaces.astro                        # radius, borders, shadows, motion
  Blocks.astro                          # the shared building blocks, live
  Recipes.astro                         # new page / new section, with one example section
  DosDonts.astro
```

Merge or drop chapters to match `DESIGN.md`. Keep it one page.

### Rules

- **Show, then say.** Each chapter: a live example, one or two lines of
  rules, and a snippet where it helps. No long prose.
- **Real tokens.** Swatches and scales render from the CSS variables
  (`` style={`background: var(${token.name})`} ``). Never type a value twice;
  if you show computed values, read them with `getComputedStyle` in a helper
  in `src/lib/`.
- **Real blocks.** Import the building blocks from `@src/components/...` or
  use the real classes. Never copy their markup into the guide.
- **Recipes are live.** Render one example section built the way the
  "New section" recipe says, and label its parts (background, container,
  heading, grid). Show the page skeleton as a snippet.
- **Data arrays + `.map()`** for swatches, scales and examples, defined at
  the top of each file.
- **Keep it private:** `<Layout title="Guidelines" noindex>`, excluded in the
  sitemap filter in `astro.config.mjs`, disallowed in robots.txt if the site
  has one, and not linked from the header or footer.
- **Style it like the site,** scoped to `src/components/guidelines/`. Guide
  styles must not leak into site components.
- English, plain strings.

## 4. Project skills (only if needed)

Add one only for a repeatable, multi-step task an agent would likely get
wrong: adding a page of a recurring type, adding a language, wiring a custom
slider or CMS block. Skip it when the "New page" and "New section" recipes
already cover it.

Write it to `.agents/skills/<name>/SKILL.md` (`.claude/skills` is a symlink
to it). Link `DESIGN.md` and other skills instead of repeating them. Don't
duplicate installed skills (`submito`, `frontend-design`, `plain-voice`).

## 5. Rewrite AGENTS.md

Keep it short; detail lives in `DESIGN.md`.

- **Project overview:** brand, purpose, routes, anything unusual (SSR,
  external content, external scripts).
- **Design:** "Read `DESIGN.md` before changing UI. Live at `/guidelines/`."
- **Where things are:** fonts, icons, images, `src/lib/` helpers.
- **Keep docs in sync:** "When you change a token, a building block or the
  page/section recipe, update `DESIGN.md` and `/guidelines/` in the same
  change."
- **Skills table:** add new project skills; remove `build-site` and the
  "Starting a new site" section.
- **Replace "Finishing a build"** with: handoff is done; re-run this skill
  after a large redesign.
- Keep Development, Environment, Conventions, Styling, Head & SEO, Verify and
  Documentation, updated for this project.

## 6. Verify

- [ ] Someone could build a new section from `DESIGN.md` alone: tokens,
      blocks and the section recipe are all there
- [ ] Every token in `DESIGN.md` exists in the code with the same value
- [ ] `/guidelines/` renders in the dev server with no console errors, and
      its chapters match `DESIGN.md`
- [ ] `/guidelines/` is `noindex` and missing from `dist/sitemap-*.xml`
- [ ] Every path and link in `AGENTS.md` and `DESIGN.md` resolves
- [ ] No env var values or secrets in the docs
- [ ] `npm run check` and `astro build` pass

Finish with a short summary: files written, skills added (and why), and any
mismatches between design and code.
