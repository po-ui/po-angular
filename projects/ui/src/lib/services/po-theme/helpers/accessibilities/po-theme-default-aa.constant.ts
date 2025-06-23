/**
 * Define estilos específicos por componente e onRoot para temas de acessibilidade AA.
 */
export const poThemeDefaultAA = {
  perComponent: {},
  onRoot: {
    // #region COMMON
    '--outline-width': 'var(--border-width-md)',
    '--outline-width-focus-visible': 'var(--border-width-md)'
  }
};

export const poThemeDensityAA = {
  small: {
    '--default-spacing-0': '0',
    '--default-spacing-xs': 'var(--spacing-xs)',
    '--default-spacing-sm': 'var(--spacing-sm)',
    '--default-spacing-md': 'var(--spacing-md)',
    '--default-spacing-lg': 'var(--spacing-lg)',
    '--default-spacing-xl': 'var(--spacing-xl)',
    '--default-font-size-sm': 'var(--font-size-sm)'
  }
};
