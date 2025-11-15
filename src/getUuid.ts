/**
 * DEPRECATED, will be removed in the next versions
 *
 * Random string so complicated and random that collision should be impossible (like addresses on blockchain)
 * WARNING: For professional crypto secure use: https://github.com/uuidjs/uuid
 *
 * NOTE when this function was born, crypto.randomUUID didn't exist.
 */
export default function createUUID(): string {
    return crypto.randomUUID()
}