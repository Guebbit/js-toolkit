---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
    name: 'js-toolkit'
    text: 'Framework-free TypeScript helpers'
    tagline: Arrays, strings, numbers, time, formatting, DOM and browser-platform helpers — no runtime dependencies, real ESM and CommonJS builds.
    actions:
        - theme: brand
          text: Getting Started
          link: /guide/getting-started
        - theme: alt
          text: API Reference
          link: /api/arrays-and-objects

features:
    - title: No runtime dependencies
      details: Every helper is a plain function over the platform (Intl, the DOM, node:fs) — nothing else to install, nothing else to audit.
    - title: Import one helper, or the barrel
      details: Every module is its own subpath export, and sideEffects is false, so a bundler drops whatever you do not use.
    - title: Dual ESM and CommonJS
      details: import and require both work natively, with declarations published for each build — checked against a real packed tarball on every build.
---
