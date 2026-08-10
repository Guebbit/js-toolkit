# @guebbit/js-toolkit

Small, dependency-free TypeScript helpers for the things that keep coming up: array and object
reshaping, string matching, ranges and distances, time conversion, cookies, query strings, and the
DOM chores that predate a framework.

Every function is a default export of its own module and is re-exported by name from the package
root. Nothing here wraps a library — if lodash already does it well, it is not in this toolkit.

- No runtime dependencies
- TypeScript throughout, with the types published
- `sideEffects: false`, so a bundler drops what you do not import
- Works from CommonJS and ESM

## Install

```sh
npm install @guebbit/js-toolkit
```

## Usage

```ts
import { arrayChunks, getMapDistance, match, setUrlQueries } from '@guebbit/js-toolkit'

arrayChunks(['a', 'b', 'c', 'd', 'e'], 2) // [['a', 'b', 'c'], ['d', 'e']]
getMapDistance(0, 3, 0, 4) // 5
match('Ipsum', 'lorem ipsum sit') // true  — case-insensitive substring by default
setUrlQueries({ tags: ['a', 'b'], page: 2 }) // 'tags=a%2Cb&page=2'
```

CommonJS works the same way:

```js
const { arrayChunks } = require('@guebbit/js-toolkit')
```

The package is compiled to CommonJS. Named ESM imports work through Node's static detection of
CommonJS exports, which the packaging test exercises on every build.

### Browser and Node

Most helpers are environment-agnostic. The DOM helpers need a `document` (a browser or jsdom), and
`deleteFile` is Node-only — it is the single module that imports `node:fs/promises`. Because each
helper is its own module and the package is side-effect free, importing the pure ones from a
server bundle does not drag the DOM ones in.

## API

### Arrays and objects

| Signature                                                                                   | What it does                                                                                                                                                |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `arrayChunks<T>(array: T[], n: number): T[][]`                                              | Split into `n` sub-arrays whose lengths differ by at most one.                                                                                              |
| `arrayColumns(haystack: Record<string, unknown>[], columns: string \| string[]): unknown[]` | PHP's `array_column`, extended to several columns. One entry per row, always.                                                                               |
| `arrayDepth<T>(check: T \| T[]): number`                                                    | Nesting depth. `0` for a non-array.                                                                                                                         |
| `associativeSlice(object, start: number, end: number): Record<string, unknown>`             | `Array.prototype.slice` for an object's own keys, in insertion order.                                                                                       |
| `coerceStringArray(value?: unknown): string[]`                                              | Any value to a trimmed `string[]`. Splits comma-separated strings, drops blanks.                                                                            |
| `canonicalize(value: unknown, throwOnCircular?: boolean): unknown`                          | Recursively sorts object keys so `JSON.stringify` of the result is a stable cache key. Arrays keep their order, `undefined` is dropped, `Date` becomes ISO. |

### Strings

| Signature                                               | What it does                                                                                                                                 |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `isEmail(string: string): boolean`                      | Anchored e-mail check, including quoted local parts and IPv4 literals.                                                                       |
| `isUrl(string: string): boolean`                        | URL check with optional protocol, port, path, query and fragment.                                                                            |
| `levenshteinDistance(a?, b?): number`                   | Edit distance. `999` when both sides are absent — "nothing to compare", not "identical".                                                     |
| `match(check?, match?, sensitive?, distance?): boolean` | Fuzzy compare. `distance` selects the mode: `-2` two-way substring, `-1` one-way substring (default), `0` exact, `1+` maximum edit distance. |
| `getUuid(): string`                                     | `crypto.randomUUID()` where available, timestamp + random otherwise. Not for cryptographic use.                                              |

### Numbers and ranges

| Signature                                                                               | What it does                                                                                                                                   |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `getDelta(a: number, b: number, size?: number): number`                                 | Distance between two numbers. With a positive `size` they sit on a wrapping space and the shorter way around wins, never more than `size / 2`. |
| `getMapDistance(Xa, Xb, Ya, Yb, size?): number`                                         | Euclidean distance between two points; with a positive `size` both axes wrap.                                                                  |
| `rangeOverlaps(firstStart, firstEnd, secondStart, secondEnd, sameUnitOverlap?): number` | Number of overlapping units, `0` when disjoint.                                                                                                |
| `getOverlapRange(firstStart, firstEnd, secondStart, secondEnd): [number, number]`       | The intersection itself. `[0, 0]` when there is none; touching ranges do not count.                                                            |

### Time

