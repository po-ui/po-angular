import { ElementRef, EventEmitter, Input, Output, Directive } from '@angular/core';

/**
 * @docsPrivate
 *
 * Este componente é de uso interno utilizado por componentes de entrada de dados com o objetivo de resetar as informações do model.
 *
 * Por padrão limpa o valor do campo e executa o método onChangePropagate, caso tenha a necessidade de tratar a função de limpar o campo,
 * deve implementar a interface PoClean.
 */
@Directive()
export abstract class PoCleanBaseComponent {

  /** Nesta propriedade deve-se informar o elementRef do campo de entrada que utilizará o po-clean. */
  @Input('p-element-ref') inputRef: ElementRef;

  /** Valor que será atribuído ao campo quando for clicado no po-clean. */
  @Input('p-default-value') defaultValue?: string = '';

  /**
   * Evento disparado quando executada ação do po-clean.
   * Este evento deve ser usado para avisar para o componente que está usando o po-clean, que o botão foi disparado,
   * e provavelmente será preciso emitir o evento para atualizar o model.
   */
  @Output('p-change-event') changeEvent?: EventEmitter<any> = new EventEmitter<any>();

  protected parentComponent: any;

  clear() {
    this.setInputValue(this.defaultValue);
    this.changeEvent.emit(this.defaultValue);
  }

  showIcon() {
    return this.defaultValue !== this.getInputValue() && this.hasCleanAttr() && !this.isDisabled() && !this.isReadonly();
  }

  // Este método verifica se o componente pai possui a propriedade clean diferente de vazio,
  // ou seja, se o po-clean deve ser usado.
  private hasCleanAttr(): boolean {
    return this.parentComponent.clean;
  }

  // Este método verifica se o componente pai está desabilitado.
  private isDisabled(): boolean {
    return this.parentComponent.disabled;
  }

  // Este método verifica se o componente pai está somente leitura.
  private isReadonly(): boolean {
    return this.parentComponent.readonly;
  }

  abstract setInputValue(value: string): void;

  abstract getInputValue(): string;

}
