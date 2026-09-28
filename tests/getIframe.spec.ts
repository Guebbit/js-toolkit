import { getIframe } from '../src'

describe('(getIframe) Get Iframe content', () => {
    beforeEach(() => {
        document.body.innerHTML =
            '<iframe id="iframe-test"></iframe>' + '<div id="not-an-iframe">Lorem</div>'
    })

    test('returns the body of the iframe document', () => {
        expect(getIframe(document.querySelector('#iframe-test'))?.tagName).toBe('BODY')
    })

    // The guard is on tagName, so anything else has to come back undefined
    // rather than throwing or returning the element's own body-less content.
    test('returns undefined for an element that is not an iframe', () => {
        expect(getIframe(document.querySelector('#not-an-iframe'))).toBeUndefined()
    })

    test('returns undefined for a missing element', () => {
        // eslint-disable-next-line unicorn/no-null
        expect(getIframe(null)).toBeUndefined()
        expect(getIframe()).toBeUndefined()
    })

    // A detached iframe has no contentWindow. Reading .document off it would
    // throw, so the second guard has to catch it first.
    test('returns undefined for an iframe that is not attached to the document', () => {
        const detached = document.createElement('iframe')
        expect(getIframe(detached)).toBeUndefined()
    })
})
