import { Component } from '@angular/core';

import { PoBreadcrumb, PoDynamicFormField } from '@po-ui/ng-components';

import { PoPageDynamicEditActions } from '@po-ui/ng-templates';

@Component({
  selector: 'sample-po-page-dynamic-edit-user',
  templateUrl: './sample-po-page-dynamic-edit-user.component.html'
})
export class SamplePoPageDynamicEditUserComponent {
  public readonly serviceApi = 'https://po-sample-api.herokuapp.com/v1/people';

  public readonly actions: PoPageDynamicEditActions = {
    save: '/documentation/po-page-dynamic-detail',
    saveNew: '/documentation/po-page-dynamic-edit'
  };

  public readonly breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/' },
      { label: 'People', link: '/documentation/po-page-dynamic-table' },
      { label: 'Edit' }
    ]
  };

  public readonly fields: Array<PoDynamicFormField> = [
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
    { property: 'city', optionsService: 'https://po-sample-api.herokuapp.com/v1/cities?transform=true' }
  ];
}
