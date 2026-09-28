# Repo Context

_Canonical 2brain context source for AI editors._

## Core Artifacts
- `.2brain/graphify-out/GRAPH_REPORT.md` — structural and semantic code graph report
- `.2brain/EXECUTION.md` — runnable build/test/CI/migration knowledge
- `.2brain/llm-wiki/` — per-file machine-oriented pages, one per source file (page path = source path + `.md`)
- `.2brain/modules/` — human-oriented module notes, mirrored into Obsidian
- `.2brain/arch/` — component/topic pages with Mermaid diagrams
- `.2brain/repo-index.json` — semantic retrieval index backing `2brain query` (a query backend, not a document to open directly)

## Where to look

- **First contact with an unfamiliar codebase** → `.2brain/llm-wiki/OVERVIEW.md` for orientation, then `.2brain/modules/js-toolkit_INDEX.md` for the module map.
- **Editing or reading a source file** → read `.2brain/llm-wiki/<path>.md` first (page path = source path + `.md`). It carries the file's purpose, key elements, graph neighbours, and gotchas not in the source.
- **"How is this structured?" / "where does X live?"** → `.2brain/arch/overview.md`, then the component page it points to.
- **"How do I run / build / test / deploy this?"** → `.2brain/EXECUTION.md`.
- **Anything else, or you don't know which file** → `2brain query <repo-path> "question"`.

Artifacts describe commit `90a968ec0ab85fafc520828b4a242abf4e0b8b6d`. Before relying on a wiki page, check its source: `git diff --quiet 90a968ec0ab85fafc520828b4a242abf4e0b8b6d -- <file>` (and `git status` for uncommitted edits). Changed → prefer the source for that file and say so. Unchanged → trust the page.

## Most-used code
Change these with care — widely depended on:
- `scripts` (23 edges)
- `keywords` (13 edges)
- `compilerOptions` (13 edges)
- `DOM` (11 edges)
- `Browser platform` (10 edges)
- `compilerOptions` (8 edges)
- `compilerOptions` (8 edges)
- `Arrays and objects` (7 edges)
- `Getting Started` (7 edges)

## Cross-cutting flows
- formatCurrency fix: plan → source → tests → changelog → release
- CI quality gate: lint, typecheck, build, test, mutation, docs, audit
- @guebbit/js-toolkit consumer ecosystem
- URL Query Roundtrip Pair
- Time Conversion Roundtrip Pair

## Index Metadata
- Provider: `ollama`
- Model: `qwen3.8:27b`
- Index revision: `0c059d38fee76716538752c9074af407a9c4738aa8cdf15e8a1c8369764b4411`
- Indexed chunks: `757`
- Memory entries: `0`

## Query
- Semantic query: `2brain query <repo-path> "your question" --top-k 5`
- Add durable memory: `2brain remember <repo-path> "fact/decision/runbook" --kind fact`

