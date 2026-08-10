/**
 * Flatten an object into FormData, for a multipart request.
 *
 * Nested objects and arrays are namespaced with PHP-style brackets, so
 * `{ user: { tags: ['a'] } }` becomes the key `user[tags][0]`. Blob and File
 * values are appended whole rather than walked into.
 *
 * FormData has no notion of nesting of its own — every value is a string or a
 * blob — so a server that does not understand bracket notation is better served
 * by one JSON.stringify'd field.
 *
 * @param object - the object to convert
 * @param form - an existing FormData to append to, a new one otherwise
 * @param namespace - bracket prefix for the current depth, set by the recursion
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
