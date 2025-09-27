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
   * Quando o valor é `info`, o popover exibe apenas informações e não permite ações customizadas.
   *
   * Quando o valor é `help`, o popover pode exibir ações customizadas no rodapé.
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
   * Compatível apenas com a propriedade type com o valor `help` e desconsiderada quando o type for `info`.
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
   *
   * O conteúdo do popover não é exibido quando esta propriedade é definida, para controle total do evento pelo desenvolvedor.
   *
   * Pode ser uma função ou um `EventEmitter`.
   *
   * Exemplo:
   * ```
   * eventOnClick: (event) => {
   *  alert('Clicou no helper');
   *  console.log(event);
   * }
   * ```
   */
  eventOnClick?: Function;

  size?: string;
}
