# Graph Report - target-repo  (2026-09-28)

## Corpus Check
- 165 files · ~48,336 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 645 nodes · 609 edges · 129 communities (42 shown, 87 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `90a968ec`
- Run `2brain check /target-repo` to check if the graph is stale.
- Run `2brain /target-repo` after code changes.

## Community Hubs (Navigation)
- Project Documentation & Conventions
- Package Metadata
- Mutation Testing Config
- NPM Build Scripts
- TypeScript Base Config
- Mutation Baseline Tracking
- Package Keywords & Tags
- CJS Build Config
- ESM Build Config
- Testing Infrastructure
- Collection Utility Functions
- Test TypeScript Config
- Type Testing Config
- Time Formatting Utilities
- ESLint TypeScript Config
- Dev Dependencies
- Type Declaration Guard
- Prettier Formatting Config
- File Size Formatting
- Smoke Test Script
- Form Data Conversion
- Cookie Management
- DOM Utility Functions
- Currency Formatting
- String Matching Utilities
- UUID Generation
- Time Conversion Utilities
- Type Export Validation
- Numeric Property Tests
- String Property Tests
- File Type Validation
- Cookie Operations
- Husky Hook Script
- Build Script
- Error Message Extraction
- Commit Linting
- Type Export Checking
- File Validation
- DOM Viewport Utilities
- Form Value Utilities
- DOM Traversal Utilities
- JSON Parsing Utilities
- Text Formatting
- ESLint
- ESLint Prettier Config
- ESLint JS Rules
- ESLint JSDoc Plugin
- ESLint Prettier Plugin
- ESLint Unicorn Plugin
- Type Assertion Testing
- Property-Based Testing
- ESLint Globals
- Git Hook Manager
- Apply Patch Hook
- Commit Message Hook
- Commit Message Hook
- Husky Shell Script
- Post Apply Patch Hook
- Post Checkout Hook
- Post Commit Hook
- Post Merge Hook
- Post Rewrite Hook
- Pre Apply Patch Hook
- Pre Auto GC Hook
- Pre Commit Hook
- Pre Commit Hook
- Pre Merge Commit Hook
- Pre Push Hook
- Pre Rebase Hook
- Prepare Commit Hook
- Jest Test Runner
- Jest JSdom Environment
- Mermaid Diagrams
- NPM Dependency Updates
- Prettier Formatter
- Package Publishing Lint
- Mutation Testing Core
- Stryker Jest Runner
- Stryker TypeScript Checker
- TypeScript Jest Transformer
- Jest Type Definitions
- Node Type Definitions
- TypeScript ESLint Plugin
- TypeScript ESLint Parser
- VitePress Documentation
- VitePress Mermaid Plugin
- Cookie Setting
- URL Query Management
- File Type Testing
- Clipboard Copy
- Blob Download
- Form Data
- DOM Append Children
- Event Delegation
- Node List Formatting
- Iframe Access
- Error Message Extraction
- UUID Generation
- Execution Time Tracking
- Security Scanning
- arrayColumns function
- arrayDepth function
- associativeSlice function
- boilerplate-node-backend (consumer)
- boilerplate-vue-frontend (consumer)
- canonicalize function
- coerceStringArray function
- getCookie
- setCookie
- docs/.vitepress/config.mts
- eslint.config.mjs
- formatCurrency function
- IFormatCurrencyOptions interface
- NO_CURRENCY_FORMAT constant
- @guebbit/vue-toolkit (consumer)
- PLAN_FORMAT_CURRENCY.md — formatCurrency Fix Plan
- README.md — Package Overview
- src/formatCurrency.ts
- src/index.ts (barrel export)
- tests/formatCurrency.test.ts
- vue-toolkit (consumer)
- WELL_FORMED_CURRENCY regex

## God Nodes (most connected - your core abstractions)
1. `scripts` - 23 edges
2. `keywords` - 13 edges
3. `compilerOptions` - 13 edges
4. `DOM` - 11 edges
5. `Plan: `formatCurrency` — the currency's own decimals, and a fallback scoped to its purpose` - 10 edges
6. `Browser platform` - 10 edges
7. `compilerOptions` - 8 edges
8. `compilerOptions` - 8 edges
9. `Arrays and objects` - 7 edges
10. `Getting Started` - 7 edges

## Surprising Connections (you probably didn't know these)
- `CI Workflow` --conceptually_related_to--> `CLAUDE.md — Project Conventions`  [INFERRED]
  .github/workflows/ci.yml → CLAUDE.md
- `Docs Deploy Workflow` --references--> `VitePress Home Page`  [INFERRED]
  .github/workflows/docs.yml → docs/index.md
- `Nightly Property-Fuzz Workflow` --conceptually_related_to--> `mutation-baseline.json`  [INFERRED]
  .github/workflows/nightly.yml → CLAUDE.md
- `CI Workflow` --references--> `mutation-baseline.json`  [EXTRACTED]
  .github/workflows/ci.yml → CLAUDE.md
- `Release Workflow` --references--> `CHANGELOG`  [EXTRACTED]
  .github/workflows/release.yml → CLAUDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **formatCurrency fix: plan → source → tests → changelog → release** — plan_format_currency_md, src_format_currency_ts, tests_format_currency_test_ts, changelog, github_workflows_release_yml [EXTRACTED 0.90]
- **CI quality gate: lint, typecheck, build, test, mutation, docs, audit** — github_workflows_ci_yml, eslint_config_mjs, mutation_baseline_json, package_json, commitlint_config_cjs [EXTRACTED 0.85]
- **@guebbit/js-toolkit consumer ecosystem** — npm_guebbit_js_toolkit, npm_guebbit_vue_toolkit, boilerplate_vue_frontend, boilerplate_node_backend, vue_toolkit [EXTRACTED 0.90]
- **URL Query Roundtrip Pair** — docs_api_browser_platform_geturlqueries, docs_api_browser_platform_seturlqueries [EXTRACTED 0.95]
- **Time Conversion Roundtrip Pair** — docs_api_time_secondstotime, docs_api_time_timetoseconds [EXTRACTED 0.95]

## Communities (129 total, 87 thin omitted)

### Community 1 - "Project Documentation & Conventions"
Cohesion: 0.29
Nodes (7): CLAUDE.md — Project Conventions, commitlint.config.cjs, Dependabot Configuration, CI Workflow, Nightly Property-Fuzz Workflow, mutation-baseline.json, package.json

### Community 2 - "Package Metadata"
Cohesion: 0.05
Nodes (36): author, bugs, url, description, engines, node, files, homepage (+28 more)

### Community 3 - "Mutation Testing Config"
Cohesion: 0.07
Nodes (29): clear-text, html, json, progress, !src/index.ts, src/**/*.ts, checkers, concurrency (+21 more)

### Community 4 - "NPM Build Scripts"
Cohesion: 0.09
Nodes (23): scripts, build, check:clean, complete, complete:check, docs:build, docs:dev, docs:preview (+15 more)

### Community 5 - "TypeScript Base Config"
Cohesion: 0.09
Nodes (21): dom.iterable, es2022, node_modules, compilerOptions, allowSyntheticDefaultImports, baseUrl, esModuleInterop, isolatedModules (+13 more)

### Community 6 - "Mutation Baseline Tracking"
Cohesion: 0.12
Nodes (13): added, baseline, baselinePath, improvements, inCI, initialising, measured, missingInCI (+5 more)

### Community 8 - "CJS Build Config"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, declarationMap, module, moduleResolution, noEmit, outDir, sourceMap (+4 more)

### Community 9 - "ESM Build Config"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, declarationMap, module, moduleResolution, noEmit, outDir, sourceMap (+4 more)

### Community 10 - "Testing Infrastructure"
Cohesion: 0.29
Nodes (6): formatCurrency, getDelta, getMapDistance, getOverlapRange, Numbers and ranges, rangeOverlaps

### Community 11 - "Collection Utility Functions"
Cohesion: 0.17
Nodes (5): arrayColumns(), arrayDepth(), canonicalize(), item, list

### Community 12 - "Test TypeScript Config"
Cohesion: 0.17
Nodes (11): compilerOptions, noEmit, types, exclude, extends, include, jest, node (+3 more)

### Community 13 - "Type Testing Config"
Cohesion: 0.18
Nodes (10): tests/types, compilerOptions, noEmit, rootDir, types, extends, include, node (+2 more)

### Community 14 - "Time Formatting Utilities"
Cohesion: 0.29
Nodes (5): IFormatDurationOptions, TDurationUnit, UNITS, factors, ISecondsToTimeMap

### Community 15 - "ESLint TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, types, extends, include, jest, node, src, tests (+1 more)

### Community 16 - "Dev Dependencies"
Cohesion: 0.22
Nodes (9): @arethetypeswrong/cli, eslint-plugin-prettier, npm-check-updates, devDependencies, @arethetypeswrong/cli, eslint-plugin-prettier, npm-check-updates, typescript-eslint (+1 more)

### Community 17 - "Type Declaration Guard"
Cohesion: 0.22
Nodes (7): cjsRoot, esmRoot, failures, missingFromCjs, missingFromEsm, NODE_IMPORT_ALLOWED, root

### Community 18 - "Prettier Formatting Config"
Cohesion: 0.25
Nodes (7): printWidth, $schema, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 19 - "File Size Formatting"
Cohesion: 0.29
Nodes (5): BINARY_UNITS, DECIMAL_UNITS, IFormatFileSizeOptions, TFileSizeUnit, fakeFile

### Community 20 - "Smoke Test Script"
Cohesion: 0.29
Nodes (4): frozenExports, pkg, root, temporary

### Community 21 - "Form Data Conversion"
Cohesion: 0.33
Nodes (3): toFormData(), queryKey, queryValue

### Community 24 - "Currency Formatting"
Cohesion: 0.25
Nodes (4): IFormatCurrencyOptions, NO_CURRENCY_FORMAT, IFormatDateTimeOptions, [start, end]

### Community 27 - "Time Conversion Utilities"
Cohesion: 0.29
Nodes (6): formatDateTime, formatDuration, getExecTime, secondsToTime, Time, timeToSeconds

### Community 29 - "Numeric Property Tests"
Cohesion: 0.50
Nodes (3): circumference, coordinate, range

### Community 30 - "String Property Tests"
Cohesion: 0.50
Nodes (3): anyString, nonEmpty, shortString

### Community 37 - "Type Export Checking"
Cohesion: 0.10
Nodes (20): API Docs — Arrays and Objects, Browser and Node, ESM vs CommonJS, Getting Started, Install, Subpath imports and `moduleResolution`, Usage, What the formatters throw (+12 more)

### Community 38 - "File Validation"
Cohesion: 0.18
Nodes (10): Browser platform, copyToClipboard, downloadBlob, formatFileSize, getCookie / setCookie / deleteCookie, getUrlQueries, isAcceptedFileType, isWithinFileSize (+2 more)

### Community 39 - "DOM Viewport Utilities"
Cohesion: 0.17
Nodes (11): appendChildren, DOM, eventDelegate, formatNodeList, getElementCenter, getForm, getIframe, getIndex (+3 more)

### Community 40 - "Form Value Utilities"
Cohesion: 0.18
Nodes (10): Change, Consumers (checked across `~/Work/Guebbit`, 2026-09-28), Design, Goal, Not in this change: needs your call, Plan: `formatCurrency` — the currency's own decimals, and a fallback scoped to its purpose, Steps, Tests (`tests/formatCurrency.test.ts`, or `.spec.ts` if the other plan's Phase 1 renames have landed) (+2 more)

