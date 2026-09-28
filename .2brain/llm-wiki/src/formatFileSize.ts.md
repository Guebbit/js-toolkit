---
source: src/formatFileSize.ts
sha256: 59ad6fea61d2c277a754be7b6e3d7e6294caa9b74bc73e308a90757df0354b36
generated_at: 2026-09-28T18:24:17.106716+00:00
model: ollama:qwen3.8:27b
---

# src/formatFileSize.ts

## Purpose

Pure formatting utility that renders a raw byte count as a human-readable string (e.g. `5 MB`, `1.5 MB`) by selecting the appropriate unit and applying a fixed divisor. Exists so callers never have to repeat the unit-selection math inline.

## Key elements

- **`formatFileSize` (default export)** – Takes `bytes` and optional `IFormatFileSizeOptions`; returns a string like `"512 KB"`. Strips trailing zeros, clamps the exponent to the last unit, and treats negative / non-finite input as `0`.
- **`IFormatFileSizeOptions`** – `decimals` (default 1), `binary` (default `true`), and `unit` (force a specific unit, useful for aligned columns or fixed-limit displays).
- **`TFileSizeUnit`** – Union of all valid unit literals from both the binary and decimal arrays.
- **`BINARY_UNITS` / `DECIMAL_UNITS`** – Internal `as const` arrays (`B…TB`) used for both unit labels and as the divisor list; not exported.

## Relationships

- **`src/index.ts`** – Re-exports this module's public API so consumers can import `formatFileSize`, `IFormatFileSizeOptions`, and `TFileSizeUnit` from the package entry point.
- **`tests/types/browser-platform.test-d.ts`** – Static type assertions that verify the exported types (`TFileSizeUnit`, `IFormatFileSizeOptions`) are compatible with the browser platform declarations, catching regressions in the public type surface.

## Notes

- `unit` option is case-sensitive and must match a literal in the _active_ unit list (e.g. `'kB'` only resolves when `binary: false`). An unrecognised value silently falls back to auto-selection rather than producing `NaN`.
- Sizes beyond the last unit (`TB`) are clamped, not overflowed — a 5 TB file still renders as `TB`.
- Trailing-zero stripping is done via `Number(value.toFixed(decimals))`, so `"5.0"` becomes `"5"`.
- The `binary` flag controls both the divisor (1024 vs 1000) and the unit labels (`KB` vs `kB`); there is no mixed mode.
