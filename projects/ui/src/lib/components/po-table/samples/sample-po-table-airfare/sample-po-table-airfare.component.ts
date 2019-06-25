import { Component, ViewChild } from '@angular/core';

import {
  PoDialogService,
  PoModalComponent,
  PoTableAction,
  PoTableColumn,
  PoTableComponent,
  PoNotificationService
} from '@portinari/portinari-ui';

import { SamplePoTableAirfareService } from './sample-po-table-airfare.service';

@Component({
  selector: 'sample-po-table-airfare',
  templateUrl: './sample-po-table-airfare.component.html',
  providers: [ SamplePoTableAirfareService ]
})
export class SamplePoTableAirfareComponent {

  actions: Array<PoTableAction> = [
    { action: this.discount.bind(this), icon: 'po-icon-finance', label: 'Apply Discount', disabled: this.validateDiscount.bind(this) },
    { action: this.details.bind(this), icon: 'po-icon-info', label: 'Details' }
  ];
  columns: Array<PoTableColumn> = this.sampleAirfare.getColumns();
  detail: any;
  items: Array<any> = this.sampleAirfare.getItems();
  total: number = 0;

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;
  @ViewChild(PoTableComponent, { static: true }) poTable: PoTableComponent;

  constructor(
    private sampleAirfare: SamplePoTableAirfareService,
    private poNotification: PoNotificationService,
    private poDialog: PoDialogService) { }

  addToCart() {
    const selectedItems = this.poTable.getSelectedRows();

    if (selectedItems.length > 0) {
      this.poDialog.confirm({
        title: 'Add to cart' ,
        message: `Would you like to add ${selectedItems.length} items to cart?`,
        confirm: () => this.confirmItems(selectedItems),
        cancel: () => {}
      });
    }
  }

  confirmItems(selectedItems: Array<any>) {
    selectedItems.forEach(item => {
      switch (item.status) {
        case 'available':
          this.poNotification.success(`${this.getDescription(item)} added succesfully`);
          break;
        case 'reserved':
          this.poNotification.warning(`${this.getDescription(item)} added succesfully, verify your e-mail to complete reservation`);
          break;
        case 'closed':
          this.poNotification.error(`${this.getDescription(item)} is closed and not available anymore`);
          break;
      }
    });
    this.items.forEach(item => item.$selected = false);
  }

  decreaseTotal(row: any) {
    if (row.value) {
      this.total -= row.value;
    }
  }

  details(item) {
    this.detail = item;
    this.poModal.open();
  }

  discount(item) {
    if (!item.disableDiscount) {
      item.value = item.value - (item.value * 0.2);
      item.disableDiscount = true;
    }
  }

  sumTotal(row: any) {
    if (row.value) {
      this.total += row.value;
    }
  }

  private getDescription(item: any) {
    return `Airfare to ${item.destination} - ${item.initials}`;
  }

  private validateDiscount(item) {
    return item.disableDiscount;
  }

}
