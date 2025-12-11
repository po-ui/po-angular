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
  ViewChild,
  inject
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoFieldModel } from '../po-field.model';
import { PoKeyCodeEnum } from './../../../enums/po-key-code.enum';

import { convertToBoolean, getDefaultSizeFn, validateSizeFn } from '../../../utils/util';
import { PoRadioSize } from './enums/po-radio-size.enum';

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
  ],
  standalone: false
})
export class PoRadioComponent extends PoFieldModel<boolean> {
  private changeDetector = inject(ChangeDetectorRef);
  private renderer = inject(Renderer2);

  @ViewChild('radio', { static: true }) radio: ElementRef;
  @ViewChild('radioInput', { static: true }) radioInput: ElementRef;

  value = false;
  private _size?: string = undefined;

  /** Define o valor do *radio* */
  @Input('p-value') radioValue: string;

  /** Define o tamanho do radio. */
  @Input('p-size') set size(value: string) {
    this._size = validateSizeFn(value, PoRadioSize);
  }

  get size(): string {
    return this._size ?? getDefaultSizeFn(PoRadioSize);
  }

  @Input({ alias: 'p-required', transform: convertToBoolean }) required?: boolean;

  /**
   *
   * Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede
   * o espaço disponível é transferido para a próxima linha em pontos apropriados para uma
   * leitura clara.
   *
   * @default `false`
   */
  @Input({ alias: 'p-label-text-wrap', transform: convertToBoolean }) labelTextWrap?: boolean = false;

  /** Define o status do *radio* */
  @Input('p-checked') checked: boolean = false;

  // Evento disparado ao sair do campo.
  @Output('p-blur') blur: EventEmitter<any> = new EventEmitter();

  /** Emite evento para a tabela ao selecionar ou desselecionar */
  @Output('p-change-selected') changeSelected: EventEmitter<any> = new EventEmitter<any>();

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
    this.blur.emit();
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

  @HostListener('focusout')
  focusOut(): void {
    this.renderer.removeClass(this.radio.nativeElement, 'po-radio-focus');
  }

  @HostListener('keyup')
  onKeyup(): void {
    this.renderer.addClass(this.radio.nativeElement, 'po-radio-focus');
  }

  @HostListener('keydown')
  onKeydown(): void {
    this.renderer.addClass(this.radio.nativeElement, 'po-radio-focus');
  }
}
