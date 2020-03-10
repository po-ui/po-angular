import { Component } from '@angular/core';

import { PoBreadcrumb, PoDynamicFormField } from '@portinari/portinari-ui';

import { PoPageDynamicEditActions } from '@portinari/portinari-templates';

@Component({
  selector: 'sample-po-page-dynamic-edit-master-detail',
  templateUrl: './sample-po-page-dynamic-edit-master-detail.component.html'
})
export class SamplePoPageDynamicEditMasterDetailComponent {
  public readonly serviceApi = 'https://thf.totvs.com.br/sample/api/po-metadata/v1/people';

  public readonly actions: PoPageDynamicEditActions = {
    save: 'dynamic-detail/:id',
    saveNew: 'dynamic-new'
  };

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' }, { label: 'People', link: '/dynamic-table' }, { label: 'Edit' }]
  };

  public readonly fields: Array<PoDynamicFormField | any> = [
    { property: 'status', divider: 'Status', options: ['active', 'inactive'] },
    { property: 'id', label: 'User ID', key: true, required: true },
    { property: 'name', divider: 'Personal data', required: true },
    { property: 'nickname' },
    { property: 'email', label: 'E-mail' },
    { property: 'birthdate', label: 'Birth date', type: 'date' },
    { property: 'genre', options: ['female', 'male', 'others'], gridLgColumns: 6 },
    { property: 'nationality' },
    { property: 'birthPlace', label: 'Place of birth' },
    { property: 'graduation' },
    { property: 'father', label: 'Father`s name', divider: 'Relationship' },
    { property: 'mother', label: 'Mother`s name' },
    { property: 'street', divider: 'Address' },
    { property: 'city' },
    { property: 'country' },
    {
      property: 'dependents',
      type: 'detail',
      divider: 'Dependents',
      detail: {
        columns: [
          { property: 'id', label: 'ID', required: true, align: 'rigth', freeze: true },
          { property: 'birthdate', label: 'Birthdate', align: 'center', width: 120 },
          { property: 'name', label: 'Name', required: true, width: 200 },
          { property: 'age', label: 'Age', required: true, align: 'rigth' },
          { property: 'related', label: 'Related', required: true }
        ]
      }
    }
  ];
}
