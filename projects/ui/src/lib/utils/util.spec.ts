import { handleThrowError } from './../util-test/util-expect.spec';

import {
  callFunction,
  capitalizeFirstLetter,
  clearObject,
  convertDateToISODate,
  convertDateToISOExtended,
  convertIsoToDate,
  convertImageToBase64,
  convertNumberToDecimal,
  convertToBoolean,
  convertToInt,
  formatYear,
  getFormattedLink,
  isEquals,
  isKeyCodeEnter,
  isExternalLink,
  isTypeof,
  mapArrayByProperties,
  mapObjectByProperties,
  openExternalLink,
  removeDuplicatedOptions,
  removeUndefinedAndNullOptions,
  setYearFrom0To100,
  sortOptionsByProperty,
  sortValues,
  validateDateRange,
  validateObjectType,
  validValue,
  valuesFromObject
} from './util';

import * as UtilFunctions from './util';

describe('Language:', () => {
  let navigatorLanguageSpy;
  let navigatorUserLanguageSpy;

  Object.defineProperty(navigator, 'userLanguage', {
    get: function () {
      return undefined;
    },
    configurable: true
  });

  beforeEach(() => {
    navigatorLanguageSpy = spyOnProperty(window.navigator, 'language', 'get');
    navigatorUserLanguageSpy = spyOnProperty(window.navigator, <any>'userLanguage', 'get');
  });

  afterEach(() => {
    navigatorLanguageSpy.calls.reset();
    navigatorUserLanguageSpy.calls.reset();
  });

  describe('Function browserLanguage:', () => {
    it('should return `pt` as default language if language is undefined', () => {
      navigatorLanguageSpy.and.returnValue(undefined);

      expect(UtilFunctions.browserLanguage()).toBe('pt');
    });

    it('should return `pt` as default language if language is invalid', () => {
      navigatorLanguageSpy.and.returnValue('wz');

      expect(UtilFunctions.browserLanguage()).toBe('pt');
    });

    it('should return `en` if browser language is `en-US`', () => {
      navigatorLanguageSpy.and.returnValue('en-US');

      expect(UtilFunctions.browserLanguage()).toBe('en');
    });

    it('should return `es` if browser language is `es`', () => {
      navigatorLanguageSpy.and.returnValue('es');

      expect(UtilFunctions.browserLanguage()).toBe('es');
    });

    it('should return `ru` if browser language is `ru`', () => {
      navigatorLanguageSpy.and.returnValue('ru');

      expect(UtilFunctions.browserLanguage()).toBe('ru');
    });
  });

  describe('Function getBrowserLanguage:', () => {
    it('should return the value of `navigator.language` if it`s defined', () => {
      navigatorLanguageSpy.and.returnValue('pt');

      expect(UtilFunctions.getShortBrowserLanguage()).toBe('pt');
    });

    it('should return the value of `navigator.userLanguage` if it`s defined and `navigator.language` is undefined', () => {
      navigatorLanguageSpy.and.returnValue(undefined);
      navigatorUserLanguageSpy.and.returnValue('en');

      expect(UtilFunctions.getShortBrowserLanguage()).toBe('en');
    });

    it('should return undefined if `navigator.language` and `navigator.userLanguage` are undefined', () => {
      navigatorLanguageSpy.and.returnValue(undefined);
      navigatorUserLanguageSpy.and.returnValue(undefined);

      expect(UtilFunctions.getBrowserLanguage()).toBe(undefined);
    });
  });

  describe('Function getShortBrowserLanguage:', () => {
    it('should return `pt` as default language if language is undefined', () => {
      navigatorLanguageSpy.and.returnValue(undefined);

      expect(UtilFunctions.getShortBrowserLanguage()).toBe('pt');
    });

    it('should return `pt` as default language if language is invalid', () => {
      navigatorLanguageSpy.and.returnValue('wz');

      expect(UtilFunctions.getShortBrowserLanguage()).toBe('pt');
    });

    it('should return `pt` if browser language is `pt`', () => {
      navigatorLanguageSpy.and.returnValue('pt');

      expect(UtilFunctions.getShortBrowserLanguage()).toBe('pt');
    });

    it('should return `pt` if browser language is `pt-BR`', () => {
      navigatorLanguageSpy.and.returnValue('pt-BR');

      expect(UtilFunctions.getShortBrowserLanguage()).toBe('pt');
    });

    it('should return `en` if browser language is `en`', () => {
      navigatorLanguageSpy.and.returnValue('en');

      expect(UtilFunctions.getShortBrowserLanguage()).toBe('en');
    });

    it('should return `en` if browser language is `en-US`', () => {
      navigatorLanguageSpy.and.returnValue('en-US');

      expect(UtilFunctions.getShortBrowserLanguage()).toBe('en');
    });

    it('should return `es` if browser language is `es`', () => {
      navigatorLanguageSpy.and.returnValue('es');

      expect(UtilFunctions.getShortBrowserLanguage()).toBe('es');
    });

    it('should return `es` if browser language is `es-ES`', () => {
      navigatorLanguageSpy.and.returnValue('es-ES');

      expect(UtilFunctions.getShortBrowserLanguage()).toBe('es');
    });

    it('should return `ru` if browser language is `ru`', () => {
      navigatorLanguageSpy.and.returnValue('ru');

      expect(UtilFunctions.getShortBrowserLanguage()).toBe('ru');
    });

    it('should return `ru` if browser language is `ru-RU`', () => {
      navigatorLanguageSpy.and.returnValue('ru-RU');

      expect(UtilFunctions.getShortBrowserLanguage()).toBe('ru');
    });
  });
});

describe('Function isLanguage:', () => {
  it('should return true if value is a language', () => {
    expect(UtilFunctions.isLanguage('pt')).toBe(true);
    expect(UtilFunctions.isLanguage('en')).toBe(true);
    expect(UtilFunctions.isLanguage('ru')).toBe(true);
    expect(UtilFunctions.isLanguage('en-US')).toBe(true);
    expect(UtilFunctions.isLanguage('pt-PT')).toBe(true);
    expect(UtilFunctions.isLanguage('pt-br')).toBe(true);
    expect(UtilFunctions.isLanguage('pt-BR')).toBe(true);
  });

  it('should return false if value not is a language', () => {
    expect(UtilFunctions.isLanguage('english')).toBe(false);
    expect(UtilFunctions.isLanguage('en-USA')).toBe(false);
    expect(UtilFunctions.isLanguage('pt PT')).toBe(false);
    expect(UtilFunctions.isLanguage(123)).toBe(false);
    expect(UtilFunctions.isLanguage(undefined)).toBe(false);
  });
});

