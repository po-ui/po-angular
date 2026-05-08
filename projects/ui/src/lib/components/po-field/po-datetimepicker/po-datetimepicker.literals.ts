export const PoDatetimepickerLiterals = {
  en: {
    open: 'Open calendar',
    clean: 'Clear field',
    invalidDatetime: 'Invalid date/time',
    datetimeOutOfRange: 'Date/time out of range'
  },
  es: {
    open: 'Calendario abierto',
    clean: 'Limpiar campo',
    invalidDatetime: 'Fecha/hora inválida',
    datetimeOutOfRange: 'Fecha/hora fuera del rango'
  },
  pt: {
    open: 'Abrir calendário',
    clean: 'Limpar campo',
    invalidDatetime: 'Data/hora inválida',
    datetimeOutOfRange: 'Data/hora fora do período'
  },
  ru: {
    open: 'Открыть календарь',
    clean: 'Очистить поле',
    invalidDatetime: 'Неверная дата/время',
    datetimeOutOfRange: 'Дата/время вне диапазона'
  }
};

/**
 * Mapeamento de locale para formato de data padrão.
 * - `en`: mm/dd/yyyy (padrão americano)
 * - `pt`, `es`, `ru`: dd/mm/yyyy
 */
export const PoDatetimepickerFormatByLocale: { [key: string]: string } = {
  en: 'mm/dd/yyyy',
  es: 'dd/mm/yyyy',
  pt: 'dd/mm/yyyy',
  ru: 'dd/mm/yyyy'
};

/**
 * Mapeamento de locale para formato de hora padrão.
 * - `en`: 12h (AM/PM)
 * - `pt`, `es`, `ru`: 24h
 */
export const PoDatetimepickerTimeFormatByLocale: { [key: string]: '12' | '24' } = {
  en: '12',
  es: '24',
  pt: '24',
  ru: '24'
};
