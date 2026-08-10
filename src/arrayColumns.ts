/**
 * php array_column
 * Return the values of one or more {columns} from every record in {haystack}.
 *
 * The result always has one entry per record, in the same order, so it can be
 * zipped straight back onto the input. A single column name yields a flat array
 * of values; a list of names yields an array of value-arrays, one slot per name.
 *
 * A record that is missing a column — or is not an object at all — contributes
 * undefined rather than throwing. Inherited properties do not count.
 *
 * @param {array} haystack
 * @param {string|string[]} columns
 */
function arrayColumns(haystack: Record<string, unknown>[], columns: string): unknown[]
function arrayColumns(haystack: Record<string, unknown>[], columns: string[]): unknown[][]
function arrayColumns(
    haystack: Record<string, unknown>[],
    columns: string | string[]
): unknown[] | unknown[][] {
    const isMulticolumn = Array.isArray(columns)
    const columnsArray = isMulticolumn ? columns : [columns]

    return haystack.map((record) => {
        const values = columnsArray.map((column) =>
            // The type says a record is always an object and a column always a
            // string. A partially-loaded haystack breaks both, and undefined is a
            // better answer there than a thrown TypeError.
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            record && column && Object.hasOwn(record, column) ? record[column] : undefined
        )
        // the extra nesting level exists only because the caller asked for a list
        return isMulticolumn ? values : values[0]
    })
}

export default arrayColumns