describe('Function formatBytes:', () => {
  it('formatBytes: should return undefined if bytes is undefined', () => {
    const bytes = undefined;

    expect(UtilFunctions.formatBytes(bytes)).toBeUndefined();
  });

  it('formatBytes: should return `2 Bytes` if bytes is 2', () => {
    const bytes = 2;

    expect(UtilFunctions.formatBytes(bytes)).toBe('2 Bytes');
  });

  it('formatBytes: should return `12.567 Bytes` if bytes is 12.5666666 and decimals is 3', () => {
    const bytes = 12.5666666;
    const decimals = 3;

    expect(UtilFunctions.formatBytes(bytes, decimals)).toBe('12.567 Bytes');
  });

  it('formatBytes: should return `12.57 Bytes` if bytes is 12.5666666 and decimals is undefined', () => {
    const bytes = 12.5666666;

    expect(UtilFunctions.formatBytes(bytes)).toBe('12.57 Bytes');
  });

  it('formatBytes: should return `13 Bytes` if bytes is 12.5666666 and decimals is -1', () => {
    const bytes = 12.5666666;
    const decimals = -1;

    expect(UtilFunctions.formatBytes(bytes, decimals)).toBe('13 Bytes');
  });

  it('formatBytes: should return `30 MB` if bytes is 31457280', () => {
    const bytes = 31457280;

    expect(UtilFunctions.formatBytes(bytes)).toBe('30 MB');
  });

  it('formatBytes: should return `20 GB` if bytes is 21474836480', () => {
    const bytes = 21474836480;

    expect(UtilFunctions.formatBytes(bytes)).toBe('20 GB');
  });

  it('formatBytes: should return `10 KB` if bytes is 10240', () => {
    const bytes = 10240;

    expect(UtilFunctions.formatBytes(bytes)).toBe('10 KB');
  });

  it('formatBytes: should return `23 TB` if bytes is 25288767438848', () => {
    const bytes = 25288767438848;

    expect(UtilFunctions.formatBytes(bytes)).toBe('23 TB');
  });

  it('formatBytes: should return `15 PB` if bytes is 16888498602639360', () => {
    const bytes = 16888498602639360;

    expect(UtilFunctions.formatBytes(bytes)).toBe('15 PB');
  });

  it('formatBytes: should return `2 EB` if bytes is 2305843009213694000', () => {
    const bytes = 2305843009213694000;

    expect(UtilFunctions.formatBytes(bytes)).toBe('2 EB');
  });
});

describe('Function convertToBoolean:', () => {
  it('should be true', () => {
    expect(convertToBoolean('true')).toBe(true);
  });

  it('should be false', () => {
    expect(convertToBoolean('false')).toBe(false);
  });

  it('should be false because is a wrong string', () => {
    expect(convertToBoolean('teste')).toBe(false);
  });

  it('should be true because is a boolean', () => {
    expect(convertToBoolean(true)).toBe(true);
  });
});

describe('Function isTypeof:', () => {
  it('should be true for this string', () => {
    expect(isTypeof('test', 'string')).toBe(true);
  });

  it('should be true for this object', () => {
    expect(isTypeof(new Date(), 'object')).toBe(true);
  });
});

describe('Function convertIsoToDate:', () => {
  it('should be a object Date', () => {
    const date = new Date(2017, 1, 1).toISOString();
    expect(typeof convertIsoToDate(date, false, false)).toBe('object');
  });

  it('should be a object Date with start', () => {
    const date = new Date(2017, 1, 1);
    expect(typeof convertIsoToDate(date.toISOString(), true, false)).toBe('object');
  });

  it('should be a object Date with end', () => {
    const date = new Date(2017, 1, 1).toISOString();
    expect(typeof convertIsoToDate(date, false, true)).toBe('object');
  });

  it('should be a date with zero hour with dateStart', () => {
    const date = new Date(2017, 1, 1).toISOString();
    const dateStart = convertIsoToDate(date, true, false);

    expect(dateStart.getHours()).toBe(0);
    expect(dateStart.getMinutes()).toBe(0);
    expect(dateStart.getSeconds()).toBe(0);
  });

  it('should be a date with 23:59:59 hour with dateEnd', () => {
    const date = new Date(2017, 1, 1).toISOString();
    const dateStart = convertIsoToDate(date, false, true);

    expect(dateStart.getHours()).toBe(23);
    expect(dateStart.getMinutes()).toBe(59);
    expect(dateStart.getSeconds()).toBe(59);
  });

  it('should be a no value', () => {
    const date = '';
    expect(typeof convertIsoToDate(date, false, false)).toBe('undefined');
  });

  it('should add up to 1 hour if it is not reset', () => {
    const date = new Date(2017, 1, 1, 2).toISOString();
    expect(typeof convertIsoToDate(date, false, false)).toBe('object');
  });

  it('should set start date with year 1', () => {
    const date = new Date(1, 1, 1);
    date.setFullYear(1);

    expect(convertIsoToDate(date.toISOString(), true, false).getFullYear()).toBe(1);
  });

  it('should set end date with year 1', () => {
    const date = new Date(1, 1, 1);
    date.setFullYear(1);
    expect(convertIsoToDate(date.toISOString(), false, true).getFullYear()).toBe(1);
  });
});

