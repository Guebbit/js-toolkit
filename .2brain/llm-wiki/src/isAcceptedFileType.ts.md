---
source: src/isAcceptedFileType.ts
sha256: 100416102f1355e333552eb9205915c0e2de4273d37d17acfef0a02dec43b68e
generated_at: 2026-09-28T19:40:23.420839+00:00
model: ollama:qwen3.8:27b
---

# src/isAcceptedFileType.ts

## Purpose

Provides a single function that checks whether a file's declared MIME type matches an entry in a file input's `accept` list. Exists to give an early, client-side "this won't be accepted" signal before a user waits out an upload that the server would reject.

## Key elements

- **`IIsAcceptedFileTypeOptions`** – Options interface with a single `caseSensitive` flag (default `false`). When `true`, comparison is verbatim; when `false` (default), both sides are lowercased per RFC 2045.
- **default export** – `(file: { type: string }, accepted: readonly string[], options?) => boolean`. Matches the file's MIME type against the accepted list, supporting exact matches, `type/*` wildcards, and the universal `*/*`. Returns `false` for an empty/missing `file.type`.

## Relationships

- **`src/index.ts`** – Re-exports the default function and `IIsAcceptedFileTypeOptions` as part of the package's public API surface.

## Notes

- Explicitly **not** a security control. The MIME type is whatever the browser reports; a server must still validate actual file bytes. This function only prevents a wasted upload.
- `caseSensitive: true` exists solely to mirror a server that compares verbatim. The doc comment warns that enabling it can cause the client to _accept_ a file the server rejects (e.g. `IMAGE/PNG` vs `image/png`), which is worse than rejecting early.
- Patterns in the `accepted` array are trimmed before comparison, so stray whitespace in an `accept` attribute value is tolerated.
