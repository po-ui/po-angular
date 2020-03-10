import { Component } from '@angular/core';

import { PoBreadcrumb } from '@portinari/portinari-ui';
import { PoPageDynamicDetailField } from '@portinari/portinari-templates';

@Component({
  selector: 'sample-po-page-dynamic-detail-basic',
  templateUrl: './sample-po-page-dynamic-detail-basic.component.html'
})
export class SamplePoPageDynamicDetailBasicComponent {
  public readonly serviceApi = 'https://thf.totvs.com.br/sample/api/po-metadata/v1/people';

  public readonly actions = {
    // back: '/', // false ou url
    // back: false, // false ou url
    back: 'dynamic-table', // url de redirecionamento
    // edit: ':id/edit', // obrigatório ter um :id para incluir o key
    edit: 'dynamic-edit/:id', // obrigatório ter um :id para incluir o key
    // remove: '/' // url de redirecionamento
    remove: 'dynamic-table' // url de redirecionamento
  };

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' }, { label: 'People', link: '/dynamic-table' }, { label: 'Detail' }]
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
