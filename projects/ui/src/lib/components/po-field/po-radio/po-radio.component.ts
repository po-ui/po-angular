import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoKeyCodeEnum } from './../../../enums/po-key-code.enum';
import { PoRadioBaseComponent } from './po-radio-base.component';

/**
 * @docsPrivate
 *
 * @docsExtends PoRadioBaseComponent
 */
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
export class PoRadioComponent extends PoRadioBaseComponent {
  @ViewChild('radioLabel', { static: true }) radioLabel: ElementRef;

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
    if (this.radioLabel && !this.disabled) {
      this.radioLabel.nativeElement.focus();
    }
  }

  onBlur() {
    this.onTouched?.();
  }

  onKeyDown(event: KeyboardEvent, value: boolean) {
    if (event.which === PoKeyCodeEnum.space || event.keyCode === PoKeyCodeEnum.space) {
      this.checkOption(value);

      event.preventDefault();
    }
  }
  protected changeModelValue(value: boolean | string) {
    this.radioValue = typeof value === 'boolean' ? value : false;
    this.changeDetector.detectChanges();
  }
}
