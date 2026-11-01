#!/usr/bin/env node
/**
 * Creates a new project from the Agentic Astro Website starter.
 *
 *   npx create-agentic-astro-website my-site
 *   npm create agentic-astro-website@latest my-site
 *
 * Options:
 *   --template <name>  default (plain CSS) or bootstrap (Bootstrap 6)
 *   --ref <ref>        branch or tag, instead of a named template
 *   --emdash           add the EmDash CMS (forces server rendering)
 *   --no-emdash        skip the EmDash prompt
 *   --no-install       skip installing dependencies
 *   --no-git           skip git init
 */
import fs, { realpathSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { downloadTemplate } from "giget";

const REPO = "github:kreativan/agentic-astro-website";
const VERSION = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")).version;

/** Named starters. The value is the git branch giget downloads. */
const TEMPLATES = {
  default: "main",
  bootstrap: "bootstrap",
};

const HELP = `create-agentic-astro-website v${VERSION}

Usage:
  npx create-agentic-astro-website [folder] [options]

Templates:
  default      Plain CSS (branch: main)
  bootstrap    Bootstrap 6 alpha (branch: bootstrap)

Options:
  --template <name>  ${Object.keys(TEMPLATES).join(" | ")} (default: default)
  --ref <ref>        branch or tag, instead of --template
  --emdash           add the EmDash CMS and switch the project to server rendering
  --no-emdash        do not add EmDash, and do not ask
  --no-install       skip installing dependencies
  --no-git           skip git init
  -h, --help         show this help
  -v, --version      show the version
`;

function parseArgs(argv) {
  const args = { dir: null, ref: null, template: null, emdash: null, install: true, git: true };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") args.help = true;
    else if (arg === "-v" || arg === "--version") args.version = true;
    else if (arg === "--no-install") args.install = false;
    else if (arg === "--no-git") args.git = false;
    else if (arg === "--emdash") args.emdash = true;
    else if (arg === "--no-emdash") args.emdash = false;
    else if (arg === "--template") args.template = argv[++i];
    else if (arg === "--ref") args.ref = argv[++i];
    else if (!arg.startsWith("-") && !args.dir) args.dir = arg;
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (args.ref === undefined) throw new Error("--ref needs a branch or tag");
  if (args.template === undefined) throw new Error("--template needs a name");
  if (args.ref && args.template) throw new Error("Use either --template or --ref, not both");
  return args;
}

function templateRef(name) {
  const ref = TEMPLATES[name];
  if (!ref) {
    throw new Error(`Unknown template "${name}". Choose one of: ${Object.keys(TEMPLATES).join(", ")}`);
  }
  return ref;
}

async function askDir() {
  if (!process.stdin.isTTY) return "my-site";
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question("Project folder (my-site): ")).trim();
  rl.close();
  return answer || "my-site";
}

async function askTemplate() {
  if (!process.stdin.isTTY) return "default";
  const names = Object.keys(TEMPLATES);
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  console.log("\nTemplate:");
  names.forEach((name, index) => {
    console.log(`  ${index + 1}) ${name}  [${TEMPLATES[name]}]`);
  });
  const answer = (await rl.question("Template (1): ")).trim().toLowerCase();
  rl.close();
  if (!answer) return "default";
  const number = Number(answer);
  if (Number.isInteger(number) && number >= 1 && number <= names.length) return names[number - 1];
  return answer;
}

async function askEmDash() {
  if (!process.stdin.isTTY) return false;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question("\nAdd EmDash CMS? This switches the site to server rendering. (y/N) ")).trim().toLowerCase();
  rl.close();
  return answer === "y" || answer === "yes";
}

function isEmptyDir(dir) {
  return !fs.existsSync(dir) || fs.readdirSync(dir).length === 0;
}

function packageManager() {
  const agent = process.env.npm_config_user_agent ?? "";
  return ["pnpm", "yarn", "bun"].find((pm) => agent.startsWith(pm)) ?? "npm";
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
  return result.status === 0;
}

