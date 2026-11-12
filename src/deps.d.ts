// Ambient typings for the two small runtime dependencies, which ship no types.

declare module 'get-nepali-number' {
  /** Converts a number (or numeric string) to a string of Devanagari digits. */
  function getNepaliNumber(input: number | string): string;
  export = getNepaliNumber;
}

declare module 'get-nepday-of-week' {
  interface NepDayOfWeek {
    full: string;
    short: string;
    min: string;
  }
  interface Options {
    lang?: 'ne' | 'en';
  }
  /** Returns the weekday names for `day` (0 = Sunday ... 6 = Saturday). */
  function getNepDayOfWeek(day: number | Date, opts?: Options): NepDayOfWeek;
  export = getNepDayOfWeek;
}
