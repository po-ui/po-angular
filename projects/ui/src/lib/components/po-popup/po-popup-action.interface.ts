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
   * A label também pode representar o agrupador de subitens quando a ação possuir `subItems`.
   */
  label: string;

  /**
   * @optional
   *
   * @description
   *
   * Ação que será executada, sendo possível passar o nome ou a referência da função.
   *
   * A action também pode ser executada para o agrupador de subitens quando a ação possuir `subItems`.
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
   * A url também pode ser configurada para o agrupador de subitens.
   * Entretanto, quando a `url` é informada em um agrupador, o clique **não abrirá os subitens**, pois o item será
   * tratado como um link e o redirecionamento terá prioridade sobre a exibição da lista.
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

  /**
   * @optional
   *
   * @description
   *
   * Define uma lista de subitens para criação de menus aninhados.
   *
   * Ao definir esta propriedade, o item exibirá um ícone indicador de subnível.
   * Recomenda-se utilizar no máximo três níveis hierárquicos para garantir a usabilidade.
   *
   * > As propriedades `disabled`, `type` e `visible` não são aplicadas visualmente ao item agrupador.
   *
   * > Quando `url` é informada em um agrupador, o redirecionamento terá prioridade e os subitens não serão abertos.
   *
   * > Em subníveis aninhados, o `icon` do agrupador é substituído pelo indicador de navegação (seta).
   */
  subItems?: Array<PoPopupAction>;

  // template interno
  $subItemTemplate?: TemplateRef<any>;
}
