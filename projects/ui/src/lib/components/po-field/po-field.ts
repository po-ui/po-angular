import { Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export abstract class PoField<T> implements ControlValueAccessor {

  @Input('p-label') label: string;

  @Input('p-help') help: string;

  @Input('p-disabled') disabled: boolean;

  @Input('name') name: string;

  @Input('p-focus') autoFocus: boolean;

  @Output('change') change = new EventEmitter<T>();

  private onModelChange: any;
  private onModelTouched: any;

  // AVALIAR GENERIC TYPE
  abstract onWriteValue(value: T);

  abstract focus();

  /**
   * Dispara o evento de change.emit
   *
   * @param value
   */
  emitChange(value) {
    this.change.emit(value);
  }

  updateModel(value: T) {
    if (this.onModelChange) {
      this.onModelChange(value);
    }
  }

  writeValue(value: any): void {
    this.onWriteValue(value);
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

}
