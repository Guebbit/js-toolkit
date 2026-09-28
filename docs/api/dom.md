# DOM

The jQuery-shaped chores a framework usually hides: reading a form, walking siblings, batching
appends, delegated listeners. Jest exercises these against jsdom — see
[Testing](/guide/testing#what-jsdom-does-not-cover) for what that does and does not prove.

## appendChildren

```ts
appendChildren(
    element: HTMLElement | Element,
    ...children: (HTMLElement | Element | (HTMLElement | Element)[])[]
): HTMLElement | Element
```

`appendChild` for arrays, through one `DocumentFragment` — the live tree is touched once
regardless of how many children were passed, not once per child. Accepts elements and arrays of
elements interchangeably, appended in the given order. Returns `element` itself, for chaining.

```ts
appendChildren(list, itemA, [itemB, itemC])
```

## eventDelegate

```ts
eventDelegate(
    eventName: string,
    childSelector: string | Node,
    callback: (this: Element, event: Event) => void,
    parent?: Node | Window | typeof globalThis
): () => void
```

Delegates one listener on `parent` (default `globalThis`) to many children — including ones that
do not exist yet. Every event is checked against `childSelector` in the listener itself
(`closest()` for a CSS selector, `contains()` for a `Node`) rather than attaching a listener per
child. Inside `callback`, `this` is the matched child, not `parent`. Returns a function that
removes the listener — the only way to remove it, since the listener itself is never exposed.

```ts
const stop = eventDelegate('click', '.item', function () {
    console.log('clicked', this)
})
// later
stop()
```

## formatNodeList

```ts
formatNodeList(
    elementsArray?: HTMLElement | HTMLElement[] | NodeList | HTMLCollection | null
): HTMLElement[]
```

Any element, array, `NodeList` or `HTMLCollection` to a plain, static array. A live `NodeList`/
`HTMLCollection` is expanded rather than wrapped — they are iterable collections, not elements, and
wrapping one whole would hand back a single-item array holding the collection itself.

## getElementCenter

```ts
getElementCenter(element: Element): [number, number]
```

`[x, y]` viewport-relative centre point, derived from `getBoundingClientRect()`. A tuple, not
`number[]` — callers destructure the pair, and an array type would drop the two-values guarantee.
Moves as the page scrolls, since the underlying rect is viewport-relative, not document-relative.

## getForm

```ts
getForm(form: HTMLElement | null, selectors?: string): Record<string, unknown>
```

Every named field's current value inside `form`, keyed by its `name` attribute. `selectors`
(default `'input, textarea, select'`) picks which descendants count as fields; each one's value is
read the same way [`getValue`](#getvalue) reads it. `null` (or no matching fields) yields `{}`.

## getIframe

```ts
getIframe(
    iframe?: HTMLElement | HTMLIFrameElement | Element | null
): HTMLElement | HTMLBodyElement | undefined
```

The `<body>` of an iframe's own document, or `undefined` if `iframe` is not an attached `<iframe>`.
An iframe's document lives behind its `contentWindow`, which is `null` until the iframe is attached
and loaded — both are checked before reading in, since `contentWindow.document` is a separate
document tree from the page that embeds it.

## getIndex

```ts
getIndex(element: HTMLElement | null): number
```

jQuery's `.index()`: an element's zero-based position among its parent's children, read straight
off `parentElement.children`. `-1` when there is no element or no parent — both mean "not in a
tree".

## getSiblings

```ts
getSiblings(element: HTMLElement | Element | null): Element[]
```

jQuery's `.siblings()`: every other child of `element`'s parent. An empty array when there is no
parent.

## getValue

```ts
getValue(
    element: HTMLElement | null,
    attribute?: string
): string | number | boolean | undefined
```

The value of an input, textarea, select, checkbox, radio group, attribute or text node — branching
on what kind of element it is. With a non-empty `attribute` (default `''`), reads that attribute
instead. A checkbox returns its `checked` state; a radio button looks up whichever sibling in its
named group is checked and returns that one's value; anything else falls back to `.value`, then
`.textContent`.

## isInViewport

```ts
isInViewport(element: Element, fully?: boolean): boolean
```

Whether `element` is at least partially inside the viewport — or, with `fully` (default `false`)
set, entirely inside it. Compares `getBoundingClientRect()` against `window.innerHeight`/
`innerWidth`, falling back to `document.documentElement`'s client size where the window dimensions
read `0` (some iframes have no browsing context of their own).
