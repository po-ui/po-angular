/**
 * @docsPrivate
 *
 * @description
 *
 * Interface interna para configuração de ações customizadas no po-helper.
 * Utilizada exclusivamente para repasse de configuração entre os componentes de página (po-page-default, po-page-header) e o po-helper.
 */
export interface PoHelperCustomAction {
  /** Ícone a ser exibido no botão. */
  icon: string;

  /** Label de acessibilidade para o botão. */
  ariaLabel?: string;

  /** Função callback a ser executada ao clicar no botão. */
  action: Function;
}
