# JSON

Parsing that reports failure through its return value, never by throwing or writing to the
console.

## getJson

```ts
getJson(json?: string): unknown
```

Parse any JSON value, `undefined` when `json` is empty or not valid JSON — a thin wrapper over
`JSON.parse` that turns its thrown `SyntaxError` into a value instead of a control-flow exception.
Returns `unknown`, not `any`: the caller still has to narrow the result before using it.

```ts
getJson('{"a":1}') // { a: 1 }
getJson('not json') // undefined
getJson(undefined) // undefined
```

## isJson

```ts
isJson<T>(test: string): Record<string, T> | T[] | false
```

Parse a JSON **structure**, or report that the string is not one. Only objects and arrays count —
a bare `5`, `'"text"'`, `'true'` or `'null'` is valid JSON but not a structure to walk, and
accepting them would make the `false` return ambiguous (`isJson('false')` could not be told apart
from a parse failure). Use [`getJson`](#getjson) when any JSON value is acceptable.

```ts
isJson('{"a":1}') // { a: 1 }
isJson('[1,2,3]') // [1, 2, 3]
isJson('true') // false — a valid value, but not a structure
isJson('not json') // false
```
