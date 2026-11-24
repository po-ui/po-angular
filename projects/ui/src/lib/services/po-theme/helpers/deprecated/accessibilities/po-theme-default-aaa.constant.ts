/**
 * @deprecated v24.x.x use `poThemeDefaultAAA`
 *
 * Define estilos específicos por componente e onRoot para temas de acessibilidade AAA.
 *
 * > Essa constante pertence ao tema padrão anterior, está **depreciada** e será removida na versão `24.x.x`. Recomendamos utilizar `poThemeDefaultAAA`, do novo tema padrão.
 */
export const poThemeDefaultAAA = {
  perComponent: {},
  onRoot: {
    // #region FONT
    '--font-family': 'Roboto',
    '--font-family-theme': 'Roboto',
    '--font-family-theme-bold': 'Roboto-Bold',
    '--font-family-theme-extra-light': 'Roboto-Condensed-Light',
    '--font-family-heading': 'Roboto',
    '--font-family-code': 'Monospace'
  }
};
