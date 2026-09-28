/**
 * @module
 * Deletes a file without ever throwing. `fs.stat` confirms the file exists, `fs.unlink` removes
 * it, and both a missing file and a real I/O error resolve to `false` — the only difference is
 * that a real error is also handed to `onError`, so a caller who does not care can ignore it.
 */

import fs from 'node:fs/promises'

/**
 * Delete a file from the filesystem.
 *
 * Resolves to `true` if the file was deleted, `false` if it didn't exist or deletion failed.
 * Never rejects — a caller that needs to react to failure passes `onError`.
 *
 * @param filePath - path of the file to delete
 * @param onError - invoked when deletion fails for a reason other than the file not existing
 */
export default (filePath: string, onError?: (error: Error) => void): Promise<boolean> =>
    fs
        .stat(filePath)
        // delete it
        .then(() => fs.unlink(filePath))
        .then(() => true)
        .catch((error: unknown) => {
            // node:fs: a missing file rejects with an Error whose `code` is 'ENOENT'
            if ((error as Error & { code?: string }).code === 'ENOENT') return false
            // other error occurred
            onError?.(error as Error)
            return false
        })
