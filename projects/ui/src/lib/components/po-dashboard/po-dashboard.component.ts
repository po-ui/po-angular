import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, computed, signal } from '@angular/core';

import { PoDashboardCard } from './interfaces/po-dashboard-card.interface';
import { PoDashboardBaseComponent } from './po-dashboard-base.component';

const PO_DASHBOARD_DISPLAY_SIZE_COL_SPAN: Record<string, number> = {
  extrasmall: 1,
  small: 1,
  medium: 2,
  large: 3,
  extralarge: 4
};

const PO_DASHBOARD_DISPLAY_SIZE_ROW_SPAN: Record<string, number> = {
  extrasmall: 1,
  small: 2,
  medium: 2,
  large: 2,
  extralarge: 2
};

/**
 * @docsExtends PoDashboardBaseComponent
 *
 * @example
 *
 * <example name="po-dashboard-basic" title="PO Dashboard Basic">
 *   <file name="sample-po-dashboard-basic/sample-po-dashboard-basic.component.html"> </file>
 *   <file name="sample-po-dashboard-basic/sample-po-dashboard-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-dashboard-labs" title="PO Dashboard Labs">
 *   <file name="sample-po-dashboard-labs/sample-po-dashboard-labs.component.html"> </file>
 *   <file name="sample-po-dashboard-labs/sample-po-dashboard-labs.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-dashboard',
  templateUrl: './po-dashboard.component.html',
  standalone: false
})
export class PoDashboardComponent extends PoDashboardBaseComponent {
  /** @internal lista interna mutável para suportar reordenação sem mutar o input diretamente */
  protected internalCards = signal<Array<PoDashboardCard>>([]);

  /** @internal computed que sincroniza internalCards com o input p-cards */
  protected syncedCards = computed(() => {
    const inputCards = this.cards();
    this.internalCards.set([...inputCards]);
    return inputCards;
  });

  protected getColSpan(card: PoDashboardCard): number {
    return PO_DASHBOARD_DISPLAY_SIZE_COL_SPAN[card.displaySize ?? 'extrasmall'] ?? 1;
  }

  protected getRowSpan(card: PoDashboardCard): number {
    return PO_DASHBOARD_DISPLAY_SIZE_ROW_SPAN[card.displaySize ?? 'extrasmall'] ?? 1;
  }

  protected onDrop(event: CdkDragDrop<Array<PoDashboardCard>>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const reordered = [...this.internalCards()];
    moveItemInArray(reordered, event.previousIndex, event.currentIndex);
    this.internalCards.set(reordered);

    this.cardsReorder.emit({
      cards: reordered,
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex
    });
  }
}
