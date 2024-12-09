import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PoTreeViewItem } from './po-tree-view-item.interface';
import { PoTreeViewService } from '../services/po-tree-view.service';

@Component({
  selector: 'po-tree-view-item',
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
  @Input('p-item') item: PoTreeViewItem;

  @Input('p-selectable') selectable: boolean;

  @Input('p-single-select') singleSelect: boolean;

  @Input('p-selected-value') selectedValue: string | number;

  get hasSubItems() {
    return !!(this.item.subItems && this.item.subItems.length);
  }

  constructor(private treeViewService: PoTreeViewService) {}

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
}
