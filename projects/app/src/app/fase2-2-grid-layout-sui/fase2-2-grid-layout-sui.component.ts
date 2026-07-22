import { CommonModule } from '@angular/common';
import { Component, computed, signal, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  CdkDragHandle,
  CdkDragPlaceholder
} from '@angular/cdk/drag-drop';
import {
  PoChartSerie,
  PoChartType,
  PoModalAction,
  PoModalComponent,
  PoModule
} from 'projects/ui/src/lib';

export type WidgetType = 'bigNumber' | 'chart' | 'routine' | 'actionlist';

/**
 * Tamanhos lógicos mapeados para spans no CSS Grid (col x row):
 *  extrasmall: 1x1
 *  small:      1x2
 *  medium:     2x2
 *  large:      3x2
 *  extralarge: 4x2
 */
export type DisplaySize = 'extrasmall' | 'small' | 'medium' | 'large' | 'extralarge';

export interface CardSpan {
  col: number;
  row: number;
}

/** Mapa de spans lógicos conforme especificação do Auto-grid */
export const DISPLAY_SIZE_SPANS: Record<DisplaySize, CardSpan> = {
  extrasmall: { col: 1, row: 1 },
  small:      { col: 1, row: 2 },
  medium:     { col: 2, row: 2 },
  large:      { col: 3, row: 2 },
  extralarge: { col: 4, row: 2 }
};

/** Fallback por tipo de widget quando displaySize não for informado */
export function getDefaultDisplaySize(type: WidgetType): DisplaySize {
  switch (type) {
    case 'chart':      return 'medium';
    case 'actionlist': return 'small';
    default:           return 'extrasmall';
  }
}

export interface WidgetCard {
  id: string;
  title: string;
  type: WidgetType;
  displaySize?: DisplaySize;
  value?: string;
  tag?: string;
  chartType?: PoChartType;
  chartSeries?: PoChartSerie[];
  chartCategories?: string[];
}

@Component({
  selector: 'app-fase2-2-grid-layout-sui',
  templateUrl: './fase2-2-grid-layout-sui.component.html',
  styleUrl: './fase2-2-grid-layout-sui.component.css',
  imports: [CommonModule, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder, PoModule]
})
export class Fase22GridLayoutSuiComponent {
  @ViewChild('cardModal') cardModal!: PoModalComponent;

  selectedCard = signal<WidgetCard | null>(null);

  isDense = signal(true);

  modalPrimaryAction: PoModalAction = {
    label: 'Fechar',
    action: () => this.cardModal.close()
  };

  lastAction = signal<string>('Nenhum drag realizado ainda.');