describe('Function callFunction:', () => {
  const context = {
    getName: function () {
      return 'PO';
    },
    'getAge': function () {
      return '2';
    }
  };

  it('should call function of context', () => {
    spyOn(context, 'getName');

    callFunction(context.getName, context);

    expect(context.getName).toHaveBeenCalled();
  });

  it('should call function of context passing attribute name', () => {
    spyOn(context, 'getAge');

    callFunction('getAge', context);

    expect(context.getAge).toHaveBeenCalled();
  });

  it('should sort with A > B', () => {
    const _options: Array<any> = [
      { name: 'Edward', value: 21 },
      { name: 'Sharpe', value: 37 }
    ];

    sortOptionsByProperty(_options, 'name');

    expect(_options).toEqual([
      { name: 'Edward', value: 21 },
      { name: 'Sharpe', value: 37 }
    ]);
  });

  it('should sort with B > A', () => {
    const _options: Array<any> = [
      { name: 'Sharpe', value: 37 },
      { name: 'Edward', value: 21 }
    ];

    sortOptionsByProperty(_options, 'name');

    expect(_options).toEqual([
      { name: 'Edward', value: 21 },
      { name: 'Sharpe', value: 37 }
    ]);
  });

  it('should sort to equals', () => {
    const _options: Array<any> = [
      { name: 'Sharpe', value: 37 },
      { name: 'Sharpe', value: 37 }
    ];

    sortOptionsByProperty(_options, 'name');

    expect(_options).toEqual([
      { name: 'Sharpe', value: 37 },
      { name: 'Sharpe', value: 37 }
    ]);
  });
});

describe('Function convertDateToISODate:', () => {
  it('should return null if no date is defined', () => {
    const date: Date = null;
    expect(convertDateToISODate(date)).toBe(null);
  });

  it('should return a ISO Date if date is defined', () => {
    const date: Date = new Date(2017, 10, 28);
    expect(convertDateToISODate(date)).toBe('2017-11-28');
  });

  it('should return year 0001 for a date that has year 1', () => {
    const date = new Date(1, 1, 1);
    date.setFullYear(1);

    expect(convertDateToISODate(date).substring(0, 4)).toBe('0001');
  });

  it('should return year 0010 for a date that has year 10', () => {
    const date = new Date(10, 1, 1);
    date.setFullYear(10);

    expect(convertDateToISODate(date).substring(0, 4)).toBe('0010');
  });

  it('should return year 0100 for a date that has year 100', () => {
    const date = new Date(100, 1, 1);
    date.setFullYear(100);

    expect(convertDateToISODate(date).substring(0, 4)).toBe('0100');
  });
});

describe('Function convertDateToISOExtended:', () => {
  it('should null for no value for function', () => {
    const date: Date = null;
    expect(convertDateToISOExtended(date, '12')).toBe(null);
  });

  it('should return a ISO extended when pass Date with no hour', () => {
    const date = new Date(2017, 10, 28);
    const dateTemp = convertDateToISOExtended(date, null).substring(0, 19);
    expect(dateTemp).toBe('2017-11-28T00:00:00');
  });

  it('should return a ISO extended when pass Date with hour', () => {
    const date = new Date(2017, 10, 28);
    expect(convertDateToISOExtended(date, 'T00:50:20')).toBe('2017-11-28T00:50:20');
  });

  it('should return a ISO extended when pass Date with hour when day and month less than 10', () => {
    const date = new Date(2017, 5, 5);
    expect(convertDateToISOExtended(date, 'T00:50:20')).toBe('2017-06-05T00:50:20');
  });

  it('should return year 0001 for a date that has year 1', () => {
    const date = new Date(1, 1, 1);
    date.setFullYear(1);

    expect(convertDateToISOExtended(date).substring(0, 4)).toBe('0001');
  });

  it('should return year 0010 for a date that has year 10', () => {
    const date = new Date(10, 1, 1);
    date.setFullYear(10);

    expect(convertDateToISOExtended(date).substring(0, 4)).toBe('0010');
  });

  it('should return year 0100 for a date that has year 100', () => {
    const date = new Date(100, 1, 1);
    date.setFullYear(100);

    expect(convertDateToISOExtended(date).substring(0, 4)).toBe('0100');
  });
});

describe('Function removeDuplicatedOptions:', () => {
  it('should return items not duplicated ', () => {
    const options = [
      { value: 1, label: 1 },
      { value: 2, label: 2 },
      { value: 2, label: 2 },
      { value: 1, label: 1 },
      { value: 3, label: 3 }
    ];
    removeDuplicatedOptions(options);
    expect(options.length).toBe(3);
  });
});

describe('Function removeUndefinedAndNullOptions:', () => {
  it('should return items not undefined and null ', () => {
    const options = [
      { value: 1, label: 1 },
      { value: 2, label: 2 },
      { value: <any>undefined, label: 'teste' },
      { value: null, label: 'teste2' },
      { value: 3, label: 3 }
    ];
    removeUndefinedAndNullOptions(options);
    expect(options.length).toBe(3);
  });
});

describe('Function validValueToOption:', () => {
  it('should return false to invalid value', () => {
    expect(validValue('')).toBeFalsy();
    expect(validValue(null)).toBeFalsy();
    expect(validValue(undefined)).toBeFalsy();
  });

  it('should return true to valid value', () => {
    expect(validValue(0)).toBeTruthy();
    expect(validValue('a')).toBeTruthy();
    expect(validValue(1)).toBeTruthy();
    expect(validValue(true)).toBeTruthy();
    expect(validValue(false)).toBeTruthy();
  });
});

describe('Function isExternalLink:', () => {
  it('should return true if is external link', () => {
    expect(isExternalLink('http://fakeUrlPo.com.br')).toBe(true);
  });
  it('should return false if is internal link', () => {
    expect(isExternalLink('./home')).toBe(false);
  });
});

describe('Function openExternalLink:', () => {
  it('should open external link', () => {
    spyOn(window, 'open');
    openExternalLink('http://fakeUrlPo.com.br');
    expect(window.open).toHaveBeenCalledWith('http://fakeUrlPo.com.br', '_blank');
  });
});

describe('Function getFormattedLink:', () => {
  it('should format link', () => {
    expect(getFormattedLink(null)).toBe('/');

    expect(getFormattedLink('../link')).toBe('/link');

    expect(getFormattedLink('./link')).toBe('/link');

    expect(getFormattedLink('link')).toBe('/link');

    expect(getFormattedLink('/link')).toBe('/link');

    expect(getFormattedLink('/link/./test')).toBe('/link/./test');

    expect(getFormattedLink('/link/../otherTest')).toBe('/link/../otherTest');

    expect(getFormattedLink('/link./../otherTest')).toBe('/link./../otherTest');

    expect(getFormattedLink('.link')).toBe('/link');

    expect(getFormattedLink('.link.....')).toBe('/link.....');

    expect(getFormattedLink('/link/._./_.otherTest')).toBe('/link/._./_.otherTest');

    expect(getFormattedLink('.../link/../otherTest')).toBe('/link/../otherTest');

    expect(getFormattedLink('.../link/../.otherTest')).toBe('/link/../.otherTest');
  });
});

