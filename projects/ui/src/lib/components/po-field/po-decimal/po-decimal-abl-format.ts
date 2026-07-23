/**
 * Classe utilitária responsável por interpretar uma *format string* no padrão **ABL**
 * (Progress 4GL) e formatar um valor numérico de acordo com ela.
 *
 * É utilizada pelo `po-decimal` quando a propriedade `p-format-abl` está definida.
 *
 * ## Caracteres suportados na *picture*
 *
 * | Caractere | Significado |
 * |-----------|-------------|
 * | `9`       | Posição de dígito obrigatória. Quando não há dígito significativo, exibe `0` (zero à esquerda / à direita). |
 * | `>` / `Z` | Posição de dígito com supressão de zero à esquerda. Quando não há dígito significativo, exibe espaço em branco. |
 * | `<`       | Posição de dígito decimal com supressão de zero à direita (*trailing*). |
 * | `,`       | Separador de grupo (milhar). A posição é literal, respeitando exatamente a *picture*. |
 * | `.`       | Separador decimal. Define a divisão entre a parte inteira e a decimal. |
 * | `-` / `+` | Sinal. Pode ser prefixo (início) ou sufixo (fim) da *picture*. |
 *
 * > A *picture* sempre utiliza `.` como separador decimal e `,` como separador de grupo (convenção ABL).
 * > A renderização utiliza os separadores informados em `format()`, permitindo respeitar o *locale*
 * > (ex.: europeu, onde o decimal vira `,` e o grupo vira `.`).
 *
 * @example
 * ```typescript
 * const abl = new PoDecimalAblFormat('999.9');
 * abl.format(0.1); // '000,1' (locale pt-BR)
 * abl.format(12.3); // '012,3'
 *
 * const abl2 = new PoDecimalAblFormat('>>>,>>>,>>9.99');
 * abl2.format(4567.8, ',', '.'); // '        4.567,80'
 * ```
 */
export class PoDecimalAblFormat {
  /** *Picture* original informada. */
  readonly format: string;

  /** Quantidade de casas decimais derivada da *picture* (usada para arredondamento do model). */
  readonly decimalsLength: number;

  /** Quantidade de dígitos na parte inteira derivada da *picture*. */
  readonly integerLength: number;

  private readonly integerTokens: Array<PoDecimalAblToken> = [];
  private readonly decimalTokens: Array<PoDecimalAblToken> = [];
  private leadingSign: '' | '-' | '+' = '';
  private trailingSign: '' | '-' | '+' = '';
  private hasDecimalPoint = false;

  constructor(format: string) {
    this.format = format || '';
    this.parse(this.format);
    this.decimalsLength = this.decimalTokens.filter(token => token.digit).length;
    this.integerLength = this.integerTokens.filter(token => token.digit).length;
  }

