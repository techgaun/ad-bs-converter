import getNepaliNumber from 'get-nepali-number';
import getNepDayOfWeek from 'get-nepday-of-week';

import { CALENDAR_DATA, MAX_BS_YEAR, MIN_BS_YEAR, type YearData } from './data';
import type { AdDate, AdDateInput, BsDate, BsDateInput, DateParts, SupportedRange } from './types';

// ---------------------------------------------------------------------------
// Static names
// ---------------------------------------------------------------------------

const NE_MONTHS = [
  'बैशाख',
  'जेष्ठ',
  'आषाढ',
  'श्रावण',
  'भाद्र',
  'आश्विन',
  'कार्तिक',
  'मंसिर',
  'पौष',
  'माघ',
  'फाल्गुन',
  'चैत्र',
] as const;

const NE_MONTHS_SHORT = [
  'बै',
  'जे',
  'आषा',
  'श्रा',
  'भा',
  'आश',
  'का',
  'मं',
  'पौ',
  'मा',
  'फा',
  'चै',
] as const;

const EN_MONTHS = [
  'Baisakh',
  'Jestha',
  'Ashadh',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Paush',
  'Mangh',
  'Falgun',
  'Chaitra',
] as const;

const EN_MONTHS_SHORT = [
  'Bai',
  'Je',
  'As',
  'Shra',
  'Bha',
  'Ash',
  'Kar',
  'Mang',
  'Pau',
  'Ma',
  'Fal',
  'Chai',
] as const;

const GREGORIAN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const GREGORIAN_MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const GREGORIAN_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const GREGORIAN_DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

// ---------------------------------------------------------------------------
// Calendar arithmetic
// ---------------------------------------------------------------------------

const MS_PER_DAY = 86_400_000;

/**
 * Anchor pair used to align the two calendars: 2073/10/29 BS is 2017-02-11 AD
 * (a Saturday). Every other date is derived from the calendar table relative
 * to this pair.
 */
const ANCHOR_BS: DateParts = { year: 2073, month: 10, day: 29 };
const ANCHOR_AD: DateParts = { year: 2017, month: 2, day: 11 };

function yearRow(year: number): YearData {
  const row = CALENDAR_DATA[year];
  if (row === undefined) {
    throw new RangeError(`No calendar data for BS year ${year}`);
  }
  return row;
}

/** Number of days from the start of the table (MIN_BS_YEAR/1/1) to the start of each year. */
const YEAR_START_ORDINAL: number[] = [];
let runningTotal = 0;
for (let year = MIN_BS_YEAR; year <= MAX_BS_YEAR; year++) {
  YEAR_START_ORDINAL.push(runningTotal);
  runningTotal += yearRow(year)[12];
}
/** Total number of days covered by the table. */
const TABLE_DAYS = runningTotal;

/** Days since MIN_BS_YEAR/1/1 for a (validated) BS date. */
function bsToOrdinal(date: DateParts): number {
  const row = yearRow(date.year);
  let ordinal = YEAR_START_ORDINAL[date.year - MIN_BS_YEAR] ?? 0;
  for (let m = 0; m < date.month - 1; m++) {
    ordinal += row[m] ?? 0;
  }
  return ordinal + date.day - 1;
}

/** Inverse of {@link bsToOrdinal}. */
function ordinalToBs(ordinal: number): DateParts {
  // Binary search for the year whose start ordinal is <= ordinal.
  let lo = 0;
  let hi = YEAR_START_ORDINAL.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if ((YEAR_START_ORDINAL[mid] ?? 0) <= ordinal) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  const year = MIN_BS_YEAR + lo;
  const row = yearRow(year);
  let remaining = ordinal - (YEAR_START_ORDINAL[lo] ?? 0);
  let month = 1;
  while (month <= 12 && remaining >= (row[month - 1] ?? 0)) {
    remaining -= row[month - 1] ?? 0;
    month++;
  }
  return { year, month, day: remaining + 1 };
}

