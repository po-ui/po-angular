import { Component } from '@angular/core';

import { PoBreadcrumb } from 'projects/ui/src/lib';
import { PoPageDynamicTableActions, PoPageDynamicTableBeforeRemoveAll } from 'projects/templates/src/lib';

@Component({
  templateUrl: './clientes.component.html'
})
export class ClientesComponent {
  public readonly serviceApi = 'http://localhost:3000/v1/people';

  public readonly actions: PoPageDynamicTableActions = {
    detail: 'dynamic-detail/:id',
    duplicate: 'dynamic-new',
    edit: 'dynamic-edit/:id',
    new: 'dynamic-new', //this.newResource.bind(this),
    remove: true,
    removeAll: this.deleteAll.bind(this),
    beforeRemoveAll: this.onBeforeDeleteAll.bind(this)
  };

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' }, { label: 'People' }]
  };

  deleteAll(resources) {
    console.log('Remove All');
    console.log(resources);
    return resources;
  }

  onBeforeDeleteAll(resources): PoPageDynamicTableBeforeRemoveAll {
    console.log('Before');
    console.log(resources);
    return {
      resources: [],
      allowAction: true
    };
  }

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
