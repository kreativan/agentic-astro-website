# create-agentic-astro-website

Create a new site from the [Agentic Astro Website](https://github.com/kreativan/agentic-astro-website) starter: Astro 7, an `AGENTS.md` and agent skills for building, forms and handoff.

```bash
npx create-agentic-astro-website my-site
npx create-agentic-astro-website my-site --template bootstrap --emdash
# or
npm create agentic-astro-website@latest my-site -- --template bootstrap
```

With no `--template` and no `--ref`, it asks you to pick one. Non-interactive runs use `default`. It then asks whether to add EmDash, unless you pass `--emdash` or `--no-emdash`. Non-interactive runs skip EmDash unless you pass `--emdash`.

It downloads that branch of the starter, sets the package name, creates `.env` from `.env.example`, links `.claude/skills` to `.agents/skills`, installs dependencies and makes the first git commit.

## Templates

| Name | Branch | Styling |
|------|--------|---------|
| `default` | `main` | Plain CSS |
| `bootstrap` | `bootstrap` | Bootstrap 6 alpha |

A new variant is a branch plus one entry in `TEMPLATES` in `index.js`. Publish the CLI again after that change. Pushing the branch is enough for later changes to the starter itself.

## Options

| Option | Description |
|--------|-------------|
| `--template <name>` | `default` or `bootstrap` |
| `--ref <ref>` | Branch or tag, instead of `--template` |
| `--emdash` | Add EmDash and switch the project to server rendering |
| `--no-emdash` | Do not add EmDash, and do not ask |
| `--no-install` | Skip installing dependencies |
| `--no-git` | Skip `git init` |
| `-h`, `--help` | Show help |
| `-v`, `--version` | Show the version |

## Next steps

```bash
cd my-site
npm run dev
```

Fill in `.env`, then ask your agent to build the site. It follows `AGENTS.md` and the `build-site` skill.

## Requirements

Node.js 22.5 or newer to run the CLI. The starter itself needs Node.js 24.
