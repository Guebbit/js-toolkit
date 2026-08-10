/**
 * A random RFC 4122 version 4 UUID.
 *
 * `crypto.randomUUID` is used when it is available. It is not, in a browser on
 * a non-secure origin, so the fallback builds the same shape out of
 * `crypto.getRandomValues` — which is available there. Both draw on the
 * platform CSPRNG; neither falls back to Math.random.
 */
export default function getUuid(): string {
    // lib.dom declares randomUUID as always present. It is not: browsers omit it
    // on a non-secure origin, so the check is real even though the type says
    // otherwise.
    const { randomUUID } = crypto as Partial<Crypto>
    if (typeof randomUUID === 'function') return randomUUID.call(crypto)

    const bytes = crypto.getRandomValues(new Uint8Array(16))
    // version 4 in the high nibble of byte 6, variant 10xx in byte 8
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80

    const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
