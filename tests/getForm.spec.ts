import { getForm } from '../src'

const markup =
    '<form id="form-test">' +
    '<input name="input-test" value="Lorem Ipsum"/>' +
    '<select name="select-test">' +
    '<option value="lorem">ipsum</option>' +
    '<option value="dolor" selected>sit</option>' +
    '<option value="consectetur">adipiscing</option>' +
    '</select>' +
    '<textarea name="textarea-test">elit sed do</textarea>' +
    '<input type="checkbox" name="checkbox-test" value="Eiusmod" checked/>' +
    '<input type="radio" name="radio-test" value="Lorem"/>' +
    '<input type="radio" name="radio-test" value="Ipsum" checked />' +
    '</form>'

describe('(getForm) Get all form-like values paired with their name (ignored if without name)', () => {
    beforeEach(() => {
        document.body.innerHTML = markup
    })

    test('Input', () => {
        expect(getForm(document.querySelector('#form-test'))).toEqual({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'checkbox-test': true,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'input-test': 'Lorem Ipsum',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'radio-test': 'Ipsum',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'select-test': 'dolor',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'textarea-test': 'elit sed do'
        })
    })

    // The caller usually passes a querySelector result straight in, which is
    // null whenever the form is not on the page yet. That must be an empty
    // result, not a crash.
    test('returns an empty object for a missing form', () => {
        // eslint-disable-next-line unicorn/no-null
        expect(getForm(null)).toEqual({})
    })

    // The name attribute is what pairs a value with a key, so an unnamed field
    // has nothing to be keyed by and is skipped entirely.
    test('skips fields without a name attribute', () => {
        document.body.innerHTML =
            '<form id="unnamed"><input value="orphan"/><input name="kept" value="yes"/></form>'
        expect(getForm(document.querySelector('#unnamed'))).toEqual({ kept: 'yes' })
    })

    test('returns an empty object for a form with no fields', () => {
        document.body.innerHTML = '<form id="bare"></form>'
        expect(getForm(document.querySelector('#bare'))).toEqual({})
    })

    // The selector is a parameter so callers can scope to a subset; narrowing it
    // has to actually narrow the result.
    test('honours a custom selector', () => {
        expect(getForm(document.querySelector('#form-test'), 'textarea')).toEqual({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'textarea-test': 'elit sed do'
        })
    })

    // The walk runs backwards through the list, so the first field in document
    // order is written last and wins. Pinning it stops the direction changing
    // unnoticed.
    test('keeps the first field in document order when two share a name', () => {
        document.body.innerHTML =
            '<form id="dupe"><input name="same" value="first"/><input name="same" value="second"/></form>'
        expect(getForm(document.querySelector('#dupe'))).toEqual({ same: 'first' })
    })

    test('reports an unchecked checkbox as false rather than omitting it', () => {
        document.body.innerHTML =
            '<form id="unchecked"><input type="checkbox" name="agree" value="x"/></form>'
        expect(getForm(document.querySelector('#unchecked'))).toEqual({ agree: false })
    })
})
