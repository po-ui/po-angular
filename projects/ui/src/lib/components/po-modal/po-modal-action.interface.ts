import { TemplateRef } from '@angular/core';

/**
 * @usedBy PoModalComponent
 *
 * @description
 *
 * Interface que define os botões de ação do componente `po-modal`.
 */
export interface PoModalAction {
  /** Função que será executada ao clicar sobre o botão. */
  action: Function;

  /**
   * Define a propriedade `p-danger` do botão.
   *
   * > Caso a propriedade esteja definida como `true` em ambos os botões, apenas o botão primário receberá o `p-danger` como `true`.
   */
  danger?: boolean;

  /** Desabilita o botão impossibilitando que sua ação seja executada. */
  disabled?: boolean;

  /**
   * Ícone exibido ao lado esquerdo do label do botão.
   *
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](https://po-ui.io/icons), conforme exemplo:
   * ```
   * modalAction: PoModalAction = {
   *   action: () => {},
   *   label: 'Botão com ícone PO',
   *   icon: 'an an-user'
   * };
   * ```
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, desde que a biblioteca
   * esteja carregada no projeto:
   * ```
   * modalAction: PoModalAction = {
   *   action: () => {},
   *   label: 'Botão com ícone Font Awesome',
   *   icon: 'fa fa-user'
   * };
   * ```
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * ```
   * // Template HTML
   * <ng-template #customIcon>
   *   <span class="fa fa-user"></span>
   * </ng-template>
   *
   * // Componente TypeScript
   * @ViewChild('customIcon', { static: true }) customIcon: TemplateRef<void>;
   *
   * modalAction: PoModalAction = {
   *   action: () => {},
   *   label: 'Botão com ícone customizado',
   * };
   *
   * // Atribuição do TemplateRef à propriedade icon após a inicialização da view
   * ngAfterViewInit() {
   *   this.modalAction.icon = this.customIcon;
   * }
   * ```
   * > Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.
   */
  icon?: string | TemplateRef<void>;

  /** Rótulo do botão. */
  label: string;

  /** Habilita um estado de carregamento ao botão, desabilitando-o e exibindo um ícone de carregamento à esquerda de seu rótulo. */
  loading?: boolean;
}
