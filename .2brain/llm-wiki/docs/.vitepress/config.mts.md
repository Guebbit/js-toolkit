---
source: docs/.vitepress/config.mts
sha256: 7fab560d8acc1139e3d0b4ffd51d5501d8823c854faaa3381187d57bdb60aa0b
generated_at: 2026-09-28T18:17:49.713435+00:00
model: ollama:qwen3.8:27b
---

# docs/.vitepress/config.mts

## Purpose

VitePress site configuration for the `@guebbit/js-toolkit` documentation. It defines the site metadata, navigation layout, and enables Mermaid diagram rendering via a plugin wrapper.

## Key elements

- **`withMermaid(defineConfig(...))`** — Wraps the standard VitePress config so that fenced ` ```mermaid ` code blocks are rendered as diagrams (used in the Testing guide).
- **`title` / `description`** — Site metadata: project name and a one-line summary of the toolkit's scope and dual-build output.
- **`base`** — Set to `/js-toolkit/`, meaning the docs are served under that subdirectory (e.g. GitHub Pages or a reverse-proxy path).
- **`themeConfig.nav`** — Top-level navigation: Home, Guide, Reference.
- **`themeConfig.sidebar`** — Two groups:
    - _Guide_: Getting Started, Testing
    - _API reference_: Arrays and objects, Strings, Errors, Numbers and ranges, Time, JSON, DOM, Browser platform, Node
- **`themeConfig.socialLinks`** — A single GitHub link to `Guebbit/js-toolkit`.

## Relationships

No graph neighbors recorded.

## Notes

- The `base` path must stay in sync with wherever the built docs are deployed; a mismatch will break all asset URLs.
- Adding a new API module means adding a corresponding `.md` page **and** a sidebar entry here—VitePress won't auto-discover pages into the sidebar.
- The Mermaid plugin is applied by _wrapping_ the export, not by a plugin array. If you switch to a different plugin system, don't drop the `withMermaid` call or the Testing guide's diagram will render as raw code.
