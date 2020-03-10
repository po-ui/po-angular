import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { PoTreeViewItem } from '../po-tree-view-item/po-tree-view-item.interface';

@Injectable()
export class PoTreeViewService {
  private expandedEvent = new Subject<PoTreeViewItem>();
  private selectedEvent = new Subject<PoTreeViewItem>();

  emitExpandedEvent(treeViewItem: PoTreeViewItem) {
    return this.expandedEvent.next(treeViewItem);
  }

  emitSelectedEvent(treeViewItem: PoTreeViewItem) {
    return this.selectedEvent.next(treeViewItem);
  }

  onExpand() {
    return this.expandedEvent.asObservable();
  }

  onSelect() {
    return this.selectedEvent.asObservable();
  }
}
