---
source: src/isWithinFileSize.ts
sha256: 7933c8c5c39f2d305e1a268129852edb3c247271344b4637b05b32673a7115ed
generated_at: 2026-09-28T19:41:01.687651+00:00
model: ollama:qwen3.8:27b
---

# src/isWithinFileSize.ts

## Purpose

A single pure predicate that checks whether a file-like object's `size` is within a caller-supplied byte limit. It exists as a client-side fail-fast guard so oversized files are rejected before any network upload begins; the server remains the authoritative enforcer.

## Key elements

- **`default` (arrow function)** — `(file: { size: number }, maxBytes: number): boolean`. Returns `true` when `maxBytes <= 0` (meaning "no limit") or when `file.size <= maxBytes`. No imports; depends only on the structural `{ size: number }` shape, so it works on `File`, `Blob`, or any custom object exposing `size`.

## Relationships

- **`src/index.ts`** — Barrel / public API file. Re-exports this module (likely alongside the sibling `isAcceptedFileType`) so consumers import from the package root rather than reaching into individual source files.

## Notes

- A `maxBytes` value of **0 or negative is treated as "no limit"** (always returns `true`). This is an intentional convention so that a missing or misconfigured maximum degrades to "accept everything" rather than silently rejecting all uploads.
- The function is deliberately structural-typed (`{ size: number }`) instead of accepting `File` or `Blob`, keeping it usable in non-DOM contexts (tests, server-side checks, custom uploaders).
- This is a **UX affordance, not a security boundary**. Do not rely on it as the sole size gate; server-side limits are the real enforcement point.
