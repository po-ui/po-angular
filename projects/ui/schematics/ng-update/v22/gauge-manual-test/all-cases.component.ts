import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PoGaugeRanges, PoGaugeOptions } from '@po-ui/ng-components';

@Component({
  selector: 'app-all-gauge-cases',
  templateUrl: './all-cases.component.html'
})
export class AllGaugeCasesComponent implements OnInit {
  // ═══════════════════════════════════════════════════════════════
  // CASO 1: p-value variações
  // ═══════════════════════════════════════════════════════════════
  percentual = 65;
  negativeValue = -10;

  // ═══════════════════════════════════════════════════════════════
  // CASO 2: Todas as propriedades
  // ═══════════════════════════════════════════════════════════════
  currentValue = 85;
  gaugeRanges: PoGaugeRanges[] = [
    { from: 0, to: 40, label: 'Baixo', color: 'red' },
    { from: 40, to: 70, label: 'Médio', color: 'yellow' },
    { from: 70, to: 100, label: 'Alto', color: 'green' }
  ];
  descricao = 'Desempenho do sistema';

  // ═══════════════════════════════════════════════════════════════
  // CASO 3: Ranges variações
  // ═══════════════════════════════════════════════════════════════
  score = 72;
  scoreRanges: PoGaugeRanges[] = [
    { from: 0, to: 50, label: 'Ruim', color: '#c64840' },
    { from: 50, to: 75, label: 'Regular', color: '#f5a623' },
    { from: 75, to: 100, label: 'Bom', color: '#0c9abe' }
  ];

  // Ranges sem label (legenda oculta)
  rangesWithoutLabel: PoGaugeRanges[] = [
    { from: 0, to: 33, color: '#c64840' },
    { from: 33, to: 66, color: '#f5a623' },
    { from: 66, to: 100, color: '#0c9abe' }
  ];

  // Ranges com cores hexadecimais
  rangesHexColor: PoGaugeRanges[] = [
    { from: 0, to: 25, label: 'Q1', color: '#FF5733' },
    { from: 25, to: 50, label: 'Q2', color: '#33FF57' },
    { from: 50, to: 75, label: 'Q3', color: '#3357FF' },
    { from: 75, to: 100, label: 'Q4', color: '#FF33F5' }
  ];

  // Ranges com cores RGB
  rangesRgbColor: PoGaugeRanges[] = [
    { from: 0, to: 33, label: 'Low', color: 'rgb(198, 72, 64)' },
    { from: 33, to: 66, label: 'Mid', color: 'rgb(245, 166, 35)' },
    { from: 66, to: 100, label: 'High', color: 'rgb(12, 154, 190)' }
  ];