  cards = signal<WidgetCard[]>([
    {
      id: 'w1',
      title: 'Faturamento do mês',
      type: 'bigNumber',
      displaySize: 'extrasmall',
      value: 'R$ 128.450',
      tag: 'Compras'
    },
    {
      id: 'w2',
      title: 'Tendência de Faturamento',
      type: 'chart',
      displaySize: 'medium',
      tag: 'Financeiro',
      chartType: PoChartType.Column,
      chartCategories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      chartSeries: [
        { label: 'Receita', data: [42, 58, 51, 73, 66, 85] },
        { label: 'Despesa', data: [30, 40, 38, 52, 47, 61] }
      ]
    },
    {
      id: 'w3',
      title: 'Pendências de Aprovação',
      type: 'routine',
      displaySize: 'small',
      tag: 'Compras'
    },
    {
      id: 'w4',
      title: 'Ticket Médio',
      type: 'bigNumber',
      displaySize: 'extrasmall',
      value: 'R$ 342',
      tag: 'Financeiro'
    },
    {
      id: 'w5',
      title: 'Índice de Inadimplência',
      type: 'bigNumber',
      displaySize: 'extrasmall',
      value: 'R$ 3.120',
      tag: 'Financeiro'
    },
    {
      id: 'w6',
      title: 'Dashboard Financeiro',
      type: 'chart',
      displaySize: 'large',
      tag: 'Financeiro',
      chartType: PoChartType.Line,
      chartCategories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
      chartSeries: [
        { label: 'Churn Rate (%)', data: [3.2, 2.8, 3.5, 2.1, 1.9, 2.4, 2.0, 1.7, 1.5, 1.3] }
      ]
    },
    {
      id: 'w7',
      title: 'Checklist de Fechamento',
      type: 'routine',
      displaySize: 'extrasmall',
      tag: 'Financeiro'
    },
    {
      id: 'w8',
      title: 'Agenda de Cobrança',
      type: 'actionlist',
      displaySize: 'small',
      tag: 'Financeiro'
    },
    {
      id: 'w9',
      title: 'Alerta de Estoque',
      type: 'bigNumber',
      displaySize: 'extrasmall',
      value: '12 itens',
      tag: 'Estoque'
    },
    {
      id: 'w10',
      title: 'Margem de Contribuição',
      type: 'bigNumber',
      displaySize: 'extrasmall',
      value: 'R$ 9.180',
      tag: 'Financeiro'
    },
    {
      id: 'w11',
      title: 'Performance por Canal',
      type: 'chart',
      displaySize: 'medium',
      tag: 'Financeiro',
      chartType: PoChartType.Donut,
      chartSeries: [
        { label: 'E-commerce', data: 30 },
        { label: 'Loja Física', data: 25 },
        { label: 'Marketplace', data: 19 },
        { label: 'Atacado', data: 15 },
        { label: 'Inside Sales', data: 11 }
      ]
    },
    {
      id: 'w12',
      title: 'Conciliação Bancária',
      type: 'routine',
      displaySize: 'extrasmall',
      tag: 'Financeiro'
    }
  ]);

  /** IDs de todos os cards — necessário para conectar os cdkDropLists */
  allCardIds = computed(() => this.cards().map(card => card.id));

  /** Retorna o span CSS (col e row) resolvido para um card */
  getSpan(card: WidgetCard): CardSpan {
    const size = card.displaySize ?? getDefaultDisplaySize(card.type);
    return DISPLAY_SIZE_SPANS[size];
  }

  /** Estilo inline de grid-column/row para cada card */
  getCardGridStyle(card: WidgetCard): Record<string, string> {
    const span = this.getSpan(card);
    return {
      'grid-column': `span ${span.col}`,
      'grid-row': `span ${span.row}`
    };
  }

  /** Altura do chart proporcional ao span de linhas do card */
  getChartHeight(card: WidgetCard): number {
    const span = this.getSpan(card);
    // 10.8rem por linha, ~17.28px/rem = ~186px; menos o header do widget (~60px)
    const rowHeightPx = 173;
    return span.row * rowHeightPx - 80;
  }

  toggleDense(): void {
    this.isDense.update(v => !v);
  }

  onDrop(event: CdkDragDrop<WidgetCard[]>, targetCard: WidgetCard): void {
    if (event.previousContainer.id === event.container.id) return;

    const sourceId = event.previousContainer.id;
    const targetId = targetCard.id;

    const updated = this.cards().map(c => ({ ...c }));

    const sourceIdx = updated.findIndex(c => c.id === sourceId);
    const targetIdx = updated.findIndex(c => c.id === targetId);

    if (sourceIdx === -1 || targetIdx === -1) return;

    // Swap de widgets — os spans (displaySize) viajam junto com o card
    [updated[sourceIdx], updated[targetIdx]] = [updated[targetIdx], updated[sourceIdx]];

    this.cards.set(updated);
    this.lastAction.set(
      `"${updated[targetIdx].title}" e "${updated[sourceIdx].title}" trocaram de posição`
    );
  }

  onCardActionClick(card: WidgetCard): void {
    this.selectedCard.set(card);
    this.cardModal.open();
  }

  /** Rótulo legível do displaySize para exibição no card */
  getSizeLabel(card: WidgetCard): string {
    const size = card.displaySize ?? getDefaultDisplaySize(card.type);
    const span = DISPLAY_SIZE_SPANS[size];
    return `${span.col}×${span.row}`;
  }
}
