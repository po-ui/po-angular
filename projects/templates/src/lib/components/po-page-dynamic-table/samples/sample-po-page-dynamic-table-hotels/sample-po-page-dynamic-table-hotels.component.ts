import { Component, ViewChild } from '@angular/core';

import { PoBreadcrumb, PoDynamicViewField, PoModalComponent } from '@po-ui/ng-components';
import {
  PoPageDynamicTableActions,
  PoPageDynamicTableCustomAction,
  PoPageDynamicTableCustomTableAction
} from '@po-ui/ng-templates';

@Component({
  selector: 'sample-po-page-dynamic-table-hotels',
  templateUrl: './sample-po-page-dynamic-table-hotels.component.html'
})
export class SamplePoPageDynamicTableHotelsComponent {
  @ViewChild('hotelDetailModal') hotelDetailModal!: PoModalComponent;

  readonly serviceApi = 'https://po-sample-api.onrender.com/v1/hotels';

  actionsRight = true;
  detailedHotel: any;
  quickSearchWidth: number = 3;
  hideRemoveAllDisclaimer = false;
  hideCloseDisclaimers: Array<string> = ['address_city'];

  readonly actions: PoPageDynamicTableActions = {
    new: '/documentation/po-page-dynamic-edit',
    remove: true,
    removeAll: true
  };

  readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' }, { label: 'Hotel' }]
  };

  readonly cityOptions: Array<object> = [
    { value: 'São Paulo', label: 'São Paulo' },
    { value: 'Uberaba', label: 'Uberaba' },
    { value: 'São benedito', label: 'São benedito' },
    { value: 'Belford Roxo', label: 'Belford Roxo' },
    { value: 'Vila Velha', label: 'Vila Velha' },
    { value: 'Mogi das Cruzes', label: 'Mogi das Cruzes' },
    { value: 'Minas Gerais', label: 'Minas Gerais' }
  ];

  readonly categoryOptions: Array<object> = [
    { value: 'Simples', label: 'Simples' },
    { value: 'Luxo', label: 'Luxo' }
  ];

  readonly fields: Array<any> = [
    { property: 'id', key: true, visible: false },
    { property: 'name', label: 'Name', filter: true, gridColumns: 6 },
    {
      property: 'floors',
      label: 'Floors',
      filter: true,
      gridColumns: 6,
      initValue: 10
    },
    {
      property: 'category',
      label: 'Category',
      filter: true,
      options: this.categoryOptions,
      initValue: 'Luxo',
      gridColumns: 6
    },
    {
      property: 'address_city',
      label: 'City',
      filter: true,
      options: this.cityOptions,
      gridColumns: 12,
      initValue: 'Mogi das Cruzes'
    }
  ];

  readonly detailFields: Array<PoDynamicViewField> = [
    { property: 'name', gridLgColumns: 4, divider: 'Info' },
    { property: 'category', tag: true, gridLgColumns: 4 },
    { property: 'floors', gridLgColumns: 4 },
    { property: 'cnpj', label: 'CNPJ', gridLgColumns: 4 },
    { property: 'address_street', label: 'Street', divider: 'Address' },
    { property: 'address_number', label: 'Number' },
    { property: 'address_zip', label: 'Zip Code' },
    { property: 'address_city', label: 'City' },
    { property: 'address_district', label: 'District' },
    { property: 'email', label: 'email', gridLgColumns: 6, divider: 'Contact' },
    { property: 'phone', gridLgColumns: 4 }
  ];

  pageCustomActions: Array<PoPageDynamicTableCustomAction> = [
    {
      label: 'Hide Remove All Disclaimer',
      action: this.onClickRemoveAllDisclaimer.bind(this),
      visible: this.isVisibleRemoveAllDisclaimer.bind(this),
      icon: 'po-icon-eye-off'
    },
    {
      label: 'Show Remove All Disclaimer',
      action: this.onClickRemoveAllDisclaimer.bind(this),
      visible: this.isHideRemoveAllDisclaimer.bind(this),
      icon: 'po-icon-eye'
    },
    {
      label: 'Hide Close City Disclaimer',
      action: this.onClickCloseCityDisclaimer.bind(this),
      visible: this.isVisibleCloseCityDisclaimer.bind(this),
      icon: 'po-icon-eye-off'
    },
    {
      label: 'Show Close City Disclaimer',
      action: this.onClickCloseCityDisclaimer.bind(this),
      visible: this.isHideCloseCityDisclaimer.bind(this),
      icon: 'po-icon-eye'
    }
  ];

  tableCustomActions: Array<PoPageDynamicTableCustomTableAction> = [
    {
      label: 'Details',
      action: this.onClickHotelDetail.bind(this),
      icon: 'po-icon-user'
    }
  ];

  constructor() {}

  private onClickHotelDetail(hotel: any) {
    this.detailedHotel = hotel;

    this.hotelDetailModal.open();
  }

  private onClickRemoveAllDisclaimer() {
    this.hideRemoveAllDisclaimer = !this.hideRemoveAllDisclaimer;
  }

  private isVisibleRemoveAllDisclaimer() {
    return !this.hideRemoveAllDisclaimer;
  }

  private isHideRemoveAllDisclaimer() {
    return this.hideRemoveAllDisclaimer;
  }

  private onClickCloseCityDisclaimer() {
    if (this.hideCloseDisclaimers.length > 0) {
      this.hideCloseDisclaimers = [];
    } else {
      this.hideCloseDisclaimers = ['address_city'];
    }
  }

  private isVisibleCloseCityDisclaimer() {
    return this.hideCloseDisclaimers.length <= 0;
  }

  private isHideCloseCityDisclaimer() {
    return this.hideCloseDisclaimers.length > 0;
  }
}
