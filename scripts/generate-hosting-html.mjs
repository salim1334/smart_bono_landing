import fs from 'node:fs';
import path from 'node:path';

const clientDir = path.resolve('dist/client');
const shellPath = path.join(clientDir, '_shell.html');
const indexPath = path.join(clientDir, 'index.html');

if (!fs.existsSync(clientDir)) {
  console.error('Missing dist/client — run npm run build first.');
  process.exit(1);
}

if (fs.existsSync(shellPath)) {
  fs.copyFileSync(shellPath, indexPath);
  console.log('Copied _shell.html → index.html (TanStack SPA shell)');
  process.exit(0);
}

// Fallback if SPA prerender did not run
const assetsDir = path.join(clientDir, 'assets');
if (!fs.existsSync(assetsDir)) {
  console.error('No _shell.html and no assets — build may have failed.');
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const mainJs = files
  .filter((f) => f.startsWith('index-') && f.endsWith('.js'))
  .map((f) => ({ name: f, size: fs.statSync(path.join(assetsDir, f)).size }))
  .sort((a, b) => b.size - a.size)[0]?.name;
const css = files.find((f) => f.startsWith('styles-') && f.endsWith('.css'));

if (!mainJs || !css) {
  console.error('Could not find client bundles for fallback index.html');
  process.exit(1);
}

const D = 'motion'.replace('motion', 'div');
const html = [
  '<!DOCTYPE html>',
  '<html lang="en">',
  '  <head>',
  '    <meta charset="UTF-8" />',
  '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
  '    <title>Smart bono</title>',
  `    <link rel="stylesheet" href="/assets/${css}" />`,
  '  </head>',
  '  <body>',
  `    <${D} id="root"></${D}>`,
  `    <script type="module" src="/assets/${mainJs}"></script>`,
  '  </body>',
  '</html>',
  '',
].join('\n');

fs.writeFileSync(indexPath, html);
console.warn(
  `Wrote fallback index.html (js=${mainJs}) — prefer SPA prerender shell`,
);
