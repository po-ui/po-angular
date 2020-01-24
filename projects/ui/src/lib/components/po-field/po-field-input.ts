import { Input, EventEmitter, Output } from '@angular/core';

import { PoFieldValidate } from './po-field-validate';

export abstract class PoFieldInput<T> extends PoFieldValidate<T> {

  @Input('p-placeholder') placeholder: string = '';

  @Output('p-blur') blur = new EventEmitter<T>();

  @Output('p-change-model') changeModel = new EventEmitter<T>();

  @Output('p-enter') enter = new EventEmitter<any>();

  emitEnter() {
    this.enter.emit();
  }

  emitChangeModel() {
    this.changeModel.emit();
  }

  emitBlur() {
    this.blur.emit();
  }

}
