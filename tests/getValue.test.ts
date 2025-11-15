import { getValue } from '../src';

document.body.innerHTML =
	'<form>'+
		'<input id="input-test" value="Lorem Ipsum"/>'+
		'<select id="select-test">'+
			'<option value="lorem">ipsum</option>'+
			'<option value="dolor" selected>sit</option>'+
			'<option value="consectetur">adipiscing</option>'+
		'</select>'+
		'<textarea id="textarea-test">elit sed do</textarea>'+
		'<input type="checkbox" id="checkbox-test" value="Eiusmod" checked/>'+
		'<input type="radio" id="radio-test1" name="radio-test" value="Lorem"/>'+
		'<input type="radio" id="radio-test2" name="radio-test" value="Ipsum" checked />'+
		'<span id="span-test">Tempor Incididunt</span>'+
		'<span id="attribute-test" data-custom-attribute="ut labore et dolore"></span>'+
	'</form>';

describe("(getValue) get value of various elements", () => {

	test("Input", () => {
		expect(
			getValue(document.querySelector('#input-test'))
		).toBe('Lorem Ipsum')
	});

	test("Select", () => {
		expect(
			getValue(document.querySelector('#select-test'))
		).toBe('dolor')
	});

	test("Textarea", () => {
		expect(
			getValue(document.querySelector('#textarea-test'))
		).toBe('elit sed do')
	});

	test("Checkbox", () => {
		expect(
			getValue(document.querySelector('#checkbox-test'))
		)
		.toBeTruthy();
	});

	test("Radio", () => {
		expect(
			getValue(document.querySelector('#radio-test1'))
		)
		.toBe('Ipsum');
	});

	test("<any element> text", () => {
		expect(
			getValue(document.querySelector('#span-test'))
		).toBe('Tempor Incididunt')
	});

	test("<any element> attribute", () => {
		expect(
			getValue(document.querySelector('#attribute-test'), 'data-custom-attribute')
		).toBe('ut labore et dolore')
	});
});