describe('Function convertToInt:', () => {
  it('should return a number when have a string number value param.', () => {
    expect(convertToInt('10.50')).toBe(10);
  });

  it('should return a number when have a decimal number value param.', () => {
    expect(convertToInt(10.5)).toBe(10);
  });

  it('should return undefined when have a null value param.', () => {
    expect(convertToInt(null)).toBeUndefined();
  });

  it('should return a undefined when have a string value param.', () => {
    expect(convertToInt('teste')).toBeUndefined();
  });

  it('should return a 0 when have a number 0 value param.', () => {
    expect(convertToInt(0)).toBe(0);
  });

  it('should return a 0 when have an invalid number value param and have a 0 default param.', () => {
    expect(convertToInt('invalidNumber', 0)).toBe(0);
  });

  it('should return a default value when have an invalid number value param and have a valid default param.', () => {
    expect(convertToInt('invalidNumber', 5)).toBe(5);
  });

  it('should return undefined when have an invalid number and have an invalid default param.', () => {
    expect(convertToInt('invalidNumber', 'tinvalidParam')).toBeUndefined();
  });
});

describe('Function isEquals:', () => {
  it('should return true with same value', () => {
    expect(isEquals(1, 1)).toBeTruthy();
    expect(isEquals({ value: '21' }, { value: '21' })).toBeTruthy();
  });

  it('should return false when different value', () => {
    expect(isEquals(2, 1)).toBeFalsy();
    expect(isEquals({ value: '1' }, { value: '21' })).toBeFalsy();
  });
});

describe('Function isKeyCodeEnter:', () => {
  const eventEnterKey = { keyCode: 13, which: 13 };
  const eventDeleteKey = { keyCode: 46, which: 46 };

  it(`isEnterKey: should return true if event keyCode is enter.`, () => {
    expect(isKeyCodeEnter(eventEnterKey)).toBe(true);
  });

  it(`isEnterKey: should return false if event keyCode is not enter.`, () => {
    expect(isKeyCodeEnter(eventDeleteKey)).toBe(false);
  });
});

