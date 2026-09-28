# Errors

Reading a human-readable message off anything a `catch` or a rejected promise can hand you.

## extractErrorMessage

```ts
extractErrorMessage(error: unknown, fallback?: string): string
```

The readable message out of any caught or rejected value, or `fallback` (default `''`) when there
is none. Written for HTTP clients, which are the reason `instanceof Error` is not enough: an
interceptor that normalises failures rejects with a plain object, and every `instanceof Error`
check then reads a real API refusal as "nothing usable" and shows its fallback instead of the
message the server sent.

Consulted in order, first match wins:

1. a bare string
2. an `Error`'s own `message`
3. a `message` property on the value itself
4. `.data.message` (an unwrapped response body)
5. `.response.data.message` (a raw axios-shaped error)

The nested lookups (4–5) only run when everything above them came up empty, so they can add a
message but never override one. An empty string at any level is treated as absent — it would
otherwise render a blank alert that reads as a broken UI rather than as an explanation.

```ts
extractErrorMessage(new Error('Boom')) // 'Boom'
extractErrorMessage({ status: 400, message: 'Email taken' }) // 'Email taken'
extractErrorMessage({ response: { data: { message: 'Nope' } } }) // 'Nope'
extractErrorMessage(undefined, 'Something went wrong') // 'Something went wrong'
```
