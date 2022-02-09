import { TemplateRef } from '@angular/core';

/**
 * @usedBy PoPageDynamicTableComponent
 *
 * @description
 *
 * Interface com as propriedades para adicionar uma ação customizada na página.
 */
export interface PoPageDynamicTableCustomAction {
  /**
   * Rótulo do botão que será exibido.
   */
  label: string;

  /**
   * Ação que será executada ao clicar no botão.
   *
   * A ação do tipo string representa um endpoint que deverá ser do tipo `POST`.
   *
   * Ao referenciar uma função, utilize em conjunto a propriedade `.bind()`, desta forma:
   * ```
   * action: this.myFunction.bind(this)
   * ```
   *
   * Tanto o endpoint quanto a função, receberá o recurso selecionado pelo usuário na tabela, caso
   * a propriedade `selectable` seja `true`.
   *
   * > Ao utilizar a propriedade `url` e a `action`, somente a `action` será executada.
   */
  action?: string | ((resources?: any) => void);

  /**
   * Rota para o qual será redirecionado ao clicar no botão.
   *
   * > Ao utilizar a propriedade `url` e a `action`, somente a `action` será executada.
   */
  url?: string;

  /**
   * Ao utilizar essa propriedade ela habilita a seleção na tabela e também desabilita
   * o botão de ação caso nenhum recurso for selecionado.
   */
  selectable?: boolean;

  /**
   * @description
   *
   * Define um ícone que será exibido ao lado esquerdo do rótulo.
   *
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons). conforme exemplo abaixo:
   * ```
   * <po-component
   *  [p-property]="[{ label: 'PO ICON', icon: 'po-icon-news' }]">
   * </po-component>
   * ```
   *
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca Font Awesome, da seguinte forma:
   * ```
   * <po-component
   *  [p-property]="[{ label: 'FA ICON', icon: 'fa fa-icon-podcast' }]">
   * </po-component>
   * ```
   *
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * component.html:
   * ```
   * <ng-template #iconTemplate>
   *   <ion-icon name="heart"></ion-icon>
   * </ng-template>
   *
   * <po-component [p-property]="myProperty"></po-component>
   * ```
   * component.ts:
   * ```
   * @ViewChild('iconTemplate', { static: true } ) iconTemplate : TemplateRef<void>;
   *
   * myProperty = [
   *  {
   *    label: 'FA ICON',
   *    icon: this.iconTemplate
   *  }
   * ];
   * ```
   */
  icon?: string | TemplateRef<void>;

  /**
   * @description
   *
   * Define se a ação será visível.
   *
   * > Caso o valor não seja especificado a ação será visível.
   *
   * Opções para tornar a ação visível ou não:
   *
   *  - Função que deve retornar um booleano.
   *
   *  - Informar diretamente um valor booleano.
   *
   */
  visible?: boolean | Function;
}
