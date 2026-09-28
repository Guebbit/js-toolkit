---
source: tests/types/browser-platform.test-d.ts
sha256: 171f1dfaa4356b1842fd3ebdbc361a8c1c4715432dc083ae7aa30839a26014dd
generated_at: 2026-09-28T19:57:37.661687+00:00
model: ollama:qwen3.8:27b
---

# tests/types/browser-platform.test-d.ts

## Purpose

Compile-time type-test for the browser-platform utilities (clipboard, cookies, downloads, query strings, FormData, file checks). It asserts via `expect-type` that every public export has a well-known, non-`any` signature and that specific invalid call sites are rejected by the type system. It guards against silent type regressions without executing any runtime code.

## Key elements

- **`expectTypeOf(...).not.toBeAny()`** (×11) — smoke-checks that each toolkit export (`copyToClipboard`, `downloadBlob`, `getCookie`, `setCookie`, `deleteCookie`, `getUrlQueries`, `setUrlQueries`, `toFormData`, `formatFileSize`, `isAcceptedFileType`, `isWithinFileSize`) is fully typed.
- **Detailed signature assertions** — pin exact parameter types, return types, and option shapes for each function (e.g. `setCookie: (string, string, ISetCookieOptions?) => void`, `getUrlQueries → Record<string, string | string[]>`).
- **`ISetCookieOptions` shape check** — verifies the full optional-field interface and the `sameSite` literal union `'Strict' | 'Lax' | 'None'`.
- **`IFormatFileSizeOptions` usage** — checked through `formatFileSize`'s own signature rather than importing `TFileSizeUnit` directly (see Notes).
- **`fakeFile` from `./_fixtures`** — used as a concrete argument in the `isAcceptedFileType` / `isWithinFileSize` assertions so the expected `boolean` return is verifiable.
- **`@ts-expect-error` block** (×5) — asserts that omitted required params, wrong array-vs-string, and wrong literal types all *fail* type-checking.

## Relationships

- **`src/index.ts`** — the barrel. This file imports `* as toolkit` and the two option types (`IFormatFileSizeOptions`, `ISetCookieOptions`) from it; every assertion ultimately validates the surface the barrel exposes.
- **`src/formatFileSize.ts`** — source of `IFormatFileSizeOptions` and the closed `TFileSizeUnit` union. The comment in this file notes that `TFileSizeUnit` is *not* re-exported from the barrel, so the test goes through the function signature instead.
- **`src/setCookie.ts`** — origin of `ISetCookieOptions`; the test re-declares its full shape to catch accidental field additions/removals.
- **`tests/types/_fixtures.ts`** — supplies `fakeFile`, a typed `File` stub used as an argument in two assertions.

## Notes

- File extension is `.test-d.ts`: it is type-checked by `tsc` (or a `tsd`/`expect-type` runner) and produces **no runtime output**. A failing assertion is a compile error, not a test failure.
- The `@ts-expect-error` lines are intentional. If a corresponding function's parameter becomes optional or its type widens, the directive will itself error (`Unused '@ts-expect-error'`), so they double as "this must stay required/tight" guards.
- `TFileSizeUnit` is deliberately absent from the public barrel; if a consumer needs to name it, they must reach into `src/formatFileSize` directly. The test documents this constraint.
