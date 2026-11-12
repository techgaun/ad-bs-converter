/**
 * Walks every single day of the calendar table in both directions. Besides
 * guaranteeing ad2bs/bs2ad are inverses of each other it also guarantees that
 * neither function throws anywhere inside SUPPORTED_RANGE (0.5.0 crashed with a
 * TypeError once the AD date walked past the end of the table).
 *
 * The loops collect mismatches and assert once at the end: a per-day `expect`
 * is far too slow for ~82,000 iterations.
 */
import { describe, expect, it } from 'vitest';

import { ad2bs, bs2ad, CALENDAR_DATA, MAX_BS_YEAR, MIN_BS_YEAR, SUPPORTED_RANGE } from '../src';

const MS_PER_DAY = 86_400_000;

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

function* everyAdDay(): Generator<Parts> {
  const { start, end } = SUPPORTED_RANGE.ad;
  const first = Date.UTC(start.year, start.month - 1, start.day);
  const last = Date.UTC(end.year, end.month - 1, end.day);
  for (let t = first; t <= last; t += MS_PER_DAY) {
    const d = new Date(t);
    yield { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
  }
}

function row(year: number) {
  const r = CALENDAR_DATA[year];
  if (r === undefined) throw new Error(`missing row for ${year}`);
  return r;
}

function nextBsDay(d: Parts): Parts {
  if (d.day < (row(d.year)[d.month - 1] ?? 0)) return { ...d, day: d.day + 1 };
  if (d.month < 12) return { year: d.year, month: d.month + 1, day: 1 };
  return { year: d.year + 1, month: 1, day: 1 };
}

function totalTableDays(): number {
  let total = 0;
  for (let year = MIN_BS_YEAR; year <= MAX_BS_YEAR; year++) total += row(year)[12];
  return total;
}

describe('round trip across the whole supported range', () => {
  it('ad2bs -> bs2ad is the identity for every AD day in the table', () => {
    const problems: string[] = [];
    let count = 0;
    let previousBs: Parts | undefined;
    let previousDow: number | undefined;

    for (const ad of everyAdDay()) {
      const bs = ad2bs(ad).en;
      const back = bs2ad(bs);
      if (!same(back, ad)) {
        problems.push(`${fmt(ad)} -> ${fmt(bs)} BS -> ${fmt(back)}`);
      }
      // Consecutive AD days must map to consecutive BS days ...
      if (previousBs !== undefined && !same(bs, nextBsDay(previousBs))) {
        problems.push(`${fmt(ad)}: ${fmt(previousBs)} BS was followed by ${fmt(bs)} BS`);
      }
      // ... and weekdays must advance by one, in both outputs.
      if (previousDow !== undefined && bs.dayOfWeek !== (previousDow + 1) % 7) {
        problems.push(`${fmt(ad)}: weekday jumped from ${previousDow} to ${bs.dayOfWeek}`);
      }
      if (back.dayOfWeek !== bs.dayOfWeek) {
        problems.push(
          `${fmt(ad)}: bs2ad weekday ${back.dayOfWeek} != ad2bs weekday ${bs.dayOfWeek}`,
        );
      }
      previousBs = bs;
      previousDow = bs.dayOfWeek;
      count++;
      if (problems.length > 20) break;
    }

    expect(problems, problems.join('\n')).toEqual([]);
    expect(previousBs !== undefined && same(previousBs, SUPPORTED_RANGE.bs.end)).toBe(true);
    expect(count).toBe(totalTableDays());
  });

  it('bs2ad -> ad2bs is the identity for every BS day in the table', () => {
    const problems: string[] = [];
    let count = 0;

    for (let year = MIN_BS_YEAR; year <= MAX_BS_YEAR; year++) {
      const r = row(year);
      for (let month = 1; month <= 12; month++) {
        const daysInMonth = r[month - 1] ?? 0;
        for (let day = 1; day <= daysInMonth; day++) {
          const bs: Parts = { year, month, day };
          const ad = bs2ad(bs);
          const back = ad2bs(ad).en;
          if (!same(back, bs) || back.totalDaysInMonth !== daysInMonth) {
            problems.push(
              `${fmt(bs)} BS -> ${fmt(ad)} -> ${fmt(back)} (${back.totalDaysInMonth} days)`,
            );
          }
          count++;
        }
      }
      if (problems.length > 20) break;
    }

    expect(problems, problems.join('\n')).toEqual([]);
    expect(count).toBe(totalTableDays());
  });

  it('the day after the last supported day is rejected in both calendars', () => {
    const { ad, bs } = SUPPORTED_RANGE;
    const next = new Date(Date.UTC(ad.end.year, ad.end.month - 1, ad.end.day + 1));
    expect(() =>
      ad2bs({ year: next.getUTCFullYear(), month: next.getUTCMonth() + 1, day: next.getUTCDate() }),
    ).toThrow(RangeError);
    expect(() => bs2ad({ year: bs.end.year + 1, month: 1, day: 1 })).toThrow(RangeError);
    expect(() => bs2ad({ ...bs.end, day: bs.end.day + 1 })).toThrow(RangeError);
  });
});
