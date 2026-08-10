import getDelta from './getDelta.js'

/**
 * Distance between 2 points, like coordinates on a map A(x,y) & B(x,y)
 *
 * With a positive {size} both axes wrap, so the distance is measured across
 * the map edge whenever that is shorter — the usual behaviour for a tiled or
 * toroidal map.
 *
 * @param {number} Xa - coordinate X of point A
 * @param {number} Xb - coordinate X of point B
 * @param {number} Ya - coordinate Y of point A
 * @param {number} Yb - coordinate Y of point B
 * @param {number} size - length of a map side, 0 for an unbounded map
 */
export default (Xa: number, Xb: number, Ya: number, Yb: number, size = 0): number =>
    Math.hypot(getDelta(Xa, Xb, size), getDelta(Ya, Yb, size))
