// Verifies the built ESM entry point works via `import`.
import assert from 'node:assert/strict';

import { ad2bs, bs2ad, SUPPORTED_RANGE } from 'ad-bs-converter';

assert.equal(typeof ad2bs, 'function', 'ad2bs must be exported');
assert.equal(typeof bs2ad, 'function', 'bs2ad must be exported');
assert.equal(typeof SUPPORTED_RANGE, 'object', 'SUPPORTED_RANGE must be exported');

const bs = ad2bs(new Date(1990, 7, 10));
assert.deepEqual(
  { year: bs.en.year, month: bs.en.month, day: bs.en.day, ne: bs.ne.year },
  { year: 2047, month: 4, day: 26, ne: '२०४७' },
);

const ad = bs2ad({ year: 2047, month: 4, day: 26 });
assert.deepEqual(
  { year: ad.year, month: ad.month, day: ad.day },
  { year: 1990, month: 8, day: 10 },
);

assert.throws(() => bs2ad('2300/1/1'), RangeError);

console.log('smoke (esm): ok');
