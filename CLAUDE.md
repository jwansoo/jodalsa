# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install          # install dependencies
npm run dev           # start Vite dev server with HMR
npm run build         # type-check (vue-tsc) then production build
npm run type-check    # vue-tsc --build only
npm run lint          # runs lint:oxlint then lint:eslint (both --fix)
npm run format        # prettier --write on src/
npm run preview       # preview the production build
```

There are no tests configured in this project (no test runner/dependency present).

To type-check or lint a single file, prefer running the underlying tool directly, e.g. `npx eslint src/path/to/File.vue --fix` or `npx oxlint src/path/to/File.vue --fix`.

## Architecture

This is a standard `create-vue` scaffold (Vue 3 + Vite + TypeScript), currently at its initial/default state — no custom features have been layered on yet.

- **Entry point**: `src/main.ts` creates the app, installs Pinia and Vue Router, then mounts to `#app`.
- **Routing**: `src/router/index.ts` uses `createWebHistory`. Routes are wired to files in `src/views/`. `AboutView` is lazy-loaded via dynamic `import()` — follow this pattern for new routes to preserve code-splitting.
- **State**: Pinia is installed (`src/stores/counter.ts` is the example store) but no store composition conventions exist yet beyond the default template.
- **Path alias**: `@/*` maps to `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).
- **Linting**: two linters run in sequence — `oxlint` (fast, `correctness` category set to `error`) then `eslint` (Vue + TypeScript flat config in `eslint.config.ts`), with `eslint-plugin-oxlint` disabling ESLint rules oxlint already covers, and Prettier formatting rules turned off in ESLint (`eslint-config-prettier`) since Prettier owns formatting.
- **TypeScript**: project uses TS project references — `tsconfig.json` points to `tsconfig.app.json` (app source, extends `@vue/tsconfig/tsconfig.dom.json`) and `tsconfig.node.json` (build tooling config). `noUncheckedIndexedAccess` is enabled in the app config.
- **Formatting**: Prettier config has no semicolons, single quotes, 100-char print width (`.prettierrc.json`).
