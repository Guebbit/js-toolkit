/**
 * TYPES — browser platform: clipboard, downloads, cookies, query strings, FormData, and the
 * client-side file checks (formatFileSize, isAcceptedFileType, isWithinFileSize).
 */
import { expectTypeOf } from 'expect-type'
import * as toolkit from '../../src'
import type { IFormatFileSizeOptions, ISetCookieOptions } from '../../src'
import { fakeFile } from './_fixtures'

expectTypeOf(toolkit.copyToClipboard).not.toBeAny()
expectTypeOf(toolkit.downloadBlob).not.toBeAny()
expectTypeOf(toolkit.getCookie).not.toBeAny()
expectTypeOf(toolkit.setCookie).not.toBeAny()
expectTypeOf(toolkit.deleteCookie).not.toBeAny()
expectTypeOf(toolkit.getUrlQueries).not.toBeAny()
expectTypeOf(toolkit.setUrlQueries).not.toBeAny()
expectTypeOf(toolkit.toFormData).not.toBeAny()
expectTypeOf(toolkit.formatFileSize).not.toBeAny()
expectTypeOf(toolkit.isAcceptedFileType).not.toBeAny()
expectTypeOf(toolkit.isWithinFileSize).not.toBeAny()

expectTypeOf(toolkit.copyToClipboard).toEqualTypeOf<(text: string) => Promise<boolean>>()
expectTypeOf(toolkit.toFormData).returns.toEqualTypeOf<FormData>()

expectTypeOf(toolkit.getUrlQueries).returns.toEqualTypeOf<Record<string, string | string[]>>()
expectTypeOf(toolkit.setUrlQueries).returns.toEqualTypeOf<string>()

// Both interfaces are reachable from the package root. Without them a consumer cannot name the
// argument they are about to build, and ends up re-declaring the shape by hand.
expectTypeOf<ISetCookieOptions>().toEqualTypeOf<{
    days?: number
    path?: string
    domain?: string
    secure?: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
}>()
expectTypeOf<ISetCookieOptions['sameSite']>().toEqualTypeOf<'Strict' | 'Lax' | 'None' | undefined>()
expectTypeOf(toolkit.setCookie).parameters.toEqualTypeOf<[string, string, ISetCookieOptions?]>()

expectTypeOf(toolkit.getCookie).toEqualTypeOf<(name: string) => string | undefined>()
expectTypeOf(toolkit.deleteCookie).toEqualTypeOf<
    (name: string, path?: string, domain?: string) => void
>()

expectTypeOf(toolkit.downloadBlob).toEqualTypeOf<
    (data: Blob | BlobPart, filename: string, type?: string) => void
>()

// The options type is checked through the function's own signature rather than
// redeclared here: IFormatFileSizeOptions.unit is TFileSizeUnit, a closed union
// derived from the binary/decimal unit tables, and that type is not itself part
// of the barrel's public surface (see src/formatFileSize.ts).
expectTypeOf(toolkit.formatFileSize).toEqualTypeOf<
    (bytes: number, options?: IFormatFileSizeOptions) => string
>()

expectTypeOf(toolkit.isAcceptedFileType(fakeFile, ['image/*'])).toEqualTypeOf<boolean>()
expectTypeOf(toolkit.isWithinFileSize(fakeFile, 2048)).toEqualTypeOf<boolean>()

// @ts-expect-error -- filename is required, not optional
toolkit.downloadBlob(new Blob(['x']))

// @ts-expect-error -- name is required, not optional
toolkit.getCookie()

// @ts-expect-error -- name is required, not optional
toolkit.deleteCookie()

// @ts-expect-error -- accepted has to be an array of patterns, not a bare string
toolkit.isAcceptedFileType(fakeFile, 'image/*')

// @ts-expect-error -- maxBytes is a number, not a string
toolkit.isWithinFileSize(fakeFile, '2048')
