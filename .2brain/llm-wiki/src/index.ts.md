---
source: src/index.ts
sha256: 99eeb78fe00ad4d4d265caaaf99e0e40c1582111dc06eea6b38e954b157aebbe
generated_at: 2026-09-28T19:39:57.134132+00:00
model: ollama:qwen3.8:27b
---

# src/index.ts

## Purpose

Package barrel file. It re-exports every helper's default export under its own name and surfaces a handful of option/result types so consumers can import from a single entry point. The file contains no logic of its own — adding a new public helper means adding one `export` line here.

## Key elements

- **Type re-exports** — `ISecondsToTimeMap`, `ISetCookieOptions`, `IMatchOptions`, `TMatchMode`, `IFormatDateTimeOptions`, `IFormatCurrencyOptions`, `IFormatFileSizeOptions`, `IFormatDurationOptions`, `TDurationUnit`. These are the public option/result types callers need for typed usage.
- **Function re-exports (~50 helpers)** — Each follows the pattern `export { default as <name> } from './<name>.js'`. Grouped loosely by domain:
    - _Array / collection_: `arrayChunks`, `appendChildren`, `arrayColumns`, `arrayDepth`, `associativeSlice`, `canonicalize`, `coerceStringArray`
    - _DOM / UI_: `copyToClipboard`, `deleteFile`, `downloadBlob`, `eventDelegate`, `formatNodeList`, `formatText`, `getElementCenter`, `getForm`, `getIframe`, `getSiblings`, `isInViewport`, `isAcceptedFileType`
    - _Formatting_: `formatCurrency`, `formatDateTime`, `formatDuration`, `formatFileSize`, `formatFlag`
    - _Cookie / URL_: `deleteCookie`, `getCookie`, `setCookie`, `getUrlQueries`, `setUrlQueries`
    - _Data / misc_: `extractErrorMessage`, `getDelta`, `getExecTime`, `getIndex`, `getJson`, `getMapDistance`, `getOverlapRange`, `getUuid`, `getValue`, `isJson`, `isWithinFileSize`, `levenshteinDistance`, `match`, `rangeOverlaps`, `secondsToTime`, `timeToSeconds`, `toFormData`

## Relationships

- **All listed neighbors** (`appendChildren`, `arrayChunks`, `arrayColumns`, `arrayDepth`, `associativeSlice`, `canonicalize`, `coerceStringArray`, `copyToClipboard`, `deleteCookie`, `deleteFile`, `downloadBlob`, `eventDelegate`, `extractErrorMessage`, `formatCurrency`, `formatDateTime`) are re-exported via `export { default as … } from './<name>.js'`. `formatCurrency` and `formatDateTime` additionally contribute their option types (`IFormatCurrencyOptions`, `IFormatDateTimeOptions`) through the type re-exports at the top.
- The file is the sole public entry point; downstream consumers import from this barrel rather than reaching into individual modules.

## Notes

- Every path ends in `.js` (ESM convention) even though the source is `.ts` — do not "fix" this to `.ts`.
- One line per export; the doc comment explicitly states new exports add a line, never logic. There is no conditional export, no side-effect import, no re-export of `*`.
- Not every module in `src/` necessarily appears here; the barrel is curated, not generated.
