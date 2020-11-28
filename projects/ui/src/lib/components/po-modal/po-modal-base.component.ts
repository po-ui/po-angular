import { Input, EventEmitter, Directive } from '@angular/core';

import { convertToBoolean } from './../../utils/util';
import { PoModalAction } from './po-modal-action.interface';

import { PoLanguageService } from '../../services/po-language/po-language.service';
import { poModalLiterals } from './po-modal.literals';

/**
 * @description
 *
 * O componente `po-modal` é utilizado para incluir conteúdos rápidos e informativos.
 *
 * No cabeçalho do componente é possível definir um título e como também permite ocultar o ícone de fechamento da modal.
 *
 * Em seu corpo é possível definir um conteúdo informativo, podendo utilizar componentes como por exemplo `po-chart`,
 * `po-table` e os demais componentes do PO.
 *
 * No rodapé encontram-se os botões de ação primária e secundária, no qual permitem definir uma ação e um rótulo, bem como
 * definir um estado de carregando e / ou desabilitado. Também é possível definir o botão com o tipo *danger*.
 *
 * > É possível fechar a modal através da tecla *ESC*, quando a propriedade `p-hide-close` não estiver habilitada.
 */
@Directive()
export class PoModalBaseComponent {
  language;
  literals;

  private _hideClose?: boolean = false;
  private _size?: string = 'md';

  /** Título da modal. */
  @Input('p-title') title: string;

  /**
   * Deve ser definido um objeto que implementa a interface `PoModalAction` contendo a label e a função da primeira ação.
   * Caso esta propriedade não seja definida ou esteja incompleta, automaticamente será adicionado um botão de ação com
   * a função de fechar a modal.
   */
  @Input('p-primary-action') primaryAction?: PoModalAction;

  /** Deve ser definido um objeto que implementa a interface `PoModalAction` contendo a label e a função da segunda ação. */
  @Input('p-secondary-action') secondaryAction?: PoModalAction;

  /**
   * Define o tamanho da modal.
   *
   * Valores válidos:
   *  - `sm` (pequeno)
   *  - `md` (médio)
   *  - `lg` (grande)
   *  - `xl` (extra grande)
   *  - `auto` (automático)
   *
   * > Quando informado `auto` a modal calculará automaticamente seu tamanho baseado em seu conteúdo.
   * Caso não seja informado um valor, a modal terá o tamanho definido como `md`.
   *
   * > Todas as opções de tamanho possuem uma largura máxima de **768px**.
   */
  @Input('p-size') set size(value: string) {
    const sizes = ['sm', 'md', 'lg', 'xl', 'auto'];
    this._size = sizes.indexOf(value) > -1 ? value : 'md';
  }

  get size() {
    return this._size;
  }

  /**
   * Define o fechamento da modal ao clicar fora da mesma.
   * Informe o valor `true` para ativar o fechamento ao clicar fora da modal.
   */
  clickOut?: boolean = false;
  @Input('p-click-out') set setClickOut(value: boolean | string) {
    this.clickOut = value === '' ? false : convertToBoolean(value);
  }

  /**
   * @optional
   *
   * @description
   *
   * Oculta o ícone de fechar do cabeçalho da modal.
   *
   * > Caso a propriedade estiver habilitada, não será possível fechar a modal através da tecla *ESC*.
   *
   * @default `false`
   */
  @Input('p-hide-close') set hideClose(value: boolean) {
    this._hideClose = convertToBoolean(value);
  }

  get hideClose() {
    return this._hideClose;
  }

  // Controla se a modal fica oculto ou visível, por padrão é oculto
  isHidden = true;

  // Event emmiter para quando a modal é fechada pelo 'X'.
  public onXClosed = new EventEmitter<boolean>();

  constructor(poLanguageService: PoLanguageService) {
    this.language = poLanguageService.getShortLanguage();

    this.literals = {
      ...poModalLiterals[this.language]
    };
  }

  /** Função para fechar a modal. */
  close(xClosed = false): void {
    this.isHidden = true;
    if (xClosed) {
      this.onXClosed.emit(xClosed);
    }
  }

  /** Função para abrir a modal. */
  open(): void {
    this.validPrimaryAction();

    this.isHidden = false;
  }

  validPrimaryAction() {
    if (!this.primaryAction) {
      this.primaryAction = {
        action: () => this.close(),
        label: this.literals.close
      };
    }

    if (!this.primaryAction['action']) {
      this.primaryAction['action'] = () => this.close();
    }
    if (!this.primaryAction['label']) {
      this.primaryAction['label'] = this.literals.close;
    }
  }
}