| Signature                                                                         | What it does                                                                          |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `secondsToTime(time?: number): ISecondsToTimeMap`                                 | Milliseconds to every unit at once, both depleting (`hours`) and total (`hoursOnly`). |
| `timeToSeconds(date?: string, delimiter?: string): number`                        | `'HH:MM:SS:ms'` to milliseconds. Components may be omitted from the right.            |
| `getExecTime<T>(fn: () => T \| Promise<T>): Promise<{ result: T; time: number }>` | Time a sync or async function, resolving with its result and elapsed milliseconds.    |

### JSON

| Signature                                                    | What it does                                                           |
| ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `getJson(json?: string): unknown`                            | Parse any JSON value, `undefined` if empty or invalid.                 |
| `isJson<T>(test: string): Record<string, T> \| T[] \| false` | Parse a JSON **structure**, `false` for a bare value or invalid input. |

Neither writes to the console — the return value is the report.

### DOM

| Signature                                                                                      | What it does                                                                        |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `appendChildren(element, ...children): HTMLElement \| Element`                                 | `appendChild` for arrays, through one document fragment.                            |
| `eventDelegate(eventName, childSelector, callback, parent?): void`                             | Delegated listener; `this` inside the callback is the matched child.                |
| `formatNodeList(elementsArray?): HTMLElement[]`                                                | Any element, array, `NodeList` or `HTMLCollection` to a plain static array.         |
| `getElementCenter(element: Element): number[]`                                                 | `[x, y]` centre from the bounding rect.                                             |
| `getForm(form: HTMLElement \| null, selectors?): Record<string, unknown>`                      | Every named field's value, keyed by `name`.                                         |
| `getIframe(iframe?): HTMLElement \| HTMLBodyElement \| undefined`                              | The iframe document's `body`, `undefined` if unreachable.                           |
| `getIndex(element: HTMLElement \| null): number`                                               | jQuery's `.index()`. `-1` when there is no parent.                                  |
| `getSiblings(element): Element[]`                                                              | jQuery's `.siblings()`.                                                             |
| `getValue(element: HTMLElement \| null, attribute?): string \| number \| boolean \| undefined` | Value of an input, textarea, select, checkbox, radio group, attribute or text node. |
| `isInViewport(element: Element, fully?: boolean): boolean`                                     | Partially, or entirely, inside the viewport.                                        |

### Browser platform

| Signature                                                                                     | What it does                                                                                                                                    |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `copyToClipboard(text: string): Promise<boolean>`                                             | Clipboard API where available, hidden-textarea fallback otherwise.                                                                              |
| `downloadBlob(data: Blob \| BlobPart, filename: string, type?): void`                         | Trigger a client-side download.                                                                                                                 |
| `getCookie(name)` / `setCookie(name, value, options?)` / `deleteCookie(name, path?, domain?)` | Read, write and remove cookies. Options: `days`, `path`, `domain`, `secure`, `sameSite`.                                                        |
| `getUrlQueries(search?, arraySeparator?): Record<string, string \| string[]>`                 | Parse a query string. Repeated or separator-joined keys become arrays. Defaults to `location.search`, and to `''` where there is no `location`. |
| `setUrlQueries(query, merge?, arraySeparator?): string`                                       | Build a query string. Empty values are dropped, or removed from `merge`.                                                                        |
| `toFormData(object, form?, namespace?): FormData`                                             | Object to `FormData`, nesting as `a[b][c]`. `Blob` and `File` are appended whole.                                                               |

Both query helpers are framework-agnostic: hand them any router's query string, or apply the result
with `history.replaceState`.

### Node

| Signature                                                  | What it does                                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `deleteFile(filePath: string, onError?): Promise<boolean>` | Delete a file. Resolves `false` if it did not exist; `onError` fires for any other failure. |

### Exported types

`ISecondsToTimeMap` (the shape `secondsToTime` returns) and `ISetCookieOptions` (the third argument
to `setCookie`) are both importable from the package root.

## Contributing

```sh
npm run complete:check   # lint, format, typecheck, build, test
npm test                 # unit, property and type tests
npm run test:pack        # packaging smoke test
npm run test:mutation    # mutation testing
```

The suite is layered — unit, property-based, type-level, packaging and mutation — and each layer
catches something the others cannot. [TESTING.md](TESTING.md) explains what each one is for, how
the per-file mutation baseline gate works, and why some surviving mutants are left alone on
purpose.

## License

AGPL-3.0. See [LICENSE](LICENSE).
