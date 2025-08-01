import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { PoListBoxLiterals } from '../interfaces/po-listbox-literals.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente de pesquisa que será criado dentro do search do `po-listbox`.
 */
@Component({
  selector: 'po-search-list',
  templateUrl: './po-search-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoSearchListComponent {
  @ViewChild('inputElement', { read: ElementRef, static: true }) inputElement: ElementRef;

  /** Propriedade que recebe as literais definidas no `po-listbox`. */
  @Input('p-literals') literals?: PoListBoxLiterals;

  @Input('p-field-value') fieldValue: string;

  /** Tamanho do texto de exibido do item. */
  @Input('p-size') size: string;

  /** Evento que será disparado a cada tecla digitada no campo de busca. */
  @Output('p-change') change = new EventEmitter();

  private _placeholder?: string;
  public initUp = false;
  public initDown = false;

  constructor(private cd: ChangeDetectorRef) {}

  /**
   * @optional
   *
   * @description
   *
   * Placeholder do campo de pesquisa.
   *
   * > Caso o mesmo não seja informado, o valor padrão será traduzido com base no idioma do navegador (pt, es e en).
   *
   * @default `Buscar`
   */
  @Input('p-placeholder') set placeholder(placeholder: string) {
    this._placeholder =
      placeholder && this.isTypeof(placeholder, 'string') ? placeholder : this.literals.placeholderSearch;
  }

  get placeholder() {
    return this._placeholder || this.literals.placeholderSearch;
  }

  get inputValue() {
    return this.inputElement.nativeElement.value;
  }

  onChange(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
    this.initUp = true;
    if (this.initDown === this.initUp) {
      this.change.emit({ event: event, [this.fieldValue]: this.inputElement.nativeElement.value });
    }
  }

  setFocus() {
    this.inputElement.nativeElement.focus();
  }

  clean() {
    this.inputElement.nativeElement.value = '';
    this.cd.markForCheck();
  }

  resetKeys() {
    this.initUp = false;
    this.initDown = false;
  }

  isTypeof(object: any, type: any) {
    return typeof object === type;
  }

  changeInitSearch(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
    this.initDown = true;
  }
}