  /**
   * Formata um valor numérico de acordo com a *picture* ABL.
   *
   * @param value Valor numérico (ou string numérica) a ser formatado.
   * @param decimalSeparator Caractere usado como separador decimal na renderização. Padrão `.`.
   * @param thousandSeparator Caractere usado como separador de grupo na renderização. Padrão `,`.
   */
  format(value: number | string, decimalSeparator: string = '.', thousandSeparator: string = ','): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));

    if (isNaN(numericValue)) {
      return '';
    }

    const negative = numericValue < 0;
    const fixedValue = Math.abs(numericValue).toFixed(this.decimalsLength);
    const [integerDigits, decimalDigits = ''] = fixedValue.split('.');

    const integerOutput = this.formatIntegerPart(integerDigits, thousandSeparator);
    const decimalOutput = this.formatDecimalPart(decimalDigits);

    let result = integerOutput;

    if (this.hasDecimalPoint && this.decimalTokens.length) {
      result += decimalSeparator + decimalOutput;
    }

    return this.applySign(result, negative);
  }

  private parse(format: string): void {
    let body = format;

    // Sinal no sufixo (ex.: ">>9-")
    if (body.length && (body[body.length - 1] === '-' || body[body.length - 1] === '+')) {
      this.trailingSign = body[body.length - 1] as '-' | '+';
      body = body.slice(0, -1);
    }

    // Sinal no prefixo (ex.: "->>9")
    if (body.length && (body[0] === '-' || body[0] === '+')) {
      this.leadingSign = body[0] as '-' | '+';
      body = body.slice(1);
    }

    const dotIndex = body.indexOf('.');
    let integerPart = body;
    let decimalPart = '';

    if (dotIndex >= 0) {
      this.hasDecimalPoint = true;
      integerPart = body.slice(0, dotIndex);
      decimalPart = body.slice(dotIndex + 1);
    }

    for (const char of integerPart) {
      this.integerTokens.push(this.createIntegerToken(char));
    }

    for (const char of decimalPart) {
      const token = this.createDecimalToken(char);
      if (token) {
        this.decimalTokens.push(token);
      }
    }
  }

  private createIntegerToken(char: string): PoDecimalAblToken {
    if (char === '9') {
      return { digit: true, kind: '9' };
    }
    if (char === '>' || char === 'Z' || char === 'z') {
      return { digit: true, kind: '>' };
    }
    if (char === ',') {
      return { digit: false, char: ',', group: true };
    }

    return { digit: false, char };
  }

  private createDecimalToken(char: string): PoDecimalAblToken | null {
    if (char === '9') {
      return { digit: true, kind: '9' };
    }
    if (char === '<') {
      return { digit: true, kind: '<' };
    }
    if (char === '>' || char === 'Z' || char === 'z') {
      // No lado decimal um `>`/`Z` comporta-se como dígito obrigatório.
      return { digit: true, kind: '9' };
    }

    return null;
  }

  private formatIntegerPart(integerDigits: string, thousandSeparator: string): string {
    const digitSlots = this.integerTokens.filter(token => token.digit);
    const totalSlots = digitSlots.length;
    const digitsArray = integerDigits.split('');

    // Preenche os slots da direita para a esquerda.
    const slotChars: Array<string> = new Array(totalSlots);
    let digitIndex = digitsArray.length - 1;

    for (let slot = totalSlots - 1; slot >= 0; slot--) {
      if (digitIndex >= 0) {
        slotChars[slot] = digitsArray[digitIndex];
        digitIndex--;
      } else {
        slotChars[slot] = digitSlots[slot].kind === '9' ? '0' : ' ';
      }
    }

    // Dígitos que não couberam nos slots (overflow) são preservados à esquerda.
    let overflow = '';
    while (digitIndex >= 0) {
      overflow = digitsArray[digitIndex] + overflow;
      digitIndex--;
    }

    let output = '';
    let slotIndex = 0;
    let seenSignificant = overflow.length > 0;

    for (const token of this.integerTokens) {
      if (token.digit) {
        const char = slotChars[slotIndex];

        if (slotIndex === 0 && overflow) {
          output += overflow;
        }

        if (char !== ' ') {
          seenSignificant = true;
        }

        output += char;
        slotIndex++;
      } else if (token.group) {
        // O separador de grupo só aparece quando existe dígito significativo à esquerda.
        output += seenSignificant ? thousandSeparator : ' ';
      } else {
        output += token.char;
      }
    }

    return output;
  }

  private formatDecimalPart(decimalDigits: string): string {
    const digitTokens = this.decimalTokens.filter(token => token.digit);
    const chars: Array<string> = digitTokens.map((token, index) => {
      const digit = decimalDigits[index];
      return digit !== undefined ? digit : token.kind === '<' ? '0' : '0';
    });

    // Supressão de zeros à direita (trailing) para posições `<`.
    for (let index = digitTokens.length - 1; index >= 0; index--) {
      if (digitTokens[index].kind === '<' && chars[index] === '0') {
        chars[index] = ' ';
      } else {
        break;
      }
    }

    return chars.join('');
  }

  private applySign(value: string, negative: boolean): string {
    let result = value;

    if (this.leadingSign === '-') {
      result = (negative ? '-' : ' ') + result;
    } else if (this.leadingSign === '+') {
      result = (negative ? '-' : '+') + result;
    } else if (negative) {
      result = '-' + result;
    }

    if (this.trailingSign === '-') {
      result = result + (negative ? '-' : ' ');
    } else if (this.trailingSign === '+') {
      result = result + (negative ? '-' : '+');
    }

    return result;
  }
}

interface PoDecimalAblToken {
  /** Indica se o token representa uma posição de dígito. */
  digit: boolean;
  /** Tipo da posição de dígito: `9` (obrigatório), `>` (supressão à esquerda) ou `<` (supressão à direita). */
  kind?: '9' | '>' | '<';
  /** Caractere literal (separador de grupo ou outro caractere fixo). */
  char?: string;
  /** Indica se o token literal é um separador de grupo. */
  group?: boolean;
}
