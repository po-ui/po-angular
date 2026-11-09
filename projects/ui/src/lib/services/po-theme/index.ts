export * from './enum/po-theme-type.enum';
export * from './enum/po-theme-a11y.enum';

export * from './interfaces/po-theme-tokens.interface';
export * from './interfaces/po-theme-color.interface';
export * from './interfaces/po-theme.interface';

export * from './helpers/types/po-theme-light-defaults.constant';
export * from './helpers/types/po-theme-light-defaults-AA.constant';
export * from './helpers/types/po-theme-dark-defaults.constant';
export * from './helpers/types/po-theme-dark-defaults-AA.constant';
export * from './helpers/accessibilities/po-theme-default-aaa.constant';
export * from './helpers/accessibilities/po-theme-default-aa.constant';
export * from './helpers/shared/base.constant';
export * from './helpers/po-theme-poui.constant';

/* Tema padrão anterior (depreciado, remoção na v24) */
export {
  poThemeDefault as poThemeDefaultDeprecated,
  poThemeDefaultDark as poThemeDefaultDarkDeprecated,
  poThemeDefaultLight as poThemeDefaultLightDeprecated
} from './helpers/deprecated/po-theme-poui.constant';
export {
  poThemeDefaultBrands as poThemeDefaultBrandsDeprecated,
  poThemeDefaultActions as poThemeDefaultActionsDeprecated,
  poThemeDefaultFeedback as poThemeDefaultFeedbackDeprecated,
  poThemeDefaultNeutrals as poThemeDefaultNeutralsDeprecated,
  poThemeDefaultLightValues as poThemeDefaultLightValuesDeprecated,
  poThemeDefaultCategoricals as poThemeDefaultCategoricalsDeprecated,
  poThemeDefaultOverlayCategoricals as poThemeDefaultOverlayCategoricalsDeprecated
} from './helpers/deprecated/types/po-theme-light-defaults.constant';
export {
  poThemeDefaultCategoricalsAA as poThemeDefaultCategoricalsAADeprecated,
  poThemeDefaultOverlayCategoricalsAA as poThemeDefaultOverlayCategoricalsAADeprecated,
  poThemeDefaultLightValuesAA as poThemeDefaultLightValuesAADeprecated
} from './helpers/deprecated/types/po-theme-light-defaults-AA.constant';
export {
  poThemeDefaultBrandsDark as poThemeDefaultBrandsDarkDeprecated,
  poThemeDefaultActionsDark as poThemeDefaultActionsDarkDeprecated,
  poThemeDefaultFeedbackDark as poThemeDefaultFeedbackDarkDeprecated,
  poThemeDefaultNeutralsDark as poThemeDefaultNeutralsDarkDeprecated,
  poThemeDefaultDarkValues as poThemeDefaultDarkValuesDeprecated,
  poThemeDefaultCategoricalsDark as poThemeDefaultCategoricalsDarkDeprecated,
  poThemeDefaultCategoricalsOverlayDark as poThemeDefaultCategoricalsOverlayDarkDeprecated
} from './helpers/deprecated/types/po-theme-dark-defaults.constant';
export {
  poThemeDefaultCategoricalsDarkAA as poThemeDefaultCategoricalsDarkAADeprecated,
  poThemeDefaultCategoricalsOverlayDarkAA as poThemeDefaultCategoricalsOverlayDarkAADeprecated,
  poThemeDefaultDarkValuesAA as poThemeDefaultDarkValuesAADeprecated
} from './helpers/deprecated/types/po-theme-dark-defaults-AA.constant';
export { poThemeDefaultAA as poThemeDefaultAADeprecated } from './helpers/deprecated/accessibilities/po-theme-default-aa.constant';
export { poThemeDefaultAAA as poThemeDefaultAAADeprecated } from './helpers/deprecated/accessibilities/po-theme-default-aaa.constant';

export * from './po-theme.service';
export * from './po-theme.module';