  // Ranges com cores do tema PO
  rangesThemeColor: PoGaugeRanges[] = [
    { from: 0, to: 25, label: 'Color 01', color: 'color-01' },
    { from: 25, to: 50, label: 'Color 02', color: 'color-02' },
    { from: 50, to: 75, label: 'Color 03', color: 'color-03' },
    { from: 75, to: 100, label: 'Color 04', color: 'color-04' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // CASO 4: p-options variações
  // ═══════════════════════════════════════════════════════════════
  valor = 55;
  gaugeOptions: PoGaugeOptions = { showFromToLegend: true };
  temperatura = 78;

  fullOptions: PoGaugeOptions = {
    showFromToLegend: true,
    pointer: true,
    showContainerGauge: true,
    subtitleGauge: 'Subtítulo completo',
    descriptionChart: 'Descrição via options',
    header: {
      hideExpand: false,
      hideTableDetails: false,
      hideExportCsv: false,
      hideExportImage: false
    }
  };

  optionsWithHeader: PoGaugeOptions = {
    header: {
      hideExpand: true,
      hideTableDetails: true,
      hideExportCsv: true,
      hideExportImage: true
    }
  };

  optionsWithSubtitle: PoGaugeOptions = {
    subtitleGauge: 'Este é o subtítulo',
    showContainerGauge: true
  };

  optionsWithDescriptionChart: PoGaugeOptions = {
    descriptionChart: 'Descrição vinda do options',
    showContainerGauge: true
  };

  // ═══════════════════════════════════════════════════════════════
  // CASO 5: Atributos estáticos
  // ═══════════════════════════════════════════════════════════════
  dynamicValue = 88;
  myRanges: PoGaugeRanges[] = [
    { from: 0, to: 30, label: 'Frio', color: 'blue' },
    { from: 30, to: 70, label: 'Morno', color: 'orange' },
    { from: 70, to: 100, label: 'Quente', color: 'red' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // CASO 6: Múltiplos gauges
  // ═══════════════════════════════════════════════════════════════
  cpu = 45;
  cpuRanges: PoGaugeRanges[] = [
    { from: 0, to: 60, label: 'Normal', color: 'green' },
    { from: 60, to: 85, label: 'Alto', color: 'yellow' },
    { from: 85, to: 100, label: 'Crítico', color: 'red' }
  ];
  memory = 72;
  memRanges: PoGaugeRanges[] = [
    { from: 0, to: 50, label: 'OK', color: 'green' },
    { from: 50, to: 80, label: 'Atenção', color: 'yellow' },
    { from: 80, to: 100, label: 'Crítico', color: 'red' }
  ];
  disk = 33;

  // ═══════════════════════════════════════════════════════════════
  // CASO 7: Conteúdo projetado
  // ═══════════════════════════════════════════════════════════════
  progress = 60;
  ranges: PoGaugeRanges[] = [
    { from: 0, to: 50, label: 'Baixo', color: '#c64840' },
    { from: 50, to: 80, label: 'Médio', color: '#f5a623' },
    { from: 80, to: 100, label: 'Alto', color: '#0c9abe' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // CASO 8: Atributos genéricos
  // ═══════════════════════════════════════════════════════════════
  val = 90;
  isActive = true;
  showGauge = true;

  // ═══════════════════════════════════════════════════════════════
  // CASO 9: Estruturas condicionais
  // ═══════════════════════════════════════════════════════════════
  gaugeItems = [
    { value: 30, title: 'Item 1', ranges: [], description: 'Primeiro' },
    {
      value: 60,
      title: 'Item 2',
      ranges: [
        { from: 0, to: 50, color: 'red' },
        { from: 50, to: 100, color: 'green' }
      ],
      description: 'Segundo'
    },
    { value: 90, title: 'Item 3', ranges: [], description: 'Terceiro' }
  ];
  gaugeType = 'simple';

  // ═══════════════════════════════════════════════════════════════
  // CASO 10: showFromToLegend e showPointer
  // ═══════════════════════════════════════════════════════════════
  showPointerFlag = true;
  showLegendFlag = false;
  properties: string[] = ['showFromToLegend', 'showPointer'];

  // ═══════════════════════════════════════════════════════════════
  // CASO 11: Convivência com po-chart
  // ═══════════════════════════════════════════════════════════════
  b = 42;
  chartSeries = [{ label: 'Series A', data: [10, 20, 30, 40, 50] }];

  // ═══════════════════════════════════════════════════════════════
  // CASO 12: Indentação e formatação
  // ═══════════════════════════════════════════════════════════════
  longVariableName = 67;
  rangesArray: PoGaugeRanges[] = [
    { from: 0, to: 33, label: 'Baixo', color: 'red' },
    { from: 33, to: 66, label: 'Médio', color: 'yellow' },
    { from: 66, to: 100, label: 'Alto', color: 'green' }
  ];
  x = 55;
  r: PoGaugeRanges[] = [
    { from: 0, to: 50, color: '#c64840' },
    { from: 50, to: 100, color: '#0c9abe' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // CASO 13: p-height variações
  // ═══════════════════════════════════════════════════════════════
  dynamicHeight = 450;

  // ═══════════════════════════════════════════════════════════════
  // CASO 14: p-description variações
  // ═══════════════════════════════════════════════════════════════
  dynamicDescription = 'Descrição dinâmica via variável';

  // ═══════════════════════════════════════════════════════════════
  // CASO 15: p-title variações
  // ═══════════════════════════════════════════════════════════════
  dynamicTitle = 'Título Dinâmico';

  // ═══════════════════════════════════════════════════════════════
  // CASO 17: Ranges com valores extremos
  // ═══════════════════════════════════════════════════════════════
  rangesStartAt20: PoGaugeRanges[] = [
    { from: 20, to: 50, label: 'Baixo', color: 'blue' },
    { from: 50, to: 80, label: 'Alto', color: 'red' }
  ];

  rangesEndAt80: PoGaugeRanges[] = [
    { from: 0, to: 40, label: 'Baixo', color: 'blue' },
    { from: 40, to: 80, label: 'Alto', color: 'red' }
  ];

  negativeRanges: PoGaugeRanges[] = [
    { from: -50, to: -20, label: 'Muito Baixo', color: 'blue' },
    { from: -20, to: 0, label: 'Baixo', color: 'cyan' },
    { from: 0, to: 50, label: 'Normal', color: 'green' }
  ];

  singleRange: PoGaugeRanges[] = [{ from: 0, to: 100, label: 'Total', color: 'green' }];

  manyRanges: PoGaugeRanges[] = [
    { from: 0, to: 8, label: 'R1', color: 'color-01' },
    { from: 8, to: 16, label: 'R2', color: 'color-02' },
    { from: 16, to: 24, label: 'R3', color: 'color-03' },
    { from: 24, to: 32, label: 'R4', color: 'color-04' },
    { from: 32, to: 40, label: 'R5', color: 'color-05' },
    { from: 40, to: 48, label: 'R6', color: 'color-06' },
    { from: 48, to: 56, label: 'R7', color: 'color-07' },
    { from: 56, to: 64, label: 'R8', color: 'color-08' },
    { from: 64, to: 72, label: 'R9', color: 'color-09' },
    { from: 72, to: 80, label: 'R10', color: 'color-10' },
    { from: 80, to: 90, label: 'R11', color: 'color-11' },
    { from: 90, to: 100, label: 'R12', color: 'color-12' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // CASO 18: Uso dentro de po-container (sample-summary)
  // ═══════════════════════════════════════════════════════════════
  turnoverRanges: PoGaugeRanges[] = [
    { from: 0, to: 50, label: 'Low rate', color: '#00b28e' },
    { from: 50, to: 75, label: 'Average rate', color: '#ea9b3e' },
    { from: 75, to: 100, label: 'High rate', color: '#c64840' }
  ];

  salesRanges: PoGaugeRanges[] = [
    { from: 0, to: 50, label: 'Sales reduction', color: '#c64840' },
    { from: 50, to: 75, label: 'Average sales', color: '#ea9b3e' },
    { from: 75, to: 100, label: 'Sales soared', color: '#00b28e' }
  ];

  // ═══════════════════════════════════════════════════════════════
  // CASO 19: Uso com pipe
  // ═══════════════════════════════════════════════════════════════
  rawValue = 77.777;

  // ═══════════════════════════════════════════════════════════════
  // CASO 20: Uso com async pipe (Observable)
  // ═══════════════════════════════════════════════════════════════
  gaugeValue$: Observable<number> = of(68);
  gaugeTitle$: Observable<string> = of('Async Gauge');
  gaugeRanges$: Observable<PoGaugeRanges[]> = of([
    { from: 0, to: 50, label: 'Low', color: 'red' },
    { from: 50, to: 100, label: 'High', color: 'green' }
  ]);

  // ═══════════════════════════════════════════════════════════════
  // CASO 22: Header options completo
  // ═══════════════════════════════════════════════════════════════
  fullHeaderOptions: PoGaugeOptions = {
    showFromToLegend: true,
    pointer: true,
    showContainerGauge: true,
    subtitleGauge: 'Full Header Sub',
    descriptionChart: 'Full Header Desc',
    header: {
      hideExpand: true,
      hideTableDetails: true,
      hideExportCsv: true,
      hideExportImage: true
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // CASO 25: Expressões complexas
  // ═══════════════════════════════════════════════════════════════
  gaugeData: { value: number; title: string; ranges: PoGaugeRanges[] } = {
    value: 78,
    title: 'Object Gauge',
    ranges: [
      { from: 0, to: 50, label: 'Low', color: 'red' },
      { from: 50, to: 100, label: 'High', color: 'green' }
    ]
  };

  // ═══════════════════════════════════════════════════════════════
  // CASO 28: Ranges vazios e null
  // ═══════════════════════════════════════════════════════════════
  emptyRanges: PoGaugeRanges[] = [];
  // @ts-ignore
  nullRanges: PoGaugeRanges[] = undefined;

  // ═══════════════════════════════════════════════════════════════
  // CASO 32: Labs-style (tudo dinâmico)
  // ═══════════════════════════════════════════════════════════════
  labsDescription = 'Labs Description';
  labsHeight = 350;
  labsRanges: PoGaugeRanges[] = [
    { from: 0, to: 30, label: 'Baixo', color: '#c64840' },
    { from: 30, to: 60, label: 'Médio', color: '#f5a623' },
    { from: 60, to: 100, label: 'Alto', color: '#0c9abe' }
  ];
  labsTitle = 'Labs Gauge';
  labsValue = 55;
  labsOptions: PoGaugeOptions = {
    showFromToLegend: true,
    pointer: true,
    showContainerGauge: true,
    subtitleGauge: 'Labs Sub'
  };
  labsShowFromToLegend = true;
  labsShowPointer = true;

  // ═══════════════════════════════════════════════════════════════
  // CASO 35: Dentro de form
  // ═══════════════════════════════════════════════════════════════
  formValue = 42;

  // ═══════════════════════════════════════════════════════════════
  // CASO 39: @Input properties do componente pai
  // ═══════════════════════════════════════════════════════════════
  @Input() inputValue = 50;
  @Input() inputTitle = 'Input Title';
  @Input() inputDescription = 'Input Desc';
  @Input() inputRanges: PoGaugeRanges[] = [
    { from: 0, to: 50, color: 'blue' },
    { from: 50, to: 100, color: 'green' }
  ];
  @Input() inputHeight = 300;
  @Input() inputShowLegend = false;
  @Input() inputShowPointer = true;
  @Input() inputOptions: PoGaugeOptions = {};

  ngOnInit(): void {}

  // ═══════════════════════════════════════════════════════════════
  // Métodos
  // ═══════════════════════════════════════════════════════════════
  onGaugeClick(): void {
    console.log('Gauge clicked!');
  }

  onMouseEnter(): void {
    console.log('Mouse enter');
  }

  onMouseLeave(): void {
    console.log('Mouse leave');
  }

  getGaugeValue(): number {
    return 73;
  }
}
