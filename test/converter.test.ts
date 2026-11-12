import { describe, expect, it } from 'vitest';

import { ad2bs, bs2ad, SUPPORTED_RANGE } from '../src';

describe('#bs2ad', () => {
  it('Converts 2072/4/3 to 2015/7/19', () => {
    const expectedDate = {
      year: 2015,
      month: 7,
      strMonth: 'July',
      strShortMonth: 'Jul',
      day: 19,
      dayOfWeek: 0,
      strDayOfWeek: 'Sunday',
      strShortDayOfWeek: 'Sun',
    };
    expect(bs2ad('2072/4/3')).toEqual(expectedDate);
  });

  it('Converts 2072/4/16 to 2015/8/1', () => {
    const expectedDate = {
      year: 2015,
      month: 8,
      strMonth: 'August',
      strShortMonth: 'Aug',
      day: 1,
      dayOfWeek: 6,
      strDayOfWeek: 'Saturday',
      strShortDayOfWeek: 'Sat',
    };
    expect(bs2ad('2072/4/16')).toEqual(expectedDate);
  });

  it('Converts 2070/9/17 to 2014/1/1', () => {
    const expectedDate = {
      year: 2014,
      month: 1,
      strMonth: 'January',
      strShortMonth: 'Jan',
      day: 1,
      dayOfWeek: 3,
      strDayOfWeek: 'Wednesday',
      strShortDayOfWeek: 'Wed',
    };
    expect(bs2ad('2070/9/17')).toEqual(expectedDate);
  });

  it('Converts 2072/4/1 to 2015/7/17', () => {
    const expectedDate = {
      year: 2015,
      month: 7,
      strMonth: 'July',
      strShortMonth: 'Jul',
      day: 17,
      dayOfWeek: 5,
      strDayOfWeek: 'Friday',
      strShortDayOfWeek: 'Fri',
    };
    expect(bs2ad('2072/4/1')).toEqual(expectedDate);
  });

  it('Converts 1978/1/1 to 1921/4/13', () => {
    const expectedDate = {
      year: 1921,
      month: 4,
      strMonth: 'April',
      strShortMonth: 'Apr',
      day: 13,
      dayOfWeek: 3,
      strDayOfWeek: 'Wednesday',
      strShortDayOfWeek: 'Wed',
    };
    expect(bs2ad('1978/1/1')).toEqual(expectedDate);
  });

  // The original assertion (2092/12/30 -> 2036/4/14) was written against the
  // 2015 table, in which 2092 BS had 366 days. The community data update in
  // Feb 2024 (commit 9630264) shortened 2092 to 365 days, so on `master` this
  // date already mapped to 2036/4/13. Years >= 2091 are provisional; the
  // expectation follows the current table.
  it('Converts 2092/12/30 to 2036/4/13', () => {
    const expectedDate = {
      year: 2036,
      month: 4,
      strMonth: 'April',
      strShortMonth: 'Apr',
      day: 13,
      dayOfWeek: 0,
      strDayOfWeek: 'Sunday',
      strShortDayOfWeek: 'Sun',
    };
    expect(bs2ad('2092/12/30')).toEqual(expectedDate);
  });

  //my birthday :D
  it('Converts 2047/4/26 to 1990/8/10', () => {
    const expectedDate = {
      year: 1990,
      month: 8,
      strMonth: 'August',
      strShortMonth: 'Aug',
      day: 10,
      dayOfWeek: 5,
      strDayOfWeek: 'Friday',
      strShortDayOfWeek: 'Fri',
    };
    expect(bs2ad('2047/4/26')).toEqual(expectedDate);
  });

  it('Converts 2076/09/16 to 2020/01/01', () => {
    const expectedDate = {
      year: 2020,
      month: 1,
      strMonth: 'January',
      strShortMonth: 'Jan',
      day: 1,
      dayOfWeek: 3,
      strDayOfWeek: 'Wednesday',
      strShortDayOfWeek: 'Wed',
    };
    expect(bs2ad('2076/09/16')).toEqual(expectedDate);
  });

  it('accepts a { year, month, day } object', () => {
    expect(bs2ad({ year: 2047, month: 4, day: 26 })).toEqual(bs2ad('2047/4/26'));
  });

  it('accepts dashes as separators', () => {
    expect(bs2ad('2047-04-26')).toEqual(bs2ad('2047/4/26'));
  });

  it('Converts 2083/7/25 to 2026/11/11 (corrected 2082/2083 data)', () => {
    expect(bs2ad('2083/7/25')).toMatchObject({ year: 2026, month: 11, day: 11, dayOfWeek: 3 });
  });

  it('converts the first and last supported BS dates', () => {
    expect(bs2ad(SUPPORTED_RANGE.bs.start)).toMatchObject(SUPPORTED_RANGE.ad.start);
    expect(bs2ad(SUPPORTED_RANGE.bs.end)).toMatchObject(SUPPORTED_RANGE.ad.end);
  });

  it('throws a RangeError for dates outside the supported range', () => {
    expect(() => bs2ad('1974/12/30')).toThrow(RangeError);
    expect(() => bs2ad('2200/1/1')).toThrow(RangeError);
    expect(() => bs2ad('2200/1/1')).toThrow(/outside the supported range/);
  });

  it('throws a RangeError for impossible BS dates', () => {
    expect(() => bs2ad('2072/13/1')).toThrow(RangeError);
    expect(() => bs2ad('2072/0/1')).toThrow(RangeError);
    expect(() => bs2ad('2072/4/33')).toThrow(RangeError);
    expect(() => bs2ad('2072/4/0')).toThrow(RangeError);
    // Kartik 2083 has 30 days after the data fix
    expect(() => bs2ad('2083/7/31')).toThrow(/Kartik 2083 has 30 days/);
  });

  it('throws a RangeError for malformed input', () => {
    expect(() => bs2ad('')).toThrow(RangeError);
    expect(() => bs2ad('2072/4')).toThrow(RangeError);
    expect(() => bs2ad('hello')).toThrow(RangeError);
    expect(() => bs2ad({ year: 2072, month: 4.5, day: 1 })).toThrow(RangeError);
    expect(() => bs2ad({ year: '2072', month: 4, day: 1 } as never)).toThrow(RangeError);
    expect(() => bs2ad(undefined as never)).toThrow(RangeError);
    expect(() => bs2ad(null as never)).toThrow(RangeError);
    expect(() => bs2ad(new Date() as never)).toThrow(RangeError);
  });
});

