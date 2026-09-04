import { UpdateDependencies } from '@po-ui/ng-schematics/package-config';

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

/** Pacote de origem/destino dos símbolos migrados do gauge. */
export const PO_UI_PACKAGE = '@po-ui/ng-components';

/** Símbolos gauge com equivalente direto no po-chart. */
export const gaugeSymbolMap: Record<string, string> = {
  PoGaugeModule: 'PoChartModule',
  PoGaugeComponent: 'PoChartComponent',
  PoGaugeRanges: 'PoChartSerie',
  PoGaugeOptions: 'PoChartOptions'
};

/** Símbolos gauge SEM equivalente -> exigem revisão manual (Req 4.4). */
export const gaugeSymbolsWithoutEquivalent: ReadonlyArray<string> = ['PoGaugeCoordinates', 'PoGaugeSvgContainer'];

/** Destino de uma propriedade do po-gauge na configuração do po-chart. */
export type PropertyTarget = 'p-series' | 'p-options' | 'passthrough' | 'unmapped';

/** Regra de mapeamento de uma propriedade do po-gauge para o po-chart. */
export interface GaugePropertyRule {
  /** Nome da propriedade do po-gauge (ex.: 'p-value', 'p-ranges'). */
  gaugeProp: string;
  /** Destino da propriedade na configuração do po-chart. */
  target: PropertyTarget;
  /** Chave em p-options quando target = 'p-options'. */
  optionsKey?: string;
}

/**
 * Tabela de Mapeamento das propriedades do po-gauge para o po-chart
 * (conforme comportamento real do componente po-gauge da v21).
 *
 * Referência: po-gauge.component.html passa `[p-title]` e `[p-height]`
 * diretamente como inputs do po-chart. `p-show-pointer` é consumido via
 * `p-options.pointer`. `p-value` com `p-ranges` vai para
 * `p-value-gauge-multiple`.
 */
export const gaugePropertyRules: ReadonlyArray<GaugePropertyRule> = [
  { gaugeProp: 'p-value', target: 'p-series' },
  { gaugeProp: 'p-ranges', target: 'p-series' },
  { gaugeProp: 'p-description', target: 'p-options', optionsKey: 'descriptionChart' },
  { gaugeProp: 'p-title', target: 'passthrough' },
  { gaugeProp: 'p-height', target: 'passthrough' },
  { gaugeProp: 'p-show-from-to-legend', target: 'p-options', optionsKey: 'showFromToLegend' },
  { gaugeProp: 'p-show-pointer', target: 'p-options', optionsKey: 'pointer' },
  { gaugeProp: 'p-options', target: 'p-options' }
];
