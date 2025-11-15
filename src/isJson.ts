/**
 * Control if parameter is json
 * @param test
 * @return json or false
 */
export default <T>(test :string) :Record<string, T> | false => {
	try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return JSON.parse(test);
	} catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
		return false;
	}
}
