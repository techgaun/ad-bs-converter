import { describe, expect, it } from 'vitest';

import { CALENDAR_DATA, MAX_BS_YEAR, MIN_BS_YEAR } from '../src';

describe('calendar data', () => {
  const years = Object.keys(CALENDAR_DATA).map(Number);

  it('covers every year from MIN_BS_YEAR to MAX_BS_YEAR without gaps', () => {
    expect(Math.min(...years)).toBe(MIN_BS_YEAR);
    expect(Math.max(...years)).toBe(MAX_BS_YEAR);
    expect(years).toHaveLength(MAX_BS_YEAR - MIN_BS_YEAR + 1);
  });

  it.each(years)('year %i has 12 plausible month lengths that sum to its total', (year) => {
    const row = CALENDAR_DATA[year];
    expect(row).toBeDefined();
    if (row === undefined) return;
    expect(row).toHaveLength(13);
    const months = row.slice(0, 12);
    for (const days of months) {
      expect(days).toBeGreaterThanOrEqual(29);
      expect(days).toBeLessThanOrEqual(32);
    }
    const total = months.reduce((sum, days) => sum + days, 0);
    expect(total).toBe(row[12]);
    expect(total === 365 || total === 366 || total === 364).toBe(true);
  });

  it('has the corrected rows for 2081-2083', () => {
    expect(CALENDAR_DATA[2081]).toEqual([31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31, 366]);
    expect(CALENDAR_DATA[2082]).toEqual([31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30, 365]);
    expect(CALENDAR_DATA[2083]).toEqual([31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30, 365]);
  });
});
