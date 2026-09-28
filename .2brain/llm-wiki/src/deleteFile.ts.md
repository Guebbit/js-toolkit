---
source: src/deleteFile.ts
sha256: 02c1e8d1452d0358787fb2cc1b782cbab440906f632ac64f17c95eb213fb91ef
generated_at: 2026-09-28T18:21:53.424567+00:00
model: ollama:qwen3.8:27b
---

# src/deleteFile.ts

## Purpose

Provides a single, fire-and-forget file deletion helper that **never rejects**. It exists so callers can attempt to remove a file without wrapping the call in `try/catch` or handling a rejected promise — success is a `true`/`false` resolution, and optional failure reporting is handled via a callback.

## Key elements

- **`export default (filePath: string, onError?: (error: Error) => void): Promise<boolean>`** — The only export. Chain: `fs.stat` → `fs.unlink` → `true`. In the `.catch` branch, an `ENOENT` code silently yields `false`; any other error invokes `onError` (if provided) and also returns `false`.

## Relationships

- **`src/index.ts`** — Imports this default export to perform file deletion as part of its broader workflow.

## Notes

- "Missing file" and "real I/O error" are indistinguishable by the boolean return; the only channel that separates them is the `onError` callback. A caller that omits `onError` gets no signal about _why_ deletion didn't happen.
- The `ENOENT` check reads `error.code` after a cast, because Node's `fs` rejects with `Error & { code: string }` rather than a typed subclass.
- `fs.stat` is used only as a gate; the actual deletion is `fs.unlink`. There is no race-safety beyond that two-step sequence.
