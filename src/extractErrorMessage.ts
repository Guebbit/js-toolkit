/**
 * Whether a value is an object worth reading properties off.
 *
 * `typeof null === 'object'`, so the truthiness check is what keeps a `null` rejection out.
 */
const isRecord = (value: unknown): value is Record<string, unknown> =>
    !!value && typeof value === 'object'

/**
 * The `message` of a record, when there is one worth showing.
 *
 * An empty string is treated as absent: it renders as a blank alert, which reads as a broken UI
 * rather than as an explanation.
 *
 * @param {unknown} value - candidate carrier, of any shape
 */
const ownMessage = (value: unknown): string | undefined => {
    if (!isRecord(value)) return undefined
    const { message } = value
    return typeof message === 'string' && message ? message : undefined
}

/**
 * Pull a human-readable message out of anything a `catch` or a rejection can hand you.
 *
 * Written for HTTP clients, which are the reason `instanceof Error` is not enough: an interceptor
 * that normalises failures rejects with a plain object literal, and every `error instanceof Error`
 * test then reads a real API refusal as "nothing usable" and shows its fallback instead of the
 * message the server took the trouble to send.
 *
 * Consulted in order — a bare string, an `Error`, a `message` on the value itself, then the two
 * places a client commonly buries the body (`.data` for an unwrapped response, `.response.data`
 * for a raw axios error). The nested lookup only ever runs when the levels above it came up
 * empty, so it can add a message but never replace one.
 *
 * Returns `fallback` rather than throwing or inventing wording: what to say when the failure
 * carried nothing is a decision about tone and language, and belongs to the caller.
 *
 * @param {unknown} error - the caught or rejected value
 * @param {string} fallback - returned when nothing readable was found; empty by default
 */
export default (error: unknown, fallback = ''): string => {
    if (typeof error === 'string' && error) return error
    if (error instanceof Error && error.message) return error.message

    const own = ownMessage(error)
    if (own) return own

    if (isRecord(error)) {
        const nested =
            ownMessage(error.data) ??
            (isRecord(error.response) ? ownMessage(error.response.data) : undefined)
        if (nested) return nested
    }

    return fallback
}
