import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  CdkDragHandle,
  CdkDragPlaceholder,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { PoModule } from 'projects/ui/src/lib';

export type CardType = 'bigNumber' | 'chart' | 'routine';

export interface CardItem {
  id: string;
  title: string;
  type: CardType;
  // Campo só pra simular algum conteúdo variável dentro do card durante a POC.
  value?: string;
}

@Component({
  selector: 'app-fase1-cdk-puro',
  templateUrl: './fase1-cdk-puro.component.html',
  styleUrl:  './fase1-cdk-puro.component.css',
  imports: [CommonModule, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder, PoModule]
})
export class Fase1CdkPuroComponent {
  // Mock inicial. Tipo aqui só serve pra POC visual (cor/borda), não tem
  // relação nenhuma ainda com tamanho real de grid.
  cardsWholeDrag = signal<CardItem[]>([
    { id: '1', title: 'Faturamento do mês', type: 'bigNumber', value: 'R$ 128.450' },
    { id: '2', title: 'Vendas por região', type: 'chart' },
    { id: '3', title: 'Pendências de aprovação', type: 'routine', value: '12 itens' },
    { id: '4', title: 'Ticket médio', type: 'bigNumber', value: 'R$ 342' },
    { id: '5', title: 'Evolução de churn', type: 'chart' }
  ]);

  cardsHandleDrag = signal<CardItem[]>([
    { id: '6', title: 'Faturamento do mês', type: 'bigNumber', value: 'R$ 128.450' },
    { id: '7', title: 'Vendas por região', type: 'chart' },
    { id: '8', title: 'Pendências de aprovação', type: 'routine', value: '12 itens' },
    { id: '9', title: 'Ticket médio', type: 'bigNumber', value: 'R$ 342' },
    { id: '10', title: 'Evolução de churn', type: 'chart' }
  ]);

  lastAction = signal<string>('Nenhum drag realizado ainda.');

  dropWholeCard(event: CdkDragDrop<CardItem[]>): void {
    this.reorder(this.cardsWholeDrag, event);
  }

  dropHandleCard(event: CdkDragDrop<CardItem[]>): void {
    this.reorder(this.cardsHandleDrag, event);
  }

  // Simula um "clique em ação do card" pra provar que, na lista com handle,
  // o clique não é engolido pelo drag.
  onCardActionClick(card: CardItem): void {
    this.lastAction.set(`Ação clicada no card "${card.title}" às ${new Date().toLocaleTimeString()}`);
  }

  private reorder(cardsSignal: typeof this.cardsWholeDrag, event: CdkDragDrop<CardItem[]>): void {
    const updated = [...cardsSignal()];
    moveItemInArray(updated, event.previousIndex, event.currentIndex);
    cardsSignal.set(updated);

    // Esse é o formato que a lib provavelmente vai querer emitir no futuro
    // via @Output(), ex: (p-sort)="onSort($event)"
    this.lastAction.set(
      `Reordenado: "${updated[event.currentIndex].title}" moveu da posição ${event.previousIndex} para ${event.currentIndex}`
    );
  }

  teste(event: any): void {
    console.log(event);
  }
}
