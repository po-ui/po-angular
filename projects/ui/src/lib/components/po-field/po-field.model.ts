import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { convertToBoolean } from '../../utils/util';

@Directive()
export abstract class PoFieldModel<T> implements ControlValueAccessor {
  // Propriedade interna que define se o ícone de ajuda adicional terá cursor clicável (evento) ou padrão (tooltip).
  @Input() additionalHelpEventTrigger: string | undefined;

  /**
   * @optional
   *
   * @description
   * Exibe um ícone de ajuda adicional ao `p-help`, com o texto desta propriedade no tooltip.
   * Se o evento `p-additional-help` estiver definido, o tooltip não será exibido.
   * **Como boa prática, indica-se utilizar um texto com até 140 caracteres.**
   * > Requer um recuo mínimo de 8px se o componente estiver próximo à lateral da tela.
   */
  @Input('p-additional-help-tooltip') additionalHelpTooltip?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define que o tooltip (`p-additional-help-tooltip` e/ou `p-error-limit`) será incluído no body da página e não
   * dentro do componente. Essa opção pode ser necessária em cenários com containers que possuem scroll ou overflow
   * escondido, garantindo o posicionamento correto do tooltip próximo ao elemento.
   *
   * > Quando utilizado com `p-additional-help-tooltip`, leitores de tela como o NVDA podem não ler o conteúdo do tooltip.
   *
   * @default `false`
   */
  @Input({ alias: 'p-append-in-body', transform: convertToBoolean }) appendBox: boolean = false;

  /** Rótulo exibido pelo componente. */
  @Input('p-label') label: string;

  /** Nome do componente. */
  @Input('name') name: string;

  /** Texto de apoio para o campo. */
  @Input('p-help') help: string;

  /**
   * @optional
   *
   * @description
   *
   * Indica se o campo será desabilitado.
   *
   * @default `false`
   */
  @Input({ alias: 'p-disabled', transform: convertToBoolean }) disabled: boolean = false;

  /**
   * @optional
   *
   * @description
   * Evento disparado ao clicar no ícone de ajuda adicional.
   * Este evento ativa automaticamente a exibição do ícone de ajuda adicional ao `p-help`.
   */
  @Output('p-additional-help') additionalHelp = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao alterar valor do campo.
   */
  @Output('p-change') change: EventEmitter<T> = new EventEmitter<T>();

  value: T;

  protected onTouched;

  private propagateChange: any;

  constructor() {}

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: T): void {
    this.onWriteValue(value);
  }

  emitAdditionalHelp() {
    if (this.isAdditionalHelpEventTriggered()) {
      this.additionalHelp.emit();
    }
  }
  emitChange(value) {
    this.change.emit(value);
  }

  getAdditionalHelpTooltip() {
    return this.isAdditionalHelpEventTriggered() ? null : this.additionalHelpTooltip;
  }

  showAdditionalHelpIcon() {
    return !!this.additionalHelpTooltip || this.isAdditionalHelpEventTriggered();
  }

  private isAdditionalHelpEventTriggered(): boolean {
    return (
      this.additionalHelpEventTrigger === 'event' ||
      (this.additionalHelpEventTrigger === undefined && this.additionalHelp.observed)
    );
  }

  protected updateModel(value: T) {
    if (this.propagateChange) {
      this.propagateChange(value);
    }
  }

  abstract onWriteValue(value: T): void;
}
