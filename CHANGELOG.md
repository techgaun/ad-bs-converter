# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project
adheres to [Semantic Versioning](https://semver.org/).

## [0.6.0] - 2026-11-11

### Fixed

- Corrected the month lengths for BS years 2082 and 2083. The rows shipped since 2017 were
  provisional predictions; they are now aligned with the published calendar and with the
  independent `nepali-date-converter`, `@remotemerge/nepali-date-converter` and
  `@sbmdkl/nepali-date-converter` tables. Conversions in the second half of those years were
  previously off by one day (for example `ad2bs('2026/11/11')` returned 2083/7/26 instead of
  2083/7/25).

  | Year | Old row (Baisakh - Chaitra)                       | New row                                           |
  | ---- | ------------------------------------------------- | ------------------------------------------------- |
  | 2082 | 31 31 32 31 31 30 30 30 29 30 30 30 (365)         | 31 31 32 31 31 31 30 29 30 29 30 30 (365)         |
  | 2083 | 31 31 32 31 31 30 30 30 29 30 30 30 (365)         | 31 31 32 31 31 31 30 29 30 29 30 30 (365)         |

- Restored the month lengths for BS years 2004, 2062 and 2087 to the values published in 0.5.0.
  PR #11 (Feb 2024, on `master` only, never released) corrected 2081 but at the same time rewrote
  these three rows to values that match no reference library. The restored rows were verified
  against two independent implementations, `nepali-date-converter` and
  `@remotemerge/nepali-date-converter`; the yearly totals are unchanged, so only the days around
  the affected month boundaries move.

  | Year | Row on `master` (Baisakh - Chaitra)       | Restored row                              |
  | ---- | ----------------------------------------- | ----------------------------------------- |
  | 2004 | 30 32 31 32 31 30 30 30 30 29 29 31 (365) | 30 32 31 32 31 30 30 30 29 30 29 31 (365) |
  | 2062 | 31 31 31 32 31 31 29 30 29 30 29 31 (365) | 30 32 31 32 31 31 29 30 29 30 29 31 (365) |
  | 2087 | 31 31 32 31 31 31 30 29 30 30 30 30 (366) | 31 31 32 31 31 31 30 30 29 30 30 30 (366) |

- `ad2bs()` no longer crashes with a `TypeError` when walking past the end of the calendar table
  (in the 0.5.0 npm release this happened for every AD date after 2036-04-14). The conversion now
  works for every day in the table and throws a descriptive `RangeError` beyond it.

### Added

- TypeScript source with bundled type declarations; the package is published as ESM (`import`)
  and CommonJS (`require`) through an `exports` map.
- `ad2bs()` accepts a `Date` object; both functions accept `{ year, month, day }` objects and
  `yyyy-mm-dd` strings in addition to `yyyy/mm/dd`.
- `SUPPORTED_RANGE` constant, plus `CALENDAR_DATA`, `MIN_BS_YEAR` and `MAX_BS_YEAR` exports.
- Exported types: `AdDate`, `AdDateInput`, `BsDate`, `BsDateFields`, `BsDateInput`, `DateParts`,
  `SupportedRange`, `YearData`.
- Malformed input, impossible dates and out-of-range dates throw `RangeError` with a clear message
  (previously the behaviour was undefined: wrong results or a `TypeError`).
- Test suite migrated to vitest, with a round-trip test over every day in the table and a
  cross-check of every day in 2000 - 2090 BS against `nepali-date-converter`.
- GitHub Actions CI (Node 18 / 20 / 22) replacing Travis; ESLint and Prettier.

### Changed

- Calendar data for BS 2101 - 2199 (already on `master`, never published to npm) is included.
- `engines.node` is now `>=18`.

### Notes

- Years 2091 BS and later remain provisional (no official source yet) and may change. The
  Feb 2024 data contribution shortened 2092 BS from 366 to 365 days, so `2092/12/30` now maps to
  2036-04-13 (it was 2036-04-14 in 0.5.0) and 2093/1/1 is 2036-04-14; the corresponding unit
  test was updated to the current table.
- With the 2004/2062/2087 rows restored, the cross-check against `nepali-date-converter` is clean
  for every day of 2000 - 2090 BS. `test/crosscheck.test.ts` keeps a `KNOWN_DISAGREEMENTS` list
  (currently empty) for documenting any future, deliberate divergence.

## 0.5.0 - 2017

Last release of the original CommonJS implementation.

[0.6.0]: https://github.com/techgaun/ad-bs-converter/compare/fd76e5a...master
