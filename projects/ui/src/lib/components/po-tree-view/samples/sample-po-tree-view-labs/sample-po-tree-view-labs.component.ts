import { Component, OnInit } from '@angular/core';

import { PoSelectOption, PoTreeViewItem } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-tree-view-labs',
  templateUrl: 'sample-po-tree-view-labs.component.html'
})
export class SamplePoTreeViewLabsComponent implements OnInit {

  event: string;
  items: Array<PoTreeViewItem>;
  parent: string;
  parentList: Array<PoSelectOption>;
  treeViewItem: PoTreeViewItem;

  ngOnInit() {
    this.restore();
  }

  add(treeViewItem: PoTreeViewItem) {
    const treeViewItemClone = { ...treeViewItem };

    if (!this.parent) {
      this.items = [ ...this.items, treeViewItemClone ];
    } else {
      const treeViewItemNode = this.getTreeViewItemNode(this.items, this.parent);

      if (!treeViewItemNode.subItems) {
        treeViewItemNode.subItems = [];
      }

      treeViewItemNode.subItems = [ ...treeViewItemNode.subItems, treeViewItemClone ];
    }

    this.items = [].concat(this.items);
    this.parentList = this.updateParentList(this.items);
  }

  changeEvent(event: string, treeViewItem: PoTreeViewItem) {
    this.event = `${event}: ${JSON.stringify(treeViewItem)}`;
  }

  restore() {
    this.event = undefined;
    this.items = [];
    this.parent = undefined;
    this.parentList = [];
    this.treeViewItem = <any> {};
  }

  private getTreeViewItemNode(items: Array<PoTreeViewItem>, value: string) {
    let treeViewItemNode: PoTreeViewItem;

    if (!items) {
      return;
    }

    for (const item of items) {
      if (item.value === value) {
        treeViewItemNode = item;
        break;
      } else if (!treeViewItemNode) {
        treeViewItemNode = this.getTreeViewItemNode(item.subItems, value);
      }
    }

    return treeViewItemNode;
  }

  private updateParentList(items: Array<PoTreeViewItem>, level = 0, parentList = [], parentItem?: PoTreeViewItem): Array<PoSelectOption> {

    items.forEach(item => {
      const { label, value } = item;

      parentList.push({ label: `${'-'.repeat(level)} ${label}`, value });

      if (item.subItems) {
        this.updateParentList(item.subItems, ++level, parentList, item);
        --level;
      }

      level = !parentItem ? 0 : level;
    });

    return parentList;
  }

}
