/**
 * Shared fixtures for the type-level tests. Not itself a `*.test-d.ts` file — no assertions here,
 * just a value the others import.
 */

/**
 * Enough of a `File` for the client-side file checks: they only ever read `type` or `size`, never
 * construct a real `File`.
 */
export const fakeFile: { type: string; size: number } = { type: 'image/png', size: 1024 }
