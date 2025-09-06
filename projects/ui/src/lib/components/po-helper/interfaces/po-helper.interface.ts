/**
 * @usedBy PoHelperComponent
 *
 * @description
 *
 * *Interface* que define as opções de configuração do componente po-helper.
 *
 * Permite customizar o conteúdo, título, tipo do ícone, modo de abertura do popover, ações customizadas e eventos.
 *
 */
export interface PoHelperOptions {
  /**
   *
   * @optional
   *
   * @description
   *
   * Título do helper exibido no popover.
   */
  title?: string;

  /**
   *
   * @optional
   *
   * @description
   *
   * Texto explicativo exibido no popover.
   */
  content?: string;

  /**
   *
   * @optional
   *
   * @description
   *
   * Tipo do ícone exibido: `info` ou `help`.
   *
   * @default `help`
   */
  type?: 'info' | 'help';

  /**
   *
   * @optional
   *
   * @description
   *
   * Ação customizada exibida no rodapé do popover.
   *
   * Deve ser um objeto com as propriedades:
   * - `label`: Texto do botão.
   * - `action`: Função executada ao clicar no botão.
   *
   * Exemplo:
   * ```typescript
   * { label: 'Saiba mais', action: this.footerAction.bind(this)) }
   * ```
   */
  footerAction?: { label: string; action: Function };

  /**
   * @optional
   *
   * @description
   * Evento disparado ao clicar no ícone do helper.
   */
  eventOnClick?: Function;

  /**
   *
   * @optional
   *
   * @description
   *
   * Tamanho do componente definido dinamicamente.
   */
  size?: string;
}
