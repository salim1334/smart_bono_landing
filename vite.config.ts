// Vite teardown calls process.stdin.off after prerender; on Windows/Git Bash the preview
// server can leave stdin without .off and the build fails despite a successful prerender.
if (!process.env.CI) process.env.CI = 'true';

// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from '@lovable.dev/vite-tanstack-config';

/** Cloudflare build emits index.js; TanStack prerender expects server.js */
function serverEntryForPrerender(): Plugin {
  return {
    name: 'server-entry-for-prerender',
    writeBundle(options) {
      const dir = options.dir ?? '';
      if (!dir.replace(/\\/g, '/').endsWith('dist/server')) return;
      const indexPath = path.join(dir, 'index.js');
      const serverPath = path.join(dir, 'server.js');
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, serverPath);
      }
    },
  };
}

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: 'server' },
    // Prerender SPA shell for Firebase static hosting (proper client bootstrap)
    spa: {
      enabled: true,
      maskPath: '/',
    },
  },
  vite: {
    plugins: [serverEntryForPrerender()],
  },
});
