import { Input, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { PoFieldValidate } from './po-field-validate';
import { ValidationErrors, AbstractControl } from '@angular/forms';

export abstract class PoFieldInput<T> extends PoFieldValidate<T> implements AfterViewInit {

  // @ViewChild('');

  abstract inputElement: ElementRef<HTMLInputElement>;

  @Input('p-error-pattern') errorPattern: string;

  @Input('p-no-autocomplete') noAutocomplete: boolean = false;

  @Input('p-clean') clean: boolean = false;

  @Input('p-placeholder') placeholder: string = '';

  @Output('p-blur') blur = new EventEmitter<T>();

  @Output('p-change-model') changeModel = new EventEmitter<T>();

  @Output('p-enter') enter = new EventEmitter<any>();

  protected previousModel: any;
  timeoutChange: any;

  get autocomplete() {
    return this.noAutocomplete ? 'off' : 'on';
  }

  constructor(private renderer: Renderer2) {
    super();
  }

  stateValidate(abstractControl: AbstractControl): ValidationErrors {
    return;
  }

  clear(e) {
    // console.log(e)
    this.updateModel(e);
  }

  focus() {
    if (!this.disabled) {
      this.inputElement.nativeElement.focus();
    }
  }

  onWriteValue(value: any = '') {
    if (this.inputElement) {
      this.renderer.setProperty(this.inputElement.nativeElement, 'value', value);

      this.emitChangeModel(value);
    }
    // this.getInputElement().nativeElement.valu

  }

  onBlur({ type, target }: Event) {
    if (type === 'blur') {
      this.emitBlur();
      this.controlChangeEmitter((target as any).value);
    }
  }

  emitEnter() {
    this.enter.emit();
  }

  emitBlur() {
    this.blur.emit();
  }

  emitChangeModel(value: any) {
    if (this.previousModel !== value) {
      this.changeModel.emit(value);
      this.previousModel = value;
    }
  }

  controlChangeEmitter(currentValue) {
    // const elementValue = this.inputElement.nativeElement.value;

    // Emite o evento change manualmente quando o campo é alterado
    // Este evento é controlado manualmente devido ao preventDefault existente na máscara
    // e devido ao controle do p-clean, que também precisa emitir change
    // console.log(elementValue, this.valueBeforeChange)
    if (currentValue !== this.previousModel) {
      clearTimeout(this.timeoutChange);
      this.timeoutChange = setTimeout(() => {
        this.emitChange(currentValue);
      }, 200);
    }
  }

}
