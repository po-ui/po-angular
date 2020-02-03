
import { Input, Renderer2 } from '@angular/core';

import { convertToBoolean } from '../../../utils/util';

import { PoFieldInput } from '../po-field-input';
// import { convertToBoolean } from 'projects/templates/src/lib/utils/util';

export abstract class PoNumberBaseComponent extends PoFieldInput<number> {

  // private _noAutocomplete: boolean = false;
  private _readonly: boolean = false;

  // @Input('p-no-autocomplete') set noAutocomplete(value: boolean) {
  //   this._noAutocomplete = convertToBoolean(value);
  // }

  // get noAutocomplete() {
  //   return this._noAutocomplete;
  // }

  // @Input('p-clean') clean: boolean;

  @Input('p-readonly') set readonly(value: boolean) {
    this._readonly = convertToBoolean(value);
  }

  get readonly() {
    return this._readonly;
  }

  // PROVAVELMENTE VAI PARA O FIELD
  @Input('p-minlength') minlength: number;

  @Input('p-maxlength') maxlength: number;

  // SUGESTÃO
  // @Input('p-validator-message') validatorMessage: string | Array<{ key: 'min|max|maxlength|minlength', message: '' }>;

  constructor(renderer: Renderer2) {
    super(renderer);
  }

  validMaxLength(maxlength: number, value: string) {

    if (maxlength && value.length > maxlength) {
      const substringValue = value.toString().substring(0, maxlength);

      if (substringValue && this.isEndWithDot(substringValue)) {
        return substringValue.toString().substring(0, maxlength - 1);
      }

      return substringValue;
    }

    return value;
  }

  protected isEndWithDot(value: string) {
    return value && value.lastIndexOf('.') === value.length - 1;
  }

  protected formatNumber(value) {
    return value ? Number(value) : null;
  }

}
