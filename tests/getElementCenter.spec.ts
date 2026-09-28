import { getElementCenter } from '../src'
import { stubRect } from './_helpers/dom'

describe('getElementCenter', () => {
    test('calculates the center of a given element', () => {
        expect(
            getElementCenter(
                stubRect({
                    left: 0,
                    top: 0,
                    width: 100,
                    height: 200
                })
            )
        ).toEqual([50, 100])
    })

    test('handles element with zero width and height', () => {
        expect(
            getElementCenter(
                stubRect({
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                })
            )
        ).toEqual([0, 0])
    })

    test('calculates the center of a positioned element', () => {
        expect(
            getElementCenter(
                stubRect({
                    left: 100,
                    top: 150,
                    width: 200,
                    height: 300
                })
            )
        ).toEqual([200, 300])
    })
})
