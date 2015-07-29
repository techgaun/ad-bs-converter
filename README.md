# ad-bs-converter [![npm version](https://badge.fury.io/js/ad-bs-converter.svg)](http://badge.fury.io/js/ad-bs-converter) [![Build Status](https://travis-ci.org/techgaun/ad-bs-converter.svg?branch=master)](https://travis-ci.org/techgaun/ad-bs-converter)
A javascript implementation to convert bikram samvat to anno domini and vice-versa

### Installation
```bash
npm install ad-bs-converter --save
```

### Example
```javascript
var adbs = require("ad-bs-converter");

console.log(adbs.ad2bs("1990/8/10"))
console.log(adbs.bs2ad("2047/4/26"))
```

outputs

```javascript
{ ne: 
   { year: '२०४७',
     month: '४',
     day: '२६',
     strMonth: 'श्रावण',
     strShortMonth: 'श्रा',
     dayOfWeek: '५',
     strDayOfWeek: 'शुक्रवार',
     strShortDayOfWeek: 'शुक्र',
     strMinDayOfWeek: 'शु' },
  en: 
   { year: 2047,
     month: 4,
     day: 26,
     strMonth: 'Shrawan',
     strShortMonth: 'Shra',
     dayOfWeek: 5,
     strDayOfWeek: 'Shukrabaar',
     strShortDayOfWeek: 'Shukra',
     strMinDayOfWeek: 'Shu' } }
{ year: 1990,
  month: 8,
  strMonth: 'August',
  strShortMonth: 'Aug',
  day: 10,
  dayOfWeek: 5,
  strDayOfWeek: 'Friday',
  strShortDayOfWeek: 'Fri' }
```
