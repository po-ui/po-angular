import { Component, ViewChild } from '@angular/core';

import { PoBreadcrumb, PoDynamicViewField, PoModalComponent } from '@po-ui/ng-components';
import {
  PoPageDynamicTableActions,
  PoPageDynamicTableCustomAction,
  PoPageDynamicTableCustomTableAction,
  PoPageDynamicTableOptions
} from '@po-ui/ng-templates';

import { SamplePoPageDynamicTableUsersService } from './sample-po-page-dynamic-table-users.service';

@Component({
  selector: 'sample-po-page-dynamic-table-users',
  templateUrl: './sample-po-page-dynamic-table-users.component.html',
  providers: [SamplePoPageDynamicTableUsersService]
})
export class SamplePoPageDynamicTableUsersComponent {
  @ViewChild('userDetailModal') userDetailModal: PoModalComponent;

  readonly serviceApi = 'https://po-sample-api.herokuapp.com/v1/people';
  detailedUser;
  quickSearchWidth: number = 3;

  readonly actions: PoPageDynamicTableActions = {
    new: '/documentation/po-page-dynamic-edit',
    remove: true,
    removeAll: true
  };

  readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' }, { label: 'People' }]
  };

  readonly cityOptions: Array<object> = [
    { value: 'São Paulo', label: 'São Paulo' },
    { value: 'Joinville', label: 'Joinville' },
    { value: 'São Bento', label: 'São Bento' },
    { value: 'Araquari', label: 'Araquari' },
    { value: 'Campinas', label: 'Campinas' },
    { value: 'Osasco', label: 'Osasco' }
  ];

  readonly fields: Array<any> = [
    { property: 'id', key: true, visible: false, filter: true },
    { property: 'name', label: 'Name', filter: true, gridColumns: 6 },
    { property: 'genre', label: 'Genre', filter: true, gridColumns: 6, duplicate: true },
    { property: 'search', filter: true, visible: false },
    {
      property: 'birthdate',
      label: 'Birthdate',
      type: 'date',
      gridColumns: 6,
      visible: false,
      allowColumnsManager: true
    },
    { property: 'city', label: 'City', filter: true, duplicate: true, options: this.cityOptions, gridColumns: 12 }
  ];

  readonly detailFields: Array<PoDynamicViewField> = [
    { property: 'status', tag: true, gridLgColumns: 4, divider: 'Personal Data' },
    { property: 'name', gridLgColumns: 4 },
    { property: 'nickname', label: 'User name', gridLgColumns: 4 },
    { property: 'email', gridLgColumns: 4 },
    { property: 'birthdate', gridLgColumns: 4, type: 'date' },
    { property: 'genre', gridLgColumns: 4, gridSmColumns: 6 },
    { property: 'cityName', label: 'City', divider: 'Address' },
    { property: 'state' },
    { property: 'country' }
  ];

  pageCustomActions: Array<PoPageDynamicTableCustomAction> = [
    { label: 'Print', action: this.printPage.bind(this) },
    { label: 'Download .csv', action: this.usersService.downloadCsv.bind(this.usersService, this.serviceApi) }
  ];

  tableCustomActions: Array<PoPageDynamicTableCustomTableAction> = [
    { label: 'Details', action: this.onClickUserDetail.bind(this) }
  ];

  constructor(private usersService: SamplePoPageDynamicTableUsersService) {}

  onLoad(): PoPageDynamicTableOptions {
    return {
      fields: [
        { property: 'id', key: true, visible: true, filter: true },
        { property: 'name', label: 'Name', filter: true, gridColumns: 6 },
        { property: 'genre', label: 'Genre', filter: true, gridColumns: 6, duplicate: true },
        { property: 'search', initValue: '0748093840433' },
        {
          property: 'birthdate',
          label: 'Birthdate',
          type: 'date',
          gridColumns: 6,
          visible: false,
          allowColumnsManager: true
        }
      ]
    };
  }

  printPage() {
    window.print();
  }

  private onClickUserDetail(user) {
    this.detailedUser = user;

    this.userDetailModal.open();
  }
}
