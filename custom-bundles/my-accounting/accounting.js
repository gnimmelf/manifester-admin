// http://openexchangerates.github.io/accounting.js/
// http://nashdot.github.io/accounting-js/docs/
import {
  formatMoney,
  formatNumber,
} from 'accounting-js';

const locales = {
  us: {
    symbol: '$',        // default currency symbol is '$'
    format: '%s%v',     // controls output: %s = symbol, %v = value (can be object, see docs)
    decimal: '.',       // decimal point separator
    thousand: ',',      // thousands separator
    precision: 2,       // decimal places
    grouping: 3,        // digit grouping (not implemented yet)
    stripZeros: false,  // strip insignificant zeros from decimal part
    fallback: 0         // value returned on unformat() failure
  },
  nb: {
    symbol : "kr",      // default currency symbol is '$'
    format: "%v%s",     // controls output: %s = symbol, %v = value/number (can be object: see below)
    decimal : ",",      // decimal point separator
    thousand: " ",      // thousands separator
    precision : 2,      // decimal places
    grouping: 3,        // digit grouping (not implemented yet)
    stripZeros: false,  // strip insignificant zeros from decimal part
    fallback: 0         // value returned on unformat() failure
  }
};

let currentLocale ='us';

export default {
  currency: (number) => formatMoney(number, locales[currentLocale]),
  number: (number) => formatNumber(number, locales[currentLocale]),
  unformat: (numberString) => unformat(numberString, locales[currentLocale], locales[currentLocale].decimal),
  locale: (locale) => {
    if (locale) {
      if (locales[locale]) {
        currentLocale = locale;
      }
      else {
        throw new Error('Unknown locale: '+locale);
      }
    }
    else {
      return currentLocale;
    }
  }
};
