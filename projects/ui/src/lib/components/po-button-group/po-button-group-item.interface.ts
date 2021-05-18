import { TemplateRef } from '@angular/core';
/**
 * @usedBy PoButtonGroupComponent
 *
 * @description
 *
 * Interface para os itens do `po-button-group`.
 */
export interface PoButtonGroupItem {
  /** Ação executada ao clicar sobre o botão. */
  action: Function;

  /**
   * @description
   *
   * Se verdadeiro, define o botão como desabilitado.
   *
   * > Por padrão esta propriedade é `false`.
   */
  disabled?: boolean;

  /**
   * Ícone exibido ao lado esquerdo do label do botão.
   *
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons). conforme exemplo abaixo:
   * ```
   * buttons: Array<PoButtonGroupItem> = [
   *  { label: 'Button 1', action: this.action.bind(this), icon: 'po-icon-user' },
   * ];
   * ```
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
   * ```
   * buttons: Array<PoButtonGroupItem> = [
   *  { label: 'Button 1', action: this.action.bind(this), icon: 'fa fa-podcast' },
   * ];
   * ```
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   *
   * component.html:
   * ```
   * <ng-template #iconTemplate>
   *  <ion-icon style="font-size: inherit" name="heart"></ion-icon>
   * </ng-template>
   * ```
   * component.ts:
   * ```
   * @ViewChild('iconTemplate', { static: true } ) iconTemplate : TemplateRef<void>;
   * buttons: Array<PoButtonGroupItem> = [];
   * ...
   *
   * this.buttons = [
   *   { label: 'Button 1', action: this.action.bind(this), icon: this.iconTemplate }
   * ];
   * ```
   * > Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.
   */
  icon?: string | TemplateRef<void>;

  /** Label do botão. */
  label?: string;

  /** Define se o botão está selecionado. Utilizado juntamente à propriedade `p-toggle`. */
  selected?: boolean;

  /**
   * Define a mensagem a ser exibida ao posicionar o *mouse* sobre o botão.
   */
  tooltip?: string;
}
