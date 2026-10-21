#!/usr/bin/env node
/**
 * Creates a new project from the Agentic Astro Website starter.
 *
 *   npx create-agentic-astro-website my-site
 *   npm create agentic-astro-website@latest my-site
 *
 * Options:
 *   --ref <ref>      branch or tag of the starter repo (default: main)
 *   --no-install     skip installing dependencies
 *   --no-git         skip git init
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { downloadTemplate } from "giget";

const REPO = "github:kreativan/agentic-astro-website";
const VERSION = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")).version;

const HELP = `create-agentic-astro-website v${VERSION}

Usage:
  npx create-agentic-astro-website [folder] [options]

Options:
  --ref <ref>      branch or tag of the starter repo (default: main)
  --no-install     skip installing dependencies
  --no-git         skip git init
  -h, --help       show this help
  -v, --version    show the version
`;

function parseArgs(argv) {
  const args = { dir: null, ref: "main", install: true, git: true };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") args.help = true;
    else if (arg === "-v" || arg === "--version") args.version = true;
    else if (arg === "--no-install") args.install = false;
    else if (arg === "--no-git") args.git = false;
    else if (arg === "--ref") args.ref = argv[++i];
    else if (!arg.startsWith("-") && !args.dir) args.dir = arg;
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (!args.ref) throw new Error("--ref needs a branch or tag");
  return args;
}

async function askDir() {
  if (!process.stdin.isTTY) return "my-site";
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question("Project folder (my-site): ")).trim();
  rl.close();
  return answer || "my-site";
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

  if (!isEmptyDir(dir)) {
    throw new Error(`${dirName} already exists and is not empty.`);
  }

  console.log(`\nCreating ${name} from ${REPO}#${args.ref}…`);
  await downloadTemplate(`${REPO}#${args.ref}`, {
    dir,
    force: true,
    ignore: (file) => file === "create" || file.startsWith("create/"),
  });

  setPackageName(dir, name);
  createEnv(dir);
  linkSkills(dir);

  const pm = packageManager();
  if (args.install) {
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
  ${args.install ? "" : `${pm} install\n  `}${pm} run dev

Fill in .env (SITE_URL, SITE_NAME, …), then ask your agent to build the site.
It will follow AGENTS.md and the build-site skill.
`);
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});
