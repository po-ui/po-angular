import { Pipe, PipeTransform, inject } from '@angular/core';

import {
  applyDecimalFormat,
  parseDecimalFormat
} from '../../components/po-field/po-decimal/utils/po-decimal-format.util';
import { PoLanguageService } from '../../services/po-language/po-language.service';

/**
 * Aplica máscaras de formatação numérica avançada a valores numéricos.
 *
 * > Retorna string vazia quando o valor excede a capacidade do formato (overflow).
 *
 * @example
 * ```html
 * {{ 4567.88 | poDecimalFormat: '>>>,>>>,>>9.99' }}
 * ```
 */
@Pipe({
  name: 'poDecimalFormat',
  standalone: true
})
export class PoDecimalFormatPipe implements PipeTransform {
  private readonly languageService = inject(PoLanguageService);

  transform(value: number | string | null | undefined, format: string, locale?: string): string {
    if (value === null || value === undefined || !format) {
      return '';
    }

    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (Number.isNaN(numValue)) {
      return '';
    }

    const parsed = parseDecimalFormat(format);
    const { decimalSeparator, thousandSeparator } = this.languageService.getNumberSeparators(locale);
    const result = applyDecimalFormat(numValue, parsed, decimalSeparator, thousandSeparator);

    return result.viewValue;
  }
}
