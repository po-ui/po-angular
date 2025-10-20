import { TemplateRef } from '@angular/core';

/**
 * @usedBy PoPopupComponent, PoWidgetComponent
 *
 * @description
 *
 * Interface para lista de ações do componente.
 */
export interface PoPopupAction {
  /**
   * @description
   *
   * Rótulo da ação.
   *
   * No componente `po-dropdown`, a label também pode representar o agrupador de subitens.
   */
  label: string;

  /**
   * @description
   *
   * Ação que será executada, sendo possível passar o nome ou a referência da função.
   *
   * No componente `po-dropdown`, a action também pode ser executada para o agrupador de subitens.
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
   * @description
   *
   * Atribui uma linha separadora acima do item.
   *
   * */
  separator?: boolean;

  /**
   * @description
   *
   * Função que deve retornar um booleano para habilitar ou desabilitar a ação para o registro selecionado.
   *
   * Também é possível informar diretamente um valor booleano que vai habilitar ou desabilitar a ação para todos os registros.
   *
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
   * URL utilizada para redirecionamento das páginas.
   *
   * No componente `po-dropdown`, a url também pode ser configurada para o agrupador de subitens.
   * Entretanto, quando a `url` é informada em um agrupador, o clique **não abrirá os subitens**, pois o item será
   * tratado como um link e o redirecionamento terá prioridade sobre a exibição da lista.
   *
   */
  url?: string;

  /**
   * @description
   *
   * Define se a ação está selecionada.
   *
   */
  selected?: boolean;

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

  // id interno
  $id?: string;

  // template interno
  $subItemTemplate?: TemplateRef<any>;
}
