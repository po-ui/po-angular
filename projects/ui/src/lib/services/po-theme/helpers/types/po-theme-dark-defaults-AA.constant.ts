import { PoThemeColorCategorical } from '../../interfaces/po-theme-color.interface';
import { poThemeDefaultDarkValues } from './po-theme-dark-defaults.constant';

const poThemeDefaultCategoricalsDarkAA: PoThemeColorCategorical = {
  '01': '#3773FF',
  '02': '#F86544',
  '03': '#B46AFF',
  '04': '#06A883',
  '05': '#FF45B8',
  '06': '#FF6021',
  '07': '#2393FB',
  '08': '#C5863A'
};

const poThemeDefaultCategoricalsOverlayDarkAA: PoThemeColorCategorical = {
  '01': '#1C3A80',
  '02': '#7C3322',
  '03': '#5A3580',
  '04': '#035442',
  '05': '#80235C',
  '06': '#803011',
  '07': '#124A7E',
  '08': '#63431D'
};

/**
 * Define estilos específicos por componente e onRoot para temas escuros.
 */
const poThemeDefaultDarkValuesAA = {
  perComponent: poThemeDefaultDarkValues.perComponent,
  onRoot: {
    ...poThemeDefaultDarkValues.onRoot,
    /* CATEGORICAL COLORS */
    '--color-caption-categorical-01': '#3773FF',
    '--color-caption-categorical-02': '#F86544',
    '--color-caption-categorical-03': '#B46AFF',
    '--color-caption-categorical-04': '#06A883',
    '--color-caption-categorical-05': '#FF45B8',
    '--color-caption-categorical-06': '#FF6021',
    '--color-caption-categorical-07': '#2393FB',
    '--color-caption-categorical-08': '#C5863A',
    /* CATEGORICAL OVERLAY COLORS */
    '--color-caption-categorical-overlay-01': '#1C3A80',
    '--color-caption-categorical-overlay-02': '#7C3322',
    '--color-caption-categorical-overlay-03': '#5A3580',
    '--color-caption-categorical-overlay-04': '#035442',
    '--color-caption-categorical-overlay-05': '#80235C',
    '--color-caption-categorical-overlay-06': '#803011',
    '--color-caption-categorical-overlay-07': '#124A7E',
    '--color-caption-categorical-overlay-08': '#63431D'
  }
};

export { poThemeDefaultCategoricalsDarkAA, poThemeDefaultCategoricalsOverlayDarkAA, poThemeDefaultDarkValuesAA };
