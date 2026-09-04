import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PoCheckboxGroupOption, PoRadioGroupOption, PoSelectOption, PoTreeViewItem } from 'projects/ui/src/public-api';

@Component({
  selector: 'sample-po-tree-view-labs',
  templateUrl: 'sample-po-tree-view-labs.component.html',
  standalone: false
})
export class SamplePoTreeViewLabsComponent implements OnInit {
  componentsSize: string = 'medium';
  disabled: boolean = false;
  event: string;
  items: Array<PoTreeViewItem>;
  itemProperties: Array<string>;
  maxLevel: number = 4;
  parent: string;
  parentList: Array<PoSelectOption>;
  selectable: boolean = false;
  singleSelect: boolean = false;
  treeViewItem: PoTreeViewItem;

  readonly componentsSizeOptions: Array<PoRadioGroupOption> = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' }
  ];

  readonly itemPropertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'disabled', label: 'Disabled' },
    { value: 'expanded', label: 'Expanded' },
    { value: 'selected', label: 'Selected' },
    { value: 'showIcon', label: 'Show Icon' }
  ];

  ngOnInit() {
    this.restore();
  }

  add(treeViewItem: PoTreeViewItem) {
    treeViewItem.disabled = this.itemProperties.includes('disabled');
    treeViewItem.expanded = this.itemProperties.includes('expanded');
    treeViewItem.selected = this.itemProperties.includes('selected');
    treeViewItem.showIcon = this.itemProperties.includes('showIcon');

    const treeViewItemClone = { ...treeViewItem };

    if (!this.parent) {
      this.items = [...this.items, treeViewItemClone];
    } else {
      const treeViewItemNode = this.getTreeViewItemNode(this.items, this.parent);

      treeViewItemNode.subItems ??= [];

      treeViewItemNode.subItems = [...treeViewItemNode.subItems, treeViewItemClone];
    }

    this.items = this.items.flat();
    this.parentList = this.updateParentList(this.items);
  }

  addItem(treeViewItemForm: NgForm) {
    this.add(this.treeViewItem);
    treeViewItemForm.reset();
    this.itemProperties = [];
  }

  changeEvent(event: string, treeViewItem: PoTreeViewItem) {
    this.event = `${event}: ${JSON.stringify(treeViewItem)}`;
  }

  restore() {
    this.componentsSize = 'medium';
    this.disabled = false;
    this.event = undefined;
    this.items = [];
    this.itemProperties = [];
    this.maxLevel = 4;
    this.parent = undefined;
    this.parentList = [];
    this.selectable = false;
    this.singleSelect = false;
    this.treeViewItem = <any>{};
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

  private updateParentList(
    items: Array<PoTreeViewItem>,
    level = 0,
    parentList = [],
    parentItem?: PoTreeViewItem
  ): Array<PoSelectOption> {
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
