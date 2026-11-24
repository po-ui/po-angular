/**
 * @deprecated v24.x.x use `poThemeDefaultAA`
 *
 * Define estilos específicos por componente e onRoot para temas de acessibilidade AA.
 *
 * > Essa constante pertence ao tema padrão anterior, está **depreciada** e será removida na versão `24.x.x`. Recomendamos utilizar `poThemeDefaultAA`, do novo tema padrão.
 */
export const poThemeDefaultAA = {
  perComponent: {},
  onRoot: {
    // #region COMMON
    '--outline-width': 'var(--border-width-md)',
    '--outline-width-focus-visible': 'var(--border-width-md)',

    // #region FONT
    '--font-family': 'Roboto',
    '--font-family-theme': 'Roboto',
    '--font-family-theme-bold': 'Roboto-Bold',
    '--font-family-theme-extra-light': 'Roboto-Condensed-Light',
    '--font-family-heading': 'Roboto',
    '--font-family-code': 'Monospace'
  }
};
