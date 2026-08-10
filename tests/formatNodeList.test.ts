import { formatNodeList } from '../src'

describe('(formatNodeList) normalize any element collection into an array', () => {
    // toStrictEqual, not toEqual: jest's toEqual treats [undefined] as equal to
    // [], so the guard that turns a missing input into an empty array could be
    // deleted and a toEqual assertion would never notice.
    test('returns an empty array when given nothing', () => {
        expect(formatNodeList()).toStrictEqual([])
        // eslint-disable-next-line unicorn/no-null
        expect(formatNodeList(null)).toStrictEqual([])
    })

    test('wraps a single element in an array', () => {
        const element = document.createElement('div')
        expect(formatNodeList(element)).toStrictEqual([element])
    })

    test('converts a NodeList to an array', () => {
        document.body.innerHTML = '<div></div><span></span>'
        const nodeList = document.querySelectorAll('div, span')
        expect(formatNodeList(nodeList)).toStrictEqual([...nodeList])
    })

    test('converts an HTMLCollection to an array', () => {
        document.body.innerHTML = '<div></div><div></div><span></span>'
        // getElementsByTagName, not querySelectorAll: an HTMLCollection is the
        // whole point of this case, and querySelectorAll returns a NodeList.
        // eslint-disable-next-line unicorn/prefer-query-selector
        const collection = document.getElementsByTagName('div')
        expect(formatNodeList(collection)).toStrictEqual([...collection])
    })

    test('keeps the items of an array that is already an array', () => {
        const first = document.createElement('div')
        const second = document.createElement('span')
        expect(formatNodeList([first, second])).toStrictEqual([first, second])
    })

    // A fresh array is returned rather than the caller's own, so mutating the
    // result cannot reach back into the input.
    test('returns a new array rather than the one passed in', () => {
        const input = [document.createElement('div')]
        const output = formatNodeList(input)
        expect(output).not.toBe(input)
        output.push(document.createElement('span'))
        expect(input).toHaveLength(1)
    })

    // A NodeList is live: detaching an element afterwards must not shorten a
    // list that was already handed back.
    test('returns a static array, not a live view', () => {
        document.body.innerHTML = '<div id="a"></div><div id="b"></div>'
        const result = formatNodeList(document.querySelectorAll('div'))
        document.querySelector('#a')!.remove()
        expect(result).toHaveLength(2)
    })

    test('returns an empty array for an empty collection', () => {
        document.body.innerHTML = ''
        expect(formatNodeList(document.querySelectorAll('div'))).toStrictEqual([])
    })
})
