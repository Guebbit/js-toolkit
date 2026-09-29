---
tags:
    - 2brain
    - 2brain/module
    - project/js-toolkit
type: module
module: scripts/
files: 2
updated: 2026-09-28T20:00:34.611799+00:00
---

# scripts/

## Purpose

`scripts/` contains the project's build pipeline and quality-gate tooling. It orchestrates compilation from the TypeScript source tree into dual-format (ESM + CommonJS) distributable output and enforces per-file mutation-testing baselines, keeping the published package and its test-quality contract in sync without manual intervention.

## Key parts

- **`build.mjs`** — Invokes `tsc` twice (once per module system) using separate tsconfig files, then writes marker `package.json` files into each output directory so Node resolves the correct module format. Produces both runtime bundles and type declarations from a single source tree.
- **`mutation-baseline.json` / `mutation-baseline.mjs`** — A per-file mutation-testing gate. The script reads a Stryker JSON report, compares each file's kill score against the committed baseline, and fails the run if any file regresses. Baselines ratchet upward only on a fully regression-free run, preventing one strong file from masking a weak one behind a single global percentage.

## How it connects

This module is a leaf node in the dependency graph—it depends on no other internal modules. It is invoked by CI and local developer workflows (via `package.json` scripts or directly) to produce the artifacts that the rest of the project (and its consumers) import.

## Where to start

Read **`scripts/build.mjs`** first: it is the entry point for every publishable artifact and shows the dual-compile strategy and output layout in a single, short file. Next, glance at **`scripts/mutation-baseline.mjs`** to understand how the project guards against silent test-quality decay on a per-file basis.

## Connected modules

_(none)_

## Files

- `scripts/build.mjs` — Builds dual ESM and CommonJS outputs (plus type declarations) from a single TypeScript source tree by invoking `tsc` twice with separate tsconfig files, then writes marker `package.json` files so Node resolves each output directory with the correct module system.
- `scripts/mutation-baseline.mjs` — Per-file mutation-testing gate. Reads a Stryker JSON report, compares each file's kill score against a committed `mutation-baseline.json`, fails the run on any regression, and ratchets baselines upward only when the entire run is regression-free. Replaces a single global percentage that can hide a weak file behind a strong one.

---

[[js-toolkit_INDEX|← js-toolkit index]]
