import { AnimationCallbackEvent, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { PoTreeViewService } from '../services/po-tree-view.service';
import { PoTreeViewItem } from './po-tree-view-item.interface';

@Component({
  selector: '[po-tree-view-item]',
  templateUrl: './po-tree-view-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoTreeViewItemComponent {
  private readonly treeViewService = inject(PoTreeViewService);

  readonly componentsSize = input<string>(undefined, { alias: 'p-components-size' });

  readonly item = input<PoTreeViewItem>(undefined, { alias: 'p-item' });

  readonly level = input<number>(0, { alias: 'p-level' });

  readonly selectable = input<boolean>(false, { alias: 'p-selectable' });

  readonly selectedValue = input<string | number>(undefined, { alias: 'p-selected-value' });

  readonly singleSelect = input<boolean>(false, { alias: 'p-single-select' });

  protected animateEnter(event: AnimationCallbackEvent): void {
    this.animateHeight(event, '0px', `${(event.target as HTMLElement).scrollHeight}px`);
  }

  protected animateLeave(event: AnimationCallbackEvent): void {
    this.animateHeight(event, `${(event.target as HTMLElement).scrollHeight}px`, '0px');
  }

  protected get hasSubItems() {
    const item = this.item();
    return !!item?.subItems?.length;
  }

  protected onClick() {
    const item = this.item();
    item.expanded = !item.expanded;

    this.treeViewService.emitExpandedEvent({ ...item });
  }

  protected onSelect(selectedItem: PoTreeViewItem) {
    this.treeViewService.emitSelectedEvent({ ...selectedItem });
  }

  protected onActivate(activatedItem: PoTreeViewItem) {
    this.treeViewService.emitActivatedEvent({ ...activatedItem });
  }

  protected trackByFunction(index: number) {
    return index;
  }

  private animateHeight(event: AnimationCallbackEvent, from: string, to: string): void {
    const element = event.target as HTMLElement;
    const previousOverflow = element.style.overflow;
    element.style.overflow = 'hidden';

    const animation = element.animate([{ height: from }, { height: to }], {
      duration: 200,
      easing: 'linear'
    });

    animation.onfinish = () => {
      element.style.overflow = previousOverflow;
      event.animationComplete();
    };
  }
}
