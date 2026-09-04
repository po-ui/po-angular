import { Directive, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { CdkDropList, CdkDragDrop, CdkDragSortEvent, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

import { PoDraggableItem, PoDropEvent } from './interfaces/po-draggable-item.interface';
import { PoDropListBaseDirective } from './po-drop-list-base.directive';

/**
 * @docsExtends PoDropListBaseDirective
 *
 * @description
 *
 * A diretiva `p-drop-list` define um container onde componentes `po-widget` podem ser
 * arrastados e reorganizados, encapsulando o `CdkDropList` do Angular CDK.
 *
 * Permite:
 * - Reordenação de `po-widget` dentro de um único container.
 * - Transferência de `po-widget` entre containers conectados via `p-drop-list-connected-to`.
 * - Itens individuais desabilitados via `p-drag-disabled` na diretiva `p-drag`.
 *
 * > Atualmente esta diretiva é suportada para uso com `po-widget`.
 * > O suporte a outros componentes será avaliado em versões futuras.
 *
 * > A diretiva não impõe nenhum estilo de layout (flex, grid etc.). O layout
 * > é responsabilidade do consumidor.
 */
@Directive({
  selector: '[p-drop-list]',
  exportAs: 'p-drop-list',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkDropList,
      inputs: ['cdkDropListOrientation: p-drop-list-orientation']
    }
  ]
})
export class PoDropListDirective extends PoDropListBaseDirective implements OnInit, OnDestroy {
  private readonly cdkDropList = inject(CdkDropList);
  private readonly subscriptions = new Subscription();
  /** Último índice confirmado pelo evento sorted. Usado para corrigir o currentIndex
   *  do dropped, que pode ficar dessincronizado em listas horizontais com itens de
   *  tamanhos diferentes (ping-pong do CDK). */
  private lastSortedIndex: number | null = null;

  constructor() {
    super();

    effect(() => {
      const disabled = this.dropListDisabled();
      this.cdkDropList.disabled = disabled;
    });

    effect(() => {
      const id = this.dropListId();
      if (id) {
        this.cdkDropList.id = id;
      }
    });

    effect(() => {
      this.cdkDropList.data = this.items();
    });

    effect(() => {
      this.cdkDropList.connectedTo = this.dropListConnectedTo();
    });

    effect(() => {
      this.cdkDropList.sortingDisabled = this.dropSortingDisabled();
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.cdkDropList.sorted.subscribe((event: CdkDragSortEvent<PoDraggableItem>) => {
        this.lastSortedIndex = event.currentIndex;
      })
    );

    this.subscriptions.add(
      this.cdkDropList.dropped.subscribe((event: CdkDragDrop<Array<PoDraggableItem>>) => {
        this.handleDrop(event);
      })
    );

    this.subscriptions.add(
      this.cdkDropList.entered.subscribe(event => {
        const draggedItem = event.item.data;
        this.dragEntered.emit({ item: draggedItem, container: this.cdkDropList.id });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private handleDrop(event: CdkDragDrop<Array<PoDraggableItem>>): void {
    const isSameContainer = event.previousContainer === event.container;

    // Em listas horizontais com itens de tamanhos diferentes, o CDK pode reportar
    // um currentIndex incorreto no evento dropped (ping-pong entre posições).
    // O evento sorted sempre reflete o estado visual correto, então usamos o último
    // índice registrado por ele quando disponível.
    const currentIndex = isSameContainer && this.lastSortedIndex !== null ? this.lastSortedIndex : event.currentIndex;
    this.lastSortedIndex = null;

    if (isSameContainer && event.previousIndex === currentIndex) {
      return;
    }

    // Trabalha com cópias para não mutar os arrays do consumidor.
    // O consumidor deve atualizar seu signal/array com event.items no (p-dropped).
    const currentItems = [...this.items()];

    let reorderedItems: Array<PoDraggableItem>;

    if (isSameContainer) {
      moveItemInArray(currentItems, event.previousIndex, currentIndex);
      reorderedItems = currentItems;
    } else {
      const previousItems = [...event.previousContainer.data];
      transferArrayItem(previousItems, currentItems, event.previousIndex, currentIndex);
      reorderedItems = currentItems;
    }

    const dropped: PoDropEvent = {
      previousIndex: event.previousIndex,
      currentIndex: currentIndex,
      item: reorderedItems[currentIndex],
      items: reorderedItems,
      container: this.cdkDropList.id,
      dropPoint: event.dropPoint
    };

    if (!isSameContainer) {
      dropped.previousContainer = event.previousContainer.id;
    }

    this.dropped.emit(dropped);
  }
}
