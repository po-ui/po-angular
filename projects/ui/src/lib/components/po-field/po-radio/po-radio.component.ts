import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoFieldModel } from '../po-field.model';
import { PoKeyCodeEnum } from './../../../enums/po-key-code.enum';

import { convertToBoolean } from '../../../utils/util';

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
  @ViewChild('radio', { static: true }) radio: ElementRef;
  @ViewChild('radioInput', { static: true }) radioInput: ElementRef;

  value = false;

  /** Define o valor do *radio* */
  @Input('p-value') radioValue: string;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do rádio.
   *
   * Valores válidos no enum `PoRadioSize`:
   * - `small`: altura de 16px.
   * - `medium`: altura de 24px.
   * - `large`: altura de 32px.
   *
   * > A medida `small` **só estará disponível** quando a acessibilidade AA estiver configurada. Caso contrário, mesmo
   * que o tamanho seja definido como `small`, a medida padrão `medium` será mantida. Para mais informações sobre como
   * configurar a acessibilidade AA, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   *
   */
  @Input('p-size') size: string;

  @Input({ alias: 'p-required', transform: convertToBoolean }) required?: boolean;

  /** Define o status do *radio* */
  @Input('p-checked') checked: boolean = false;

  /** Emite evento para a tabela ao selecionar ou desselecionar */
  @Output('p-change-selected') changeSelected: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
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
      this.radioInput.nativeElement.focus();
      this.onKeyup();
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
      this.changeSelected.emit(null);
    }
  }

  onWriteValue(value: any): void {
    if (value !== this.value) {
      this.value = !!value;

      this.changeDetector.markForCheck();
    }
  }

  @HostListener('focusout', ['$event.target'])
  focusOut(): void {
    this.renderer.removeClass(this.radio.nativeElement, 'po-radio-focus');
  }

  @HostListener('keyup', ['$event.target'])
  onKeyup(): void {
    this.renderer.addClass(this.radio.nativeElement, 'po-radio-focus');
  }

  @HostListener('keydown', ['$event.target'])
  onKeydown(): void {
    this.renderer.addClass(this.radio.nativeElement, 'po-radio-focus');
  }
}
