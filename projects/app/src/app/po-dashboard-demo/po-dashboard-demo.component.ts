import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { PoCheckboxGroupOption, PoChartSerie, PoChartType } from '../../../../ui/src/public-api';
import { PoDashboardCard } from '../../../../ui/src/lib/components/po-dashboard/interfaces/po-dashboard-card.interface';
import { PoDashboardReorderEvent } from '../../../../ui/src/lib/components/po-dashboard/interfaces/po-dashboard-reorder-event.interface';

@Component({
  selector: 'app-po-dashboard-demo',
  templateUrl: './po-dashboard-demo.component.html',
  standalone: false
})
export class PoDashboardDemoComponent implements OnInit, AfterViewInit {
  // Linha 1 — 4 bigNumbers (extrasmall 1×1)
  @ViewChild('tplReceitaProjetada') tplReceitaProjetada: TemplateRef<void>;
  @ViewChild('tplCustosOperacionais') tplCustosOperacionais: TemplateRef<void>;
  @ViewChild('tplMargemContribuicao') tplMargemContribuicao: TemplateRef<void>;
  @ViewChild('tplIndiceInadimplencia') tplIndiceInadimplencia: TemplateRef<void>;

  // Linha 2 — 2 charts (medium 2×2)
  @ViewChild('tplPerformanceCanal') tplPerformanceCanal: TemplateRef<void>;
  @ViewChild('tplPipelineAtendimentos') tplPipelineAtendimentos: TemplateRef<void>;

  // Linha 3 — 2 routines + 1 actionlist (extrasmall 1×1)
  @ViewChild('tplConciliacaoBancaria') tplConciliacaoBancaria: TemplateRef<void>;
  @ViewChild('tplCadastroFornecedores') tplCadastroFornecedores: TemplateRef<void>;
  @ViewChild('tplAgendaCobranca') tplAgendaCobranca: TemplateRef<void>;

  cards: Array<PoDashboardCard> = [];
  properties: Array<string> = [];
  lastReorder = '-';

  readonly propertiesOptions: Array<PoCheckboxGroupOption> = [{ value: 'draggable', label: 'Draggable' }];

  // Chart data — Performance por Canal (Donut)
  readonly seriesPerformance: Array<PoChartSerie> = [
    { label: 'E-commerce', data: 30 },
    { label: 'Loja Física', data: 25 },
    { label: 'Marketplace', data: 19 },
    { label: 'Atacado', data: 15 },
    { label: 'Inside Sales', data: 11 }
  ];
  readonly chartTypeDonut = PoChartType.Donut;

  // Chart data — Pipeline de Atendimentos (Pie)
  readonly seriesPipeline: Array<PoChartSerie> = [
    { label: 'Novas', data: 36 },
    { label: 'Em tratamento', data: 29 },
    { label: 'Finalizadas', data: 22 },
    { label: 'Reabertas', data: 13 }
  ];
  readonly chartTypePie = PoChartType.Pie;

  ngOnInit(): void {
    this.restore();
  }

  ngAfterViewInit(): void {
    this.buildCards();
  }

  onReorder(event: PoDashboardReorderEvent): void {
    this.cards = event.cards;
    this.lastReorder = `"${event.cards[event.currentIndex].id}" movido do índice ${event.previousIndex} para ${event.currentIndex}`;
  }

  restore(): void {
    this.properties = [];
    this.lastReorder = '-';
    if (this.tplReceitaProjetada) {
      this.buildCards();
    }
  }

  private buildCards(): void {
    this.cards = [
      // Linha 1 — 4 bigNumbers extrasmall (1×1)
      { id: 'w1', displaySize: 'extrasmall', template: this.tplReceitaProjetada },
      { id: 'w2', displaySize: 'extrasmall', template: this.tplCustosOperacionais },
      { id: 'w3', displaySize: 'extrasmall', template: this.tplMargemContribuicao },
      { id: 'w4', displaySize: 'extrasmall', template: this.tplIndiceInadimplencia },

      // Linha 2 — 2 charts medium (2×2)
      { id: 'w5', displaySize: 'medium', template: this.tplPerformanceCanal },
      { id: 'w6', displaySize: 'medium', template: this.tplPipelineAtendimentos },

      // Linha 3 — 2 routines + 1 actionlist extrasmall (1×1)
      { id: 'w7', displaySize: 'extrasmall', template: this.tplConciliacaoBancaria },
      { id: 'w8', displaySize: 'extrasmall', template: this.tplCadastroFornecedores },
      { id: 'w9', displaySize: 'extrasmall', template: this.tplAgendaCobranca }
    ];
  }
}
