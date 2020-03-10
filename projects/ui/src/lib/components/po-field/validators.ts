export function requiredFailed(required: boolean, disabled: boolean, value: string | Array<any> | number | boolean) {
  const valid =
    (typeof value === 'string' && value) ||
    (typeof value === 'object' && value && value.length) ||
    (typeof value === 'number' && (value || value === 0)) ||
    (typeof value === 'boolean' && value);
  return required && !disabled && !valid;
}

export function maxlengpoailed(maxlength: number, value: string | number) {
  const validMaxlength = maxlength || maxlength === 0;
  const validValue = (value || value === 0) && value.toString();
  return validMaxlength && validValue && validValue.length > Number(maxlength);
}

export function minlengpoailed(minlength: number, value: string | number) {
  const validMinlength = minlength || minlength === 0;
  const validValue = (value || value === 0) && value.toString();
  return validMinlength && validValue && validValue.length < Number(minlength);
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
