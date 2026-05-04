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
   * @optional
   *
   * @description
   *
   * Ação que será executada, sendo possível passar o nome ou a referência da função.
   *
   * No componente `po-dropdown`, a action também pode ser executada para o agrupador de subitens.
   *
   * > Para que a função seja executada no contexto do componente, utilize *bind*:
   * `action: this.myFunction.bind(this)`
   */
  action?: Function;

  /**
   * @optional
   *
   * @description
   *
   * Ícone exibido ao lado esquerdo do rótulo.
   *
   * Aceita ícones da [Biblioteca de ícones](https://po-ui.io/icons), fontes externas (ex: Font Awesome)
   * ou um `TemplateRef` para ícones customizados.
   *
   * ```
   * { label: 'Ação', icon: 'an an-newspaper' }
   * ```
   */
  icon?: string | TemplateRef<void>;

  /**
   * @optional
   *
   * @description
   *
   * Atribui uma linha separadora acima do item.
   */
  separator?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Desabilita a ação. Aceita um valor booleano ou uma função que retorna booleano.
   */
  disabled?: boolean | Function;

  /**
   * @optional
   *
   * @description
   *
   * Define a cor do item.
   *
   * Valores válidos:
   *  - `default`
   *  - `danger`
   */
  type?: string;

  /**
   * @optional
   *
   * @description
   *
   * URL para redirecionamento. Aceita rotas internas e links externos.
   *
   * No componente `po-dropdown`, quando informada em um agrupador com `subItems`, o clique
   * redireciona ao invés de abrir os subitens.
   *
   * > Quando informada, tem prioridade sobre a propriedade `action`.
   */
  url?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define se a ação está selecionada.
   */
  selected?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Define a visibilidade da ação. Aceita um valor booleano ou uma função que retorna booleano.
   *
   * @default `true`
   */
  visible?: boolean | Function;

  // id interno
  $id?: string;

  // template interno
  $subItemTemplate?: TemplateRef<any>;
}
