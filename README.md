# ad-bs-converter [![npm version](https://badge.fury.io/js/ad-bs-converter.svg)](http://badge.fury.io/js/ad-bs-converter) [![CI](https://github.com/techgaun/ad-bs-converter/actions/workflows/ci.yml/badge.svg)](https://github.com/techgaun/ad-bs-converter/actions/workflows/ci.yml)

Convert Bikram Sambat (BS, the Nepali calendar) dates to Anno Domini (AD, Gregorian) and vice-versa.

Written in TypeScript, published as both ESM and CommonJS with bundled type declarations. Requires
Node 22 or newer (CI runs on Node 22, 24 and 26; `.nvmrc` points at 26) and works in any modern
browser bundler.

_If you are looking for an ad-bs converter for Python, check out [ad-bs-converter.py](https://github.com/techgaun/ad-bs-converter.py)._

## Installation

```bash
npm install ad-bs-converter
```

## Usage

```ts
// ESM / TypeScript
import { ad2bs, bs2ad } from 'ad-bs-converter';

// CommonJS
const { ad2bs, bs2ad } = require('ad-bs-converter');
```

```ts
console.log(ad2bs('1990/8/10'));
console.log(bs2ad('2047/4/26'));
```

outputs

```js
{
  ne: {
    year: '२०४७',
    month: '४',
    day: '२६',
    strMonth: 'श्रावण',
    strShortMonth: 'श्रा',
    dayOfWeek: '५',
    strDayOfWeek: 'शुक्रबार',
    strShortDayOfWeek: 'शुक्र',
    strMinDayOfWeek: 'शु',
    totalDaysInMonth: '३२'
  },
  en: {
    year: 2047,
    month: 4,
    day: 26,
    strMonth: 'Shrawan',
    strShortMonth: 'Shra',
    dayOfWeek: 5,
    strDayOfWeek: 'Shukrabaar',
    strShortDayOfWeek: 'Shukra',
    strMinDayOfWeek: 'Shu',
    totalDaysInMonth: 32
  }
}
{
  year: 1990,
  month: 8,
  strMonth: 'August',
  strShortMonth: 'Aug',
  day: 10,
  dayOfWeek: 5,
  strDayOfWeek: 'Friday',
  strShortDayOfWeek: 'Fri'
}
```

### Accepted inputs

Both functions accept a `"yyyy/mm/dd"` string (a `-` separator and leading zeros are fine) or a
`{ year, month, day }` object. `ad2bs` additionally accepts a JavaScript `Date`, which is read in the
local time zone (`getFullYear()`, `getMonth()`, `getDate()`).

```ts
ad2bs('2026-11-11');
ad2bs({ year: 2026, month: 11, day: 11 });
ad2bs(new Date(2026, 10, 11));

bs2ad('2083/07/25');
bs2ad({ year: 2083, month: 7, day: 25 });
```

Months and days are always 1-based. `dayOfWeek` is `0` for Sunday through `6` for Saturday.

### Errors

Malformed input, impossible dates (for example `2083/7/31`, since Kartik 2083 has 30 days) and dates
outside the supported range throw a `RangeError` with a descriptive message.

```ts
try {
  ad2bs('1900/1/1');
} catch (error) {
  // RangeError: AD date 1900/1/1 is outside the supported range 1918/4/13 - 2143/4/18
}
```

### Supported range

```ts
import { SUPPORTED_RANGE } from 'ad-bs-converter';

SUPPORTED_RANGE.bs; // { start: { year: 1975, month: 1, day: 1 }, end: { year: 2199, month: 12, day: 30 } }
SUPPORTED_RANGE.ad; // { start: { year: 1918, month: 4, day: 13 }, end: { year: 2143, month: 4, day: 18 } }
```

The calendar table lives in [`src/data.ts`](src/data.ts) and is also exported as `CALENDAR_DATA`
(with `MIN_BS_YEAR` / `MAX_BS_YEAR`) for anyone who needs the raw month lengths.

### A note on data accuracy

The Bikram Sambat calendar is not computed from a formula: month lengths are published by Nepal's
Panchanga Nirnayak Samiti year by year. This library therefore ships a lookup table.

- **1978 - 2090 BS**: considered reliable. Every day in 2000 - 2090 BS is cross-checked in CI
  against the independent [`nepali-date-converter`](https://www.npmjs.com/package/nepali-date-converter)
  table with no disagreements (see [`test/crosscheck.test.ts`](test/crosscheck.test.ts)).
- **2082 and 2083 BS** were corrected in v0.6.0; earlier releases carried provisional 2017-era
  predictions that were off by a day in the second half of those years (see the
  [changelog](CHANGELOG.md)).
- **2004, 2062 and 2087 BS**: PR #11 (2024, never published to npm) fixed 2081 but also rewrote
  these three rows to values that match no reference library. v0.6.0 restores the original rows,
  which agree with both `nepali-date-converter` and `@remotemerge/nepali-date-converter`.
- **2091 BS and later** are provisional. No official data exists yet and different sources disagree;
  the rows are kept so conversions keep working but they may change in a future release.

If you spot a discrepancy, please open an issue with the source you are comparing against.

### TypeScript

All inputs and outputs are typed:

```ts
import type {
  AdDate,
  AdDateInput,
  BsDate,
  BsDateInput,
  DateParts,
  SupportedRange,
} from 'ad-bs-converter';
```

## Development

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run lint        # eslint + prettier --check
npm test            # vitest (unit, round-trip and cross-check suites)
npm run build       # tsup -> dist/ (ESM + CJS + .d.ts)
npm run smoke       # require()/import the built package
```

## License

ISC
