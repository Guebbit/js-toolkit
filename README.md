# @guebbit/js-toolkit

Small, dependency-free TypeScript helpers for the things that keep coming up: array and object
reshaping, string matching, ranges and distances, time conversion, cookies, query strings, and the
DOM chores that predate a framework.

Every function is a default export of its own module and is re-exported by name from the package
root. Nothing here wraps a library — if lodash already does it well, it is not in this toolkit.

- No runtime dependencies
- TypeScript throughout, with declarations published for both module formats
- Real ESM and CommonJS builds, so `import` and `require` both work natively
- Every helper is importable on its own, and `sideEffects: false` lets a bundler
  drop whatever you do not use
- Node 20+

## Install

```sh
npm install @guebbit/js-toolkit
```

## Usage

```ts
import { arrayChunks, getMapDistance, match, setUrlQueries } from '@guebbit/js-toolkit'

arrayChunks(['a', 'b', 'c', 'd', 'e'], 2) // [['a', 'b', 'c'], ['d', 'e']]
getMapDistance(0, 3, 0, 4) // 5
match('Ipsum', 'lorem ipsum sit') // true  — case-insensitive, first inside second
setUrlQueries({ tags: ['a', 'b'], page: 2 }) // 'tags=a%2Cb&page=2'
```

Import a single helper instead, when you would rather not go through the barrel:

```ts
import getMapDistance from '@guebbit/js-toolkit/getMapDistance'
```

CommonJS works the same way:

```js
const { arrayChunks } = require('@guebbit/js-toolkit')
const getDelta = require('@guebbit/js-toolkit/getDelta').default
```

There is no default export on the barrel — it exports names. Every one of these forms, both
module systems and both subpath styles, is exercised against a real packed tarball on each
build. A subpath import needs `moduleResolution: "node16"`, `"nodenext"` or `"bundler"` — see
[Getting Started](https://guebbit.github.io/js-toolkit/guide/getting-started) for the `node10`
caveat.

### Browser and Node

Most helpers are environment-agnostic. The DOM helpers need a `document` (a browser or jsdom), and
`deleteFile` is Node-only — it is the single module that imports `node:fs/promises`. Because each
helper is its own module and the package is side-effect free, importing the pure ones from a
server bundle does not drag the DOM ones in.

## API

Full reference, one page per category, with every export's parameters, return value, defaults and
an example: **https://guebbit.github.io/js-toolkit/**

| Category                                                                          | What lives there                                                      |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [Arrays and objects](https://guebbit.github.io/js-toolkit/api/arrays-and-objects) | reshaping, slicing, coercing plain data                               |
| [Strings](https://guebbit.github.io/js-toolkit/api/strings)                       | fuzzy matching, edit distance, id generation, plain-text display      |
| [Errors](https://guebbit.github.io/js-toolkit/api/errors)                         | a readable message out of anything a `catch` hands you                |
| [Numbers and ranges](https://guebbit.github.io/js-toolkit/api/numbers-and-ranges) | distances, overlaps, currency display                                 |
| [Time](https://guebbit.github.io/js-toolkit/api/time)                             | seconds to every unit, durations, execution timing, date display      |
| [JSON](https://guebbit.github.io/js-toolkit/api/json)                             | parsing that never throws                                             |
| [DOM](https://guebbit.github.io/js-toolkit/api/dom)                               | the jQuery-shaped chores a framework usually hides                    |
| [Browser platform](https://guebbit.github.io/js-toolkit/api/browser-platform)     | clipboard, downloads, cookies, query strings, `FormData`, file checks |
| [Node](https://guebbit.github.io/js-toolkit/api/node)                             | the one helper that only runs outside a browser                       |

`ISecondsToTimeMap`, `ISetCookieOptions`, `IMatchOptions`/`TMatchMode`, `IFormatCurrencyOptions`,
`IFormatDateTimeOptions`, `IFormatDurationOptions`/`TDurationUnit` and `IFormatFileSizeOptions` are
all importable from the package root — each documented alongside the function it configures.

## Contributing

```sh
npm run complete:check   # lint, format, typecheck, build, test:package, test, test:types, docs:build
npm test                 # unit and property tests
npm run test:types       # type-level tests
npm run test:package     # packaging smoke test
npm run test:mutation    # mutation testing

FC_SEED=$RANDOM FC_NUM_RUNS=1000 npm test   # explore past the fixed seed
```

The suite is layered — unit, property-based, type-level, packaging and mutation — and each layer
catches something the others cannot. The
[testing guide](https://guebbit.github.io/js-toolkit/guide/testing) explains what each one is for,
how the per-file mutation baseline gate works, and why some surviving mutants are left alone on
purpose.

## License

AGPL-3.0. See [LICENSE](LICENSE).