/** Whole days since the Unix epoch for a Gregorian calendar date (time-zone independent). */
function adToDayNumber(date: DateParts): number {
  return Math.round(Date.UTC(date.year, date.month - 1, date.day) / MS_PER_DAY);
}

/** Inverse of {@link adToDayNumber}, additionally returning the weekday. */
function dayNumberToAd(dayNumber: number): DateParts & { dayOfWeek: number } {
  const d = new Date(dayNumber * MS_PER_DAY);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    dayOfWeek: d.getUTCDay(),
  };
}

/** Day number (see {@link adToDayNumber}) of MIN_BS_YEAR/1/1. */
const TABLE_START_DAY_NUMBER = adToDayNumber(ANCHOR_AD) - bsToOrdinal(ANCHOR_BS);
const TABLE_END_DAY_NUMBER = TABLE_START_DAY_NUMBER + TABLE_DAYS - 1;

function stripDayOfWeek(d: DateParts & { dayOfWeek: number }): DateParts {
  return { year: d.year, month: d.month, day: d.day };
}

/**
 * Inclusive bounds of the dates this library can convert, in both calendars.
 * Derived from the calendar table, so it grows automatically when rows are added.
 */
export const SUPPORTED_RANGE: Readonly<SupportedRange> = Object.freeze({
  bs: Object.freeze({
    start: Object.freeze({ year: MIN_BS_YEAR, month: 1, day: 1 }),
    end: Object.freeze({ year: MAX_BS_YEAR, month: 12, day: yearRow(MAX_BS_YEAR)[11] }),
  }),
  ad: Object.freeze({
    start: Object.freeze(stripDayOfWeek(dayNumberToAd(TABLE_START_DAY_NUMBER))),
    end: Object.freeze(stripDayOfWeek(dayNumberToAd(TABLE_END_DAY_NUMBER))),
  }),
});

// ---------------------------------------------------------------------------
// Input parsing and validation
// ---------------------------------------------------------------------------

const DATE_STRING = /^\s*(\d{1,4})[/-](\d{1,2})[/-](\d{1,2})\s*$/;

function formatParts(d: DateParts): string {
  return `${d.year}/${d.month}/${d.day}`;
}

function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

function parseInput(input: unknown, calendar: 'BS' | 'AD'): DateParts {
  if (typeof input === 'string') {
    const match = DATE_STRING.exec(input);
    if (match === null) {
      throw new RangeError(
        `Invalid ${calendar} date string ${JSON.stringify(input)}; expected "yyyy/mm/dd"`,
      );
    }
    return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  }

  if (input instanceof Date) {
    if (calendar !== 'AD') {
      throw new RangeError('A Date object can only be used as an AD date');
    }
    if (Number.isNaN(input.getTime())) {
      throw new RangeError('Invalid Date object');
    }
    return { year: input.getFullYear(), month: input.getMonth() + 1, day: input.getDate() };
  }

  if (typeof input === 'object' && input !== null) {
    const { year, month, day } = input as Partial<Record<keyof DateParts, unknown>>;
    if (isInteger(year) && isInteger(month) && isInteger(day)) {
      return { year, month, day };
    }
    throw new RangeError(
      `Invalid ${calendar} date object; expected { year, month, day } with integer values`,
    );
  }

  throw new RangeError(
    `Invalid ${calendar} date input of type ${typeof input}; expected a "yyyy/mm/dd" string or a { year, month, day } object`,
  );
}

function validateBs(date: DateParts): DateParts {
  const { start, end } = SUPPORTED_RANGE.bs;
  if (date.year < MIN_BS_YEAR || date.year > MAX_BS_YEAR) {
    throw new RangeError(
      `BS date ${formatParts(date)} is outside the supported range ${formatParts(start)} - ${formatParts(end)}`,
    );
  }
  if (date.month < 1 || date.month > 12) {
    throw new RangeError(`Invalid BS date ${formatParts(date)}: month must be between 1 and 12`);
  }
  const daysInMonth = yearRow(date.year)[date.month - 1] ?? 0;
  if (date.day < 1 || date.day > daysInMonth) {
    throw new RangeError(
      `Invalid BS date ${formatParts(date)}: ${EN_MONTHS[date.month - 1]} ${date.year} has ${daysInMonth} days`,
    );
  }
  return date;
}

