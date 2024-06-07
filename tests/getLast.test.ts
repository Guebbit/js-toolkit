import { getLast } from '../index';

describe("(getLast) Get last element of array", () => {
	test("regular array", () => {
    expect(
			getLast([
				'lorem',
				'ipsum',
				'dolor',
				'sit'
			])
		).toEqual('sit');
	});

	test("Object.values of object", () => {
		expect(
			getLast(Object.values({
				lorem: 'ipsum',
				dolor: 'sit'
			}))
		).toEqual('sit');
	});
});
