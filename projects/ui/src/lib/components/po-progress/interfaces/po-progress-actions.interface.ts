import { TemplateRef } from '@angular/core';

/**
 * @description
 * Interface para as ações dos componentes po-progress e po-upload.
 *
 * @usedBy PoProgressComponent, PoUploadComponent
 */
export interface PoProgressAction {
  /** Rótulo da ação. */
  label?: string;

  /**
   * @description
   *
   * Define um ícone que será exibido ao lado esquerdo do rótulo.
   *
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](https://po-ui.io/icons). conforme exemplo abaixo:
   * ```
   * <po-component
   *  [p-property]="[{ label: 'PHOSPHOR ICON', icon: 'an an-newspaper' }]">
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
   *  - `danger` - indicado para ações exclusivas (excluir, sair).
   */
  type?: string;

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
