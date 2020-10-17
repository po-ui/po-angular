import { ElementRef, Directive } from '@angular/core';

import { PoInputGeneric } from '../po-input-generic/po-input-generic';

@Directive()
export abstract class PoNumberBaseComponent extends PoInputGeneric {
  type = 'number';

  protected invalidInputValueOnBlur = false;

  /* istanbul ignore next */
  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  eventOnInput(e: any) {
    if (!this.mask) {
      let value = e.target.value;
      const valueMaxlength = this.validMaxLength(this.maxlength, value);
      this.invalidInputValueOnBlur = false;

      if (value !== valueMaxlength) {
        value = valueMaxlength;

        this.inputEl.nativeElement.value = value;
      }

      this.callOnChange(this.formatNumber(value));
    }
  }

  onBlur(event: any) {
    const target = event.target;
    this.invalidInputValueOnBlur = target.value === '' && !target.validity.valid;

    if (this.invalidInputValueOnBlur) {
      this.callOnChange('Valor Inválido');
    }

    this.eventOnBlur(event);
  }

  onKeyDown(event) {
    if (!this.isKeyAllowed(event)) {
      event.stopPropagation();
      event.preventDefault();
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
      } else {
        // Se for o valor for undefined, deve limpar o campo
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

  private isKeyAllowed(event): boolean {
    return this.isShortcut(event) || this.isControlKeys(event) || !this.isInvalidKey(event.key);
  }

  private isInvalidKey(key) {
    const validatesKey = new RegExp(/[a-zA-Z:;=_´`^~"'?!@#$%¨&*()><{}çÇ\[\]/\\|]+/);
    return validatesKey.test(key);
  }

  private isShortcut(event): boolean {
    const key = event.keyCode;
    const ctrl = event.ctrlKey || event.metaKey;
    const keyA = key === 65;
    const keyC = key === 67;
    const keyX = key === 88;
    const keyV = key === 86;

    return (ctrl && keyC) || (ctrl && keyV) || (ctrl && keyA) || (ctrl && keyX);
  }

  private isControlKeys(event) {
    const controlKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Left',
      'Right',
      'Up',
      'Down',
      'Tab',
      'Delete'
    ];

    return controlKeys.indexOf(event.key) !== -1;
  }
}
