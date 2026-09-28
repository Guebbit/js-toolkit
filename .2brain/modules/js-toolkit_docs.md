---
tags:
  - 2brain
  - 2brain/module
  - project/js-toolkit
type: module
module: docs/
files: 13
updated: 2026-09-28T20:00:22.207502+00:00
---

# docs/

## Purpose

The `docs/` directory is the VitePress-powered documentation site for `@guebbit/js-toolkit`. It defines the site's layout, navigation, and content—covering both a quick-start guide and per-module API references—so that users can discover and understand every public helper without reading source code.

## Key parts

- **Site configuration** — `.vitepress/config.mts` sets site metadata, sidebar/nav layout, and enables Mermaid diagram rendering via a plugin wrapper. This is the single file that controls how the whole site is built and served.
- **API reference** (`api/`) — One Markdown file per public utility area: `arrays-and-objects`, `browser-platform`, `dom`, `errors`, `json`, `node`, `numbers-and-ranges`, `strings`, `time`. Together they document the toolkit's full public surface, from data reshaping to browser-specific helpers.
- **Guides** (`guide/`) — `getting-started.md` gives a project-level overview and first-run instructions; `testing.md` describes the five-layer test strategy used across the codebase.
- **Home page** — `index.md` provides the VitePress `home` layout landing page that links into the guides and API sections.

## How it connects

This module has no runtime or build-time dependencies on other modules in the repository. It is a pure consumer: it *describes* the library's public API but is never imported by application code. The only tooling dependency is VitePress (a dev dependency), which reads the config and Markdown files to produce a static site.

## Where to start

1. **`docs/guide/getting-started.md`** — the fastest way to understand what the toolkit is, what problems it solves, and how the API docs are organised.
2. **`docs/.vitepress/config.mts`** — read this second if you plan to edit or add documentation pages; it shows how the sidebar is wired and what plugins are active, so new files land in the right place.

## Connected modules
_(none)_

## Files
- `docs/.vitepress/config.mts` — VitePress site configuration for the `@guebbit/js-toolkit` documentation. It defines the site metadata, navigation layout, and enables Mermaid diagram rendering via a plugin wrapper.
- `docs/api/arrays-and-objects.md` — Reshaping, slicing and coercing plain arrays and objects — no class instances, no mutation of the
- `docs/api/browser-platform.md` — Clipboard, downloads, cookies, query strings, `FormData`, and the client-side file checks that
- `docs/api/dom.md` — The jQuery-shaped chores a framework usually hides: reading a form, walking siblings, batching
- `docs/api/errors.md` — Reading a human-readable message off anything a `catch` or a rejected promise can hand you.
- `docs/api/json.md` — Parsing that reports failure through its return value, never by throwing or writing to the
- `docs/api/node.md` — The one helper that only runs outside a browser — it is the single module that imports
- `docs/api/numbers-and-ranges.md` — Distances (plain and wrapping), interval overlap, and currency display — formatCurrency renders a
- `docs/api/strings.md` — Fuzzy matching, edit distance, id generation, and plain-text display formatting.
- `docs/api/time.md` — Conversions between a raw duration and every calendar-style unit, execution timing, and the two
- `docs/guide/getting-started.md` — `@guebbit/js-toolkit` is a small set of framework-free TypeScript helpers for the things that keep
- `docs/guide/testing.md` — Five layers, each catching a kind of bug the others cannot see.
- `docs/index.md` — layout: home

---
[[js-toolkit_INDEX|← js-toolkit index]]
