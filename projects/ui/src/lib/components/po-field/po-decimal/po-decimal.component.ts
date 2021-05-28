import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { PoLanguageService } from '../../../services/po-language/po-language.service';

import { minFailed, maxFailed } from '../validators';

import { convertToInt } from '../../../utils/util';
import { PoInputBaseComponent } from '../po-input/po-input-base.component';

const poDecimalDefaultDecimalsLength = 2;
const poDecimalDefaultThousandMaxlength = 13;
const poDecimalMaxDecimalsLength = 15;
const poDecimalTotalLengthLimit = 16;

/**
 *
 * @docsExtends PoInputBaseComponent
 *
 * @description
 *
 * <br>
 * - O `po-decimal` é um *input* específico para receber apenas números decimais, por isso recebe as seguintes características:
 *  + Aceita apenas números;
 *  + Utiliza ',' como separador de decimal;
 *  + Utiliza '.' para separação de milhar;
 *  + É possível configurar a quantidade de casas decimais e a quantidade de digitos do campo.
 *
 * > **Importante:**
 * Atualmente o JavaScript limita-se a um conjunto de dados de `32 bits`, e para que os valores comportem-se devidamente,
 * o `po-decimal` contém um tratamento que limita em 16 o número total de casas antes e após a vírgula.
 * Veja abaixo as demais regras nas documentações de `p-decimals-length` e `p-thousand-maxlength`.
 *
 * @example
 *
 * <example name="po-decimal-basic" title="PO Decimal Basic">
 *  <file name="sample-po-decimal-basic/sample-po-decimal-basic.component.html"> </file>
 *  <file name="sample-po-decimal-basic/sample-po-decimal-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-decimal-labs" title="PO Decimal Labs">
 *  <file name="sample-po-decimal-labs/sample-po-decimal-labs.component.html"> </file>
 *  <file name="sample-po-decimal-labs/sample-po-decimal-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-decimal-hourly-wage" title="PO Decimal - Hourly Wage">
 *  <file name="sample-po-decimal-hourly-wage/sample-po-decimal-hourly-wage.component.html"> </file>
 *  <file name="sample-po-decimal-hourly-wage/sample-po-decimal-hourly-wage.component.ts"> </file>
 * </example>
 *
 * <example name="po-decimal-hourly-wage-reactive-form" title="PO Decimal - Hourly Wage Reactive Form">
 *  <file name="sample-po-decimal-hourly-wage-reactive-form/sample-po-decimal-hourly-wage-reactive-form.component.html"> </file>
 *  <file name="sample-po-decimal-hourly-wage-reactive-form/sample-po-decimal-hourly-wage-reactive-form.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-decimal',
  templateUrl: './po-decimal.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoDecimalComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoDecimalComponent),
      multi: true
    }
  ]
})
export class PoDecimalComponent extends PoInputBaseComponent implements AfterViewInit, OnInit {
  private _decimalsLength?: number = poDecimalDefaultDecimalsLength;
  private _thousandMaxlength?: number = poDecimalDefaultThousandMaxlength;
  private _locale?: string;
  private _min?: number;
  private _max?: number;

  private decimalSeparator: string;
  private fireChange: boolean = false;
  private isKeyboardAndroid: boolean = false;
  private minusSign: string = '-';
  private oldDotsLength = null;
  private thousandSeparator: string;
  private valueBeforeChange: any;

  private regex = {
    thousand: new RegExp('\\' + ',', 'g'),
    decimal: new RegExp('\\' + '.', 'g')
  };

  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;

  get autocomplete() {
    return this.noAutocomplete ? 'off' : 'on';
  }

  /**
   * @optional
   *
   * @description
   *
   * Quantidade máxima de casas decimais.
   *
   * > **Importante:**
   * - O valor máximo permitido é 15;
   * - A soma total de `p-decimals-length` com `p-thousand-maxlength` limita-se à 16;
   * - Esta propriedade sobrepõe apenas o valor **padrão** de `p-thousand-maxlength`;
   * - Caso `p-thousand-maxlength` tenha um valor definido, esta propriedade poderá receber apenas o valor restante do limite total (16).
   *
   * @default `2`
   */
  @Input('p-decimals-length') set decimalsLength(value: number) {
    let decimalsLength = convertToInt(value);

    decimalsLength = this.isValueBetweenAllowed(decimalsLength, poDecimalMaxDecimalsLength)
      ? decimalsLength
      : poDecimalDefaultDecimalsLength;

    if (this.isGreaterThanTotalLengthLimit(decimalsLength, this.thousandMaxlength)) {
      this.thousandMaxlength = poDecimalTotalLengthLimit - decimalsLength;
    }

    this._decimalsLength = decimalsLength;
  }

  get decimalsLength() {
    return this._decimalsLength;
  }

  /**
   * @optional
   *
   * @description
   *
   * Quantidade máxima de dígitos antes do separador decimal.
   *
   * > **Importante:**
   * - O valor máximo permitido é 13;
   * - A soma total de `p-decimals-length` com `p-thousand-maxlength` limita-se à 16;
   * - Esta propriedade sobrepõe o valor definido em `p-decimals-length`.
   *
   * @default `13`
   */
  @Input('p-thousand-maxlength') set thousandMaxlength(value: number) {
    let thousandMaxlength = convertToInt(value);

    if (this.decimalsLength > poDecimalDefaultDecimalsLength && !thousandMaxlength) {
      thousandMaxlength = poDecimalTotalLengthLimit - this.decimalsLength;
    }

    thousandMaxlength = this.isValueBetweenAllowed(thousandMaxlength, poDecimalDefaultThousandMaxlength)
      ? thousandMaxlength
      : poDecimalDefaultThousandMaxlength;

    if (this.isGreaterThanTotalLengthLimit(this.decimalsLength, thousandMaxlength)) {
      this.decimalsLength = poDecimalTotalLengthLimit - thousandMaxlength;
    }

    this._thousandMaxlength = thousandMaxlength;
  }

  get thousandMaxlength() {
    return this._thousandMaxlength;
  }

  /**
   * @optional
   *
   * @description
   *
   * Informa o locale(país) para a formatação do valor.
   * Por padrão o valor será configurado segundo a o módulo [`I18n`](documentation/po-i18n)
   *
   * > Para ver quais linguagens suportadas acesse [`I18n`](documentation/po-i18n)
   *
   */
  @Input('p-locale') set locale(locale: string) {
    this._locale = locale;
    this.setNumbersSeparators();
  }

  /**
   * @optional
   *
   * @description
   *
   * Valor mínimo.
   */
  @Input('p-min') set min(value: number) {
    if (!isNaN(value)) {
      this._min = value;

      this.validateModel();
    } else if (!value) {
      this._min = undefined;

      this.validateModel();
    }
  }

  get min(): number {
    return this._min;
  }

  /**
   * @optional
   *
   * @description
   *
   * Valor máximo.
   */
  @Input('p-max') set max(value: number) {
    if (!isNaN(value)) {
      this._max = value;

      this.validateModel();
    } else if (!value) {
      this._max = undefined;

      this.validateModel();
    }
  }

  get max(): number {
    return this._max;
  }

  constructor(private el: ElementRef, private poLanguageService: PoLanguageService) {
    super();
    this.isKeyboardAndroid = !!navigator.userAgent.match(/Android/i);
  }

  ngOnInit() {
    this.setNumbersSeparators();
  }

  setNumbersSeparators() {
    const { decimalSeparator, thousandSeparator } = this.poLanguageService.getNumberSeparators(this._locale);
    this.decimalSeparator = decimalSeparator;
    this.thousandSeparator = thousandSeparator;
    this.regex = {
      thousand: new RegExp('\\' + thousandSeparator, 'g'),
      decimal: new RegExp('\\' + decimalSeparator, 'g')
    };
  }

  ngAfterViewInit() {
    this.verifyAutoFocus();
    this.setPaddingInput();
  }

  clear(value) {
    this.callOnChange(value);
    this.controlChangeEmitter();
  }

  extraValidation(abstractControl: AbstractControl): { [key: string]: any } {
    // Verifica se já possui algum error pattern padrão.
    this.errorPattern = this.errorPattern !== 'Valor Inválido' ? this.errorPattern : '';

    if (minFailed(this.min, abstractControl.value)) {
      return {
        min: {
          valid: false
        }
      };
    }

    if (maxFailed(this.max, abstractControl.value)) {
      return {
        max: {
          valid: false
        }
      };
    }

    return null;
  }

  focus(): void {
    if (!this.disabled) {
      this.inputEl.nativeElement.focus();
    }
  }

  getScreenValue() {
    return this.inputEl ? this.inputEl.nativeElement.value : '';
  }

  hasInvalidClass() {
    return (
      this.el.nativeElement.classList.contains('ng-invalid') &&
      this.el.nativeElement.classList.contains('ng-dirty') &&
      this.getScreenValue() !== ''
    );
  }

  hasLetters(value: string = '') {
    return value.match(/[a-zA-Z:;+=_´`^~"'?!@#$%¨&*()><{}çÇ\[\]/\\|]+/);
  }

  isValidNumber(event: any): boolean {
    // - event.key não existia em alguns browsers, como Samsung browser e Firefox.
    const keyValue = <any>String.fromCharCode(event.which);
    const validKey = event.which !== 8 && event.which !== 0;

    return !this.hasLetters(keyValue) && validKey;
  }

  // função responsável por adicionar os zeroes com as casa decimais ao sair do campo.
  onBlur(event: any) {
    this.onTouched?.();
    const value = event.target.value;

    if (value) {
      if (this.hasLetters(value) || this.containsMoreThanOneDecimalSeparator(value)) {
        this.setViewValue('');
        this.callOnChange(undefined);
        return;
      }

      const valueWithoutThousandSeparator = this.formatValueWithoutThousandSeparator(value);
      this.setViewValue(this.formatToViewValue(valueWithoutThousandSeparator));
    }

    this.blur.emit();
    this.controlChangeEmitter();
  }

  onFocus(event: FocusEvent) {
    // Atualiza valor da variável que será usada para verificar se o campo teve alteração
    this.valueBeforeChange = this.getScreenValue();

    // Dispara evento quando o usuário entrar no campo
    // Este evento também é disparado quando o campo inicia com foco.
    this.enter.emit();
  }

  onInput(event: any) {
    const selectionStart = event.target.selectionStart;
    const selectionEnd = event.target.selectionEnd;

    let modelValue;
    let viewValue;

    // - Browsers nativos do Android ex: Samsung Browser.
    if (this.isKeyboardAndroid) {
      this.onInputKeyboardAndroid(event);
    }

    modelValue = this.formatValueWithoutThousandSeparator(event.target.value);
    modelValue = this.addZeroBefore(modelValue);
    viewValue = this.formatMask(modelValue);

    // validação para não quebrar IE com placeholder definido e Input vazio
    if (viewValue) {
      this.setViewValue(viewValue);
      this.setCursorInput(event, selectionStart, selectionEnd);
    }

    this.callOnChange(this.formatToModelValue(modelValue));
  }

  onInputKeyboardAndroid(event: any) {
    const inputValue = event.target.value;
    const selectionStart = event.target.selectionStart;
    const hasLetters = this.hasLetters(inputValue);

    if (hasLetters) {
      this.setViewValue(inputValue.replace(hasLetters[0], ''));

      return event.preventDefault();
    } else {
      const position = selectionStart - 1;
      const key = inputValue.charAt(position);

      this.setPositionValue(event);

      if (this.isValidKey(event, key)) {
        this.setViewValue(inputValue);
      }
    }
  }

  onKeyPress(event: KeyboardEvent) {
    this.isValidKey(event);
  }

  setPaddingInput() {
    setTimeout(() => {
      const selectorIcons = '.po-field-icon-container:not(.po-field-icon-container-left) > .po-icon';
      let icons = this.el.nativeElement.querySelectorAll(selectorIcons).length;
      if (this.clean) {
        icons++;
      }
      if (icons) {
        this.inputEl.nativeElement.style.paddingRight = `${icons * 36}px`;
      }
    });
  }

  writeValueModel(value) {
    if (this.inputEl) {
      if (value || value === 0) {
        const formatedViewValue = this.formatToViewValue(value);
        this.setViewValue(formatedViewValue);
      } else {
        this.setViewValue('');
      }
    }

    if (value) {
      this.change.emit(value);
    }
  }

  getErrorPatternMessage() {
    return this.errorPattern !== '' && this.hasInvalidClass() ? this.errorPattern : '';
  }

  // responsável por adicionar 0 antes da virgula (decimalSeparator).
  private addZeroBefore(value) {
    const isDecimalSeparator = value === this.decimalSeparator;

    return isDecimalSeparator ? `0${value}` : value;
  }

  private containsComma(value) {
    return value.includes(this.decimalSeparator);
  }

  private containsMoreThanOneDecimalSeparator(value: string = '') {
    const foundComma = value.match(this.regex.decimal);

    return !!(foundComma && foundComma.length > 1);
  }

  private controlChangeEmitter() {
    const elementValue = this.getScreenValue();

    // Emite o evento change manualmente quando o campo é alterado
    // Este evento é controlado manualmente devido ao preventDefault existente na máscara
    // e devido ao controle do p-clean, que também precisa emitir change
    if (elementValue !== this.valueBeforeChange) {
      this.fireChange = true;
      setTimeout(() => {
        this.change.emit(elementValue);
      }, 200);
    }
  }

  private formatMask(value: string) {
    // necessário para não adicionar . nas casa decimais.
    // por exemplo: 12.345,123.45 (errado)
    // 12.345,12345 (correto)

    if (value.match(this.regex.decimal)) {
      const regex = new RegExp(`(\\d)(?=(\\d{3})+(?!\\d)${this.decimalSeparator})`, 'g');
      return value.toString().replace(regex, `$1${this.thousandSeparator}`);
    }

    return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${this.thousandSeparator}`);
  }

  private formatToModelValue(value: string) {
    const formattedValue = this.replaceCommaToDot(value);
    const parsedValue = formattedValue ? parseFloat(Number(formattedValue).toFixed(this.decimalsLength)) : undefined;

    return parsedValue === 0 || parsedValue ? parsedValue : undefined;
  }

  private formatToViewValue(value: string) {
    let formatedNumber;
    let numberValue;
    let valueBeforeDot;
    let valueAfterDot;

    // - Necessário para tratar valores que contenham decimalSeparator
    value = this.replaceCommaToDot(value);

    numberValue = Number(value).toFixed(this.decimalsLength);

    valueBeforeDot = this.getValueBeforeSeparator(numberValue, '.');
    valueAfterDot = this.getValueAfterSeparator(numberValue, '.');

    formatedNumber = this.formatMask(valueBeforeDot);

    if (this.decimalsLength === 0) {
      return formatedNumber;
    } else {
      return `${formatedNumber}${this.decimalSeparator}${valueAfterDot}`;
    }
  }

  private formatValueWithoutThousandSeparator(value: string = '') {
    return value.toString().replace(this.regex.thousand, '');
  }

  private getValueAfterSeparator(value = '', separator) {
    return value.split(separator)[1] || '';
  }

  private getValueBeforeSeparator(value = '', separator) {
    return value.split(separator)[0] || '';
  }

  private hasLessDot(value) {
    if (value) {
      const dots = value.match(this.regex.thousand);
      const dotsLength = dots && dots.length;

      if (dotsLength < this.oldDotsLength) {
        this.oldDotsLength = dotsLength;
        return true;
      }
    }

    if (!value) {
      this.oldDotsLength = null;
    }

    return false;
  }

  private hasMoreDot(value) {
    if (value) {
      const dots = value.match(this.regex.thousand);
      const dotsLength = dots && dots.length;

      if (dotsLength > this.oldDotsLength) {
        this.oldDotsLength = dotsLength;
        return true;
      }
    }

    if (!value) {
      this.oldDotsLength = null;
    }

    return false;
  }

  private hasMinusSignInvalidPosition(event: any): boolean {
    const keyIsMinusSign = event.key === this.minusSign;
    const selectionStart = event.target.selectionStart;

    return keyIsMinusSign && selectionStart !== 0;
  }

  private isInvalidKey(event: any, charCode: any) {
    const isInvalidNumber = !this.isValidNumber(event);

    return (
      this.verifyInsertComma(event) ||
      this.verifyThousandLength(event) ||
      this.verifyValueAfterComma(event) ||
      this.verifyInsertMinusSign(event) ||
      this.hasMinusSignInvalidPosition(event) ||
      isInvalidNumber ||
      this.validateCursorPositionBeforeSeparator(event) ||
      this.verifyDecimalLengthIsZeroAndKeyPressedIsComma(charCode)
    );
  }

  private isGreaterThanTotalLengthLimit(decimalsMaxLength: number, thousandMaxlength: number) {
    return decimalsMaxLength + thousandMaxlength > poDecimalTotalLengthLimit;
  }

  private isKeyDecimalSeparator(event) {
    return event.key === this.decimalSeparator || event.char === this.decimalSeparator;
  }

  private isPositionAfterDecimalSeparator(positionCursor, value) {
    const indexComma = value && value.indexOf(this.decimalSeparator);

    if (indexComma && this.decimalsLength > 0) {
      return positionCursor > indexComma;
    }
  }

  private isSelectionStartDifferentSelectionEnd(target: any) {
    return target.selectionStart !== target.selectionEnd;
  }

  private isValidKey(event: any, key?: string) {
    const charCode = event.which || event.keyCode;
    const validKey = event.which === 8 || event.which === 0;

    if (validKey && !this.isKeyboardAndroid) {
      return;
    }

    if (key) {
      event.key = key;
    }

    if (this.isInvalidKey(event, charCode)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  private isValueBetweenAllowed(value: number, maxAllowed: number) {
    return value >= 0 && value <= maxAllowed;
  }

  // Quando decimalsLength for 0 não deve permitir informar vírgula (decimalSeparator)
  private verifyDecimalLengthIsZeroAndKeyPressedIsComma(charCode: number) {
    return charCode === 44 && this.decimalsLength === 0;
  }

  private verifyAutoFocus() {
    if (this.autoFocus) {
      this.focus();
    }
  }

  private setInitialSelectionRange(target: any, selectionStart, selectionEnd) {
    if (selectionStart === 1 && selectionEnd === 1) {
      return target.setSelectionRange(selectionStart + 1, selectionEnd + 1);
    }
    return target.setSelectionRange(selectionStart - 1, selectionEnd - 1);
  }

  private replaceAt(value, index, replace) {
    return value.substring(0, index) + replace + value.substring(index + 1);
  }

  private replaceCommaToDot(value: string = '') {
    if (this.decimalSeparator === ',') {
      value = value.toString().replace(this.regex.decimal, '.');
    }

    return value;
  }

  private setCursorInput(event, selectionStart, selectionEnd) {
    const target = event.target;
    const viewValue = target.value;

    // Caso houver mais . do que anteriormente soma o valor com 1.
    if (this.hasMoreDot(viewValue) || viewValue === '0' + this.decimalSeparator) {
      return target.setSelectionRange(selectionStart + 1, selectionEnd + 1);
    }

    // Caso houver menos . do que anteriormente subtrai o valor por 1.
    if (this.hasLessDot(viewValue)) {
      this.setInitialSelectionRange(target, selectionStart, selectionEnd);
    }
    return target.setSelectionRange(selectionStart, selectionEnd);
  }

  private setPositionValue(event: any) {
    const value = event.target.value;
    const position = event.target.selectionStart - 1;

    if (position > 0 && event.key === this.minusSign) {
      event.target.value = value.substring(0, position) + value.substr(position + 1);
    }
  }

  private setViewValue(value: string) {
    this.inputEl.nativeElement.value = value;
  }

  private validateCursorPositionBeforeSeparator(event: any): boolean {
    const target = event.target;
    const originalValue = this.formatValueWithoutThousandSeparator(target.value);
    const valueBeforeSeparator = this.getValueBeforeSeparator(target.value, this.decimalSeparator);
    const valueBeforeSeparatorOriginal = this.getValueBeforeSeparator(originalValue, this.decimalSeparator);

    if (this.isSelectionStartDifferentSelectionEnd(target)) {
      return false;
    }
    return (
      target.selectionStart <= valueBeforeSeparator.length &&
      valueBeforeSeparatorOriginal.length === this.thousandMaxlength &&
      !this.isKeyDecimalSeparator(event)
    );
  }

  private verifyThousandLength(event: any): boolean {
    const target = event.target;
    const originalValue = this.formatValueWithoutThousandSeparator(target.value);
    const valueBeforeSeparatorOriginal = this.getValueBeforeSeparator(originalValue, this.decimalSeparator);

    if (this.isSelectionStartDifferentSelectionEnd(target)) {
      return false;
    }
    return (
      valueBeforeSeparatorOriginal.length >= this.thousandMaxlength &&
      !this.isKeyDecimalSeparator(event) &&
      this.isPositionAfterDecimalSeparator(target.selectionStart - this.decimalsLength, target.value)
    );
  }

  private verifyInsertComma(e: any): boolean {
    const hasComma = this.containsComma(e.target.value);

    return hasComma && e.key === this.decimalSeparator;
  }

  private verifyInsertMinusSign(event: any): boolean {
    const value = event.target.value;
    const indexMinusSign = value.lastIndexOf(this.minusSign) !== -1;
    const positionMinusSign = value.lastIndexOf('-');
    const occurancesMinusSign = value.match(new RegExp('-', 'g'));

    if (this.isKeyboardAndroid && indexMinusSign && occurancesMinusSign.length > 1) {
      event.target.value = this.replaceAt(value, positionMinusSign, '');
    }
    return indexMinusSign && event.key === this.minusSign;
  }

  private verifyValueAfterComma(event: any): boolean {
    const value = event.target.value;
    const selectionStart = event.target.selectionStart;
    const valueAfterSeparator = this.getValueAfterSeparator(value, this.decimalSeparator);

    return (
      this.isPositionAfterDecimalSeparator(selectionStart, value) && valueAfterSeparator.length >= this.decimalsLength
    );
  }
}
