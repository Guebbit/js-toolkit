/**
 * TYPES — Node: the one helper that only runs outside a browser (see
 * tests/getUrlQueries.node.spec.ts for its runtime counterpart).
 */
import { expectTypeOf } from 'expect-type'
import * as toolkit from '../../src'

expectTypeOf(toolkit.deleteFile).not.toBeAny()

expectTypeOf(toolkit.deleteFile).toEqualTypeOf<
    (filePath: string, onError?: (error: Error) => void) => Promise<boolean>
>()

// @ts-expect-error -- filePath is required, not optional
void toolkit.deleteFile()
