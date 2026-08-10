import { getUuid } from '../src'

describe('(getUuid) random unique id', () => {
    test('returns a string', () => {
        expect(typeof getUuid()).toBe('string')
    })

    test('produces unique values across many calls', () => {
        const values = new Set(Array.from({ length: 1000 }, () => getUuid()))
        expect(values.size).toBe(1000)
    })

    test('uses crypto.randomUUID when it is available', () => {
        const randomUUID = jest.fn(() => '11111111-1111-4111-8111-111111111111')
        const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto')
        Object.defineProperty(globalThis, 'crypto', {
            configurable: true,
            value: { randomUUID }
        })
        try {
            expect(getUuid()).toBe('11111111-1111-4111-8111-111111111111')
            expect(randomUUID).toHaveBeenCalledTimes(1)
        } finally {
            if (original) Object.defineProperty(globalThis, 'crypto', original)
            else delete (globalThis as { crypto?: unknown }).crypto
        }
    })

    // The guard is `typeof crypto !== 'undefined'`, which exists for runtimes
    // where the binding is absent entirely rather than merely empty. Reading
    // `crypto.randomUUID` without it throws a ReferenceError there.
    test('falls back when there is no crypto binding at all', () => {
        const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto')
        delete (globalThis as { crypto?: unknown }).crypto
        try {
            expect(getUuid()).toMatch(/^\d+-[\da-z]+$/)
        } finally {
            if (original) Object.defineProperty(globalThis, 'crypto', original)
        }
    })

    test('falls back to timestamp + random when crypto.randomUUID is unavailable', () => {
        const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto')
        Object.defineProperty(globalThis, 'crypto', {
            configurable: true,
            value: {}
        })
        try {
            const uuid = getUuid()
            expect(uuid).toMatch(/^\d+-[\da-z]+$/)
            expect(uuid).toContain('-')
        } finally {
            if (original) Object.defineProperty(globalThis, 'crypto', original)
            else delete (globalThis as { crypto?: unknown }).crypto
        }
    })
})
