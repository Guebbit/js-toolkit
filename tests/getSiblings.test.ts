import { getSiblings } from '../src'

describe('(getSiblings) get siblings of element', () => {
    beforeEach(() => {
        document.body.innerHTML =
            '<div id="wrapper">' +
            '<span id="first">Lorem</span>' +
            '<span id="testSpan">Ipsum</span>' +
            '<span id="third">Sit</span>' +
            '<span id="fourth">Dolor</span>' +
            '</div>'
    })

    test('returns every sibling, in document order, excluding the element itself', () => {
        const siblings = getSiblings(document.querySelector('#testSpan'))
        expect(siblings.map((element) => element.id)).toEqual(['first', 'third', 'fourth'])
    })

    // The element itself is a child of its parent, so filtering it out is the
    // whole job. Without that filter the caller gets itself back in the list.
    test('never includes the element itself', () => {
        const element = document.querySelector('#testSpan')
        expect(getSiblings(element)).not.toContain(element)
    })

    test('returns an empty array for an only child', () => {
        document.body.innerHTML = '<div><span id="lonely">Lorem</span></div>'
        expect(getSiblings(document.querySelector('#lonely'))).toEqual([])
    })

    test('returns an empty array for a missing element', () => {
        // eslint-disable-next-line unicorn/no-null
        expect(getSiblings(null)).toEqual([])
    })

    // A freshly created element has no parentNode at all; the function must not
    // throw reading children off nothing.
    test('returns an empty array for a detached element', () => {
        expect(getSiblings(document.createElement('span'))).toEqual([])
    })

    test('returns a real array, not a live HTMLCollection', () => {
        const siblings = getSiblings(document.querySelector('#testSpan'))
        expect(Array.isArray(siblings)).toBe(true)
        // removing a sibling afterwards must not change an already-returned list
        document.querySelector('#third')!.remove()
        expect(siblings).toHaveLength(3)
    })
})
