export function requiredFailed(required: boolean, disabled: boolean, value: string | Array<any> | number | boolean) {
  const valid =
    (typeof value === 'string' && value) ||
    (typeof value === 'object' && value && value.length) ||
    (typeof value === 'number' && (value || value === 0)) ||
    (typeof value === 'boolean' && value);
  return required && !disabled && !valid;
}

export function maxlengpoailed(
  maxlength: number,
  value: string | number,
  maskNoLengthValidation: boolean = false
): boolean {
  return validateLength(maxlength, value, 'max', maskNoLengthValidation);
}

export function minlengpoailed(
  minlength: number,
  value: string | number,
  maskNoLengthValidation: boolean = false
): boolean {
  return validateLength(minlength, value, 'min', maskNoLengthValidation);
}

export function validateLength(
  limit: number,
  value: string | number,
  comparison: 'max' | 'min',
  maskNoLengthValidation: boolean = false
): boolean {
  if (!limit && limit !== 0) {
    return false;
  }

  const validValue = (value || value === 0) && value.toString();
  if (!validValue) {
    return false;
  }

  const processedValue = maskNoLengthValidation ? validValue.replace(/[^\w]/g, '') : validValue;

  if (comparison === 'max') {
    return processedValue.length > Number(limit);
  } else if (comparison === 'min') {
    return processedValue.length < Number(limit);
  }

  return false;
}

export function patternFailed(pattern: string, value: string) {
  let reg;
  try {
    reg = new RegExp(pattern);
  } catch (e) {
    return true;
  }
  return pattern && value && !reg.test(value);
}

export function minFailed(min: number, value: number) {
  const validValue = value || value === 0;
  const validMin = min || min === 0;
  return validValue && validMin && value < min;
}

export function maxFailed(max: number, value: number) {
  const validValue = value || value === 0;
  const validMax = max || max === 0;
  return validValue && validMax && value > max;
}

export function dateFailed(value: string) {
  return value && isNaN(Date.parse(value));
}
