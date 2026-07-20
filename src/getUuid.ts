/** *
 * Random string so complicated and random that collision should be impossible (like addresses on blockchain)
 * WARNING: For professional crypto secure use: https://github.com/uuidjs/uuid
 *
 * NOTE when this function was born, crypto.randomUUID didn't exist.
 */
export default function createUUID(): string {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now().toString()}-${Math.random().toString(36).slice(2)}`
}
