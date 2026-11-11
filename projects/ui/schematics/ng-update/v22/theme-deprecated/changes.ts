/**
 * Mapeamentos da migração opcional `migration-v22-theme-deprecated`.
 *
 * Este arquivo não depende de nenhum pacote para que possa ser importado tanto
 * pelas schematics quanto pelos testes da biblioteca, mantendo uma única fonte
 * para o mapeamento.
 */

/** Pacote de origem dos símbolos de tema. */
export const PO_UI_PACKAGE = '@po-ui/ng-components';

/** Pacote dos arquivos CSS do tema. */
export const PO_UI_STYLE_PACKAGE = '@po-ui/style';

/**
 * Constantes públicas do tema padrão na v21 (que na v22 apontam para o novo
 * tema) e a constante equivalente do tema anterior, depreciado até a v24.
 */
export const themeDeprecatedSymbolMap: Record<string, string> = {
  poThemeDefault: 'poThemeDefaultDeprecated',
  poThemeDefaultLight: 'poThemeDefaultLightDeprecated',
  poThemeDefaultDark: 'poThemeDefaultDarkDeprecated',

  poThemeDefaultBrands: 'poThemeDefaultBrandsDeprecated',
  poThemeDefaultActions: 'poThemeDefaultActionsDeprecated',
  poThemeDefaultFeedback: 'poThemeDefaultFeedbackDeprecated',
  poThemeDefaultNeutrals: 'poThemeDefaultNeutralsDeprecated',
  poThemeDefaultLightValues: 'poThemeDefaultLightValuesDeprecated',
  poThemeDefaultCategoricals: 'poThemeDefaultCategoricalsDeprecated',
  poThemeDefaultOverlayCategoricals: 'poThemeDefaultOverlayCategoricalsDeprecated',

  poThemeDefaultCategoricalsAA: 'poThemeDefaultCategoricalsAADeprecated',
  poThemeDefaultOverlayCategoricalsAA: 'poThemeDefaultOverlayCategoricalsAADeprecated',
  poThemeDefaultLightValuesAA: 'poThemeDefaultLightValuesAADeprecated',

  poThemeDefaultBrandsDark: 'poThemeDefaultBrandsDarkDeprecated',
  poThemeDefaultActionsDark: 'poThemeDefaultActionsDarkDeprecated',
  poThemeDefaultFeedbackDark: 'poThemeDefaultFeedbackDarkDeprecated',
  poThemeDefaultNeutralsDark: 'poThemeDefaultNeutralsDarkDeprecated',
  poThemeDefaultDarkValues: 'poThemeDefaultDarkValuesDeprecated',
  poThemeDefaultCategoricalsDark: 'poThemeDefaultCategoricalsDarkDeprecated',
  poThemeDefaultCategoricalsOverlayDark: 'poThemeDefaultCategoricalsOverlayDarkDeprecated',

  poThemeDefaultCategoricalsDarkAA: 'poThemeDefaultCategoricalsDarkAADeprecated',
  poThemeDefaultCategoricalsOverlayDarkAA: 'poThemeDefaultCategoricalsOverlayDarkAADeprecated',
  poThemeDefaultDarkValuesAA: 'poThemeDefaultDarkValuesAADeprecated',

  poThemeDefaultAA: 'poThemeDefaultAADeprecated',
  poThemeDefaultAAA: 'poThemeDefaultAAADeprecated'
};

/** Símbolos novos da v22 sem equivalente no tema anterior: geram aviso. */
export const themeSymbolsWithoutDeprecated: ReadonlyArray<string> = ['poThemeSharedBase'];

/** Arquivos CSS do `@po-ui/style` e seus equivalentes do tema anterior. */
export const themeDeprecatedStyleMap: Record<string, string> = {
  'po-theme-default.min.css': 'po-theme-default-deprecated.min.css',
  'po-theme-default-variables.css': 'po-theme-default-deprecated-variables.css',
  'po-theme-default-variables.min.css': 'po-theme-default-deprecated-variables.min.css'
};

/** Nome do serviço de tema. */
export const PO_THEME_SERVICE = 'PoThemeService';

/** Constante do tema anterior usada na injeção e em `setDefaultTheme`. */
export const PO_THEME_DEFAULT_DEPRECATED = 'poThemeDefaultDeprecated';
