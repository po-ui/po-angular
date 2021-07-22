import { TemplateRef } from '@angular/core';

/**
 * @usedBy PoNavbarComponent
 *
 * @description
 *
 * Interface para lista de ações dos ícones do componente.
 */
export interface PoNavbarIconAction {
  /**
   * Ação que será executada, deve-se passar a referência da função.
   *
   * > Para que a função seja executada no contexto do elemento filho o mesmo deve ser passado utilizando *bind*.
   *
   * Exemplo: `action: this.myFunction.bind(this)`
   */
  action?: Function;

  /**
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons). conforme exemplo abaixo:
   * ```
   * <po-navbar
   *   [p-icon-actions]="[{ link: '/', icon: 'po-icon-news' }]">
   * </po-navbar>
   * ```
   *
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca Font Awesome, da seguinte forma:
   * ```
   * <po-navbar
   *   [p-icon-actions]="[{ link: '/', icon: 'fa fa-podcast' }]">
   * </po-navbar>
   * ```
   *
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * component.html:
   * ```
   * <ng-template #iconTemplate>
   *   <ion-icon name="heart"></ion-icon>
   * </ng-template>
   *
   * <po-navbar
   *   [p-icon-actions]="[{ link: '/', icon: iconTemplate }]">
   * </po-navbar>
   * ```
   *
   */
  icon?: string | TemplateRef<void>;

  /** Rótulo da ação, será exibido quando o mesmo for aberto no popup. */
  label: string;

  /** link utilizado no redirecionamento das páginas. */
  link?: string;

  /** Mensagem exibida ao passar o mouse no ícone quando o mesmo estiver na navbar. */
  tooltip?: string;
}
