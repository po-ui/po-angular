import { ChangeDetectorRef, Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { convertToBoolean } from '../../utils/util';
import { PoHelperComponent, PoHelperOptions } from '../po-helper';

@Directive()
export abstract class PoFieldModel<T> implements ControlValueAccessor {
  // Propriedade interna que define se o ícone de ajuda adicional terá cursor clicável (evento) ou padrão (tooltip).
  @Input() additionalHelpEventTrigger: string | undefined;

  /**
   *
   * @deprecated v23.x.x use `p-helper`
   *
   * @optional
   *
   * @description
   * Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`.
   * **Como boa prática, indica-se utilizar um texto com até 140 caracteres.**
   * > Requer um recuo mínimo de 8px se o componente estiver próximo à lateral da tela.
   *
   * > Essa propriedade está **depreciada** e será removida na versão `23.x.x`. Recomendamos utilizar a propriedade `p-helper` que oferece mais recursos e flexibilidade.
   */
  @Input('p-additional-help-tooltip') additionalHelpTooltip?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define que o popover (`p-helper` e/ou `p-error-limit`) será incluído no body da página e não
   * dentro do componente. Essa opção pode ser necessária em cenários com containers que possuem scroll ou overflow
   * escondido, garantindo o posicionamento correto do tooltip próximo ao elemento.
   *
   * > Quando utilizado com `p-helper`, leitores de tela como o NVDA podem não ler o conteúdo do popover.
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
   *
   * @deprecated v23.x.x use `p-helper`
   *
   * @optional
   *
   * @description
   * Evento disparado ao clicar no ícone de ajuda adicional.
   *
   * > Essa propriedade está **depreciada** e será removida na versão `23.x.x`. Recomendamos utilizar a propriedade `p-helper` que oferece mais recursos e flexibilidade.
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

  /**
   * @optional
   *
   * @description
   * Evento disparado quando uma tecla é pressionada enquanto o foco está no componente.
   * Retorna um objeto `KeyboardEvent` com informações sobre a tecla.
   */
  @Output('p-keydown') keydown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  displayAdditionalHelp: boolean = false;
  value: T;

  protected onTouched;

  private propagateChange: any;

  constructor(private readonly cd: ChangeDetectorRef) {}

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.cd?.markForCheck();
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
    if (this.label && this.isAdditionalHelpEventTriggered()) {
      this.additionalHelp.emit();
    }
  }
  emitChange(value) {
    this.change.emit(value);
  }

  getAdditionalHelpTooltip() {
    return this.isAdditionalHelpEventTriggered() ? null : this.additionalHelpTooltip;
  }

  /**
   * Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
   * Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.
   *
   * > Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.
   *
   * ```
   * // Exemplo com p-label e p-helper
   * <po-nome-component
   *  #component
   *  ...
   *  p-label="Label do component"
   *  [p-helper]="helperOptions"
   *  (p-keydown)="onKeyDown($event, component)"
   * ></po-nome-component>
   * ```
   * ```
   * ...
   * onKeyDown(event: KeyboardEvent, inp: PoNomeDoComponente): void {
   *  if (event.code === 'F9') {
   *    inp.showAdditionalHelp();
   *  }
   * }
   * ```
   */
  showAdditionalHelp(helperHtmlElement?: PoHelperComponent, poHelperComponent?: string | PoHelperOptions): boolean {
    this.displayAdditionalHelp = !this.displayAdditionalHelp;
    const helper = poHelperComponent;
    const isHelpEvt = this.isAdditionalHelpEventTriggered();
    if (!this.label && (helper || this.additionalHelpTooltip || isHelpEvt || helperHtmlElement)) {
      if (isHelpEvt) {
        this.additionalHelp.emit();
      }
      if (typeof helper !== 'string' && typeof helper?.eventOnClick === 'function') {
        helper.eventOnClick();
        return;
      }
      if (helperHtmlElement?.helperIsVisible()) {
        helperHtmlElement?.closeHelperPopover();
        return;
      }
      helperHtmlElement?.openHelperPopover();
      return;
    }
    return this.displayAdditionalHelp;
  }

  showAdditionalHelpIcon() {
    return !!this.additionalHelpTooltip || this.isAdditionalHelpEventTriggered();
  }

  protected isAdditionalHelpEventTriggered(): boolean {
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
