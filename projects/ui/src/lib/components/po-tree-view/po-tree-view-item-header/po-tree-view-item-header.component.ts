import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { PoTreeViewItem } from '../po-tree-view-item/po-tree-view-item.interface';

@Component({
  selector: 'po-tree-view-item-header',
  templateUrl: './po-tree-view-item-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoTreeViewItemHeaderComponent {
  @ViewChild('inputCheckbox') inputCheckbox;

  @Input('p-item') item: PoTreeViewItem;

  @Input('p-selectable') selectable: boolean = false;

  @Output('p-expanded') expanded = new EventEmitter<MouseEvent>();

  @Output('p-selected') selected = new EventEmitter<any>();

  get hasSubItems() {
    return !!(this.item.subItems && this.item.subItems.length);
  }
}
