export const MASK_CPF = '999.999.999-99';
export const MASK_CNPJ = '99.999.999/9999-99';

const CPF_LENGTH = 11;

export function onlyDigits(value: string): string {
  return (value || '').replace(/\D/g, '');
}

export function resolveMask(digitCount: number): string {
  return digitCount > CPF_LENGTH ? MASK_CNPJ : MASK_CPF;
}
