import { Component } from '@angular/core';

import { PoBreadcrumb } from '@po-ui/ng-components';
import { PoPageDynamicTableActions } from '@po-ui/ng-templates';

import { SamplePoPageDynamicTableUsersService } from './sample-po-page-dynamic-table-users.service';

@Component({
  selector: 'sample-po-page-dynamic-table-users',
  templateUrl: './sample-po-page-dynamic-table-users.component.html',
  providers: [SamplePoPageDynamicTableUsersService]
})
export class SamplePoPageDynamicTableUsersComponent {
  public readonly serviceApi = 'https://po-sample-api.herokuapp.com/v1/people';

  public readonly actions: PoPageDynamicTableActions = {
    new: '/documentation/po-page-dynamic-edit',
    remove: true,
    removeAll: true
  };

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' }, { label: 'People' }]
  };

  public readonly cityOptions: Array<object> = [
    { value: 'São Paulo', label: 'São Paulo' },
    { value: 'Joinville', label: 'Joinville' },
    { value: 'São Bento', label: 'São Bento' },
    { value: 'Araquari', label: 'Araquari' },
    { value: 'Campinas', label: 'Campinas' },
    { value: 'Osasco', label: 'Osasco' }
  ];

  public readonly fields: Array<any> = [
    { property: 'id', key: true },
    { property: 'name', label: 'Name', filter: true, gridColumns: 6 },
    { property: 'genre', label: 'Genre', filter: true, gridColumns: 6, duplicate: true },
    { property: 'birthdate', label: 'Birthdate', type: 'date', gridColumns: 6 },
    { property: 'city', label: 'City', filter: true, duplicate: true, options: this.cityOptions, gridColumns: 12 }
  ];

  public pageCustomActions = [
    { label: 'Print', action: this.printPage.bind(this) },
    { label: 'Download .csv', action: this.usersService.downloadCsv.bind(this.usersService, this.serviceApi) }
  ];

  constructor(private usersService: SamplePoPageDynamicTableUsersService) {}

  printPage() {
    window.print();
  }
}
