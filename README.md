# ad-bs-converter [![Build Status](https://travis-ci.org/techgaun/ad-bs-converter.svg?branch=master)](https://travis-ci.org/techgaun/ad-bs-converter)
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

```
2047/4/26
1990/8/10
```
