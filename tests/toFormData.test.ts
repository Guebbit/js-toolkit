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
