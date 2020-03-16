import {  ElementRef, Directive } from '@angular/core';

import { PoInputGeneric } from '../po-input-generic/po-input-generic';

@Directive()
export abstract class PoNumberBaseComponent extends PoInputGeneric {

  type = 'number';

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  eventOnInput(e: any) {
    if (!this.mask) {
      let value = e.target.value;
      const valueMaxlength = this.validMaxLength(this.maxlength, value);

      if (value !== valueMaxlength) {
        value = valueMaxlength;

        this.inputEl.nativeElement.value = value;
      }

      this.callOnChange(this.formatNumber(value));
    }
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

  writeValueModel(value) {
    if (this.inputEl) {
      if (value || value === 0) {
        if (this.mask) {
          this.inputEl.nativeElement.value = this.objMask.controlFormatting(String(value));

          // Se o model for definido como formatado, então precisa atualizá-lo no primeiro acesso
          if (this.objMask.formatModel) {
            this.onChangePropagate(this.objMask.valueToModel);
          }
        } else {
          this.inputEl.nativeElement.value = value;
        }
      } else { // Se for o valor for undefined, deve limpar o campo
        this.inputEl.nativeElement.value = '';
      }
    }

    // Emite evento quando o model é atualizado, inclusive a primeira vez

    this.changeModel.emit(value);

  }

  private isEndWithDot(value: string) {
    return value && value.lastIndexOf('.') === value.length - 1;
  }

  private formatNumber(value) {
    return value ? Number(value) : null;
  }

}