function setPackageName(dir, name) {
  const file = path.join(dir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
  pkg.name = name.toLowerCase().replace(/[^a-z0-9-~._]+/g, "-").replace(/^[-._]+|-+$/g, "") || "my-site";
  pkg.version = "0.0.1";
  fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
}

function createEnv(dir) {
  const example = path.join(dir, ".env.example");
  const env = path.join(dir, ".env");
  if (fs.existsSync(example) && !fs.existsSync(env)) fs.copyFileSync(example, env);
}

// Claude Code reads .claude/skills, Codex and Cursor read .agents/skills: keep one copy, linked.
const EMDASH_CONFIG = `import { defineConfig, envField } from 'astro/config';
import { loadEnv } from "vite";
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import emdash, { local } from 'emdash/astro';
import { sqlite } from 'emdash/db';

// Config can't import astro:env, so read the values it needs from .env directly
const { SITE_URL } = loadEnv(process.env, process.cwd(), "");

export default defineConfig({
  site: SITE_URL || 'http://localhost:4321',
  output: 'server',
  adapter: node({ mode: 'standalone' }),

  devToolbar: {
    enabled: false
  },

  env: {
    schema: {
      SITE_LANG: envField.string({ context: 'server', access: 'public', default: 'en' }),
      SITE_NAME: envField.string({ context: 'server', access: 'public', default: 'Agentic Astro Website' }),
      SITE_DESCRIPTION: envField.string({ context: 'server', access: 'public', default: '' }),
      SITE_IMAGE: envField.string({ context: 'server', access: 'public', default: '' }),
    },
  },

  integrations: [
    react(),
    emdash({
      database: sqlite({ url: 'file:./data.db' }),
      storage: local({
        directory: './uploads',
        baseUrl: '/_emdash/api/media/file',
      }),
    }),
    sitemap({
      filter: (page) => {
        const exclude = ['/guidelines/'];
        return !exclude.some(path => page.includes(path));
      }
    }),
  ],
});
`;

const LIVE_CONFIG = `import { defineLiveCollection } from "astro:content";
import { emdashLoader } from "emdash/runtime";

export const collections = {
  _emdash: defineLiveCollection({ loader: emdashLoader() }),
};
`;

const EMDASH_AGENTS = `
## EmDash

This project uses [EmDash](https://emdashcms.com/). The admin is at \`/_emdash/admin\`. Query content at request time with \`getEmDashCollection()\` and \`getEmDashEntry()\` from \`emdash\`. Render body content with \`PortableText\` from \`emdash/ui\`.

The database is \`data.db\`. Uploads are in \`uploads/\`. Do not commit those, or \`EMDASH_ENCRYPTION_KEY\`.
`;

function lineBreak(text) {
  return text.includes("\r\n") ? "\r\n" : "\n";
}

function editLines(file, drop) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  const nl = lineBreak(text);
  const next = text.split(/\r?\n/).filter((line) => !drop(line)).join(nl);
  if (next !== text) fs.writeFileSync(file, next);
}

function replaceOnce(file, from, to) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes(from)) return;
  fs.writeFileSync(file, text.replace(from, to));
}

function enableEmDash(dir) {
  fs.writeFileSync(path.join(dir, "astro.config.mjs"), EMDASH_CONFIG);
  fs.writeFileSync(path.join(dir, "src", "live.config.ts"), LIVE_CONFIG);

  for (const name of [".env", ".env.example"]) {
    editLines(path.join(dir, name), (line) => line === "ASTRO_SSR=0" || line.startsWith("# 1 = SSR with the Node adapter"));
  }

  const ignore = path.join(dir, ".gitignore");
  const ignoreText = fs.readFileSync(ignore, "utf8");
  if (!ignoreText.includes("data.db")) {
    fs.writeFileSync(ignore, `${ignoreText.trimEnd()}\n\n# EmDash\ndata.db*\nuploads/\n`);
  }

  const agents = path.join(dir, "AGENTS.md");
  editLines(agents, (line) => line.includes("| `ASTRO_SSR` |"));
  if (fs.existsSync(agents) && !fs.readFileSync(agents, "utf8").includes("## EmDash")) {
    const text = fs.readFileSync(agents, "utf8");
    const nl = lineBreak(text);
    fs.writeFileSync(agents, text.replace(`${nl}## Conventions${nl}`, `${nl}${EMDASH_AGENTS.trim()}${nl}${nl}## Conventions${nl}`));
  }

  replaceOnce(
    path.join(dir, "README.md"),
    "- **Static or SSR:** static by default, SSR with the Node adapter when `ASTRO_SSR=1`.",
    "- **Rendering:** server output with the Node adapter. The EmDash admin is at `/_emdash/admin`.",
  );
  editLines(path.join(dir, "README.md"), (line) => line.includes("| `ASTRO_SSR` |"));
  replaceOnce(
    path.join(dir, "README.md"),
    "| `npm run start` | Run the SSR build (`ASTRO_SSR=1`) on `0.0.0.0:4321` |",
    "| `npm run start` | Run the production server on `0.0.0.0:4321` |",
  );
  replaceOnce(
    path.join(dir, ".agents", "skills", "project-handoff", "SKILL.md"),
    "`ASTRO_SSR`",
    "`EMDASH_ENCRYPTION_KEY`",
  );
}

