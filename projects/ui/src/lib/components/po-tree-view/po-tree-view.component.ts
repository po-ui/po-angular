import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { PoTreeViewBaseComponent } from './po-tree-view-base.component';
import { PoTreeViewItem } from './po-tree-view-item/po-tree-view-item.interface';
import { PoTreeViewService } from './services/po-tree-view.service';

/**
 * @docsExtends PoTreeViewBaseComponent
 *
 * @example
 *
 * <example name="po-tree-view-basic" title="PO Tree View Basic">
 *  <file name="sample-po-tree-view-basic/sample-po-tree-view-basic.component.html"> </file>
 *  <file name="sample-po-tree-view-basic/sample-po-tree-view-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-tree-view-labs" title="PO Tree View Labs">
 *  <file name="sample-po-tree-view-labs/sample-po-tree-view-labs.component.html"> </file>
 *  <file name="sample-po-tree-view-labs/sample-po-tree-view-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-tree-view-folder-structure" title="PO Tree View - Folder Structure">
 *  <file name="sample-po-tree-view-folder-structure/sample-po-tree-view-folder-structure.component.html"> </file>
 *  <file name="sample-po-tree-view-folder-structure/sample-po-tree-view-folder-structure.component.ts"> </file>
 * </example>
 *
 * <example name="po-tree-view-supermarket" title="PO Tree View - Supermarket">
 *  <file name="sample-po-tree-view-supermarket/sample-po-tree-view-supermarket.component.html"> </file>
 *  <file name="sample-po-tree-view-supermarket/sample-po-tree-view-supermarket.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-tree-view',
  templateUrl: './po-tree-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PoTreeViewService]
})
export class PoTreeViewComponent extends PoTreeViewBaseComponent implements OnInit {
  get hasItems() {
    return !!(this.items && this.items.length);
  }

  constructor(private treeViewService: PoTreeViewService) {
    super();
  }

  ngOnInit() {
    this.treeViewService.onExpand().subscribe((treeViewItem: PoTreeViewItem) => {
      this.emitExpanded(treeViewItem);
    });

    this.treeViewService.onSelect().subscribe((treeViewItem: PoTreeViewItem) => {
      this.emitSelected(treeViewItem);
    });
  }

  trackByFunction(index: number) {
    return index;
  }
}
