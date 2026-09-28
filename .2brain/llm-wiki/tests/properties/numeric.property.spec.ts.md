---
source: tests/properties/numeric.property.spec.ts
sha256: 0dfd4c078e272788b94877ccda8ef29cf79fb2c5351f3fbfddfca231118771e2
generated_at: 2026-09-28T19:54:43.880422+00:00
model: ollama:qwen3.8:27b
---

# tests/properties/numeric.property.spec.ts

## Purpose

Property-based test suite (fast-check) for the four numeric geometry helpers exported from `src/index.ts`: `getDelta`, `getMapDistance`, `rangeOverlaps`, and `getOverlapRange`. It encodes invariants (non-negativity, symmetry, translation invariance, boundedness, cross-function consistency) as universally-quantified properties rather than point examples, catching off-by-one, sign, and argument-order bugs that a handful of concrete cases would miss.

## Key elements

- **`coordinate`** – fast-check arbitrary: integer in [−10 000, 10 000]. Used for single-axis values.
- **`circumference`** – arbitrary: integer in [1, 10 000]. Represents the size of a wrapping space.
- **`range`** – arbitrary: ordered pair `[min, max]` of integers in [−1000, 1000], guaranteed `start ≤ end`.
- **`(getDelta) properties`** – 8 properties: non-negativity, operand symmetry, zero-iff-equal (linear), translation invariance, equals |a−b| on linear space, ≤ half-circumference on wrapping space, lap-periodicity, and never longer than the linear distance.
- **`(getMapDistance) properties`** – 5 properties: non-negativity, zero for self, point-pair symmetry, equals `Math.hypot` on unbounded map, and wrapping never increases distance.
- **`(rangeOverlaps) properties`** – 6 properties: non-negativity, range symmetry, bounded by shorter range, identity for self, zero for disjoint ranges, and the `same=true` flag adds exactly 1 to a real overlap.
- **`(getOverlapRange) properties`** – 5 properties: symmetry, returned range is contained in both inputs, never inverted/empty, width equals `rangeOverlaps` result, and identity for self.

## Relationships

- **`src/index.ts`** – sole module under test. The file imports `getDelta`, `getMapDistance`, `getOverlapRange`, and `rangeOverlaps` from `../../src` (resolves to `src/index.ts`). No other project files are touched.

## Notes

- **Integers are deliberate.** The file comment states that a float generator would force tolerance-based assertions and mask small errors. All arbitraries are `fc.integer`.
- **`range` enforces `start ≤ end`** by construction (`.map` with `Math.min`/`Math.max`). The comment makes explicit that an inverted range is a caller error, not a contract the SUT must handle.
- **`rangeOverlaps` has a `same` boolean parameter** (default `false`). When `true`, a single shared boundary unit is counted, adding exactly 1 to the plain overlap. The property pins this delta.
- **`getOverlapRange` signals "no overlap" with `[0, 0]`**, not `null` or `undefined`. Several properties special-case this sentinel.
- **Cross-function consistency is tested explicitly**: `getOverlapRange` width must equal `rangeOverlaps`, and `getMapDistance` must equal `Math.hypot` of the two `getDelta` components on an unbounded map. A regression in either function is caught by the paired assertion.
