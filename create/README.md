# create-agentic-astro-website

Create a new site from the [Agentic Astro Website](https://github.com/kreativan/agentic-astro-website) starter: Astro 7, an `AGENTS.md` and agent skills for building, forms and handoff.

```bash
npx create-agentic-astro-website my-site
# or
npm create agentic-astro-website@latest my-site
```

It downloads the starter, sets the package name, creates `.env` from `.env.example`, links `.claude/skills` to `.agents/skills`, installs dependencies and makes the first git commit.

## Options

| Option | Description |
|--------|-------------|
| `--ref <ref>` | Branch or tag of the starter repo (default: `main`) |
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
