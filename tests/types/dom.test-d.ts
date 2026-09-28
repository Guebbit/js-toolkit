/**
 * TYPES — DOM: element-returning helpers keep a real element type rather than widening to a bare
 * object, so a caller can chain straight back into the DOM.
 */
import { expectTypeOf } from 'expect-type'
import * as toolkit from '../../src'

expectTypeOf(toolkit.appendChildren).not.toBeAny()
expectTypeOf(toolkit.eventDelegate).not.toBeAny()
expectTypeOf(toolkit.formatNodeList).not.toBeAny()
expectTypeOf(toolkit.getElementCenter).not.toBeAny()
expectTypeOf(toolkit.getForm).not.toBeAny()
expectTypeOf(toolkit.getIframe).not.toBeAny()
expectTypeOf(toolkit.getIndex).not.toBeAny()
expectTypeOf(toolkit.getSiblings).not.toBeAny()
expectTypeOf(toolkit.getValue).not.toBeAny()
expectTypeOf(toolkit.isInViewport).not.toBeAny()

expectTypeOf(toolkit.formatNodeList).returns.toEqualTypeOf<HTMLElement[]>()
// An unsubscribe, not void: it is the only way to remove the listener.
expectTypeOf(toolkit.eventDelegate).returns.toEqualTypeOf<() => void>()
expectTypeOf(toolkit.getSiblings).returns.toEqualTypeOf<Element[]>()
expectTypeOf(toolkit.getElementCenter).returns.toEqualTypeOf<[number, number]>()
expectTypeOf(toolkit.getIndex).toEqualTypeOf<(element: HTMLElement | null) => number>()
expectTypeOf(toolkit.getIframe).returns.toEqualTypeOf<HTMLElement | HTMLBodyElement | undefined>()
expectTypeOf(toolkit.getValue).returns.toEqualTypeOf<string | number | boolean | undefined>()

expectTypeOf(toolkit.isInViewport).toEqualTypeOf<(element: Element, fully?: boolean) => boolean>()

// Variadic, and each argument (or nested array) has to be an element — the whole point is
// appendChild for arrays, not for arbitrary values.
expectTypeOf(toolkit.appendChildren).toEqualTypeOf<
    (
        element: HTMLElement | Element,
        ...children: (HTMLElement | Element | (HTMLElement | Element)[])[]
    ) => HTMLElement | Element
>()

expectTypeOf(toolkit.getForm).toEqualTypeOf<
    (form: HTMLElement | null, selectors?: string) => Record<string, unknown>
>()

// @ts-expect-error -- a child has to be an element (or an array of them), not a bare string
toolkit.appendChildren(document.body, 'not an element')

// @ts-expect-error -- form is required, not optional
toolkit.getForm()
