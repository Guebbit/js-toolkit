# Browser platform

Clipboard, downloads, cookies, query strings, `FormData`, and the client-side file checks that
save a user waiting out an upload only to be told no.

## copyToClipboard

```ts
copyToClipboard(text: string): Promise<boolean>
```

Copy a string to the clipboard. Uses the async Clipboard API when available (a secure context),
and falls back to a hidden, off-screen `<textarea>` selected and copied via `document.execCommand`
otherwise. Never throws — resolves `false` on failure instead, since a clipboard write should never
crash the caller.

## downloadBlob

```ts
downloadBlob(data: Blob | BlobPart, filename: string, type?: string): void
```

Trigger a client-side file download — the browser has no direct "save this Blob" API, so this
fakes a click on an off-DOM anchor pointed at an object URL, then revokes the URL right after so
the buffered data doesn't outlive the download. `data` is wrapped in a `Blob` (using `type`,
default `'text/plain'`) unless it already is one. `filename` is the name the browser suggests for
the saved file.

## getCookie / setCookie / deleteCookie

```ts
getCookie(name: string): string | undefined
setCookie(name: string, value: string, options?: ISetCookieOptions): void
deleteCookie(name: string, path?: string, domain?: string): void
```

Read, write and remove cookies. `document.cookie` is one string of `name=value` pairs joined by
`'; '` — there is no lookup-by-name or delete API, so `getCookie` splits and matches by hand, and
`deleteCookie` removes a cookie the only way the platform allows: rewriting it with the same name,
path (default `'/'`) and domain but an already-expired date.

`ISetCookieOptions`:

| Field      | Type                          | Default | Purpose                                      |
| ---------- | ----------------------------- | ------- | -------------------------------------------- |
| `days`     | `number`                      | —       | days until expiry; omit for a session cookie |
| `path`     | `string`                      | —       | path the cookie is scoped to                 |
| `domain`   | `string`                      | —       | domain the cookie is scoped to               |
| `secure`   | `boolean`                     | —       | only send the cookie over HTTPS              |
| `sameSite` | `'Strict' \| 'Lax' \| 'None'` | —       | cross-site sending policy                    |

```ts
setCookie('theme', 'dark', { days: 7 })
getCookie('theme') // 'dark'
deleteCookie('theme')
```

## getUrlQueries

```ts
getUrlQueries(
    search?: string | URLSearchParams,
    arraySeparator?: string | false
): Record<string, string | string[]>
```

Parse a query string into a plain object, built on `URLSearchParams`. A key becomes an array if it
appears more than once, or if `arraySeparator` (default `','`; pass `false` to disable) splits its
value into more than one piece — otherwise it collapses to a plain string. `search` defaults to
`location.search`, and to `''` where there is no `location` (Node). Framework-agnostic: hand it any
router's query string.

```ts
getUrlQueries('?tags=a,b&page=2') // { tags: ['a', 'b'], page: '2' }
```

## setUrlQueries

```ts
setUrlQueries(
    query: Record<string, QueryValue>,
    merge?: string | URLSearchParams | false,
    arraySeparator?: string
): string
```

Build a query string from a plain object, via `URLSearchParams`. `undefined`/`null`/`''`/an empty
array are dropped — or removed from `merge` (default `false`), if given, whose other keys are kept
unless overwritten. Array values are joined with `arraySeparator` (default `','`). Returns a plain
string to pass to any router, or to apply with `history.replaceState`/`pushState`.

```ts
setUrlQueries({ tags: ['a', 'b'], page: 2 }) // 'tags=a%2Cb&page=2'
```

## toFormData

```ts
toFormData(object: Record<string, unknown>, form?: FormData, namespace?: string): FormData
```

Flatten a plain object into `FormData`, for a multipart request. Nested objects and arrays are
namespaced with PHP-style brackets, so `{ user: { tags: ['a'] } }` becomes the key
`user[tags][0]`. `Blob` and `File` values are appended whole rather than walked into — `File`
extends `Blob`, so checking for `Blob` covers both without missing a plain `Blob` (what
`canvas.toBlob()` or `fetch().blob()` hand you).

## formatFileSize

```ts
formatFileSize(bytes: number, options?: IFormatFileSizeOptions): string
```

Render a byte count the way a person reads one — `'5 MB'`, `'1.5 MB'`, `'512 KB'` — picking the
largest unit that keeps the value at least 1 (or the unit `options.unit` forces). Trailing zeroes
are stripped, so a round number stays round. `bytes` below `0` is treated as `0`.

`IFormatFileSizeOptions`:

| Field      | Type            | Default | Purpose                                                                                                                                      |
| ---------- | --------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `decimals` | `number`        | `1`     | digits after the decimal point, trailing zeroes stripped                                                                                     |
| `binary`   | `boolean`       | `true`  | binary units (1 KB = 1024 B, what an OS reports) or decimal (1 kB = 1000 B)                                                                  |
| `unit`     | `TFileSizeUnit` | —       | always render in this unit instead of picking the fitting one — for a column of sizes where a per-row unit makes two numbers hard to compare |

```ts
formatFileSize(5_242_880) // '5 MB'
formatFileSize(1_500_000, { binary: false }) // '1.5 MB'
```

## isAcceptedFileType

```ts
isAcceptedFileType(
    file: { type: string },
    accepted: readonly string[],
    options?: IIsAcceptedFileTypeOptions
): boolean
```

Whether a file's declared mime type is one of the `accepted` ones — the same list a file input's
`accept` attribute takes, wildcards (`'image/*'`) included. A UX affordance, never a security
control: the type is whatever the _browser_ declared, and a server must re-check the actual bytes
regardless.

`IIsAcceptedFileTypeOptions`: `caseSensitive?: boolean` (default `false`). Case-insensitive is the
correct reading per RFC 2045 — turn this on only to mirror a server that compares verbatim.

## isWithinFileSize

```ts
isWithinFileSize(file: { size: number }, maxBytes: number): boolean
```

Whether a file is no larger than `maxBytes`. Like [`isAcceptedFileType`](#isacceptedfiletype), a
UX affordance rather than a control. A `maxBytes` of `0` or less means "no limit" — so a
misconfigured maximum accepts everything instead of rejecting everything.