describe('Function sortValues:', () => {
  describe('Valid values:', () => {
    it('should return `-1` if `leftSide` is less than `rightSide` and `ascending` is `undefined`', () => {
      const ascending: boolean = undefined;
      const expectedReturn: number = -1;
      const leftSide: string = 'ABC';
      const rightSide: string = 'CBA';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `-1` if `leftSide` is less than `rightSide`, `ascending` is `undefined` and use lower and upper characters', () => {
      const ascending: boolean = undefined;
      const expectedReturn: number = -1;
      const leftSide: string = 'Aaa';
      const rightSide: string = 'abc';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `-1` if `leftSide` is less than `rightSide` and `ascending` is `true`', () => {
      const ascending: boolean = true;
      const expectedReturn: number = -1;
      const leftSide: string = 'ABC';
      const rightSide: string = 'CBA';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `-1` if `leftSide` is less than `rightSide`, `ascending` is `true` and use lower and upper characters', () => {
      const ascending: boolean = true;
      const expectedReturn: number = -1;
      const leftSide: string = 'Aaa';
      const rightSide: string = 'abc';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `1` if `leftSide` is less than `rightSide` and `ascending` is `false`', () => {
      const ascending: boolean = false;
      const expectedReturn: number = 1;
      const leftSide: string = 'ABC';
      const rightSide: string = 'CBA';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `1` if `leftSide` is less than `rightSide`, `ascending` is `false` and use lower and upper characters', () => {
      const ascending: boolean = false;
      const expectedReturn: number = 1;
      const leftSide: string = 'Aaa';
      const rightSide: string = 'abc';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `1` if `leftSide` is greater than `rightSide` and `ascending` is `undefined`', () => {
      const ascending: boolean = undefined;
      const expectedReturn: number = 1;
      const leftSide: string = 'CBA';
      const rightSide: string = 'ABC';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `1` if `leftSide` is greater than `rightSide`, `ascending` is `undefined` and use lower and upper characters', () => {
      const ascending: boolean = undefined;
      const expectedReturn: number = 1;
      const leftSide: string = 'abc';
      const rightSide: string = 'Aaa';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `1` if `leftSide` is greater than `rightSide` and `ascending` is `true`', () => {
      const ascending: boolean = true;
      const expectedReturn: number = 1;
      const leftSide: string = 'CBA';
      const rightSide: string = 'ABC';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `1` if `leftSide` is greater than `rightSide`, `ascending` is `true` and use lower and upper characters', () => {
      const ascending: boolean = true;
      const expectedReturn: number = 1;
      const leftSide: string = 'abc';
      const rightSide: string = 'Aaa';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `-1` if `leftSide` is greater than `rightSide` and `ascending` is `false`', () => {
      const ascending: boolean = false;
      const expectedReturn: number = -1;
      const leftSide: string = 'CBA';
      const rightSide: string = 'ABC';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `-1` if `leftSide` is greater than `rightSide`, `ascending` is `false` and use lower and upper characters', () => {
      const ascending: boolean = false;
      const expectedReturn: number = -1;
      const leftSide: string = 'abc';
      const rightSide: string = 'AAA';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `0` if `leftSide` is equal to `rightSide` and `ascending` is `undefined`', () => {
      const ascending: boolean = undefined;
      const expectedReturn: number = 0;
      const leftSide: string = 'ABC';
      const rightSide: string = 'ABC';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `0` if `leftSide` is equal to `rightSide`, `ascending` is `undefined` and use lower and upper characters', () => {
      const ascending: boolean = undefined;
      const expectedReturn: number = 0;
      const leftSide: string = 'ABC';
      const rightSide: string = 'abc';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `0` if `leftSide` is equal to `rightSide` and `ascending` is `true`', () => {
      const ascending: boolean = true;
      const expectedReturn: number = 0;
      const leftSide: string = 'ABC';
      const rightSide: string = 'ABC';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `0` if `leftSide` is equal to `rightSide`, `ascending` is `true` and use lower and upper characters', () => {
      const ascending: boolean = true;
      const expectedReturn: number = 0;
      const leftSide: string = 'ABC';
      const rightSide: string = 'abc';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `0` if `leftSide` is equal to `rightSide` and `ascending` is `false`', () => {
      const ascending: boolean = false;
      const expectedReturn: number = 0;
      const leftSide: string = 'ABC';
      const rightSide: string = 'ABC';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `0` if `leftSide` is equal to `rightSide`, `ascending` is `false` and use lower and upper characters', () => {
      const ascending: boolean = false;
      const expectedReturn: number = 0;
      const leftSide: string = 'ABC';
      const rightSide: string = 'abc';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `-1` if `leftSide` is numeric value, `rightSide` is a character value and `ascending` is `true`', () => {
      const ascending: boolean = true;
      const expectedReturn: number = -1;
      const leftSide: string = '123';
      const rightSide: string = 'ABC';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it('should return `1` if `leftSide` is numeric value, `rightSide` is a character value and `ascending` is `false`', () => {
      const ascending: boolean = false;
      const expectedReturn: number = 1;
      const leftSide: string = '123';
      const rightSide: string = 'ABC';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });
  });

  describe('Invalid values:', () => {
    const invalidValues: Array<any> = [undefined, null, NaN];
    const validParam: string = 'ABC';
    const expectedReturn: number = 0;

    it('should return `-1` if `leftSide` is invalid value and `ascending` is `true`', () => {
      const ascending: boolean = true;

      invalidValues.forEach(invalidValue => {
        expect(sortValues(invalidValue, validParam, ascending)).toBe(-1);
      });
    });

    it('should return `1` if `leftSide` is invalid value and `ascending` is `false`', () => {
      const ascending: boolean = false;

      invalidValues.forEach(invalidValue => {
        expect(sortValues(invalidValue, validParam, ascending)).toBe(1);
      });
    });

    it('should return `1` if `rightSide` is invalid value and `ascending` is `true`', () => {
      const ascending: boolean = true;

      invalidValues.forEach(invalidValue => {
        expect(sortValues(validParam, invalidValue, ascending)).toBe(1);
      });
    });

    it('should return `-1` if `rightSide` is invalid value and `ascending` is `false`', () => {
      const ascending: boolean = false;

      invalidValues.forEach(invalidValue => {
        expect(sortValues(validParam, invalidValue, ascending)).toBe(-1);
      });
    });

    it('should return `0` if `ascending` is invalid value', () => {
      const ascendingInvalidValues: Array<any> = [null, NaN, 0];

      ascendingInvalidValues.forEach(invalidValue => {
        expect(sortValues(validParam, `${validParam}X`, invalidValue)).toBe(expectedReturn);
      });
    });
  });

  describe('Date values:', () => {
    it(`should return '1' when 'leftSide' is greater than 'rightSide' and 'ascending' is 'true' and
      dates are Javascript Date format`, () => {
      const ascending: boolean = true;
      const expectedReturn: number = 1;
      const leftSide = new Date(2018, 5, 5);
      const rightSide = new Date(2018, 3, 5);

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '1' when 'leftSide' is greater than 'rightSide' and 'ascending' is 'true' and
      dates are string Date format`, () => {
      const ascending: boolean = true;
      const expectedReturn: number = 1;
      const leftSide = '2018-05-05';
      const rightSide = '2018-03-05';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '1' when 'leftSide' is greater than 'rightSide' and 'ascending' is 'true' and
      dates are string complete Date format`, () => {
      const ascending: boolean = true;
      const expectedReturn: number = 1;
      const leftSide = '2018-05-05T05:05:13-02:00';
      const rightSide = '2018-03-05T05:05:13-02:00';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '1' when 'leftSide' hour is greater than 'rightSide' hour and 'ascending' is 'true' and
      dates are string complete Date format`, () => {
      const ascending: boolean = true;
      const expectedReturn: number = 1;
      const leftSide = '2018-05-05T05:05:13-02:00';
      const rightSide = '2018-05-05T05:03:13-02:00';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '-1' when 'leftSide' is less than 'rightSide' and 'ascending' is 'true' and
      dates are Javascript Date format`, () => {
      const ascending: boolean = true;
      const expectedReturn: number = -1;
      const leftSide = new Date(2018, 3, 5);
      const rightSide = new Date(2018, 5, 5);

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '-1' when 'leftSide' is less than 'rightSide' and 'ascending' is 'true' and
      dates are string Date format`, () => {
      const ascending: boolean = true;
      const expectedReturn: number = -1;
      const leftSide = '2018-03-05';
      const rightSide = '2018-05-05';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '-1' when 'leftSide' is less than 'rightSide' and 'ascending' is 'true' and
      dates are string complete Date format`, () => {
      const ascending: boolean = true;
      const expectedReturn: number = -1;
      const leftSide = '2018-03-05T05:05:13-02:00';
      const rightSide = '2018-05-05T05:05:13-02:00';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '-1' when 'leftSide' is greater than 'rightSide' and 'ascending' is 'false' and
      dates are Javascript Date format`, () => {
      const ascending: boolean = false;
      const expectedReturn: number = -1;
      const leftSide = new Date(2018, 5, 5);
      const rightSide = new Date(2018, 3, 5);

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '-1' when 'leftSide' is greater than 'rightSide' and 'ascending' is 'false' and
      dates are string Date format`, () => {
      const ascending: boolean = false;
      const expectedReturn: number = -1;
      const leftSide = '2018-05-05';
      const rightSide = '2018-03-05';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '-1' when 'leftSide' is greater than 'rightSide' and 'ascending' is 'false' and
      dates are string complete Date format`, () => {
      const ascending: boolean = false;
      const expectedReturn: number = -1;
      const leftSide = '2018-05-05T05:05:13-02:00';
      const rightSide = '2018-03-05T05:05:13-02:00';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '1' when 'leftSide' is less than 'rightSide' and 'ascending' is 'false' and
      dates are Javascript Date format`, () => {
      const ascending: boolean = false;
      const expectedReturn: number = 1;
      const leftSide = new Date(2018, 3, 5);
      const rightSide = new Date(2018, 5, 5);

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '1' when 'leftSide' is less than 'rightSide' and 'ascending' is 'false' and
      dates are string Date format`, () => {
      const ascending: boolean = false;
      const expectedReturn: number = 1;
      const leftSide = '2018-03-05';
      const rightSide = '2018-05-05';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '1' when 'leftSide' is less than 'rightSide' and 'ascending' is 'false' and
      dates are string complete Date format`, () => {
      const ascending: boolean = false;
      const expectedReturn: number = 1;
      const leftSide = '2018-03-05T05:05:13-02:00';
      const rightSide = '2018-05-05T05:05:13-02:00';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '0' when 'leftSide' is equal to 'rightSide' and 'ascending' is 'true' and
      dates are Javascript Date format`, () => {
      const ascending: boolean = true;
      const expectedReturn: number = 0;
      const leftSide = new Date(2018, 3, 5);
      const rightSide = new Date(2018, 3, 5);

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '0' when 'leftSide' is equal to 'rightSide' and 'ascending' is 'true' and
      dates are string Date format`, () => {
      const ascending: boolean = true;
      const expectedReturn: number = 0;
      const leftSide = '2018-03-05';
      const rightSide = '2018-03-05';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '0' when 'leftSide' is equal to 'rightSide' and 'ascending' is 'true' and
      dates are string complete Date format`, () => {
      const ascending: boolean = true;
      const expectedReturn: number = 0;
      const leftSide = '2018-03-05T05:05:13-02:00';
      const rightSide = '2018-03-05T05:05:13-02:00';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '0' when 'leftSide' is equal to 'rightSide' and 'ascending' is 'false' and
      dates are Javascript Date format`, () => {
      const ascending: boolean = false;
      const expectedReturn: number = 0;
      const leftSide = new Date(2018, 3, 5);
      const rightSide = new Date(2018, 3, 5);

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '0' when 'leftSide' is equal to 'rightSide' and 'ascending' is 'false' and
      dates are string Date format`, () => {
      const ascending: boolean = false;
      const expectedReturn: number = 0;
      const leftSide = '2018-03-05';
      const rightSide = '2018-03-05';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '0' when 'leftSide' is equal to 'rightSide' and 'ascending' is 'false' and
      dates are string complete Date format`, () => {
      const ascending: boolean = false;
      const expectedReturn: number = 0;
      const leftSide = '2018-03-05T05:05:13-02:00';
      const rightSide = '2018-03-05T05:05:13-02:00';

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '1' if 'leftSide' is greater than 'rightSide', 'ascending' is 'true' and
      dates are a Javascript DateTime format`, () => {
      const ascending: boolean = true;
      const expectedReturn: number = 1;
      const leftSide = new Date(2018, 3, 5, 9, 10, 0);
      const rightSide = new Date(2018, 3, 5, 9, 0, 0);

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '-1' if 'leftSide' is less than 'rightSide', 'ascending' is 'true' and
      dates are a Javascript DateTime format`, () => {
      const ascending: boolean = true;
      const expectedReturn: number = -1;
      const leftSide = new Date(2018, 3, 5, 9, 0, 0);
      const rightSide = new Date(2018, 3, 5, 9, 10, 0);

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '-1' if 'leftSide' is greater than 'rightSide', 'ascending' is 'false' and
      dates are a Javascript DateTime format`, () => {
      const ascending: boolean = false;
      const expectedReturn: number = -1;
      const leftSide = new Date(2018, 3, 5, 9, 10, 0);
      const rightSide = new Date(2018, 3, 5, 9, 0, 0);

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '1' if 'leftSide' is less than 'rightSide', 'ascending' is 'false' and
      dates are a Javascript DateTime format`, () => {
      const ascending: boolean = false;
      const expectedReturn: number = 1;
      const leftSide = new Date(2018, 3, 5, 9, 0, 0);
      const rightSide = new Date(2018, 3, 5, 9, 10, 0);

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '0' if 'leftSide' is equal to 'rightSide', 'ascending' is 'true' and
      dates are a Javascript DateTime format`, () => {
      const ascending: boolean = true;
      const expectedReturn: number = 0;
      const leftSide = new Date(2018, 3, 5, 9, 0, 0);
      const rightSide = new Date(2018, 3, 5, 9, 0, 0);

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });

    it(`should return '0' if 'leftSide' is equal to 'rightSide', 'ascending' is 'false' and
      dates are a Javascript DateTime format`, () => {
      const ascending: boolean = false;
      const expectedReturn: number = 0;
      const leftSide = new Date(2018, 3, 5, 9, 0, 0);
      const rightSide = new Date(2018, 3, 5, 9, 0, 0);

      expect(sortValues(leftSide, rightSide, ascending)).toBe(expectedReturn);
    });
  });
});

describe('Function validateDateRange:', () => {
  let dateStart;
  let dateEnd;
  let date;

  beforeEach(() => {
    dateStart = undefined;
    dateEnd = undefined;
    date = new Date(2018, 6, 30);
  });

  it('should return `true` when date is between `dateStart` and `dateEnd`.', () => {
    dateStart = new Date(2018, 0, 1);
    dateEnd = new Date(2019, 0, 1);

    expect(validateDateRange(date, dateStart, dateEnd)).toBeTruthy();
  });

  it('should return `false` when date is not between `dateStart` and `dateEnd`.', () => {
    dateStart = new Date(2000, 0, 1);
    dateEnd = new Date(2001, 0, 1);

    expect(validateDateRange(date, dateStart, dateEnd)).toBeFalsy();
  });

  it('should return `true` when date is greater than `dateStart`.', () => {
    dateStart = new Date(2018, 0, 1);

    expect(validateDateRange(date, dateStart, dateEnd)).toBeTruthy();
  });

  it('should return `false` when date is less than `dateStart`.', () => {
    dateStart = new Date(2019, 0, 1);

    expect(validateDateRange(date, dateStart, dateEnd)).toBeFalsy();
  });

  it('should return `true` when date is less than `dateEnd`.', () => {
    dateEnd = new Date(2019, 0, 1);

    expect(validateDateRange(date, dateStart, dateEnd)).toBeTruthy();
  });

  it('should return `false` when date is greater than `dateEnd`.', () => {
    dateEnd = new Date(2017, 0, 1);

    expect(validateDateRange(date, dateStart, dateEnd)).toBeFalsy();
  });

  it('should return `true` when doesn`t have `dateStart` and `dateEnd`.', () => {
    expect(validateDateRange(date, dateStart, dateEnd)).toBeTruthy();
  });
});

describe('Function capitalizeFirstLetter:', () => {
  const lowerCaseText = 'text';
  const upperCaseText = 'TEXT';
  const expectedReturn = 'Text';

  it('should return first letter capitalized', () => {
    expect(capitalizeFirstLetter(lowerCaseText)).toBe(expectedReturn);
  });

  it('should keep first letter capitalized', () => {
    expect(capitalizeFirstLetter(upperCaseText)).toBe(upperCaseText);
  });
});

describe('Function formatYear:', () => {
  it('should return year as string', () => {
    const year = 2018;
    const stringYear = '2018';

    expect(formatYear(year)).toBe(stringYear);
  });

  it('should return year as string with left 0', () => {
    const year = 118;
    const stringYear = '0118';

    expect(formatYear(year)).toBe(stringYear);
  });

  it('should return year as string with left 00', () => {
    const year = 18;
    const stringYear = '0018';

    expect(formatYear(year)).toBe(stringYear);
  });

  it('should return year as string with left 000', () => {
    const year = 8;
    const stringYear = '0008';

    expect(formatYear(year)).toBe(stringYear);
  });

  it('should return undefined if year is -1', () => {
    const year = -1;

    expect(formatYear(year)).toBeUndefined();
  });
});

describe('Function setYearFrom0To100:', () => {
  it('should set year to 1 if year is 1', () => {
    const year = 1;
    const date = new Date(1, 1, 1);

    setYearFrom0To100(date, year);

    expect(date.getFullYear()).toBe(year);
  });

  it('shouldn`t set year to 1 if year is 2018', () => {
    const year = 2018;
    const date = new Date(2018, 1, 1);

    setYearFrom0To100(date, year);

    expect(date.getFullYear()).toBe(year);
  });
});

describe('Function mapArrayByProperties:', () => {
  it('should return an array with a list of objects with only selected properties', () => {
    const people = [
      { id: 1, name: 'Fulano', birthdate: '1980-11-01', genre: 'Male', city: 'São Paulo', dependents: 2 },
      { id: 2, name: 'Beltrano', birthdate: '1997-01-21', genre: 'Female', city: 'Joinville', dependents: 0 },
      { id: 3, name: 'Siclano', birthdate: '1995-07-15', genre: 'Male', city: 'Joinville', dependents: 0 }
    ];
    const properties = ['id', 'name'];

    const result = [
      { id: 1, name: 'Fulano' },
      { id: 2, name: 'Beltrano' },
      { id: 3, name: 'Siclano' }
    ];

    expect(mapArrayByProperties(people, properties)).toEqual(result);
  });

  it('should return an array with a list of objects with same structure for all items', () => {
    const people = [
      { id: 1, name: 'Fulano', city: 'São Paulo', dependents: 2 }, // no genre
      { id: 2, name: 'Beltrano', genre: 'Female', city: 'Joinville' }, // no dependents
      { id: 3, name: 'Siclano', genre: 'Male', dependents: 0 } // no city
    ];
    const properties = ['id', 'name', 'city', 'genre', 'dependents'];

    const result = [
      { id: 1, name: 'Fulano', city: 'São Paulo', genre: undefined, dependents: 2 },
      { id: 2, name: 'Beltrano', city: 'Joinville', genre: 'Female', dependents: undefined },
      { id: 3, name: 'Siclano', city: undefined, genre: 'Male', dependents: 0 }
    ];

    expect(mapArrayByProperties(people, properties)).toEqual(result);
  });

  it('should return an array with a list of empty objects if isn`t an object list', () => {
    const people = [
      { id: 1, name: 'Fulano' },
      { id: 2, name: 'Beltrano' },
      { id: 3, name: 'Siclano' }
    ];

    const result = [{}, {}, {}];

    expect(mapArrayByProperties(people)).toEqual(result);
  });

  it('should return an empty array if params doesn`t exist', () => {
    expect(mapArrayByProperties()).toEqual([]);
  });
});

describe('Function mapObjectByProperties:', () => {
  it('should return a new object with only selected properties', () => {
    const person = { id: 1, name: 'Fulano', birthdate: '1980-11-01', genre: 'Male', city: 'São Paulo', dependents: 2 };
    const properties = ['id', 'name'];

    const result = { id: 1, name: 'Fulano' };

    expect(mapObjectByProperties(person, properties)).toEqual(result);
  });

  it('should return property with undefined if the property doesn`t exist', () => {
    const person = { id: 1, name: 'Fulano', birthdate: '1980-11-01' };
    const properties = ['id', 'nickname'];

    const result = { id: 1, nickname: undefined };

    expect(mapObjectByProperties(person, properties)).toEqual(result);
  });

  it('should return an empty object if params doesn`t exist', () => {
    expect(mapObjectByProperties()).toEqual({});
  });
});

describe('Function valuesFromObject:', () => {
  it('should return an array of values of object', () => {
    const person = { id: 1, name: 'Fulano', birthdate: '1980-11-01' };

    const result = [1, 'Fulano', '1980-11-01'];

    expect(valuesFromObject(person)).toEqual(result);
  });

  it('should return an empty array if params doesn`t exist', () => {
    expect(valuesFromObject()).toEqual([]);
  });
});

describe('Function convertImageToBase64:', () => {
  it(`should resolve of promise if file is defined.`, async () => {
    const file = new File([''], 'filename', { type: 'text/html' });

    const result = await convertImageToBase64(file);

    expect(result).toBeDefined();
  });

  it(`should return a error if file is invalid.`, async () => {
    const file = <any>'invalid file';

    const result = await handleThrowError(convertImageToBase64(file));

    expect(result).toThrow();
  });
});

describe('Function convertNumberToDecimals:', () => {
  it('should convert number to float', () => {
    expect(convertNumberToDecimal(12.567, 2)).toBe(12.57);
    expect(convertNumberToDecimal(12.56, 2)).toBe(12.56);
    expect(convertNumberToDecimal(12.5649584958748574897, 2)).toBe(12.56);
    expect(convertNumberToDecimal(12.5649584958748574897, 4)).toBe(12.565);
    expect(convertNumberToDecimal(12.56, 1)).toBe(12.6);
    expect(convertNumberToDecimal('12.56', 1)).toBe(12.6);
    expect(convertNumberToDecimal('12', 1)).toBe(12);
    expect(convertNumberToDecimal(12, 1)).toBe(12);
    expect(convertNumberToDecimal(0, 0)).toBe(0);
    expect(convertNumberToDecimal(0, 1)).toBe(0);
    expect(convertNumberToDecimal(100, 1)).toBe(100);
    expect(convertNumberToDecimal(100, 0)).toBe(100);
    expect(convertNumberToDecimal(undefined, 0)).toBe(undefined);
    expect(convertNumberToDecimal('test', 0)).toBe(undefined);
    expect(convertNumberToDecimal(null, 0)).toBe(undefined);
    expect(convertNumberToDecimal(NaN, 1)).toBe(undefined);
  });
});

describe('Function clearObject:', () => {
  it('should return object without null or undefined value', () => {
    const expectedValue = { name: 'john doe' };
    const dirtyObject = { ...expectedValue, age: undefined, email: null };

    const cleanObject = clearObject(dirtyObject);

    expect(cleanObject).toEqual(expectedValue);
  });
});

describe('Function validateObjectType:', () => {
  it('should return value if it`s an object', () => {
    const value = { key: 'value' };

    expect(validateObjectType(value)).toEqual(value);
  });

  it('should return undefined if it isn`t an object', () => {
    let value: any;

    value = 'value';
    expect(validateObjectType(value)).toBe(undefined);

    value = 1;
    expect(validateObjectType(value)).toBe(undefined);

    value = false;
    expect(validateObjectType(value)).toBe(undefined);

    value = ['value'];
    expect(validateObjectType(value)).toBe(undefined);
  });
});

describe('sortFields:', () => {
  it('should return the ordered fields', () => {
    const fields = [
      { property: 'test 1', order: 2 },
      { property: 'test 2', order: 1 },
      { property: 'test 3', order: 4 },
      { property: 'test 4', order: 3 }
    ];

    const expectedFields = [
      { property: 'test 2', order: 1 },
      { property: 'test 1', order: 2 },
      { property: 'test 4', order: 3 },
      { property: 'test 3', order: 4 }
    ];

    const result = UtilFunctions.sortFields(fields, -1);

    expect(result).toEqual(expectedFields);
  });

  it('should return ordering fields with value default', () => {
    const fields = [
      { property: 'test 1', order: 2 },
      { property: 'test 2', order: -1 },
      { property: 'test 3', order: 4 },
      { property: 'test 4', order: 3 }
    ];

    const expectedFields = [
      { property: 'test 1', order: 2 },
      { property: 'test 4', order: 3 },
      { property: 'test 3', order: 4 },
      { property: 'test 2', order: -1 }
    ];

    const result = UtilFunctions.sortFields(fields, -1);

    expect(result).toEqual(expectedFields);
  });

  it('should return ordering fields with default values', () => {
    const fields = [
      { property: 'test 1', order: 2 },
      { property: 'test 2', order: -1 },
      { property: 'test 3' },
      { property: 'test 4', order: -2 },
      { property: 'test 5', order: 0 },
      { property: 'test 6' },
      { property: 'test 7', order: 4 },
      { property: 'test 8', order: 2 }
    ];

    const expectedFields = [
      { property: 'test 1', order: 2 },
      { property: 'test 8', order: 2 },
      { property: 'test 7', order: 4 },
      { property: 'test 2', order: -1 },
      { property: 'test 3' },
      { property: 'test 4', order: -2 },
      { property: 'test 5', order: 0 },
      { property: 'test 6' }
    ];

    const result = UtilFunctions.sortFields(fields);

    expect(result).toEqual(expectedFields);
  });

  it('should return ordering fields with invalid values', () => {
    const fields = [
      { property: 'test 1', order: 2 },
      { property: 'test 2', order: true },
      { property: 'test 3' },
      { property: 'test 4', order: -2 },
      { property: 'test 5', order: 0 },
      { property: 'test 6' },
      { property: 'test 7', order: 4 },
      { property: 'test 8', order: 'A' }
    ];

    const expectedFields = [
      { property: 'test 1', order: 2 },
      { property: 'test 7', order: 4 },
      { property: 'test 2', order: true },
      { property: 'test 3' },
      { property: 'test 4', order: -2 },
      { property: 'test 5', order: 0 },
      { property: 'test 6' },
      { property: 'test 8', order: 'A' }
    ];

    const result = UtilFunctions.sortFields(fields);

    expect(result).toEqual(expectedFields);
  });

  it('should keep the array in the same order if order is undefined', () => {
    const fields = [
      { property: 'test 1' },
      { property: 'test 2' },
      { property: 'test 3' },
      { property: 'test 4' },
      { property: 'test 5' },
      { property: 'test 6' },
      { property: 'test 7' }
    ];

    const expectedFields = [
      { property: 'test 1' },
      { property: 'test 2' },
      { property: 'test 3' },
      { property: 'test 4' },
      { property: 'test 5' },
      { property: 'test 6' },
      { property: 'test 7' }
    ];

    const result = UtilFunctions.sortFields(fields, -1);

    expect(result).toEqual(expectedFields);
  });

  it('should return an empty array if fields is an empty array', () => {
    const fields = [];

    const expectedFields = [];

    const result = UtilFunctions.sortFields(fields, -1);

    expect(result).toEqual(expectedFields);
  });

  it('should return an empty array if fields is undefined', () => {
    const fields = undefined;

    const expectedFields = [];

    const result = UtilFunctions.sortFields(fields);

    expect(result).toEqual(expectedFields);
  });
});
