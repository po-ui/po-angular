import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

import { convertToBoolean, getDefaultSize, validateSize } from './../../utils/util';
import { PoModalAction } from './po-modal-action.interface';

import { PoFieldSize } from '../../enums/po-field-size.enum';
import { PoThemeService } from '../../services/po-theme/po-theme.service';
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
 * definir um estado de carregando e / ou desabilitado e / ou definir o botão com o tipo *danger*. Também é possível utilizar
 * o componente [`PoModalFooter`](/documentation/po-modal-footer).
 *
 * > É possível fechar a modal através da tecla *ESC*, quando a propriedade `p-hide-close` não estiver habilitada.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                                  | Descrição                                             | Valor Padrão                                                                        |
 * |----------------------------------------------|-------------------------------------------------------|-------------------------------------------------------------------------------------|
 * | **Default Values**                           |                                                       |                                                                                     |
 * | `--border-radius` &nbsp;                     | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-md)`                                                           |
 * | `--border-width` &nbsp;                      | Contém o valor da largura dos cantos do elemento&nbsp;| `var(--border-width-sm)`                                                            |
 * | `--border-color` &nbsp;                      | Cor da borda                                          | `var(--color-neutral-light-20)`                                                     |
 * | `--background` &nbsp;                        | Cor de background                                     | `var(--color-neutral-light-00)`                                                     |
 * | `--shadow` &nbsp;                            | Contém o valor da sombra do elemento                  | `var(--shadow-md)`                                                                  |
 * | `--color-overlay` &nbsp;                     | Cor da camada visual temporária                       | `var(--color-neutral-dark-80)`                                                      |
 * | `--opacity-overlay` &nbsp;                   | Opacidade da camada visual temporária &nbsp;          | `0.7`                                                                               |
 * | `--color-divider` &nbsp;                     | Cor das divisões do modal                             | `var(--color-neutral-light-20)`                                                     |
 * | `--padding-header` &nbsp;                    | Padding do header do modal                            | `var(--spacing-sm) var(--spacing-md)`                                               |
 * | `--padding-body` &nbsp;                      | Padding do corpo do modal                             | `var(--spacing-md) var(--spacing-2xl) var(--spacing-2xl) var(--spacing-md) `        |
 *
 */
@Directive()
export class PoModalBaseComponent {
  /** Título da modal. */
  @Input('p-title') title: string;

  /** Evento disparado ao fechar o modal. */
  @Output('p-close') closeModal: EventEmitter<any> = new EventEmitter();

  /**
   * Deve ser definido um objeto que implementa a interface `PoModalAction` contendo a label e a função da primeira ação.
   * Caso esta propriedade não seja definida ou esteja incompleta, automaticamente será adicionado um botão de ação com
   * a função de fechar a modal.
   */
  @Input('p-primary-action') primaryAction?: PoModalAction;

  /** Deve ser definido um objeto que implementa a interface `PoModalAction` contendo a label e a função da segunda ação. */
  @Input('p-secondary-action') secondaryAction?: PoModalAction;

  language;
  literals;

  // Controla se a modal fica oculto ou visível, por padrão é oculto
  isHidden = true;

  // Event emmiter para quando a modal é fechada pelo 'X'.
  public onXClosed = new EventEmitter<boolean>();
  private _componentsSize?: string = undefined;
  private _hideClose?: boolean = false;
  private _size?: string = 'md';

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
  // eslint-disable-next-line @typescript-eslint/member-ordering
  clickOut?: boolean = false;
  @Input('p-click-out') set setClickOut(value: boolean | string) {
    this.clickOut = value === '' ? false : convertToBoolean(value);
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho dos componentes de formulário no modal:
   * - `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
   * - `medium`: aplica a medida medium de cada componente.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input('p-components-size') set componentsSize(value: string) {
    this._componentsSize = validateSize(value, this.poThemeService, PoFieldSize);
  }

  get componentsSize(): string {
    return this._componentsSize ?? getDefaultSize(this.poThemeService, PoFieldSize);
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

  /**
   * @optional
   *
   * @description
   * Ícone exibido ao lado esquerdo do label do titúlo da modal.
   *
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](https://po-ui.io/icons). conforme exemplo abaixo:
   * ```
   * <po-modal p-icon="an an-user" p-title="PO Modal"></po-modal>
   * ```
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
   * ```
   * <po-modal p-icon="fa fa-podcast" p-title="PO Modal"></po-modal>
   * ```
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * ```
   * <po-modal [p-icon]="template" p-title="PO Modal"></po-modal>
   *
   * <ng-template #template>
   *  <ion-icon style="font-size: inherit" name="heart"></ion-icon>
   * </ng-template>
   * ```
   */
  @Input('p-icon') icon?: string | TemplateRef<void>;

  constructor(
    poLanguageService: PoLanguageService,
    protected poThemeService: PoThemeService
  ) {
    this.language = poLanguageService.getShortLanguage();

    this.literals = {
      ...poModalLiterals[this.language]
    };
  }

  /** Função para fechar a modal. */
  close(xClosed = false): void {
    this.closeModal.emit();

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
