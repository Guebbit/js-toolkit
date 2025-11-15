/**
 * WHITELIST
 * Filter object by array of allowed values
 *
 * @param recordsToFilter - records
 * @param allowed - allowed keys of records
 */
export default <T>(recordsToFilter: Record<string | number | symbol, T>, allowed: (string | number | symbol)[]) :Record<string, T> => {
    const result: Record<string, T> = {};
    const filteredKeys = Object.keys(recordsToFilter).filter(key => allowed.includes(key));

    for (const key of filteredKeys) {
        result[key] = recordsToFilter[key];
    }
    return result;
};
