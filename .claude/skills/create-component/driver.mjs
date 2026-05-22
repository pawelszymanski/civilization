#!/usr/bin/env node
/**
 * Angular component generator following this project's style conventions.
 *
 * Usage (from project root):
 *   node .claude/skills/create-component/driver.mjs <path> [options]
 *
 * Arguments:
 *   path            Component path relative to src/app/components/
 *                   e.g. "hud/my-component", "modals/menus/my-modal"
 *
 * Options:
 *   --worker        Include Web Worker boilerplate ({type: 'module'})
 *   --simple        Minimal component — no OnInit/OnDestroy or subscriptions
 *   --no-push       Omit ChangeDetectionStrategy.OnPush
 *   --group <name>  Comment label to insert in app.module.ts COMPONENTS array
 *   --dry-run       Print generated content without writing files
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dir, '../../../');

// ─── Parse args ────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
if (!argv.length || argv[0].startsWith('-')) {
  console.error([
    'Usage: node driver.mjs <path/from/src/app/components> [options]',
    '',
    'Examples:',
    '  node driver.mjs hud/my-widget',
    '  node driver.mjs hud/my-widget --worker --group hud',
    '  node driver.mjs modals/menus/my-modal --group "menu modals"',
    '  node driver.mjs sidebars/dev-tools/components/my-form --simple',
    '  node driver.mjs hud/my-widget --dry-run',
    '',
    'Options:',
    '  --worker        Worker boilerplate with {type: "module"}',
    '  --simple        No lifecycle hooks or subscriptions',
    '  --no-push       No ChangeDetectionStrategy.OnPush',
    '  --group <name>  COMPONENTS array comment group',
    '  --dry-run       Preview without writing',
  ].join('\n'));
  process.exit(1);
}

const componentPath = argv[0];
const useWorker   = argv.includes('--worker');
const isSimple    = argv.includes('--simple');
const noPush      = argv.includes('--no-push');
const isDryRun    = argv.includes('--dry-run');
const groupIdx    = argv.indexOf('--group');
const moduleGroup = groupIdx !== -1 ? argv[groupIdx + 1] : null;

// ─── Derived names ─────────────────────────────────────────────────────────

const parts      = componentPath.split('/');
const kebab      = parts.at(-1);
const pascal     = kebab.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');
const className  = `${pascal}Component`;
const selector   = `.${kebab}-component`;
const filePrefix = `${kebab}.component`;

// ─── Relative path prefixes ────────────────────────────────────────────────
//
// Component sits at: src/app/components/{...parts}/
// To reach src/app/ (models, services, stores, workers): parts.length + 1 dirs up
// To reach src/       (styles/):                         parts.length + 2 dirs up

const toApp = '../'.repeat(parts.length + 1);
const toSrc = '../'.repeat(parts.length + 2);

// ─── File generators ───────────────────────────────────────────────────────

function generateTs() {
  const withLifecycle = !isSimple;
  const withPush      = !noPush;

  const core = ['Component'];
  if (withPush)      core.push('ChangeDetectionStrategy');
  if (withLifecycle) core.push('OnDestroy', 'OnInit');
  core.push('ViewEncapsulation');

  const opts = [
    `  selector: '${selector}'`,
    `  templateUrl: './${filePrefix}.html'`,
    `  styleUrls: ['./${filePrefix}.scss']`,
    `  encapsulation: ViewEncapsulation.None`,
  ];
  if (withPush) opts.push(`  changeDetection: ChangeDetectionStrategy.OnPush`);

  // Worker property: myComponentWorker from my-component
  const workerProp = kebab.replace(/-(\w)/g, (_, c) => c.toUpperCase()) + 'Worker';
  const workerFile = `./${toApp}workers/${kebab}.worker`;

  const body = [];

  if (withLifecycle) {
    body.push(`  subscriptions: Subscription[] = [];`);
    if (useWorker) body.push(``, `  ${workerProp}: Worker;`);
  }

  if (body.length > 0) body.push(``);
  body.push(`  constructor() {}`);

  if (withLifecycle) {
    body.push(``, `  // INIT`, ``);

    const initCalls = [];
    if (useWorker) initCalls.push(`    this.init${pascal}Worker();`);
    initCalls.push(`    this.subscribeToData();`);
    body.push(`  ngOnInit(): void {`, ...initCalls, `  }`, ``);

    const destroyCalls = [`    this.unsubscribeFromData();`];
    if (useWorker) destroyCalls.push(`    this.${workerProp}.terminate();`);
    body.push(`  ngOnDestroy(): void {`, ...destroyCalls, `  }`);

    if (useWorker) {
      body.push(
        ``,
        `  init${pascal}Worker(): void {`,
        `    this.${workerProp} = new Worker(new URL('${workerFile}', import.meta.url), {type: 'module'});`,
        `    this.${workerProp}.onmessage = (message) => {`,
        `      // handle message.data`,
        `    };`,
        `  }`,
      );
    }

    body.push(
      ``,
      `  subscribeToData(): void {`,
      `    this.subscriptions.push(`,
      `      // TODO`,
      `    );`,
      `  }`,
      ``,
      `  unsubscribeFromData(): void {`,
      `    this.subscriptions.forEach(s => s.unsubscribe());`,
      `  }`,
    );
  }

  const implementsStr = withLifecycle ? ` implements OnInit, OnDestroy` : '';
  const rxjsLine = withLifecycle ? `import {Subscription} from 'rxjs';\n` : '';

  return [
    `import {${core.join(', ')}} from '@angular/core';`,
    rxjsLine,
    `@Component({`,
    opts.join(',\n'),
    `})`,
    `export class ${className}${implementsStr} {`,
    ``,
    body.join('\n'),
    ``,
    `}`,
  ].join('\n');
}

function generateHtml() {
  return `<!-- ${className} -->\n`;
}

function generateScss() {
  return `@import '${toSrc}styles/mixins';\n@import '${toSrc}styles/variables';\n\n${selector} {\n}\n`;
}

// ─── Module registration ───────────────────────────────────────────────────

function updateModule(src) {
  const importLine = `import {${className}} from './components/${componentPath}/${filePrefix}';`;

  // Add import: just before the "// DIRECTIVES" comment
  if (!src.includes(importLine)) {
    src = src.replace(
      '\n// DIRECTIVES',
      `\n${importLine}\n\n// DIRECTIVES`
    );
  }

  // Add to COMPONENTS array: just before its closing `];`
  if (!src.includes(`${className},`)) {
    const start    = src.indexOf('const COMPONENTS = [');
    const closeIdx = src.indexOf('\n];', start);
    const prefix   = moduleGroup ? `  // ${moduleGroup}\n  ` : `  `;
    src = src.slice(0, closeIdx) + `\n${prefix}${className},` + src.slice(closeIdx);
  }

  return src;
}

// ─── Execute ───────────────────────────────────────────────────────────────

const outDir    = join(PROJECT_ROOT, 'src/app/components', componentPath);
const moduleSrc = join(PROJECT_ROOT, 'src/app/app.module.ts');

const generated = {
  [`${filePrefix}.ts`]:   generateTs(),
  [`${filePrefix}.html`]: generateHtml(),
  [`${filePrefix}.scss`]: generateScss(),
};

console.log(`\nGenerating ${className}`);
console.log(`  selector : ${selector}`);
console.log(`  path     : src/app/components/${componentPath}/`);
if (isDryRun) console.log(`  mode     : DRY RUN — no files written`);
console.log('');

for (const [name, content] of Object.entries(generated)) {
  if (isDryRun) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`  ${name}`);
    console.log('─'.repeat(60));
    console.log(content);
  } else {
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, name), content, 'utf8');
    console.log(`  created  ${name}`);
  }
}

if (existsSync(moduleSrc)) {
  const original = readFileSync(moduleSrc, 'utf8');
  const updated  = updateModule(original);
  if (isDryRun) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`  app.module.ts additions`);
    console.log('─'.repeat(60));
    updated.split('\n').forEach(line => {
      if (!original.split('\n').includes(line) && line.includes(className)) {
        console.log(`+ ${line}`);
      }
    });
  } else {
    writeFileSync(moduleSrc, updated, 'utf8');
    console.log(`  updated  app.module.ts`);
  }
} else {
  console.warn(`  warning  app.module.ts not found — skipping module registration`);
}

if (!isDryRun) {
  console.log('\nDone. Add constructor dependencies and subscriptions as needed.\n');
}
