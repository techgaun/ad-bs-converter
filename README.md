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
   { year: '२०७२',
     month: '४',
     day: '३१',
     strMonth: 'श्रावण',
     strShortMonth: 'श्रा',
     dayOfWeek: '३',
     strDayOfWeek: 'बुधवार',
     strShortDayOfWeek: 'बुध',
     strMinDayOfWeek: 'बु' },
  en: 
   { year: 2072,
     month: 4,
     day: 31,
     strMonth: 'Shrawan',
     strShortMonth: 'Shra',
     dayOfWeek: 3,
     strDayOfWeek: 'Budhabaar',
     strShortDayOfWeek: 'Budha',
     strMinDayOfWeek: 'Bu' } }
{ year: 2015,
  month: 8,
  strMonth: 'August',
  strShortMonth: 'Aug',
  day: 17,
  dayOfWeek: 1,
  strDayOfWeek: 'Monday',
  strShortDayOfWeek: 'Mon' }
```
