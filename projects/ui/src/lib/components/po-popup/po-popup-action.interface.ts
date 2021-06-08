import { TemplateRef } from '@angular/core';

/**
 * @usedBy PoPopupComponent
 *
 * @description
 *
 * Interface para lista de ações do componente.
 */
export interface PoPopupAction {
  /** Rótulo da ação. */
  label: string;

  /**
   * Ação que será executada, sendo possível passar o nome ou a referência da função.
   *
   * > Para que a função seja executada no contexto do elemento filho o mesmo deve ser passado utilizando *bind*.
   *
   * Exemplo: `action: this.myFunction.bind(this)`
   */
  action?: Function;

  /**
   * @description
   *
   * Define um ícone que será exibido ao lado esquerdo do rótulo.
   *
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons). conforme exemplo abaixo:
   *
   * ```
   * <po-popup
   *  [p-actions]="[ { label: 'PO ICON', icon: 'po-icon-news', action: () => action.bind(this) } ]">
   * </po-popup>
   *
   * ```
   *
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca Font Awesome, da seguinte forma:
   * ```
   * <po-popup
   *  [p-actions]="[ { label: 'FA ICON', icon: 'fa fa-icon-podcast', action: () => action.bind(this) } ]">
   * </po-popup>
   *
   * ```
   *
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * component.html:
   * ```
   *
   * <ng-template #iconTemplate>
   *   <ion-icon name="heart"></ion-icon>
   * </ng-template>
   *
   * <po-popup [p-actions]="actions"></po-popup>
   * ```
   * component.ts:
   * ```
   * @ViewChild('iconTemplate', { static: true } ) iconTemplate : TemplateRef<void>;
   * actions: Array<PoPopupAction> = [];
   *
   * this.actions = [
   *  {
   *    label: 'FA ICON',
   *    icon: this.iconTemplate,
   *    action: () => this.action.bind(this)
   *  }
   * ];
   * ```
   */
  icon?: string | TemplateRef<void>;

  /** Atribui uma linha separadora acima do item. */
  separator?: boolean;

  /**
   * Função que deve retornar um booleano para habilitar ou desabilitar a ação para o registro selecionado.
   *
   * Também é possível informar diretamente um valor booleano que vai habilitar ou desabilitar a ação para todos os registros.
   */
  disabled?: boolean | Function;

  /**
   * @description
   *
   * Define a cor do item, sendo `default` o padrão.
   *
   * Valores válidos:
   *  - `default`
   *  - `danger`
   */
  type?: string;

  /** URL utilizada no redirecionamento das páginas. */
  url?: string;

  /** Define se a ação está selecionada. */
  selected?: boolean;

  /**
   * @description
   *
   * Define se a ação será visível.
   *
   * > Caso o valor não seja especificado a ação será visível.
   */
  visible?: boolean;
}
