import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { PoTreeViewItem } from '../po-tree-view-item/po-tree-view-item.interface';

@Injectable()
export class PoTreeViewService {

  private event = new Subject<PoTreeViewItem>();

  emitEvent(treeViewItem: PoTreeViewItem) {
    return this.event.next(treeViewItem);
  }

  receiveEvent() {
    return this.event.asObservable();
  }

}
