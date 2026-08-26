import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { PoTreeViewService } from '../services/po-tree-view.service';
import { PoTreeViewItem } from './po-tree-view-item.interface';

@Component({
  selector: '[po-tree-view-item]',
  templateUrl: './po-tree-view-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toggleBody', [
      transition(':enter', [
        style({
          'overflow-y': 'hidden',
          visibility: 'hidden',
          opacity: 0,
          height: '0'
        }),
        animate(200, style({ height: '*' })),
        animate(100, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({
          'overflow-y': 'hidden',
          visibility: 'visible',
          opacity: 1,
          height: '*'
        }),
        animate(200, style({ height: 0 })),
        animate(100, style({ opacity: 0 }))
      ])
    ])
  ],
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

  get hasSubItems() {
    const item = this.item();
    return !!item?.subItems?.length;
  }

  onClick() {
    const item = this.item();
    item.expanded = !item.expanded;

    this.treeViewService.emitExpandedEvent({ ...item });
  }

  onSelect(selectedItem: PoTreeViewItem) {
    this.treeViewService.emitSelectedEvent({ ...selectedItem });
  }

  onActivate(activatedItem: PoTreeViewItem) {
    this.treeViewService.emitActivatedEvent({ ...activatedItem });
  }

  trackByFunction(index: number) {
    return index;
  }
}
