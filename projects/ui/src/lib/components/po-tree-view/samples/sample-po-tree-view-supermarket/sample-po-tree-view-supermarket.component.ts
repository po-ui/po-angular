import { Component, ViewChild } from '@angular/core';

import { PoStepperComponent, PoTableColumn, PoTreeViewItem } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-tree-view-supermarket',
  templateUrl: 'sample-po-tree-view-supermarket.component.html'
})
export class SamplePoTreeViewSupermarketComponent {
  columnsItemsSelected: Array<PoTableColumn> = [{ property: 'item' }];
  confirmed: boolean = false;
  itemsListSelected: Array<any> = [];

  readonly items: Array<PoTreeViewItem> = [
    {
      label: 'Condiments',
      value: 'condiments',
      subItems: [
        { label: 'Extra virgin Olive', value: 'extraVirginOlive' },
        { label: 'Mayonnaise', value: 'Mayonnaise' },
        { label: 'Tomato ketchup', value: 'tomatoKetchup' },
        { label: 'Soda', value: 'soda' }
      ]
    },
    {
      label: 'Drinks',
      value: 'drinks',
      subItems: [
        { label: 'Orange juice', value: 'orangeJuice' },
        { label: 'Grape juice', value: 'grapeJuice' },
        { label: 'Beer', value: 'beer' },
        { label: 'Wine', value: 'wine' },
        { label: 'Soda', value: 'soda' }
      ]
    },
    {
      label: 'Grains',
      value: 122,
      subItems: [
        { label: 'Black bean', value: 'blackBean' },
        { label: 'Chickpeas', value: 'chickpeas' },
        { label: 'Lentil', value: 'lentil' },
        { label: 'Pea', value: 'pea' }
      ]
    },
    {
      label: 'Personal hygiene',
      value: 'personalHygiene',
      subItems: [
        { label: 'Body wash', value: 'bodyWash' },
        { label: 'Deodorant', value: 'deodorant' },
        { label: 'Shampoo', value: 'deodorant' },
        { label: 'Conditioner', value: 'conditioner' },
        { label: 'Sunscreen lotion', value: 'sunscreenLotion' }
      ]
    },
    {
      label: 'Frozen foods',
      value: 'frozenFoods',
      subItems: [
        { label: 'Hamburguer', value: 'hamburguer' },
        { label: 'Lasagna', value: 'lasagna' },
        { label: 'Sandwiches', value: 'sandwiches' }
      ]
    }
  ];

  @ViewChild('stepper', { static: true }) stepper: PoStepperComponent;

  addItem(seletectedItem) {
    if (seletectedItem.subItems) {
      seletectedItem.subItems.forEach(itemSelected => {
        if (!this.itemsListSelected.some(item => item.item === itemSelected.label)) {
          this.itemsListSelected.push({ item: itemSelected.label });
        }
      });
    } else {
      if (!this.itemsListSelected.some(item => item.item === seletectedItem.label)) {
        this.itemsListSelected.push({ item: seletectedItem.label });
      }
    }
  }

  checkOut() {
    this.confirmed = true;
    this.stepper.next();
  }

  isConfirmed() {
    return !!this.confirmed;
  }

  removeItem(unseletectedItem) {
    if (unseletectedItem.subItems) {
      const removedValues = unseletectedItem.subItems.map(item => item.label);
      this.itemsListSelected = this.itemsListSelected.filter(
        itemSelected => !removedValues.includes(itemSelected.item)
      );
    } else {
      this.itemsListSelected = this.itemsListSelected.filter(
        itemSelected => unseletectedItem.label !== itemSelected.item
      );
    }
  }
}
