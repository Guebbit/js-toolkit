import { appendChildren } from '../src'

describe('(appendChildren) appendChild for arrays', () => {
    test('appends single elements in order', () => {
        const parent = document.createElement('div')
        const a = document.createElement('span')
        const b = document.createElement('em')
        appendChildren(parent, a, b)
        expect([...parent.children]).toEqual([a, b])
    })

    test('flattens nested arrays of children', () => {
        const parent = document.createElement('div')
        const a = document.createElement('span')
        const b = document.createElement('em')
        const c = document.createElement('i')
        appendChildren(parent, a, [b, c])
        expect([...parent.children]).toEqual([a, b, c])
    })

    test('returns the parent element', () => {
        const parent = document.createElement('div')
        expect(appendChildren(parent, document.createElement('span'))).toBe(parent)
    })
})
