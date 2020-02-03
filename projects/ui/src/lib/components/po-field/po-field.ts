import { Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { convertToBoolean } from '../../utils/util';

export abstract class PoField<T> implements AfterViewInit, ControlValueAccessor {

  _disabled = false;

  @Input('p-label') label: string;

  @Input('p-help') help: string;

  @Input('p-disabled') set disabled(value: boolean) {
    this._disabled = convertToBoolean(value);
  }

  get disabled() {
    return this._disabled;
  }

  @Input('name') name: string;

  @Input('p-focus') autoFocus: boolean;

  @Output('p-change') change = new EventEmitter<T>();

  private onModelChange: any;
  private onModelTouched: any;

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.focus();
    }
  }

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
