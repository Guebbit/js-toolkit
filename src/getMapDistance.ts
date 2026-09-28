/**
 * @module
 * Distance between two map points, reusing {getDelta} per axis so each axis
 * gets the same wrap-around treatment, then combining them with `Math.hypot`
 * for the straight-line distance between the two.
 */

import getDelta from './getDelta.js'

/**
 * Distance between 2 points, like coordinates on a map A(x,y) & B(x,y)
 *
 * With a positive {size} both axes wrap, so the distance is measured across
 * the map edge whenever that is shorter — the usual behaviour for a tiled or
 * toroidal map.
 *
 * @param Xa - coordinate X of point A
 * @param Xb - coordinate X of point B
 * @param Ya - coordinate Y of point A
 * @param Yb - coordinate Y of point B
 * @param size - length of a map side, 0 for an unbounded map
 */
export default (Xa: number, Xb: number, Ya: number, Yb: number, size = 0): number =>
    Math.hypot(getDelta(Xa, Xb, size), getDelta(Ya, Yb, size))
