/**
 *  Trasformo un array normale in un FormData
 *  Necessario per il passaggio di file o per evitare l'uso di php:\\input
 *  WARNING formData appiattisce tutti gli array multidimensionali,
 *  quindi è meglio trasformarli in un json.
 *  JSON.stringify(); prima e poi json_decode($_POST['']); nel php
 *
 *  @param object obj = oggetto da convertire
 *  @param FormData RECURSIVO  form = l'oggetto convertito
 *  @param string RECURSIVO  namespace = ??
 */
/*
TODO proibire queste parole in set data
(a volte appaiono, quando cancello un this._data.files o this._data.files_info
e non so come evitarlo o che fanno)
	[append] => function append() { [native code] }
	[delete] => function delete() { [native code] }
	[get] => function get() { [native code] }
	[getAll] => function getAll() { [native code] }
	[has] => function has() { [native code] }
	[set] => function set() { [native code] }
	[keys] => function keys() { [native code] }
	[values] => function values() { [native code] }
	[forEach] => function forEach() { [native code] }
	[entries] => function entries() { [native code] }
*/
const toFormData = (object:Record<string, unknown>, form?: FormData, namespace?: string) :FormData => {
	const fd = form ?? new FormData();
	let formKey :string;
	for(const property in object) {
		if(Object.prototype.hasOwnProperty.call(object, property)) {
			formKey = namespace ? namespace + '[' + property + ']' : property;
			// if the property is an object, but not a File,
			// use recursivity.
			if(typeof object[property] === 'object' && !(object[property] instanceof File))
				toFormData(object[property] as Record<string, unknown>, fd, property);
			else
				// if it's a string or a File object
				fd.append(formKey, object[property] as string | Blob);
		}
	}
	return fd;
}

export default toFormData;