function installEmDash(dir, pm) {
  const packages = ["emdash", "@astrojs/react", "react", "react-dom"];
  const command = { npm: ["install"], pnpm: ["add"], yarn: ["add"], bun: ["add"] }[pm] ?? ["install"];
  console.log(`\nAdding EmDash with ${pm}…`);
  if (!run(pm, [...command, ...packages], dir)) {
    console.warn(`  Install failed. Run "${pm} ${command[0]} ${packages.join(" ")}" yourself.`);
    return;
  }
  const bin = path.join(dir, "node_modules", ".bin", "emdash");
  if (!run(bin, ["secrets", "generate", "--write", ".env"], dir)) {
    console.warn("  Could not write EMDASH_ENCRYPTION_KEY. Run `npx emdash secrets generate --write .env`.");
  }
}

function linkSkills(dir) {
  const source = path.join(dir, ".agents", "skills");
  const link = path.join(dir, ".claude", "skills");
  if (!fs.existsSync(source)) return;

  const stat = fs.lstatSync(link, { throwIfNoEntry: false });
  if (stat?.isSymbolicLink() && fs.existsSync(link)) return;
  if (stat) fs.rmSync(link, { recursive: true, force: true });

  fs.mkdirSync(path.dirname(link), { recursive: true });
  try {
    fs.symlinkSync(path.join("..", ".agents", "skills"), link, "dir");
  } catch {
    fs.cpSync(source, link, { recursive: true });
    console.warn("  Could not create a symlink, so .claude/skills is a copy of .agents/skills. Keep them in sync.");
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return void process.stdout.write(HELP);
  if (args.version) return void console.log(VERSION);

  const dirName = args.dir ?? (await askDir());
  const dir = path.resolve(dirName);
  const name = path.basename(dir);
  const ref = args.ref ?? templateRef(args.template ?? (await askTemplate()));
  const emdash = args.emdash ?? (await askEmDash());

  if (!isEmptyDir(dir)) {
    throw new Error(`${dirName} already exists and is not empty.`);
  }

  console.log(`\nCreating ${name} from ${REPO}#${ref}…`);
  await downloadTemplate(`${REPO}#${ref}`, {
    dir,
    force: true,
    ignore: (file) => file === "create" || file.startsWith("create/"),
  });

  setPackageName(dir, name);
  createEnv(dir);
  linkSkills(dir);
  if (emdash) enableEmDash(dir);

  const pm = packageManager();
  if (args.install && emdash) installEmDash(dir, pm);
  else if (args.install) {
    console.log(`\nInstalling dependencies with ${pm}…`);
    if (!run(pm, ["install"], dir)) console.warn(`  Install failed. Run "${pm} install" yourself.`);
  }

  if (args.git) {
    const ok = run("git", ["init", "-q"], dir)
      && run("git", ["add", "-A"], dir)
      && run("git", ["commit", "-q", "-m", "Initial commit from create-agentic-astro-website"], dir);
    if (!ok) console.warn("  Skipped the initial git commit.");
  }

  const relative = path.relative(process.cwd(), dir) || ".";
  console.log(`
Done. Next steps:

  cd ${relative}
  ${args.install ? "" : `${pm} install${emdash ? " emdash @astrojs/react react react-dom" : ""}\n  ${emdash ? "npx emdash secrets generate --write .env\n  " : ""}`}${pm} run dev

Fill in .env (SITE_URL, SITE_NAME, …), then ask your agent to build the site.
It will follow AGENTS.md and the build-site skill.${emdash ? `

EmDash is installed. Run the dev server, then open /_emdash/admin
and finish the setup wizard (site, account, passkey).` : ""}
`);
}

function startedAsCli() {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return realpathSync(entry) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (startedAsCli()) {
  main().catch((error) => {
    console.error(`\n${error.message}`);
    process.exit(1);
  });
}

export { enableEmDash };
