import { timeToSeconds } from '../src';

describe("(timeToSeconds) Transform 'HH:MM:SS:ms' string in milliseconds integer", () => {
	test("default", () => {
		expect(
      timeToSeconds('14:30:20:50')
		).toEqual(52_220_050);
	});

  test("without milliseconds", () => {
    expect(
      timeToSeconds('14:30:20')
    ).toEqual(52_220_000);
  });

  test("minutes and hours only", () => {
    expect(
      timeToSeconds('14:30')
    ).toEqual(52_200_000);
  });

  test("hours only", () => {
    expect(
      timeToSeconds('14')
    ).toEqual(50_400_000);
  });
});
