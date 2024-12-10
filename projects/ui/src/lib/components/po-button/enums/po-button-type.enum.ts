/**
 * @usedBy PoButtonComponent
 *
 * @description
 *
 * Enumeração que define os tipos possíveis para o `PoButtonComponent`. Estes tipos estão relacionados ao comportamento
 * do botão quando utilizado dentro de um formulário HTML.
 *
 * @example
 * No uso com o `PoButtonComponent`, a propriedade `p-type` pode ser utilizada para configurar o comportamento:
 *
 * ```
 * <po-button p-label="Enviar" p-type="submit"></po-button>
 * <po-button p-label="Cancelar" p-type="button"></po-button>
 * <po-button p-label="Redefinir" p-type="reset"></po-button>
 * ```
 */
export enum PoButtonType {
  /**
   * Define o botão como do tipo `submit`. Quando clicado, o formulário é enviado automaticamente,
   * disparando o evento `submit`.
   */
  Submit = 'submit',

  /**
   * Define o botão como do tipo `button`. Este tipo de botão não possui comportamento padrão associado
   * e é utilizado principalmente para ações programáticas como cliques e disparos de eventos customizados.
   */
  Button = 'button',

  /**
   * Define o botão como do tipo `reset`. Quando clicado, redefine os campos do formulário ao qual pertence
   * para seus valores iniciais.
   */
  Reset = 'reset'
}
