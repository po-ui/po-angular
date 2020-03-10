import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { isTypeof } from '../../../../utils/util';

import { PoMultiselectLiterals } from '../../index';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente de pesquisa que será criado dentro do dropdown do `po-multiselect`.
 */
@Component({
  selector: 'po-multiselect-search',
  templateUrl: './po-multiselect-search.component.html'
})
export class PoMultiselectSearchComponent {
  private _placeholder?: string;

  /** Propriedade que recebe as literais definidas no `po-multiselect`. */
  @Input('p-literals') literals?: PoMultiselectLiterals;

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
    this._placeholder = placeholder && isTypeof(placeholder, 'string') ? placeholder : this.literals.placeholderSearch;
  }

  get placeholder() {
    return this._placeholder || this.literals.placeholderSearch;
  }

  /** Evento que será disparado a cada tecla digitada no campo de busca. */
  @Output('p-change') change = new EventEmitter();

  @ViewChild('inputElement', { read: ElementRef, static: true }) inputElement: ElementRef;

  onChange(event) {
    this.change.emit({ event: event, value: this.inputElement.nativeElement.value });
  }

  setFocus() {
    this.inputElement.nativeElement.focus();
  }

  clean() {
    this.inputElement.nativeElement.value = '';
  }
}
