import { getIndex } from '../src';

document.body.innerHTML =
	'<div>'+
		'<div>Lorem Ipsum</div>'+
		'<div>Lorem Ipsum</div>'+
		'<div id="testContent">Lorem Ipsum</div>'+
		'<div>Lorem Ipsum</div>'+
	'</div>';

describe("(getIndex) get index of element (nth child of parent)", () => {
	test("Element only", () => {
		expect(getIndex(document.querySelector('#testContent'))).toBe(2)
	});
});
