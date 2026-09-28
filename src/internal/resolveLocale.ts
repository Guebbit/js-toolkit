/**
 * @module
 * A locale the `Intl` constructors will accept, or `undefined` for the runtime's default.
 * `Intl` already falls back on its own for a well-formed tag it has no data for (`'zz'`), but
 * throws on a malformed one (`'en_US'`, `''`). This maps the second case onto the first.
 */

/**
 * The locale as given when it is a well-formed BCP 47 tag, otherwise `undefined`.
 *
 * @param locale - a BCP 47 tag, e.g. `'it-IT'`, possibly malformed
 * @returns `locale`, or `undefined` (the runtime's default) when `Intl` would reject it
 */
export default (locale?: string): string | undefined => {
    try {
        // Intl: the spec's own well-formedness check, the same one every Intl constructor runs.
        // Throws a RangeError on a malformed tag; `undefined` passes (it means "the default").
        Intl.getCanonicalLocales(locale)
    } catch {
        // malformed: hand Intl nothing, so it picks the runtime's default
        return
    }
    return locale
}
