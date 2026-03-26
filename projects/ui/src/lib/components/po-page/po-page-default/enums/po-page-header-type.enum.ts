/**
 * @usedBy PoPageDefaultComponent
 *
 * @description
 *
 * Define os tipos de cabeçalho disponíveis, alterando a hierarquia visual e os elementos de navegação.
 */
export enum PoPageHeaderType {
  /**
   * Layout padrão que permite o uso de `p-breadcrumb`. As ações seguem o estilo definido
   * em suas propriedades individuais (padrão: `primary` para a primeira ação).
   */
  primary = 'primary',

  /**
   * Exibe um botão de retorno (voltar) ao lado do título e oculta o `p-breadcrumb`.
   * Por padrão, as ações assumem o estilo `secondary`.
   */
  secondary = 'secondary',

  /**
   * Layout simplificado sem botões de navegação e sem `p-breadcrumb`.
   * Assim como no tipo `secondary`, as ações assumem o estilo `secondary` por padrão.
   */
  tertiary = 'tertiary'
}
