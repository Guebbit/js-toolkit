import fc from 'fast-check'

/**
 * A fixed seed makes every property run reproducible.
 *
 * Mutation testing gates on a per-file score, and that score has to be a
 * property of the tests rather than of the day: with a random seed a mutant can
 * be killed on one run and survive the next, so a file's baseline would drift on
 * its own and a real regression would be indistinguishable from noise.
 *
 * To explore beyond this seed, run the suite with FAST_CHECK_SEED set, and
 * optionally more cases than the per-commit run uses:
 *   FAST_CHECK_SEED=$RANDOM FAST_CHECK_RUNS=1000 npm test
 * The nightly workflow does exactly that. Anything it finds should be committed
 * as a named regression case, not left to a lucky seed to rediscover.
 */
fc.configureGlobal({
    seed: process.env.FAST_CHECK_SEED ? Number(process.env.FAST_CHECK_SEED) : 42,
    numRuns: process.env.FAST_CHECK_RUNS ? Number(process.env.FAST_CHECK_RUNS) : 100
})
