import fs from 'node:fs/promises'

/**
 * Delete target file in the filesystem
 * Resolves to true if the file was deleted, false if it didn't exist or an error occurred
 *
 * @param filePath
 * @param onError - optional callback invoked when deletion fails for a reason other than the file not existing
 */
export default (filePath: string, onError?: (error: Error) => void): Promise<boolean> =>
    fs
        .stat(filePath)
        // delete it
        .then(() => fs.unlink(filePath))
        .then(() => true)
        .catch((error: unknown) => {
            // file doesn't exist
            if ((error as Error & { code?: string }).code === 'ENOENT') return false
            // other error occurred
            onError?.(error as Error)
            return false
        })
