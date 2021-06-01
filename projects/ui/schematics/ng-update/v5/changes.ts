import { UpdateDependencies } from '@po-ui/ng-schematics/package-config';
import { ReplaceChanges } from '@po-ui/ng-schematics/replace/replace';

export const replaceChanges: Array<ReplaceChanges> = [
  {
    replace: 'PoLineChartSeries|PoBarChartSeries|PoColumnChartSeries|PoPieChartSeries|PoDonutChartSeries',
    replaceWith: 'PoChartSerie'
  },
  {
    // Caso conter mais de um interface sendo importada do pacote,
    // será mantido o primeiro e os outros serão removidos.
    replace: /(?<=PoChartSerie[^]*)((\s)?(,)(\s)+?PoChartSerie)/,
    replaceWith: ''
  }
];

export const updateDepedenciesVersion: UpdateDependencies = {
  dependencies: [
    '@po-ui/ng-components',
    '@po-ui/ng-code-editor',
    '@po-ui/ng-templates',
    '@po-ui/ng-storage',
    '@po-ui/ng-sync',
    '@po-ui/style'
  ]
};
