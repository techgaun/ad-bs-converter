// Verifies the built CommonJS entry point works via `require()`.
const assert = require('node:assert/strict');

const adbs = require('..');

assert.equal(typeof adbs.ad2bs, 'function', 'ad2bs must be exported');
assert.equal(typeof adbs.bs2ad, 'function', 'bs2ad must be exported');
assert.equal(typeof adbs.SUPPORTED_RANGE, 'object', 'SUPPORTED_RANGE must be exported');

const bs = adbs.ad2bs('1990/8/10');
assert.deepEqual(
  { year: bs.en.year, month: bs.en.month, day: bs.en.day, ne: bs.ne.year },
  { year: 2047, month: 4, day: 26, ne: '२०४७' },
);

const ad = adbs.bs2ad('2047/4/26');
assert.deepEqual(
  { year: ad.year, month: ad.month, day: ad.day },
  { year: 1990, month: 8, day: 10 },
);

assert.throws(() => adbs.ad2bs('1900/1/1'), RangeError);

console.log('smoke (cjs): ok');
