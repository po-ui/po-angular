import { PoThemeColorCategorical } from '../../interfaces/po-theme-color.interface';
import { poThemeDefaultDarkValues } from './po-theme-dark-defaults.constant';

const poThemeDefaultCategoricalsDarkAA: PoThemeColorCategorical = {
  '01': '#2E67FF',
  '02': '#F76D43',
  '03': '#9654FF',
  '04': '#00BF9C',
  '05': '#F22CA6',
  '06': '#FC501C',
  '07': '#63A9EB',
  '08': '#FA8E0A'
};

const poThemeDefaultCategoricalsOverlayDarkAA: PoThemeColorCategorical = {
  '01': '#1F3FAD',
  '02': '#B8523E',
  '03': '#4D2C97',
  '04': '#018E7F',
  '05': '#95277B',
  '06': '#BA3B15',
  '07': '#4B80B3',
  '08': '#B96907'
};

/**
 * Define estilos específicos por componente e onRoot para temas escuros.
 */
const poThemeDefaultDarkValuesAA = {
  ...poThemeDefaultDarkValues.perComponent,
  onRoot: {
    ...poThemeDefaultDarkValues.onRoot,
    /* CATEGORICAL COLORS */
    '--color-caption-categorical-01': '#2E67FF',
    '--color-caption-categorical-02': '#F76D43',
    '--color-caption-categorical-03': '#9654FF',
    '--color-caption-categorical-04': '#00BF9C',
    '--color-caption-categorical-05': '#F22CA6',
    '--color-caption-categorical-06': '#FC501C',
    '--color-caption-categorical-07': '#63A9EB',
    '--color-caption-categorical-08': '#FA8E0A',
    /* CATEGORICAL OVERLAY COLORS */
    '--color-caption-categorical-overlay-01': '#1F3FAD',
    '--color-caption-categorical-overlay-02': '#B8523E',
    '--color-caption-categorical-overlay-03': '#4D2C97',
    '--color-caption-categorical-overlay-04': '#018E7F',
    '--color-caption-categorical-overlay-05': '#95277B',
    '--color-caption-categorical-overlay-06': '#BA3B15',
    '--color-caption-categorical-overlay-07': '#4B80B3',
    '--color-caption-categorical-overlay-08': '#B96907'
  }
};

export { poThemeDefaultCategoricalsDarkAA, poThemeDefaultCategoricalsOverlayDarkAA, poThemeDefaultDarkValuesAA };