describe('#ad2bs', () => {
  it('Converts 2015/8/1 to 2072/4/16', () => {
    const expectedDate = {
      ne: {
        year: '२०७२',
        month: '४',
        day: '१६',
        strMonth: 'श्रावण',
        strShortMonth: 'श्रा',
        dayOfWeek: '६',
        strDayOfWeek: 'शनिबार',
        strShortDayOfWeek: 'शनि',
        strMinDayOfWeek: 'श',
        totalDaysInMonth: '३२',
      },
      en: {
        year: 2072,
        month: 4,
        day: 16,
        strMonth: 'Shrawan',
        strShortMonth: 'Shra',
        dayOfWeek: 6,
        strDayOfWeek: 'Shanibaar',
        strShortDayOfWeek: 'Shani',
        strMinDayOfWeek: 'Sha',
        totalDaysInMonth: 32,
      },
    };
    expect(ad2bs('2015/8/1')).toEqual(expectedDate);
  });

  it('Converts 2014/1/1 to 2070/9/17', () => {
    const expectedDate = {
      ne: {
        year: '२०७०',
        month: '९',
        day: '१७',
        strMonth: 'पौष',
        strShortMonth: 'पौ',
        dayOfWeek: '३',
        strDayOfWeek: 'बुधबार',
        strShortDayOfWeek: 'बुध',
        strMinDayOfWeek: 'बु',
        totalDaysInMonth: '३०',
      },
      en: {
        year: 2070,
        month: 9,
        day: 17,
        strMonth: 'Paush',
        strShortMonth: 'Pau',
        dayOfWeek: 3,
        strDayOfWeek: 'Budhabaar',
        strShortDayOfWeek: 'Budha',
        strMinDayOfWeek: 'Bu',
        totalDaysInMonth: 30,
      },
    };
    expect(ad2bs('2014/1/1')).toEqual(expectedDate);
  });

  it('Converts 2015/7/19 to 2072/4/3', () => {
    const expectedDate = {
      ne: {
        year: '२०७२',
        month: '४',
        day: '३',
        strMonth: 'श्रावण',
        strShortMonth: 'श्रा',
        dayOfWeek: '०',
        strDayOfWeek: 'आइतबार',
        strShortDayOfWeek: 'आइत',
        strMinDayOfWeek: 'आ',
        totalDaysInMonth: '३२',
      },
      en: {
        year: 2072,
        month: 4,
        day: 3,
        strMonth: 'Shrawan',
        strShortMonth: 'Shra',
        dayOfWeek: 0,
        strDayOfWeek: 'Aaitabaar',
        strShortDayOfWeek: 'Aaita',
        strMinDayOfWeek: 'Aai',
        totalDaysInMonth: 32,
      },
    };
    expect(ad2bs('2015/7/19')).toEqual(expectedDate);
  });

  it('Converts 2015/7/17 to 2072/4/1', () => {
    const expectedDate = {
      ne: {
        year: '२०७२',
        month: '४',
        day: '१',
        strMonth: 'श्रावण',
        strShortMonth: 'श्रा',
        dayOfWeek: '५',
        strDayOfWeek: 'शुक्रबार',
        strShortDayOfWeek: 'शुक्र',
        strMinDayOfWeek: 'शु',
        totalDaysInMonth: '३२',
      },
      en: {
        year: 2072,
        month: 4,
        day: 1,
        strMonth: 'Shrawan',
        strShortMonth: 'Shra',
        dayOfWeek: 5,
        strDayOfWeek: 'Shukrabaar',
        strShortDayOfWeek: 'Shukra',
        strMinDayOfWeek: 'Shu',
        totalDaysInMonth: 32,
      },
    };
    expect(ad2bs('2015/7/17')).toEqual(expectedDate);
  });

  it('Converts 2017/4/13 to 2073/12/31', () => {
    const expectedDate = {
      ne: {
        year: '२०७३',
        month: '१२',
        day: '३१',
        strMonth: 'चैत्र',
        strShortMonth: 'चै',
        dayOfWeek: '४',
        strDayOfWeek: 'बिहिबार',
        strShortDayOfWeek: 'बिहि',
        strMinDayOfWeek: 'बि',
        totalDaysInMonth: '३१',
      },
      en: {
        year: 2073,
        month: 12,
        day: 31,
        strMonth: 'Chaitra',
        strShortMonth: 'Chai',
        dayOfWeek: 4,
        strDayOfWeek: 'Bihibaar',
        strShortDayOfWeek: 'Bihi',
        strMinDayOfWeek: 'Bi',
        totalDaysInMonth: 31,
      },
    };
    expect(ad2bs('2017/4/13')).toEqual(expectedDate);
  });

  it('Converts 2018/4/13 to 2074/12/30', () => {
    const expectedDate = {
      ne: {
        year: '२०७४',
        month: '१२',
        day: '३०',
        strMonth: 'चैत्र',
        strShortMonth: 'चै',
        dayOfWeek: '५',
        strDayOfWeek: 'शुक्रबार',
        strShortDayOfWeek: 'शुक्र',
        strMinDayOfWeek: 'शु',
        totalDaysInMonth: '३०',
      },
      en: {
        year: 2074,
        month: 12,
        day: 30,
        strMonth: 'Chaitra',
        strShortMonth: 'Chai',
        dayOfWeek: 5,
        strDayOfWeek: 'Shukrabaar',
        strShortDayOfWeek: 'Shukra',
        strMinDayOfWeek: 'Shu',
        totalDaysInMonth: 30,
      },
    };
    expect(ad2bs('2018/4/13')).toEqual(expectedDate);
  });

  // See the matching bs2ad test: 2092 BS lost a day in the Feb 2024 data
  // update, so 2036/4/14 is now the first day of 2093 BS (provisional data).
  it('Converts 2036/4/13 to 2092/12/30 and 2036/4/14 to 2093/1/1', () => {
    const expectedDate = {
      ne: {
        year: '२०९२',
        month: '१२',
        day: '३०',
        strMonth: 'चैत्र',
        strShortMonth: 'चै',
        dayOfWeek: '०',
        strDayOfWeek: 'आइतबार',
        strShortDayOfWeek: 'आइत',
        strMinDayOfWeek: 'आ',
        totalDaysInMonth: '३०',
      },
      en: {
        year: 2092,
        month: 12,
        day: 30,
        strMonth: 'Chaitra',
        strShortMonth: 'Chai',
        dayOfWeek: 0,
        strDayOfWeek: 'Aaitabaar',
        strShortDayOfWeek: 'Aaita',
        strMinDayOfWeek: 'Aai',
        totalDaysInMonth: 30,
      },
    };
    expect(ad2bs('2036/4/13')).toEqual(expectedDate);
    expect(ad2bs('2036/4/14').en).toMatchObject({
      year: 2093,
      month: 1,
      day: 1,
      dayOfWeek: 1,
      strDayOfWeek: 'Sombaar',
    });
  });

  //my birthday :D
  it('Converts 1990/8/10 to 2047/4/26', () => {
    const expectedDate = {
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
        totalDaysInMonth: '३२',
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
        totalDaysInMonth: 32,
      },
    };
    expect(ad2bs('1990/8/10')).toEqual(expectedDate);
  });

  it('Converts 2026/11/11 to 2083/7/25 (corrected 2082/2083 data)', () => {
    expect(ad2bs('2026/11/11').en).toMatchObject({
      year: 2083,
      month: 7,
      day: 25,
      dayOfWeek: 3,
      totalDaysInMonth: 30,
    });
  });

  it('keeps converting past 2036/4/14 (end of the 0.5.0 table)', () => {
    expect(ad2bs('2036/4/15').en).toMatchObject({ year: 2093, month: 1, day: 2 });
    expect(ad2bs('2037/1/1').en).toMatchObject({ year: 2093, month: 9, day: 17 });
  });

  it('accepts a Date object (local time)', () => {
    expect(ad2bs(new Date(1990, 7, 10))).toEqual(ad2bs('1990/8/10'));
    expect(ad2bs(new Date(2026, 10, 11, 23, 59, 59))).toEqual(ad2bs('2026/11/11'));
  });

  it('accepts a { year, month, day } object', () => {
    expect(ad2bs({ year: 1990, month: 8, day: 10 })).toEqual(ad2bs('1990/8/10'));
  });

  it('accepts dashes as separators', () => {
    expect(ad2bs('1990-08-10')).toEqual(ad2bs('1990/8/10'));
  });

  it('converts the first and last supported AD dates', () => {
    expect(ad2bs(SUPPORTED_RANGE.ad.start).en).toMatchObject(SUPPORTED_RANGE.bs.start);
    expect(ad2bs(SUPPORTED_RANGE.ad.end).en).toMatchObject(SUPPORTED_RANGE.bs.end);
  });

  it('throws a RangeError for dates outside the supported range', () => {
    expect(() => ad2bs('1918/4/12')).toThrow(RangeError);
    expect(() => ad2bs('2143/4/19')).toThrow(/outside the supported range/);
    expect(() => ad2bs(new Date(1900, 0, 1))).toThrow(RangeError);
  });

  it('throws a RangeError for impossible AD dates', () => {
    expect(() => ad2bs('2026/2/30')).toThrow(RangeError);
    expect(() => ad2bs('2026/13/1')).toThrow(RangeError);
    expect(() => ad2bs('2026/0/1')).toThrow(RangeError);
    expect(() => ad2bs('2025/2/29')).toThrow(RangeError);
  });

  it('throws a RangeError for malformed input', () => {
    expect(() => ad2bs('')).toThrow(RangeError);
    expect(() => ad2bs('2026-11')).toThrow(RangeError);
    expect(() => ad2bs('2026/11/11T00:00:00Z')).toThrow(RangeError);
    expect(() => ad2bs(new Date('nonsense'))).toThrow(RangeError);
    expect(() => ad2bs({ year: 2026, month: 11 } as never)).toThrow(RangeError);
    expect(() => ad2bs(20261111 as never)).toThrow(RangeError);
  });
});

describe('SUPPORTED_RANGE', () => {
  it('describes the full calendar table', () => {
    expect(SUPPORTED_RANGE).toEqual({
      bs: { start: { year: 1975, month: 1, day: 1 }, end: { year: 2199, month: 12, day: 30 } },
      ad: { start: { year: 1918, month: 4, day: 13 }, end: { year: 2143, month: 4, day: 18 } },
    });
  });

  it('is frozen', () => {
    expect(Object.isFrozen(SUPPORTED_RANGE)).toBe(true);
    expect(Object.isFrozen(SUPPORTED_RANGE.bs.start)).toBe(true);
  });
});
