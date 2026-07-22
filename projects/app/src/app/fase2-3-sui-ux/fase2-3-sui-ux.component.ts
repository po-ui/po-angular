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
 * Spans de coluna por tipo de card, baseados na grid de 12 colunas do Figma:
 *   compact (bigNumber, routine, actionlist) → 3 cols × 1 row
 *   chart                                   → 4 cols × 2 rows
 *
 * Os spans permitidos por tipo segundo o handoff:
 *   chart:   4 | 6 | 12
 *   compact: 3 | 4 | 6 | 12
 */
export type ColSpanValue = 3 | 4 | 6 | 12;
export type RowSpanValue = 1 | 2;

export interface CardSpan {
  col: ColSpanValue;
  row: RowSpanValue;
}

/**
 * A altura é travada por tipo (regra central do handoff):
 *  - chart    → sempre 2 rows
 *  - demais   → sempre 1 row
 *
 * A largura é adaptável — o colSpan pode ser sobrescrito,
 * mas o rowSpan nunca muda.
 */
export function getDefaultSpan(type: WidgetType, colSpan?: ColSpanValue): CardSpan {
  const row: RowSpanValue = type === 'chart' ? 2 : 1;
  const col: ColSpanValue = colSpan ?? (type === 'chart' ? 4 : 3);
  return { col, row };
}

export interface WidgetCard {
  id: string;
  title: string;
  type: WidgetType;
  /** Largura em colunas (de 12). Opcional — fallback por tipo se ausente. */
  colSpan?: ColSpanValue;
  value?: string;
  tag?: string;
  chartType?: PoChartType;
  chartSeries?: PoChartSerie[];
  chartCategories?: string[];
}

/**
 * Row de 200px conforme Figma Dev Mode:
 *   card compacto: 321.5 × 200  → 3 cols × 1 row
 *   card gráfico:  434 × 400    → 4 cols × 2 rows
 *   gap: 16px nas duas direções
 */
const ROW_HEIGHT_PX = 200;
const GAP_PX = 16;

@Component({
  selector: 'app-fase2-3-sui-ux',
  templateUrl: './fase2-3-sui-ux.component.html',
  styleUrl: './fase2-3-sui-ux.component.css',
  imports: [CommonModule, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder, PoModule]
})
export class Fase23SuiUxComponent {
  @ViewChild('cardModal') cardModal!: PoModalComponent;

  selectedCard = signal<WidgetCard | null>(null);

  isDense = signal(true);

  modalPrimaryAction: PoModalAction = {
    label: 'Fechar',
    action: () => this.cardModal.close()
  };

  lastAction = signal<string>('Nenhum drag realizado ainda.');

  /**
   * Layout espelhando home-brown-delta.vercel.app (conforme imagem):
   *   Row 1 → 4 × compact (span 3)
   *   Row 2 → 2 × chart   (span 6)
   *   Row 3 → 3 × compact (span 4)
   */
  cards = signal<WidgetCard[]>([
    // Row 1 — 4 bigNumbers × 3 cols
    {
      id: 'w1',
      title: 'Receita Projetada',
      type: 'bigNumber',
      colSpan: 3,
      value: 'R$ 12.840,00',
      tag: 'Compras'
    },
    {
      id: 'w2',
      title: 'Custos Operacionais',
      type: 'bigNumber',
      colSpan: 3,
      value: 'R$ 7.340,00',
      tag: 'Compras'
    },
    {
      id: 'w3',
      title: 'Margem de Contribuição',
      type: 'bigNumber',
      colSpan: 3,
      value: 'R$ 9.180,00',
      tag: 'Financeiro'
    },
    {
      id: 'w4',
      title: 'Índice de Inadimplência',
      type: 'bigNumber',
      colSpan: 3,
      value: 'R$ 3.120,00',
      tag: 'Financeiro'
    },

    // Row 2 — 2 charts × 6 cols
    {
      id: 'w5',
      title: 'Performance por Canal',
      type: 'chart',
      colSpan: 6,
      tag: 'Financeiro',
      chartType: PoChartType.Donut,
      chartSeries: [
        { label: 'E-commerce',   data: 30 },
        { label: 'Loja Física',  data: 25 },
        { label: 'Marketplace',  data: 19 },
        { label: 'Atacado',      data: 15 },
        { label: 'Inside Sales', data: 11 }
      ]
    },
    {
      id: 'w6',
      title: 'Pipeline de Atendimentos',
      type: 'chart',
      colSpan: 6,
      tag: 'Financeiro',
      chartType: PoChartType.Pie,
      chartSeries: [
        { label: 'Novas',         data: 36 },
        { label: 'Em tratamento', data: 29 },
        { label: 'Finalizadas',   data: 22 },
        { label: 'Reabertas',     data: 13 }
      ]
    },

    // Row 3 — 3 compactos × 4 cols
    {
      id: 'w7',
      title: 'Conciliação Bancária',
      type: 'routine',
      colSpan: 4,
      tag: 'Financeiro'
    },
    {
      id: 'w8',
      title: 'Cadastro de Fornecedores',
      type: 'routine',
      colSpan: 4,
      tag: 'Compras'
    },
    {
      id: 'w9',
      title: 'Agenda de Cobrança',
      type: 'actionlist',
      colSpan: 4,
      tag: 'Financeiro'
    }
  ]);

  /** IDs de todos os cards — necessário para conectar os cdkDropLists */
  allCardIds = computed(() => this.cards().map(card => card.id));

  /** Retorna o span resolvido para um card, com rowSpan travado por tipo */
  getSpan(card: WidgetCard): CardSpan {
    return getDefaultSpan(card.type, card.colSpan);
  }

  /**
   * Estilo inline de grid-column/row para cada card.
   * Na grid de 12 colunas, o span de coluna é direto.
   * O span de linha (rowSpan) é travado por tipo — chart=2, demais=1.
   */
  getCardGridStyle(card: WidgetCard): Record<string, string> {
    const span = this.getSpan(card);
    return {
      'grid-column': `span ${span.col}`,
      'grid-row':    `span ${span.row}`
    };
  }

  /**
   * Altura do chart em px, derivada do número de rows que o card ocupa.
   * row=2 → 2 × 200px + 1 gap de 16px − overhead do header/footer do po-widget (~68px)
   */
  getChartHeight(card: WidgetCard): number {
    const span = this.getSpan(card);
    return span.row * ROW_HEIGHT_PX + (span.row - 1) * GAP_PX - 68;
  }

  /** Label de debug para exibição no card (col × row) */
  getSpanLabel(card: WidgetCard): string {
    const span = this.getSpan(card);
    return `${span.col}×${span.row}`;
  }

  toggleDense(): void {
    this.isDense.update(v => !v);
  }

  /**
   * Swap completo de cards no drop.
   * O colSpan viaja junto com o card — a largura é propriedade do conteúdo.
   * O rowSpan não precisa viajar pois é derivado do tipo.
   *
   * Regra de segurança: se origem === destino, nenhuma mudança é persistida.
   */
  onDrop(event: CdkDragDrop<WidgetCard[]>, targetCard: WidgetCard): void {
    if (event.previousContainer.id === event.container.id) return;

    const sourceId = event.previousContainer.id;
    const updated = this.cards().map(c => ({ ...c }));

    const sourceIdx = updated.findIndex(c => c.id === sourceId);
    const targetIdx = updated.findIndex(c => c.id === targetCard.id);

    if (sourceIdx === -1 || targetIdx === -1) return;

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
}
