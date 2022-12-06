import { TemplateRef } from '@angular/core';

export interface PoItemListAction {
  /**
   * Ação que será executada, sendo possível passar o nome ou a referência da função.
   *
   * > Para que a função seja executada no contexto do elemento filho o mesmo deve ser passado utilizando *bind*.
   *
   * Exemplo: `action: this.myFunction.bind(this)`
   */
  action?: Function;

  /**
   * Função que deve retornar um booleano para habilitar ou desabilitar a ação para o registro selecionado.
   *
   * Também é possível informar diretamente um valor booleano que vai habilitar ou desabilitar a ação para todos os registros.
   */
  disabled?: boolean | Function;

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

  /** Rótulo da ação. */
  label: string;

  /** URL utilizada no redirecionamento das páginas. */
  url?: string;
  selected?: boolean;

  /** Atribui uma linha separadora acima do item. */
  separator?: boolean;
  /**
   * @description
   *
   * Define a cor do item, sendo `action` o padrão.
   *
   * Valores válidos:
   *  - `action`
   *  - `check`
   *  - `option`
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
  /**
   * @description
   *
   * Define se o item vai ter o estilo danger ou não.
   *
   * Deve ser usado para mostrar uma ação de exclusão ou de saída.
   */
  danger?: boolean;
}
