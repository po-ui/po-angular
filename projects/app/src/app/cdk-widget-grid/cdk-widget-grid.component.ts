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

export type WidgetType = 'bigNumber' | 'chart' | 'routine';

export interface WidgetContent {
  id: string;
  title: string;
  type: WidgetType;
  value?: string;
  tag?: string;
  chartType?: PoChartType;
  chartSeries?: PoChartSerie[];
  chartCategories?: string[];
}

// Uma linha da grade: array de células, cada célula com largura e conteúdo
export interface GridCell {
  id: string;           // ID único da célula (usado como cdkDropList id)
  colSpan: number;      // Número de colunas no grid de 12 (ex: 4, 6, 8)
  widget: WidgetContent | null; // null = slot vazio
}

export interface GridRow {
  id: string;
  cells: GridCell[];
}

@Component({
  selector: 'app-cdk-widget-grid',
  templateUrl: './cdk-widget-grid.component.html',
  styleUrl: './cdk-widget-grid.component.css',
  imports: [CommonModule, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder, PoModule]
})
export class CdkWidgetGridComponent {
  @ViewChild('widgetModal') widgetModal!: PoModalComponent;

  selectedWidget = signal<WidgetContent | null>(null);

  modalPrimaryAction: PoModalAction = {
    label: 'Fechar',
    action: () => this.widgetModal.close()
  };

  lastAction = signal<string>('Nenhum drag realizado ainda.');

  rows = signal<GridRow[]>([
    {
      id: 'row-0',
      cells: [
        {
          id: 'cell-0-0', colSpan: 8,
          widget: {
            id: 'w1', title: 'Tendência de Faturamento', type: 'chart', tag: 'Financeiro',
            chartType: PoChartType.Column,
            chartCategories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            chartSeries: [
              { label: 'Receita', data: [42, 58, 51, 73, 66, 85] },
              { label: 'Despesa', data: [30, 40, 38, 52, 47, 61] }
            ]
          }
        },
        {
          id: 'cell-0-1', colSpan: 4,
          widget: { id: 'w2', title: 'Faturamento do mês', type: 'bigNumber', value: 'R$ 128.450', tag: 'Compras' }
        }
      ]
    },
    {
      id: 'row-1',
      cells: [
        {
          id: 'cell-1-0', colSpan: 4,
          widget: { id: 'w3', title: 'Ticket médio', type: 'bigNumber', value: 'R$ 342', tag: 'Financeiro' }
        },
        {
          id: 'cell-1-1', colSpan: 4,
          widget: { id: 'w4', title: 'Índice de inadimplência', type: 'bigNumber', value: 'R$ 3.120', tag: 'Financeiro' }
        },
        {
          id: 'cell-1-2', colSpan: 4,
          widget: { id: 'w5', title: 'Margem de Contribuição', type: 'bigNumber', value: 'R$ 9.180', tag: 'Financeiro' }
        }
      ]
    },
    {
      id: 'row-2',
      cells: [
        {
          id: 'cell-2-0', colSpan: 6,
          widget: {
            id: 'w6', title: 'Performance por Canal', type: 'chart', tag: 'Financeiro',
            chartType: PoChartType.Donut,
            chartSeries: [
              { label: 'E-commerce', data: 30 },
              { label: 'Loja Física', data: 25 },
              { label: 'Marketplace', data: 19 },
              { label: 'Atacado', data: 15 },
              { label: 'Inside Sales', data: 11 }
            ]
          }
        },
        {
          id: 'cell-2-1', colSpan: 6,
          widget: {
            id: 'w7', title: 'Evolução de Churn', type: 'chart', tag: 'Financeiro',
            chartType: PoChartType.Line,
            chartCategories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
            chartSeries: [
              { label: 'Churn Rate (%)', data: [3.2, 2.8, 3.5, 2.1, 1.9, 2.4, 2.0, 1.7, 1.5, 1.3] }
            ]
          }
        }
      ]
    },
    {
      id: 'row-3',
      cells: [
        {
          id: 'cell-3-0', colSpan: 4,
          widget: { id: 'w8', title: 'Pendências de Aprovação', type: 'routine', tag: 'Compras' }
        },
        {
          id: 'cell-3-1', colSpan: 4,
          widget: { id: 'w9', title: 'Conciliação Bancária', type: 'routine', tag: 'Financeiro' }
        },
        {
          id: 'cell-3-2', colSpan: 4,
          widget: { id: 'w10', title: 'Agenda de Cobrança', type: 'routine', tag: 'Financeiro' }
        }
      ]
    }
  ]);

  // IDs de todas as células — necessário para conectar os cdkDropLists entre si
  allCellIds = computed(() =>
    this.rows().flatMap(row => row.cells.map(cell => cell.id))
  );

  getChartHeight(row: GridRow, cell: GridCell): number {
    const hasChart = row.cells.some(c => c.widget?.type === 'chart');
    const hasBigNumber = row.cells.some(c => c.widget?.type === 'bigNumber');

    if (hasChart && hasBigNumber) {
      return 240;
    }

    const minHeight = 160;
    const maxHeight = 320;
    return Math.round(minHeight + ((cell.colSpan - 3) / (12 - 3)) * (maxHeight - minHeight));
  }

  getBigNumberStackHeight(row: GridRow): number {
    const hasChart = row.cells.some(c => c.widget?.type === 'chart');
    if (!hasChart) return 0;

    const bigNumberCount = row.cells.filter(c => c.widget?.type === 'bigNumber').length;
    const chartHeight = 240;
    return Math.round(chartHeight / bigNumberCount);
  }

  onDrop(event: CdkDragDrop<WidgetContent[]>): void {
    if (event.previousContainer === event.container) return;

    const sourceId = event.previousContainer.id;
    const targetId = event.container.id;

    const updatedRows = this.rows().map(row => ({
      ...row,
      cells: row.cells.map(cell => ({ ...cell }))
    }));

    // Encontra as células de origem e destino
    let sourceCell: GridCell | undefined;
    let targetCell: GridCell | undefined;

    for (const row of updatedRows) {
      for (const cell of row.cells) {
        if (cell.id === sourceId) sourceCell = cell;
        if (cell.id === targetId) targetCell = cell;
      }
    }

    if (!sourceCell || !targetCell) return;

    // Swap do conteúdo (widget) — o colSpan da célula permanece fixo
    const temp = sourceCell.widget;
    sourceCell.widget = targetCell.widget;
    targetCell.widget = temp;

    this.rows.set(updatedRows);

    const moved = targetCell.widget;
    this.lastAction.set(moved
      ? `"${moved.title}" moveu para ${targetId}`
      : `Widget removido de ${targetId}`
    );
  }

  onWidgetActionClick(widget: WidgetContent): void {
    this.selectedWidget.set(widget);
    this.widgetModal.open();
  }

  // Determina se a linha é "mista" — tem chart e bigNumber juntos
  isMixedRow(row: GridRow): boolean {
    const types = new Set(row.cells.map(c => c.widget?.type).filter(Boolean));
    return types.has('chart') && types.has('bigNumber');
  }

  // Coleta os bigNumbers de uma linha mista em grupos de subgrid
  getBigNumbersInRow(row: GridRow): (GridCell | null)[] {
    const cells = row.cells.filter(c => c.widget?.type === 'bigNumber');
    // Garante no mínimo 2 slots na stack — se tiver 1, adiciona slot vazio
    if (cells.length === 1) {
      return [cells[0], null];
    }
    return cells;
  }

  getChartsInRow(row: GridRow): GridCell[] {
    return row.cells.filter(c => c.widget?.type === 'chart');
  }
}