function validateAd(date: DateParts): number {
  const dayNumber = adToDayNumber(date);
  const normalised = dayNumberToAd(dayNumber);
  if (
    Number.isNaN(dayNumber) ||
    normalised.year !== date.year ||
    normalised.month !== date.month ||
    normalised.day !== date.day
  ) {
    throw new RangeError(`Invalid AD date ${formatParts(date)}`);
  }
  if (dayNumber < TABLE_START_DAY_NUMBER || dayNumber > TABLE_END_DAY_NUMBER) {
    const { start, end } = SUPPORTED_RANGE.ad;
    throw new RangeError(
      `AD date ${formatParts(date)} is outside the supported range ${formatParts(start)} - ${formatParts(end)}`,
    );
  }
  return dayNumber;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Converts a Bikram Sambat date to the Gregorian (AD) calendar.
 *
 * @param input `"yyyy/mm/dd"` string or `{ year, month, day }` object.
 * @throws {RangeError} if the input is malformed, not a real BS date, or
 *   outside {@link SUPPORTED_RANGE}.
 */
export function bs2ad(input: BsDateInput): AdDate {
  const bs = validateBs(parseInput(input, 'BS'));
  const ad = dayNumberToAd(TABLE_START_DAY_NUMBER + bsToOrdinal(bs));
  return {
    year: ad.year,
    month: ad.month,
    strMonth: GREGORIAN_MONTHS[ad.month - 1] ?? '',
    strShortMonth: GREGORIAN_MONTHS_SHORT[ad.month - 1] ?? '',
    day: ad.day,
    dayOfWeek: ad.dayOfWeek,
    strDayOfWeek: GREGORIAN_DAYS[ad.dayOfWeek] ?? '',
    strShortDayOfWeek: GREGORIAN_DAYS_SHORT[ad.dayOfWeek] ?? '',
  };
}

/**
 * Converts a Gregorian (AD) date to the Bikram Sambat calendar.
 *
 * @param input `"yyyy/mm/dd"` string, `{ year, month, day }` object, or a
 *   `Date` (read in the local time zone).
 * @throws {RangeError} if the input is malformed, not a real date, or outside
 *   {@link SUPPORTED_RANGE}.
 */
export function ad2bs(input: AdDateInput): BsDate {
  const ad = parseInput(input, 'AD');
  const dayNumber = validateAd(ad);
  const bs = ordinalToBs(dayNumber - TABLE_START_DAY_NUMBER);
  const dayOfWeek = dayNumberToAd(dayNumber).dayOfWeek;
  const totalDaysInMonth = yearRow(bs.year)[bs.month - 1] ?? 0;
  const neDay = getNepDayOfWeek(dayOfWeek);
  const enDay = getNepDayOfWeek(dayOfWeek, { lang: 'en' });

  return {
    ne: {
      year: getNepaliNumber(bs.year),
      month: getNepaliNumber(bs.month),
      day: getNepaliNumber(bs.day),
      strMonth: NE_MONTHS[bs.month - 1] ?? '',
      strShortMonth: NE_MONTHS_SHORT[bs.month - 1] ?? '',
      dayOfWeek: getNepaliNumber(dayOfWeek),
      strDayOfWeek: neDay.full,
      strShortDayOfWeek: neDay.short,
      strMinDayOfWeek: neDay.min,
      totalDaysInMonth: getNepaliNumber(totalDaysInMonth),
    },
    en: {
      year: bs.year,
      month: bs.month,
      day: bs.day,
      strMonth: EN_MONTHS[bs.month - 1] ?? '',
      strShortMonth: EN_MONTHS_SHORT[bs.month - 1] ?? '',
      dayOfWeek,
      strDayOfWeek: enDay.full,
      strShortDayOfWeek: enDay.short,
      strMinDayOfWeek: enDay.min,
      totalDaysInMonth,
    },
  };
}
