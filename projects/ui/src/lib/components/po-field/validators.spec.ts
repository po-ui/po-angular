import {
  requiredFailed,
  maxlengpoailed,
  minlengpoailed,
  patternFailed,
  minFailed,
  maxFailed,
  dateFailed,
  validateLength
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
  it('should return `true` if value.length is greater than `maxlength` without ignoring special characters', () => {
    expect(maxlengpoailed(3, '1234', false)).toBeTruthy();
    expect(maxlengpoailed(5, 'abc-de', false)).toBeTruthy();
    expect(maxlengpoailed(7, 'abc@def!', false)).toBeTruthy();
  });

  it('should return `false` if value.length is less or equal than `maxlength` without ignoring special characters', () => {
    expect(maxlengpoailed(3, '123', false)).toBeFalsy();
    expect(maxlengpoailed(6, 'abc-def', false)).toBeTruthy();
    expect(maxlengpoailed(7, 'abcdef!', false)).toBeFalsy();
  });

  it('should return `true` if alphanumeric value.length exceeds `maxlength` while ignoring special characters', () => {
    expect(maxlengpoailed(3, '123-4', true)).toBeTruthy();
    expect(maxlengpoailed(3, 'abc@de!', true)).toBeTruthy();
  });

  it('should return `false` if alphanumeric value.length is within `maxlength` while ignoring special characters', () => {
    expect(maxlengpoailed(4, '123-4', true)).toBeFalsy();
    expect(maxlengpoailed(5, 'abc@d!', true)).toBeFalsy();
  });

  it('should handle null or undefined values gracefully', () => {
    expect(maxlengpoailed(3, null, true)).toBeFalsy();
    expect(maxlengpoailed(3, undefined, true)).toBeFalsy();
  });

  it('should handle edge cases for special character-only inputs', () => {
    expect(maxlengpoailed(1, '---', true)).toBeFalsy();
    expect(maxlengpoailed(1, '@@@', true)).toBeFalsy();
  });

  it('should consider all characters when ignoring special characters is disabled', () => {
    expect(maxlengpoailed(5, '123-4', false)).toBeFalsy();
    expect(maxlengpoailed(5, 'abc@!', false)).toBeFalsy();
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

  it('should correctly handle maskNoLengthValidation when true', () => {
    expect(minlengpoailed(3, '1-2', true)).toBeTruthy();
    expect(minlengpoailed(3, '1-2-3', true)).toBeFalsy();
    expect(minlengpoailed(5, '12-345', true)).toBeFalsy();
    expect(minlengpoailed(5, '12--34', true)).toBeTruthy();
  });

  it('should correctly handle maskNoLengthValidation when false', () => {
    expect(minlengpoailed(3, '1-2', false)).toBeFalsy();
    expect(minlengpoailed(3, '1-2-3', false)).toBeFalsy();
    expect(minlengpoailed(5, '12-345', false)).toBeFalsy();
    expect(minlengpoailed(5, '12--34', false)).toBeFalsy();
  });

  it('should return `false` for invalid values or limits regardless of maskNoLengthValidation', () => {
    expect(minlengpoailed(undefined, '123', true)).toBeFalsy();
    expect(minlengpoailed(null, '123', true)).toBeFalsy();
    expect(minlengpoailed(3, null, true)).toBeFalsy();
    expect(minlengpoailed(3, undefined, true)).toBeFalsy();

    expect(minlengpoailed(undefined, '123', false)).toBeFalsy();
    expect(minlengpoailed(null, '123', false)).toBeFalsy();
    expect(minlengpoailed(3, null, false)).toBeFalsy();
    expect(minlengpoailed(3, undefined, false)).toBeFalsy();
  });
});

describe('Function validateLength:', () => {
  it('should return true if value length exceeds limit and comparison is "max"', () => {
    expect(validateLength(3, '1234', 'max')).toBeTruthy();
    expect(validateLength(5, 'abcdef', 'max')).toBeTruthy();
  });

  it('should return false if value length is within limit and comparison is "max"', () => {
    expect(validateLength(3, '123', 'max')).toBeFalsy();
    expect(validateLength(5, 'abcd', 'max')).toBeFalsy();
  });

  it('should return true if value length is below limit and comparison is "min"', () => {
    expect(validateLength(5, '1234', 'min')).toBeTruthy();
    expect(validateLength(3, '12', 'min')).toBeTruthy();
  });

  it('should return false if value length meets or exceeds limit and comparison is "min"', () => {
    expect(validateLength(3, '123', 'min')).toBeFalsy();
    expect(validateLength(5, 'abcdef', 'min')).toBeFalsy();
  });

  it('should correctly handle maskNoLengthValidation when true', () => {
    expect(validateLength(5, '1-2-3-4-5', 'max', true)).toBeFalsy();
    expect(validateLength(5, '1-2-3', 'min', true)).toBeTruthy();
  });

  it('should return false for invalid values or limits', () => {
    expect(validateLength(undefined, '123', 'max')).toBeFalsy();
    expect(validateLength(null, '123', 'max')).toBeFalsy();
    expect(validateLength(3, null, 'max')).toBeFalsy();
    expect(validateLength(3, undefined, 'max')).toBeFalsy();
  });

  it('should return false if comparison is not "max" or "min"', () => {
    expect(validateLength(3, '1234', 'invalidComparison' as any)).toBeFalsy();
    expect(validateLength(3, '1234', '' as any)).toBeFalsy();
    expect(validateLength(3, '1234', null)).toBeFalsy();
    expect(validateLength(3, '1234', undefined)).toBeFalsy();
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
