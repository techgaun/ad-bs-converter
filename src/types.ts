/** A calendar date broken into its numeric parts. Months and days are 1-based. */
export interface DateParts {
  year: number;
  month: number;
  day: number;
}

/**
 * Input accepted by {@link bs2ad}: a `"yyyy/mm/dd"` (or `"yyyy-mm-dd"`) string
 * or a {@link DateParts} object describing a Bikram Sambat date.
 */
export type BsDateInput = string | DateParts;

/**
 * Input accepted by {@link ad2bs}: a `"yyyy/mm/dd"` (or `"yyyy-mm-dd"`) string,
 * a {@link DateParts} object, or a JavaScript `Date` (interpreted in the local
 * time zone, i.e. via `getFullYear()`, `getMonth()` and `getDate()`).
 */
export type AdDateInput = string | DateParts | Date;

/**
 * One localisation of a Bikram Sambat date. `T` is `string` for the Nepali
 * (Devanagari numeral) version and `number` for the English version.
 */
export interface BsDateFields<T extends string | number> {
  year: T;
  month: T;
  day: T;
  /** Full month name, e.g. `"श्रावण"` / `"Shrawan"`. */
  strMonth: string;
  /** Abbreviated month name, e.g. `"श्रा"` / `"Shra"`. */
  strShortMonth: string;
  /** Day of week, `0` for Sunday through `6` for Saturday. */
  dayOfWeek: T;
  /** Full weekday name, e.g. `"शनिबार"` / `"Shanibaar"`. */
  strDayOfWeek: string;
  /** Short weekday name, e.g. `"शनि"` / `"Shani"`. */
  strShortDayOfWeek: string;
  /** Minimal weekday name, e.g. `"श"` / `"Sha"`. */
  strMinDayOfWeek: string;
  /** Number of days in the BS month the date falls in. */
  totalDaysInMonth: T;
}

/** Result of {@link ad2bs}. */
export interface BsDate {
  /** Nepali (Devanagari) representation. Numbers are strings of Devanagari digits. */
  ne: BsDateFields<string>;
  /** English representation. Numbers are plain JavaScript numbers. */
  en: BsDateFields<number>;
}

/** Result of {@link bs2ad}. */
export interface AdDate {
  year: number;
  /** 1-based Gregorian month. */
  month: number;
  /** Full month name, e.g. `"August"`. */
  strMonth: string;
  /** Abbreviated month name, e.g. `"Aug"`. */
  strShortMonth: string;
  day: number;
  /** Day of week, `0` for Sunday through `6` for Saturday. */
  dayOfWeek: number;
  /** Full weekday name, e.g. `"Friday"`. */
  strDayOfWeek: string;
  /** Short weekday name, e.g. `"Fri"`. */
  strShortDayOfWeek: string;
}

/** Inclusive bounds of the dates this library can convert. */
export interface SupportedRange {
  bs: { start: DateParts; end: DateParts };
  ad: { start: DateParts; end: DateParts };
}
