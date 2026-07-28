import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { deleteFile } from '../src'

describe('(deleteFile) delete target file in the filesystem', () => {
    let directory: string

    beforeEach(async () => {
        directory = await fs.mkdtemp(path.join(os.tmpdir(), 'js-toolkit-'))
    })

    afterEach(async () => {
        await fs.rm(directory, { recursive: true, force: true })
    })

    test('deletes an existing file and resolves true', async () => {
        const filePath = path.join(directory, 'file.txt')
        await fs.writeFile(filePath, 'content')

        await expect(deleteFile(filePath)).resolves.toBe(true)
        await expect(fs.stat(filePath)).rejects.toMatchObject({ code: 'ENOENT' })
    })

    test('resolves false when the file does not exist, without calling onError', async () => {
        const onError = jest.fn<undefined, [Error]>()

        await expect(deleteFile(path.join(directory, 'missing.txt'), onError)).resolves.toBe(false)
        expect(onError).not.toHaveBeenCalled()
    })

    test('resolves false and forwards the error when deletion fails for another reason', async () => {
        // a directory exists (stat succeeds) but cannot be unlinked like a file
        const onError = jest.fn<undefined, [Error]>()

        await expect(deleteFile(directory, onError)).resolves.toBe(false)
        expect(onError).toHaveBeenCalledTimes(1)
        // the error crosses from Node's fs realm into jsdom's, so check shape rather than `instanceof Error`
        expect(typeof onError.mock.calls[0]?.[0].message).toBe('string')
    })

    test('does not throw when no onError callback is provided on a non-ENOENT error', async () => {
        await expect(deleteFile(directory)).resolves.toBe(false)
    })
})
