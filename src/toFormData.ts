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
const toFormData = (
    object: Record<string, unknown>,
    form?: FormData,
    namespace?: string
): FormData => {
    const fd = form ?? new FormData()
    let formKey: string
    for (const property in object) {
        if (Object.prototype.hasOwnProperty.call(object, property)) {
            formKey = namespace ? namespace + '[' + property + ']' : property
            // A plain object recurses; anything else is appended.
            //
            // The check is `Blob`, not `File`: File extends Blob, so this covers both.
            // Testing for File alone sends a plain Blob — what canvas.toBlob(),
            // fetch().blob() and most image croppers hand you — down the recursive
            // branch, where it has no enumerable own properties, so nothing is
            // appended and the upload goes out empty with no error anywhere.
            //
            // The namespace passed down is the accumulated {formKey}, not the bare
            // {property}: PHP-style bracket notation has to carry every ancestor,
            // or `{a:{b:{c:1}}}` posts as `b[c]` and the server cannot tell which
            // branch it came from — two siblings holding the same nested shape
            // collide on one key.
            if (typeof object[property] === 'object' && !(object[property] instanceof Blob))
                toFormData(object[property] as Record<string, unknown>, fd, formKey)
            else
                // if it's a primitive or a binary value (Blob/File)
                fd.append(formKey, object[property] as string | Blob)
        }
    }
    return fd
}

export default toFormData
