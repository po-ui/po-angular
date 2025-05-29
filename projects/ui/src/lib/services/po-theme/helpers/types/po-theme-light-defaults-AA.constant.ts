import { PoThemeColorCategorical } from '../../interfaces/po-theme-color.interface';
import { poThemeDefaultLightValues } from './po-theme-light-defaults.constant';

const poThemeDefaultCategoricalsAA: PoThemeColorCategorical = {
  '01': '#3773FF',
  '02': '#F86544',
  '03': '#B46AFF',
  '04': '#06A883',
  '05': '#FF45B8',
  '06': '#FF6021',
  '07': '#2393FB',
  '08': '#C5863A'
};

const poThemeDefaultOverlayCategoricalsAA: PoThemeColorCategorical = {
  '01': '#9BB9FF',
  '02': '#FBB2A1',
  '03': '#D9B5FF',
  '04': '#83D3C1',
  '05': '#FFA2DB',
  '06': '#FFAF90',
  '07': '#91C9FD',
  '08': '#E2C39C'
};

/**
 * Define estilos específicos por componente e onRoot para temas claros para AA.
 */
const poThemeDefaultLightValuesAA = {
  perComponent: poThemeDefaultLightValues.perComponent,
  onRoot: {
    ...poThemeDefaultLightValues.onRoot,
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
    '--color-caption-categorical-overlay-01': '#9BB9FF',
    '--color-caption-categorical-overlay-02': '#FBB2A1',
    '--color-caption-categorical-overlay-03': '#D9B5FF',
    '--color-caption-categorical-overlay-04': '#83D3C1',
    '--color-caption-categorical-overlay-05': '#FFA2DB',
    '--color-caption-categorical-overlay-06': '#FFAF90',
    '--color-caption-categorical-overlay-07': '#91C9FD',
    '--color-caption-categorical-overlay-08': '#E2C39C'
  }
};

export { poThemeDefaultCategoricalsAA, poThemeDefaultOverlayCategoricalsAA, poThemeDefaultLightValuesAA };
