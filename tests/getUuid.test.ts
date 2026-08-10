import { getUuid } from '../src'

const V4 = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/

describe('(getUuid) random unique id', () => {
    test('returns a v4 uuid', () => {
        expect(getUuid()).toMatch(V4)
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
        }
    })

    // randomUUID is unavailable in a browser on a non-secure origin, where
    // getRandomValues still is. The fallback has to produce a real v4, not a
    // lookalike, and must still draw on the platform CSPRNG.
    describe('when crypto.randomUUID is unavailable', () => {
        let original: PropertyDescriptor | undefined
        let getRandomValues: jest.Mock

        beforeEach(() => {
            original = Object.getOwnPropertyDescriptor(globalThis, 'crypto')
            const real = globalThis.crypto
            getRandomValues = jest.fn((array: Uint8Array) => real.getRandomValues(array))
            Object.defineProperty(globalThis, 'crypto', {
                configurable: true,
                value: { getRandomValues }
            })
        })

        afterEach(() => {
            if (original) Object.defineProperty(globalThis, 'crypto', original)
        })

        test('still produces a well-formed v4 uuid', () => {
            expect(getUuid()).toMatch(V4)
        })

        test('draws its randomness from crypto.getRandomValues', () => {
            getUuid()
            expect(getRandomValues).toHaveBeenCalledTimes(1)
            const [buffer] = getRandomValues.mock.calls[0] as [Uint8Array]
            expect(buffer).toBeInstanceOf(Uint8Array)
            expect(buffer.length).toBe(16)
        })

        // The version and variant bits are fixed by the spec, so they must be
        // stamped over whatever the CSPRNG produced rather than left random.
        test('stamps the version and variant bits over the random bytes', () => {
            getRandomValues.mockImplementation((array: Uint8Array) => array.fill(0xff))
            const uuid = getUuid()
            expect(uuid).toMatch(V4)
            expect(uuid[14]).toBe('4')
            expect('89ab').toContain(uuid[19])
        })

        // Every byte renders as two hex digits. With a zero-filled buffer each
        // one is below 0x10, so a padding that does nothing produces a short,
        // malformed uuid — invisible against random bytes, which are mostly
        // large enough not to need padding.
        test('pads every byte to two hex digits', () => {
            getRandomValues.mockImplementation((array: Uint8Array) => array.fill(0))
            expect(getUuid()).toBe('00000000-0000-4000-8000-000000000000')
        })

        test('is still unique across many calls', () => {
            const values = new Set(Array.from({ length: 500 }, () => getUuid()))
            expect(values.size).toBe(500)
        })
    })
})
