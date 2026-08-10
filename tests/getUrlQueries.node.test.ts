/**
 * @jest-environment @stryker-mutator/jest-runner/jest-env/node
 *
 * Stryker's wrapper around the plain node environment, not `node` itself: the
 * stock environment reports no coverage back to Stryker, which fails the whole
 * mutation run on a missing-coverage error. Under a normal jest run it behaves
 * exactly like `node`.
 */
import { getUrlQueries } from '../src'

/**
 * The `typeof location === 'undefined'` default guards runtimes with no
 * `location` binding at all: SSR, a worker, a plain node script. It cannot be
 * exercised under jsdom, where `location` exists and is non-configurable, so
 * this one case runs in the node environment instead.
 */
describe('(getUrlQueries) outside a browser', () => {
    test('returns an empty object when there is no location to read', () => {
        expect(typeof location).toBe('undefined')
        expect(getUrlQueries()).toEqual({})
    })

    test('still parses a query string handed to it explicitly', () => {
        expect(getUrlQueries('?lorem=ipsum&dolor=sit')).toEqual({
            lorem: 'ipsum',
            dolor: 'sit'
        })
    })
})
