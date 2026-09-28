---
tags:
  - 2brain
  - 2brain/module
  - project/js-toolkit
type: module
module: tests/_setup/
files: 1
updated: 2026-09-28T20:02:01.831906+00:00
---

# tests/_setup/

## Purpose

`tests/_setup/` holds test-infra configuration that runs before or alongside the test suite. Its sole responsibility is to set up the FastCheck property-based testing environment so that test files can import a ready-to-use configuration rather than repeating setup boilerplate.

## Key parts

- **`fastCheck.ts`** – Registers/configures FastCheck (the property-based testing library) for the project's test runner. Typically this is where global options (random seed, number of cases, reporter hooks, etc.) are pinned so every spec file inherits the same defaults.

## How it connects

This module is a leaf in the dependency graph: it imports no other project modules, and (by the naming convention `_setup`) other test files import *from* it. It sits at the bottom of the test-infrastructure chain—pure configuration with no runtime dependency on application code.

## Where to start

Open **`tests/_setup/fastCheck.ts`**. It is the only file in the module and the single point where FastCheck is configured, so reading it tells you exactly what seed, case count, and reporter settings apply to every property-based test in the suite.

## Connected modules
_(none)_

## Files
- `tests/_setup/fastCheck.ts`

---
[[js-toolkit_INDEX|← js-toolkit index]]
