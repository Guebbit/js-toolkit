---
source: tests/isAcceptedFileType.spec.ts
sha256: c7efa720d75e3c6221d223d427c1810630f96153a6d195ce042132e515560bf2
generated_at: 2026-09-28T19:51:55.093745+00:00
model: ollama:qwen3.8:27b
---

# tests/isAcceptedFileType.spec.ts

## Purpose

Unit test suite for the `isAcceptedFileType` helper (exported from `src/index.ts`). It verifies that a file's declared MIME type is correctly accepted or rejected against a list of allowed types, covering basic membership, case-sensitivity, wildcard syntax, and edge cases like empty types and empty accept lists.

## Key elements

- **`IMAGES`** — shared fixture array of image MIME types used as the accept list in most tests.
- **Main describe block** — covers: accepting a listed type, rejecting an unlisted type, default case-insensitivity (citing RFC 2045), strict `caseSensitive: true` mode, rejecting an empty `type` string, and rejecting everything when the accept list is empty.
- **`wildcards` describe block** — verifies `image/*` matches any subtype but not a different top-level type, and `*/*` matches everything.
- **Spacing tolerance test** — confirms leading spaces left over from splitting an `accept` attribute on commas are handled.
- **Empty-entry tests** — empty or whitespace-only entries in the accept list never match.
- **Prefix-rejection tests** — ensures `image/*` is a whole-segment match (not a prefix) and that exact entries like `image/png` do not match `image/png2`.

## Relationships

- **`src/index.ts`** — the sole import target; exports the `isAcceptedFileType(file, acceptList, options?)` function under test. The test exercises its public API contract (accepted/rejected, case handling, wildcard semantics, `caseSensitive` option) without mocking.

## Notes

- Default behavior is **case-insensitive** (both the file type and the accept entries are lowercased for comparison); passing `{ caseSensitive: true }` opts into verbatim comparison to mirror a strict server.
- A file with an empty or missing `type` is rejected **even** against `*/*` — the catch-all does not override the "unknown type" guard.
- Wildcard `image/*` matches the **entire** type segment, not a prefix: `imagex/png` and `illustration/svg` do **not** match.
- The test suite implicitly documents that the accept list is expected to be pre-split (e.g., `accept.split(',')`), since spacing and empty-entry handling are tested here rather than in a parsing step.
