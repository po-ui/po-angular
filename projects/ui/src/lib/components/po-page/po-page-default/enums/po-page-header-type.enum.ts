/**
 * @usedBy PoPageDefaultComponent
 *
 * @description
 *
 * Define os tipos de cabeçalho disponíveis no `po-page-default`.
 */
export enum PoPageHeaderType {
  /**
   * Layout padrão com suporte a `p-breadcrumb`.
   */
  primary = 'primary',

  /**
   * Exibe um botão de retorno ao lado do título.
   *
   * > Incompatível com `p-breadcrumb`.
   */
  secondary = 'secondary',

  /**
   * Layout simplificado sem botão de retorno.
   *
   * > Incompatível com `p-breadcrumb`.
   */
  tertiary = 'tertiary'
}
