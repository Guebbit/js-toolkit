import { toFormData } from '../src'

describe('(toFormData) transform object in FormData', () => {
    test('appends flat values under their own key', () => {
        const fd = toFormData({ lorem: 'ipsum', dolor: 'sit' })
        expect(fd.get('lorem')).toBe('ipsum')
        expect(fd.get('dolor')).toBe('sit')
    })

    test('namespaces nested objects with bracket keys', () => {
        const fd = toFormData({ dolor: { sit: 'consectetur' } })
        expect(fd.get('dolor[sit]')).toBe('consectetur')
    })

    // Two levels is the depth where the accumulated namespace and the bare
    // property name are still the same string, so it cannot tell them apart.
    // Three is where they diverge.
    test('namespaces three levels deep with the full bracket chain', () => {
        const fd = toFormData({ lorem: { ipsum: { dolor: 'sit' } } })
        expect([...fd.keys()]).toEqual(['lorem[ipsum][dolor]'])
        expect(fd.get('lorem[ipsum][dolor]')).toBe('sit')
    })

    // Without the full chain both branches post as `inner[value]` and the server
    // sees two entries under one key with no way to tell which is which.
    test('keeps sibling branches with the same inner shape apart', () => {
        const fd = toFormData({
            first: { inner: { value: 'a' } },
            second: { inner: { value: 'b' } }
        })
        expect(fd.get('first[inner][value]')).toBe('a')
        expect(fd.get('second[inner][value]')).toBe('b')
    })

    test('flattens arrays using indexed bracket keys', () => {
        const fd = toFormData({ adipiscing: ['elit', 'sed do'] })
        expect(fd.get('adipiscing[0]')).toBe('elit')
        expect(fd.get('adipiscing[1]')).toBe('sed do')
    })

    test('appends File instances directly instead of recursing', () => {
        const file = new File(['content'], 'note.txt', { type: 'text/plain' })
        const fd = toFormData({ upload: file })
        expect(fd.get('upload')).toBe(file)
    })

    test('appends plain Blob instances directly instead of recursing', () => {
        // A Blob that is not a File must not take the recursive branch: it has no
        // enumerable own properties, so nothing would be appended and the value
        // would vanish without an error.
        //
        // Identity is not asserted: `FormData.append` normalises a non-File Blob into a File
        // named "blob" per spec, so the stored value is equivalent but not the same reference.
        const blob = new Blob(['content'], { type: 'text/plain' })
        const stored = toFormData({ upload: blob }).get('upload')
        expect(stored).toBeInstanceOf(Blob)
        expect((stored as Blob).size).toBe(blob.size)
        expect((stored as Blob).type).toBe('text/plain')
    })

    test('appends a Blob nested inside an object under its bracket key', () => {
        const blob = new Blob(['content'], { type: 'image/png' })
        const stored = toFormData({ avatar: { file: blob } }).get('avatar[file]')
        expect(stored).toBeInstanceOf(Blob)
        expect((stored as Blob).size).toBe(blob.size)
    })

    test('drops null values rather than appending the string "null"', () => {
        // Pinned because it sits on the branch the Blob fix touches: null is typeof 'object',
        // so it takes the recursive path, and `for...in` over null appends nothing.
        // eslint-disable-next-line unicorn/no-null
        const fd = toFormData({ lorem: 'ipsum', empty: null })
        expect(fd.has('empty')).toBe(false)
        expect(fd.get('lorem')).toBe('ipsum')
    })

    test('skips inherited enumerable properties', () => {
        const obj = Object.create({ inherited: 'nope' }) as Record<string, unknown>
        obj.own = 'yes'
        const fd = toFormData(obj)
        expect(fd.get('own')).toBe('yes')
        expect(fd.has('inherited')).toBe(false)
    })

    test('reuses a provided FormData instance', () => {
        const existing = new FormData()
        existing.append('keep', 'me')
        const fd = toFormData({ lorem: 'ipsum' }, existing)
        expect(fd).toBe(existing)
        expect(fd.get('keep')).toBe('me')
        expect(fd.get('lorem')).toBe('ipsum')
    })
})
