# Node

The one helper that only runs outside a browser — it is the single module that imports
`node:fs/promises`, so importing every other helper from a server bundle never drags this in.

## deleteFile

```ts
deleteFile(filePath: string, onError?: (error: Error) => void): Promise<boolean>
```

Delete a file. Resolves `true` if the file was deleted, `false` if it did not exist or deletion
failed. Never rejects — a caller that needs to react to a real failure passes `onError`, called
only when deletion fails for a reason other than the file not existing (`fs.stat` confirms
existence first, so a missing file and a genuine I/O error are told apart by the underlying
`ENOENT` code).

```ts
const deleted = await deleteFile('/tmp/upload-42.tmp', (error) => logger.error(error))
```
