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
  // Dados para widgets do tipo chart
  chartType?: PoChartType;
  chartSeries?: PoChartSerie[];
  chartCategories?: string[];
}

export interface GridCell {
  colClass: string;
  widget: WidgetContent;
}

@Component({
  selector: 'app-fase2-cdk-widget',
  templateUrl: './fase2-cdk-widget.component.html',
  styleUrl: './fase2-cdk-widget.component.css',
  imports: [CommonModule, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder, PoModule]
})
export class Fase2CdkWidgetComponent {
  @ViewChild('widgetModal') widgetModal!: PoModalComponent;

  selectedWidget = signal<WidgetContent | null>(null);

  modalPrimaryAction: PoModalAction = {
    label: 'Fechar',
    action: () => this.widgetModal.close()
  };

  lastAction = signal<string>('Nenhum drag realizado ainda.');

  cells = signal<GridCell[]>([
    // Linha 1: big numbers
    {
      colClass: 'po-xl-3 po-lg-6',
      widget: { id: '1', title: 'Faturamento do mês', type: 'bigNumber', value: 'R$ 128.450', tag: 'Compras' }
    },
    {
      colClass: 'po-xl-3 po-lg-6',
      widget: { id: '2', title: 'Ticket médio', type: 'bigNumber', value: 'R$ 342', tag: 'Financeiro' }
    },
    {
      colClass: 'po-xl-3 po-lg-6',
      widget: { id: '3', title: 'Índice de inadimplência', type: 'bigNumber', value: 'R$ 3.120', tag: 'Financeiro' }
    },
    {
      colClass: 'po-xl-3 po-lg-6',
      widget: { id: '4', title: 'Margem de Contribuição', type: 'bigNumber', value: 'R$ 9.180', tag: 'Financeiro' }
    },
    // Linha 2: gráfico de colunas — tendência de faturamento
    {
      colClass: 'po-xl-6 po-lg-6',
      widget: {
        id: '5',
        title: 'Tendência de Faturamento',
        type: 'chart',
        tag: 'Financeiro',
        chartType: PoChartType.Column,
        chartCategories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        chartSeries: [
          { label: 'Receita', data: [42, 58, 51, 73, 66, 85] },
          { label: 'Despesa', data: [30, 40, 38, 52, 47, 61] }
        ]
      }
    },
    // Linha 2: gráfico de donut — performance por canal
    {
      colClass: 'po-xl-6 po-lg-6',
      widget: {
        id: '6',
        title: 'Performance por Canal',
        type: 'chart',
        tag: 'Financeiro',
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
    // Linha 3: gráfico de linha — evolução de churn
    {
      colClass: 'po-xl-8 po-lg-8',
      widget: {
        id: '7',
        title: 'Evolução de Churn',
        type: 'chart',
        tag: 'Financeiro',
        chartType: PoChartType.Line,
        chartCategories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
        chartSeries: [
          { label: 'Churn Rate (%)', data: [3.2, 2.8, 3.5, 2.1, 1.9, 2.4, 2.0, 1.7, 1.5, 1.3] }
        ]
      }
    },
    // Linha 3: rotinas
    {
      colClass: 'po-xl-4 po-lg-4',
      widget: { id: '8', title: 'Pendências de Aprovação', type: 'routine', tag: 'Compras' }
    }
  ]);

  cellsAsList = computed(() => this.cells().map(cell => [cell.widget]));
  allListIds = computed(() => this.cells().map((_, i) => `cell-${i}`));

  getListId(index: number): string {
    return `cell-${index}`;
  }

  onDrop(event: CdkDragDrop<WidgetContent[]>, targetIndex: number): void {
    console.log('previousContainer: ', event.previousContainer);
    console.log('container: ', event.container);
    console.log('targetIndex - pra onde ele vai', targetIndex);
    if (event.previousContainer.id === event.container.id) return;

    const sourceIndex = this.allListIds().indexOf(event.previousContainer.id); // pega o index do card de origem
    if (sourceIndex === -1) return;

    console.log('cells ', this.cells());
    const updated = this.cells().map(cell => ({ ...cell }));
    console.log('updated ', updated);
    const temp = updated[sourceIndex];
    console.log('temp ', temp);

    // altera a ordem dos cards
    updated[sourceIndex] = updated[targetIndex];
    updated[targetIndex] = temp;

    // atualiza células
    this.cells.set(updated);
    console.log('cells atualizado ', this.cells());
    this.lastAction.set(
      `"${updated[targetIndex].widget.title}" e "${updated[sourceIndex].widget.title}" trocaram de posição`
    );
  }

  onWidgetActionClick(widget: WidgetContent): void {
    this.selectedWidget.set(widget);
    this.widgetModal.open();
  }
}

