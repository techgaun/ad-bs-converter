/**
 * Cross-checks every day in the overlap between this library and
 * `nepali-date-converter` (an independent implementation with its own table).
 *
 * `nepali-date-converter` supports 2000/01/01 - 2090/12/30 BS
 * (1943-04-14 - 2034-04-13 AD), so that is the range compared here. It guards
 * against accidental drift in `src/data.ts` for the years that matter most.
 */
import NepaliDate from 'nepali-date-converter';
import { describe, expect, it } from 'vitest';

import { ad2bs, bs2ad, CALENDAR_DATA } from '../src';

const CROSSCHECK_FIRST_BS_YEAR = 2000;
const CROSSCHECK_LAST_BS_YEAR = 2090;
const MS_PER_DAY = 86_400_000;

/**
 * Years where the two tables are known to differ. These are NOT silently
 * accepted: `known disagreements are still real` below fails as soon as one of
 * them is resolved, so the entry has to be removed deliberately.
 *
 * In each case the two tables place a single day in a different one of two
 * adjacent months; the yearly totals agree, so dates outside the affected
 * window are unaffected. No authoritative source was available to settle them
 * when the cross-check was added, so the historic rows are kept unchanged.
 *
 * - 2004 BS: Paush/Magh 30/29 here vs 29/30 in nepali-date-converter.
 * - 2062 BS: Baisakh/Jestha 31/31 here vs 30/32 in nepali-date-converter.
 * - 2087 BS: Mangsir/Paush 29/30 here vs 30/29 in nepali-date-converter.
 */
const KNOWN_DISAGREEMENTS: Readonly<Record<number, string>> = {
  2004: 'Paush/Magh 2004: 30/29 here vs 29/30 in nepali-date-converter',
  2062: 'Baisakh/Jestha 2062: 31/31 here vs 30/32 in nepali-date-converter',
  2087: 'Mangsir/Paush 2087: 29/30 here vs 30/29 in nepali-date-converter',
};

interface Parts {
  year: number;
  month: number;
  day: number;
}

function fmt(d: Parts): string {
  return `${d.year}/${d.month}/${d.day}`;
}

function same(a: Parts, b: Parts): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

function isKnown(...dates: Parts[]): boolean {
  return dates.some((d) => d.year in KNOWN_DISAGREEMENTS);
}

function toParts(d: Date): Parts {
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

function row(year: number) {
  const r = CALENDAR_DATA[year];
  if (r === undefined) throw new Error(`missing row for ${year}`);
  return r;
}

/** Month lengths of `year` according to nepali-date-converter. */
function theirMonthLengths(year: number): number[] {
  const lengths: number[] = [];
  for (let month = 0; month < 12; month++) {
    const start = new NepaliDate(year, month, 1).toJsDate();
    let end: Date;
    if (month < 11) {
      end = new NepaliDate(year, month + 1, 1).toJsDate();
    } else if (year < CROSSCHECK_LAST_BS_YEAR) {
      end = new NepaliDate(year + 1, 0, 1).toJsDate();
    } else {
      // Their table ends at 2090/12/30; the day after it is outside their range.
      const last = new NepaliDate(year, 11, 30).toJsDate();
      end = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
    }
    const s = toParts(start);
    const e = toParts(end);
    lengths.push(
      Math.round(
        (Date.UTC(e.year, e.month - 1, e.day) - Date.UTC(s.year, s.month - 1, s.day)) / MS_PER_DAY,
      ),
    );
  }
  return lengths;
}

describe('cross-check against nepali-date-converter', () => {
  const adStart = bs2ad({ year: CROSSCHECK_FIRST_BS_YEAR, month: 1, day: 1 });
  const adEnd = bs2ad({
    year: CROSSCHECK_LAST_BS_YEAR,
    month: 12,
    day: row(CROSSCHECK_LAST_BS_YEAR)[11],
  });

  it(`AD -> BS agrees for every day from ${fmt(adStart)} to ${fmt(adEnd)}`, () => {
    const mismatches: string[] = [];
    let count = 0;
    const first = Date.UTC(adStart.year, adStart.month - 1, adStart.day);
    const last = Date.UTC(adEnd.year, adEnd.month - 1, adEnd.day);
    for (let t = first; t <= last; t += MS_PER_DAY) {
      const d = new Date(t);
      const ad: Parts = {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
      };
      const ours = ad2bs(ad).en;
      const theirs = new NepaliDate(new Date(ad.year, ad.month - 1, ad.day));
      const expected: Parts = {
        year: theirs.getYear(),
        month: theirs.getMonth() + 1,
        day: theirs.getDate(),
      };
      if (!same(ours, expected) && !isKnown(ours, expected)) {
        mismatches.push(`${fmt(ad)} AD: ours ${fmt(ours)} vs theirs ${fmt(expected)}`);
      }
      count++;
    }
    expect(count).toBeGreaterThan(33_000);
    expect(mismatches, mismatches.slice(0, 10).join('\n')).toEqual([]);
  });

  it(`BS -> AD agrees for every day from ${CROSSCHECK_FIRST_BS_YEAR} to ${CROSSCHECK_LAST_BS_YEAR} BS`, () => {
    const mismatches: string[] = [];
    for (let year = CROSSCHECK_FIRST_BS_YEAR; year <= CROSSCHECK_LAST_BS_YEAR; year++) {
      if (year in KNOWN_DISAGREEMENTS) continue;
      const r = row(year);
      for (let month = 1; month <= 12; month++) {
        const daysInMonth = r[month - 1] ?? 0;
        for (let day = 1; day <= daysInMonth; day++) {
          const bs: Parts = { year, month, day };
          const ours = bs2ad(bs);
          let expected: Parts;
          try {
            expected = toParts(new NepaliDate(year, month - 1, day).toJsDate());
          } catch (error) {
            mismatches.push(`${fmt(bs)} BS: nepali-date-converter threw ${String(error)}`);
            continue;
          }
          if (!same(ours, expected)) {
            mismatches.push(`${fmt(bs)} BS: ours ${fmt(ours)} vs theirs ${fmt(expected)}`);
          }
        }
      }
    }
    expect(mismatches, mismatches.slice(0, 10).join('\n')).toEqual([]);
  });

  it('month lengths agree for every year in the overlap', () => {
    const mismatches: string[] = [];
    for (let year = CROSSCHECK_FIRST_BS_YEAR; year <= CROSSCHECK_LAST_BS_YEAR; year++) {
      if (year in KNOWN_DISAGREEMENTS) continue;
      const ours = row(year).slice(0, 12);
      const theirs = theirMonthLengths(year);
      if (JSON.stringify(ours) !== JSON.stringify(theirs)) {
        mismatches.push(`${year}: ours [${ours.join(', ')}] vs theirs [${theirs.join(', ')}]`);
      }
    }
    expect(mismatches, mismatches.join('\n')).toEqual([]);
  });

  it('known disagreements are still real (remove the entry once resolved)', () => {
    for (const [yearKey, note] of Object.entries(KNOWN_DISAGREEMENTS)) {
      const year = Number(yearKey);
      const ours = row(year).slice(0, 12);
      const theirs = theirMonthLengths(year);
      expect(JSON.stringify(ours), note).not.toBe(JSON.stringify(theirs));
      // Even where the month boundaries differ, the year as a whole must line up.
      expect(
        ours.reduce((a, b) => a + b, 0),
        note,
      ).toBe(theirs.reduce((a, b) => a + b, 0));
    }
  });
});
