# Strings

Fuzzy matching, edit distance, id generation, and plain-text display formatting.

## levenshteinDistance

```ts
levenshteinDistance(a?: string | null, b?: string | null): number
```

Number of single-character edits needed to turn one string into the other — the classic
Wagner–Fischer dynamic-programming edit distance. A true metric: never negative, symmetric, zero
exactly when the two are equal, and obeys the triangle inequality. `undefined`/`null` are treated
as the empty string, so comparing two absent values is `0` — they really are identical.

```ts
levenshteinDistance('kitten', 'sitting') // 3
levenshteinDistance(undefined, undefined) // 0
```

## match

```ts
match(check?: string, against?: string, options?: IMatchOptions): boolean
```

Compare two strings under one of several rules. Both sides are trimmed first, and lowercased unless
`sensitive` is set. Equality satisfies every mode.

`IMatchOptions`:

| Field         | Type         | Default       | Purpose                                        |
| ------------- | ------------ | ------------- | ---------------------------------------------- |
| `sensitive`   | `boolean`    | `false`       | compare with case sensitivity                  |
| `mode`        | `TMatchMode` | `'contained'` | which rule decides a match — see below         |
| `maxDistance` | `number`     | `0`           | maximum edit distance accepted in `fuzzy` mode |

`TMatchMode`:

| Mode        | True when                                       |
| ----------- | ----------------------------------------------- |
| `exact`     | the two are equal                               |
| `contains`  | `check` contains `against`                      |
| `contained` | `check` is contained in `against` — the default |
| `either`    | one contains the other, whichever way round     |
| `fuzzy`     | their edit distance is at most `maxDistance`    |

```ts
match('Ipsum', 'lorem ipsum') // true   — default 'contained'
match('lorem ipsum', 'Ipsum', { mode: 'contains' }) // true
match('lorem ipsum', 'lorem ispum', { mode: 'fuzzy', maxDistance: 2 }) // true
```

## getUuid

```ts
getUuid(): string
```

A random RFC 4122 version 4 UUID. Uses `crypto.randomUUID` where available, and falls back to
building the same shape by hand from `crypto.getRandomValues` when it is missing (a browser on a
non-secure origin omits `randomUUID`, even though its type declares it always present). Both
sources draw on the platform CSPRNG — never `Math.random` — but this is not meant for
cryptographic use.

## formatFlag

```ts
formatFlag(
    value: boolean | null | undefined,
    trueLabel: string,
    falseLabel: string,
    empty?: string
): string
```

Render a boolean as one of two already-translated labels, keeping "unset" distinct from "false":
a nullish `value` renders `empty` (default `'—'`) rather than `falseLabel`, since a nullish flag
means nobody has answered the question.

```ts
formatFlag(true, 'Yes', 'No') // 'Yes'
formatFlag(null, 'Yes', 'No') // '—'
formatFlag(null, 'Yes', 'No', 'Not set') // 'Not set'
```

## formatText

```ts
formatText(value?: string | null, empty?: string): string
```

Show a string, or a fallback glyph (default `'—'`) when there is nothing to show. Whitespace counts
as nothing — a value of `'   '` renders as `empty` too, rather than as a blank cell that looks like
a layout bug.

```ts
formatText('Ada') // 'Ada'
formatText('   ') // '—'
formatText(undefined, 'n/a') // 'n/a'
```