### Community 41 - "DOM Traversal Utilities"
Cohesion: 0.20
Nodes (9): Async and error handling, Code layout, Commenting external calls, Comments, Function design, Scope, Tests, TypeScript (+1 more)

### Community 42 - "JSON Parsing Utilities"
Cohesion: 0.50
Nodes (3): getJson, isJson, JSON

### Community 43 - "Text Formatting"
Cohesion: 0.29
Nodes (6): formatFlag, formatText, getUuid, levenshteinDistance, match, Strings

### Community 48 - "ESLint Prettier Plugin"
Cohesion: 0.22
Nodes (9): exports, ./internal/*, ./package.json, import, default, types, require, default (+1 more)

### Community 74 - "NPM Dependency Updates"
Cohesion: 0.25
Nodes (7): arrayChunks, arrayColumns, arrayDepth, Arrays and objects, associativeSlice, canonicalize, coerceStringArray

### Community 93 - "Clipboard Copy"
Cohesion: 0.25
Nodes (7): API, Browser and Node, Contributing, @guebbit/js-toolkit, Install, License, Usage

### Community 94 - "Blob Download"
Cohesion: 0.67
Nodes (3): CHANGELOG, Release Workflow, @guebbit/js-toolkit (npm package)

## Knowledge Gaps
- **344 isolated node(s):** `husky.sh script`, `$schema`, `semi`, `tabWidth`, `singleQuote` (+339 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **87 thin communities (<3 nodes) omitted from report** — run `2brain query /target-repo "..."` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies` to `Package Metadata`, `Package Keywords & Tags`, `Commit Linting`, `ESLint`, `ESLint Prettier Config`, `ESLint JS Rules`, `ESLint JSDoc Plugin`, `ESLint Unicorn Plugin`, `Type Assertion Testing`, `Property-Based Testing`, `ESLint Globals`, `Git Hook Manager`, `Jest Test Runner`, `Jest JSdom Environment`, `Mermaid Diagrams`, `Prettier Formatter`, `Package Publishing Lint`, `Mutation Testing Core`, `Stryker Jest Runner`, `Stryker TypeScript Checker`, `TypeScript Jest Transformer`, `Jest Type Definitions`, `Node Type Definitions`, `TypeScript ESLint Plugin`, `TypeScript ESLint Parser`, `VitePress Documentation`, `VitePress Mermaid Plugin`, `DOM Append Children`, `Iframe Access`, `UUID Generation`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `scripts` connect `NPM Build Scripts` to `Package Metadata`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `semi` to the rest of the system?**
  _344 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Utility Helper Functions` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `Package Metadata` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `Mutation Testing Config` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `NPM Build Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._