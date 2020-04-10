import { Component } from '@angular/core';

import { PoBreadcrumb } from '@po-ui/ng-components';
import { PoPageDynamicDetailActions, PoPageDynamicDetailField } from '@po-ui/ng-templates';

@Component({
  selector: 'sample-po-page-dynamic-detail-user',
  templateUrl: './sample-po-page-dynamic-detail-user.component.html'
})
export class SamplePoPageDynamicDetailUserComponent {
  public readonly serviceApi = 'https://po-sample-api.herokuapp.com/v1/people';

  public readonly actions: PoPageDynamicDetailActions = {
    back: '/documentation/po-page-dynamic-table'
  };

  public readonly breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/' },
      { label: 'People', link: '/documentation/po-page-dynamic-table' },
      { label: 'Detail' }
    ]
  };

  public readonly fields: Array<PoPageDynamicDetailField> = [
    { property: 'status', tag: true, divider: 'Status' },
    { property: 'id', label: 'User ID', key: true },
    { property: 'name', divider: 'Personal data' },
    { property: 'nickname' },
    { property: 'email', label: 'E-mail' },
    { property: 'birthdate', label: 'Birth date', type: 'date' },
    { property: 'genre', gridLgColumns: 6 },
    { property: 'nationality' },
    { property: 'birthPlace', label: 'Place of birth' },
    { property: 'graduation' },
    { property: 'father', label: 'Father`s name', divider: 'Relationship' },
    { property: 'mother', label: 'Mother`s name' },
    { property: 'street', divider: 'Address' },
    { property: 'city' },
    { property: 'country' }
  ];
}
