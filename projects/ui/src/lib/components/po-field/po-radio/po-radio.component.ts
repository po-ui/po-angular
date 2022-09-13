import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { InputBoolean } from '../../../decorators';
import { PoFieldModel } from '../po-field.model';
import { PoKeyCodeEnum } from './../../../enums/po-key-code.enum';

import { PoRadioSize } from './po-radio-size.enum';

@Component({
  selector: 'po-radio',
  templateUrl: './po-radio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoRadioComponent),
      multi: true
    }
  ]
})
export class PoRadioComponent extends PoFieldModel<boolean> {
  @ViewChild('radioLabel', { static: true }) radioLabel: ElementRef;

  value = false;

  private _size: PoRadioSize = PoRadioSize.Medium;

  /** Define o valor do *radio* */
  @Input('p-value') radioValue: string;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do *radio*
   * @default `medium`
   */
  @Input('p-size') set size(value: PoRadioSize) {
    this._size = Object.values(PoRadioSize).includes(value) ? value : PoRadioSize.Medium;
  }

  get size() {
    return this._size;
  }

  @Input('p-required') @InputBoolean() required: boolean;

  /** Define o status do *radio* */
  @Input('p-checked') checked: boolean = false;

  constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  /**
   * Função que atribui foco ao *radio*.
   *
   * Para utilizá-la é necessário capturar a referência do componente no DOM através do `ViewChild`, como por exemplo:
   *
   * ```
   * import { ViewChild } from '@angular/core';
   * import { PoRadioComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoRadioComponent, { static: true }) radio: PoRadioComponent;
   *
   * focusRadio() {
   * this.radio.focus();
   * }
   * ```
   *
   */
  focus(): void {
    if (!this.disabled) {
      this.radioLabel.nativeElement.focus();
    }
  }

  onBlur() {
    this.onTouched?.();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.which === PoKeyCodeEnum.space || event.keyCode === PoKeyCodeEnum.space) {
      this.eventClick();
    }
  }

  changeValue(value: any) {
    if (value) {
      this.value = value;
      this.updateModel(value);
      this.emitChange(this.value);
    }
  }

  eventClick() {
    if (!this.disabled) {
      this.changeValue(!this.value);
      this.changeDetector.detectChanges();
    }
  }

  onWriteValue(value: any): void {
    if (value !== this.value) {
      this.value = !!value;

      this.changeDetector.markForCheck();
    }
  }

  @HostListener('focusin', ['$event.target'])
  focusIn(): void {
    this.radioLabel.nativeElement.setAttribute('focus', '');
  }

  @HostListener('focusout', ['$event.target'])
  focusOut(): void {
    this.radioLabel.nativeElement.removeAttribute('focus');
  }
}
