import { getIndex } from '../src'

document.body.innerHTML =
    '<div>' +
    '<div>Lorem Ipsum</div>' +
    '<div>Lorem Ipsum</div>' +
    '<div id="testContent">Lorem Ipsum</div>' +
    '<div>Lorem Ipsum</div>' +
    '</div>'

describe('(getIndex) get index of element (nth child of parent)', () => {
    test('Element only', () => {
        expect(getIndex(document.querySelector('#testContent'))).toBe(2)
    })

    test('returns -1 when the element is null', () => {
        // eslint-disable-next-line unicorn/no-null
        expect(getIndex(null)).toBe(-1)
    })

    test('returns -1 when the element has no parent', () => {
        const orphan = document.createElement('div')
        expect(getIndex(orphan)).toBe(-1)
    })
})
