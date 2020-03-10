import {
  requiredFailed,
  maxlengpoailed,
  minlengpoailed,
  patternFailed,
  minFailed,
  maxFailed,
  dateFailed
} from './validators';

describe('requiredFailed: ', () => {
  it('should be true', () => {
    expect(requiredFailed(true, false, '')).toBeTruthy();
  });

  it('should be false', () => {
    expect(requiredFailed(true, true, '')).toBeFalsy();
    expect(requiredFailed(true, false, 'valor')).toBeFalsy();
    expect(requiredFailed(false, true, '')).toBeFalsy();
    expect(requiredFailed(false, false, '')).toBeFalsy();
    expect(requiredFailed(true, false, 123)).toBeFalsy();
    expect(requiredFailed(true, false, 0)).toBeFalsy();
    expect(requiredFailed(true, false, [1, 2, 3])).toBeFalsy();
  });

  it('should return `true` if passed boolean value false', () => {
    const required = true;
    const disabled = false;
    const value = false;

    expect(requiredFailed(required, disabled, value)).toBeTruthy();
  });

  it('should return `false` if passed boolean value true', () => {
    const required = true;
    const disabled = false;
    const value = true;

    expect(requiredFailed(required, disabled, value)).toBeFalsy();
  });
});

describe('Function maxlengpoailed:', () => {
  it('should return `true` if value.length is greater than `maxlength`', () => {
    expect(maxlengpoailed(3, '1234')).toBeTruthy();
    expect(maxlengpoailed(3, '1234567')).toBeTruthy();
    expect(maxlengpoailed(5, 'abcdef')).toBeTruthy();
    expect(maxlengpoailed(10, 'abcdefghijk')).toBeTruthy();
    expect(maxlengpoailed(0, 'abc')).toBeTruthy();
  });

  it('should return `false` if value.length is less or equal than `maxlength` or value or `maxlength` is invalid', () => {
    expect(maxlengpoailed(3, '123')).toBeFalsy();
    expect(maxlengpoailed(1, '1')).toBeFalsy();
    expect(maxlengpoailed(0, '')).toBeFalsy();
    expect(maxlengpoailed(20, null)).toBeFalsy();
    expect(maxlengpoailed(20, undefined)).toBeFalsy();
    expect(maxlengpoailed(5, 'abcd')).toBeFalsy();
    expect(maxlengpoailed(2, 'a')).toBeFalsy();
    expect(maxlengpoailed(undefined, 'abc')).toBeFalsy();
    expect(maxlengpoailed(null, '123')).toBeFalsy();
    expect(maxlengpoailed(NaN, '123')).toBeFalsy();
  });
});

describe('Function minlengpoailed:', () => {
  it('should return `true` if value.length is less than `minlength`', () => {
    expect(minlengpoailed(3, 0)).toBeTruthy();
    expect(minlengpoailed(3, '12')).toBeTruthy();
    expect(minlengpoailed(3, '1')).toBeTruthy();
    expect(minlengpoailed(3, 'aa')).toBeTruthy();
    expect(minlengpoailed(20, 'aa')).toBeTruthy();
  });

  it('should return `false` if value.length is greater or equal than `minlength` or value or `minlength` is invalid', () => {
    expect(minlengpoailed(3, '123')).toBeFalsy();
    expect(minlengpoailed(1, '1')).toBeFalsy();
    expect(minlengpoailed(0, '')).toBeFalsy();
    expect(minlengpoailed(20, null)).toBeFalsy();
    expect(minlengpoailed(20, undefined)).toBeFalsy();
    expect(minlengpoailed(5, 'abcdef')).toBeFalsy();
    expect(minlengpoailed(2, 'abc')).toBeFalsy();
    expect(minlengpoailed(undefined, 'abc')).toBeFalsy();
    expect(minlengpoailed(null, 'abc')).toBeFalsy();
    expect(minlengpoailed(NaN, '123')).toBeFalsy();
    expect(minlengpoailed(0, '123')).toBeFalsy();
  });
});

describe('Function patternFailed', () => {
  it('should be true', () => {
    expect(patternFailed('d', 'a')).toBeTruthy();
    expect(patternFailed('[0-3]', '4')).toBeTruthy();
    expect(patternFailed('[(0', '4')).toBeTruthy();
  });

  it('should be false', () => {
    expect(patternFailed('[0-3]', '0')).toBeFalsy();
    expect(patternFailed('[0-3]', '3')).toBeFalsy();
  });
});

describe('Function minFailed:', () => {
  it('should return `true` if value is less than min', () => {
    expect(minFailed(3, 1)).toBeTruthy();
    expect(minFailed(3, 2)).toBeTruthy();
    expect(minFailed(3, 0)).toBeTruthy();
    expect(minFailed(-1, -2)).toBeTruthy();
    expect(minFailed(0, -1)).toBeTruthy();
    expect(minFailed(50, 49)).toBeTruthy();
    expect(minFailed(1000, 999)).toBeTruthy();
  });

  it('should return `false` if min number or value is invalid', () => {
    expect(minFailed(undefined, 2)).toBeFalsy();
    expect(minFailed(null, 3)).toBeFalsy();
    expect(minFailed(1, undefined)).toBeFalsy();
    expect(minFailed(1, null)).toBeFalsy();
    expect(minFailed(0, 0)).toBeFalsy();
  });

  it('should return `false` if value is equal or greater than min', () => {
    expect(minFailed(0, 0)).toBeFalsy();
    expect(minFailed(3, 3)).toBeFalsy();
    expect(minFailed(-1, -1)).toBeFalsy();
    expect(minFailed(0, 3)).toBeFalsy();
    expect(minFailed(1, 2)).toBeFalsy();
    expect(minFailed(-2, 0)).toBeFalsy();
    expect(minFailed(49, 50)).toBeFalsy();
    expect(minFailed(999, 1000)).toBeFalsy();
    expect(minFailed(1000, 1000)).toBeFalsy();
  });
});

describe('Function maxFailed:', () => {
  it('should return `true` if value is greater than max', () => {
    expect(maxFailed(1, 3)).toBeTruthy();
    expect(maxFailed(2, 3)).toBeTruthy();
    expect(maxFailed(0, 3)).toBeTruthy();
    expect(maxFailed(-2, -1)).toBeTruthy();
    expect(maxFailed(-1, 0)).toBeTruthy();
    expect(maxFailed(49, 50)).toBeTruthy();
    expect(maxFailed(999, 1000)).toBeTruthy();
  });

  it('should return `false` if max number or value is invalid', () => {
    expect(maxFailed(undefined, 2)).toBeFalsy();
    expect(maxFailed(null, 3)).toBeFalsy();
    expect(maxFailed(1, undefined)).toBeFalsy();
    expect(maxFailed(1, null)).toBeFalsy();
  });

  it('should return `false` if value is equal or less than max', () => {
    expect(maxFailed(0, 0)).toBeFalsy();
    expect(maxFailed(3, 3)).toBeFalsy();
    expect(maxFailed(-1, -1)).toBeFalsy();
    expect(maxFailed(3, 0)).toBeFalsy();
    expect(maxFailed(2, 1)).toBeFalsy();
    expect(maxFailed(0, -2)).toBeFalsy();
    expect(maxFailed(50, 49)).toBeFalsy();
    expect(maxFailed(1000, 999)).toBeFalsy();
    expect(maxFailed(1000, 1000)).toBeFalsy();
  });
});

describe('Function dateFailed', () => {
  it('should be true', () => {
    expect(dateFailed('teste')).toBeTruthy();
  });

  it('should be false', () => {
    expect(dateFailed(new Date().toString())).toBeFalsy();
  });
});
