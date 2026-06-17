import { AnimationCallbackEvent, ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';

import { PoTreeViewService } from '../services/po-tree-view.service';
import { PoTreeViewItem } from './po-tree-view-item.interface';

@Component({
  selector: 'po-tree-view-item',
  templateUrl: './po-tree-view-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoTreeViewItemComponent {
  private readonly treeViewService = inject(PoTreeViewService);

  @Input('p-components-size') componentsSize: string;

  @Input('p-item') item: PoTreeViewItem;

  @Input('p-selectable') selectable: boolean;

  @Input('p-single-select') singleSelect: boolean;

  @Input('p-selected-value') selectedValue: string | number;

  get hasSubItems() {
    return !!(this.item.subItems && this.item.subItems.length);
  }

  onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.item.expanded = !this.item.expanded;

    this.treeViewService.emitExpandedEvent({ ...this.item });
  }

  onSelect(selectedItem: PoTreeViewItem) {
    this.treeViewService.emitSelectedEvent({ ...selectedItem });
  }

  trackByFunction(index: number) {
    return index;
  }

  animateEnter(event: AnimationCallbackEvent): void {
    const element = event.target as HTMLElement;
    const height = element.scrollHeight;
    const previousOverflowY = element.style.overflowY;
    element.style.overflowY = 'hidden';

    // Sequência equivalente à animação legada: height 0 -> auto (200ms) e, em seguida, opacity 0 -> 1 (100ms).
    const animation = element.animate(
      [
        { height: '0px', opacity: 0, offset: 0 },
        { height: `${height}px`, opacity: 0, offset: 0.6667 },
        { height: `${height}px`, opacity: 1, offset: 1 }
      ],
      { duration: 300, easing: 'linear' }
    );

    animation.onfinish = () => {
      element.style.overflowY = previousOverflowY;
      event.animationComplete();
    };
  }

  animateLeave(event: AnimationCallbackEvent): void {
    const element = event.target as HTMLElement;
    const height = element.scrollHeight;
    const previousOverflowY = element.style.overflowY;
    element.style.overflowY = 'hidden';

    // Sequência equivalente à animação legada: height auto -> 0 (200ms) e, em seguida, opacity 1 -> 0 (100ms).
    const animation = element.animate(
      [
        { height: `${height}px`, opacity: 1, offset: 0 },
        { height: '0px', opacity: 1, offset: 0.6667 },
        { height: '0px', opacity: 0, offset: 1 }
      ],
      { duration: 300, easing: 'linear' }
    );

    animation.onfinish = () => {
      element.style.overflowY = previousOverflowY;
      event.animationComplete();
    };
  }
}
