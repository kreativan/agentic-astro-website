## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

On Windows, Astro does not background the server automatically. Pass `--background` yourself.

## Project

Import app files with the `@src/` alias.

## Building pages

These rules apply when building an Astro site from scratch, from an example, or from a provided URL.

### Converting an existing project

When converting an existing project to Astro, reuse its assets (CSS, JS, SVG, images, fonts). Do not rebuild those files from scratch.

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

### JavaScript

- Do not put long JavaScript in `astro.config`, a component, or a layout.
- Put custom helpers in `src/lib/` and import them.

### Forms

- Submit forms with `submito` (npm). Follow the [submito](.agents/skills/submito/SKILL.md) skill.

### Repeating items

- For sliders, lists, and any repeated markup, define the items as an array or object at the top of the component and render them with `.map()`. Do not copy the same HTML block once per item.

## Finishing a build

When every page is built and `astro build` passes, the build is not done yet. Run the [project-handoff](.agents/skills/project-handoff/SKILL.md) skill. It covers:

- Writing `DESIGN.md`: tokens, typography, layout, components and rules.
- Building the internal style guide at `src/pages/guidelines/`, with its sections in `src/components/guidelines/`. It shows live component examples, snippets and usage notes.
- Creating project skills for repeatable, project-specific tasks, when they are needed.
- Rewriting this file (`AGENTS.md`) so it describes the finished project.

Do not report the project as finished until the handoff checklist passes.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
