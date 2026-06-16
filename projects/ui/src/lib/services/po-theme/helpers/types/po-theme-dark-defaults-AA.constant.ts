import { PoThemeColorCategorical } from '../../interfaces/po-theme-color.interface';
import { poThemeDefaultDarkValues } from './po-theme-dark-defaults.constant';

const poThemeDefaultCategoricalsDarkAA: PoThemeColorCategorical = {
  '01': '#003DCC',
  '02': '#669900',
  '03': '#6626A6',
  '04': '#D44E2A',
  '05': '#008599',
  '06': '#B17F00',
  '07': '#AC2076',
  '08': '#9F0712'
};

const poThemeDefaultCategoricalsOverlayDarkAA: PoThemeColorCategorical = {
  '01': '#99B8FF',
  '02': '#DDFF99',
  '03': '#CCACEC',
  '04': '#EEB9AA',
  '05': '#99F1FF',
  '06': '#FFE299',
  '07': '#EFA9D4',
  '08': '#FB9DA3'
};

/**
 * Define estilos específicos por componente e onRoot para temas escuros.
 */
const poThemeDefaultDarkValuesAA = {
  perComponent: poThemeDefaultDarkValues.perComponent,
  onRoot: {
    ...poThemeDefaultDarkValues.onRoot,
    /* CATEGORICAL COLORS */
    '--color-caption-categorical-01': '#003DCC',
    '--color-caption-categorical-02': '#669900',
    '--color-caption-categorical-03': '#6626A6',
    '--color-caption-categorical-04': '#D44E2A',
    '--color-caption-categorical-05': '#008599',
    '--color-caption-categorical-06': '#B17F00',
    '--color-caption-categorical-07': '#AC2076',
    '--color-caption-categorical-08': '#9F0712',
    /* CATEGORICAL OVERLAY COLORS */
    '--color-caption-categorical-overlay-01': '#99B8FF',
    '--color-caption-categorical-overlay-02': '#DDFF99',
    '--color-caption-categorical-overlay-03': '#CCACEC',
    '--color-caption-categorical-overlay-04': '#EEB9AA',
    '--color-caption-categorical-overlay-05': '#99F1FF',
    '--color-caption-categorical-overlay-06': '#FFE299',
    '--color-caption-categorical-overlay-07': '#EFA9D4',
    '--color-caption-categorical-overlay-08': '#FB9DA3'
  }
};

export { poThemeDefaultCategoricalsDarkAA, poThemeDefaultCategoricalsOverlayDarkAA, poThemeDefaultDarkValuesAA };
