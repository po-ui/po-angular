import { Component } from '@angular/core';

import { PoBreadcrumb } from '@portinari/portinari-ui';
import { PoPageDynamicTableActions } from '@portinari/portinari-templates';

@Component({
  selector: 'sample-po-page-dynamic-table-users',
  templateUrl: './sample-po-page-dynamic-table-users.component.html'
})
export class SamplePoPageDynamicTableUsersComponent {
  public readonly serviceApi = 'https://thf.totvs.com.br/sample/api/thf-metadata/v1/people';

  public readonly actions: PoPageDynamicTableActions = {
    detail: 'dynamic-detail/:id',
    duplicate: 'dynamic-new',
    edit: 'dynamic-edit/:id',
    new: 'dynamic-new',
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
}
