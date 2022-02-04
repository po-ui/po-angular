import { Component, DoCheck, ViewChild } from '@angular/core';

import { PoBreadcrumb } from '@po-ui/ng-components';
import {
  PoPageDynamicDetailActions,
  PoPageDynamicDetailComponent,
  PoPageDynamicDetailField
} from '@po-ui/ng-templates';

@Component({
  selector: 'sample-po-page-dynamic-detail-user',
  templateUrl: './sample-po-page-dynamic-detail-user.component.html'
})
export class SamplePoPageDynamicDetailUserComponent implements DoCheck {
  @ViewChild(PoPageDynamicDetailComponent, { static: true }) poPageDynamicDetail: PoPageDynamicDetailComponent;

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

  public readonly model = {
    id: '0148093543698',
    name: 'Ronaldo Nascimento Filho',
    birthdate: '1980-11-01T00:00:00-00:00',
    genre: 'male',
    city: '3550308',
    status: 'active',
    nickname: 'ronaldo.filho',
    email: 'ronaldo.filho@gmail.com',
    nationality: 'Brazilian',
    birthPlace: 'São Paulo',
    graduation: 'College',
    father: 'Papai',
    mother: 'Mamãe',
    street: 'Santos Dumont',
    country: 'Brasil',
    genreDescription: 'Masculino',
    statusDescription: 'Ativo',
    cityName: 'São Paulo',
    state: 'São Paulo',
    uf: 'SP',
    dependents: [
      {
        id: 109481,
        name: 'Maria',
        age: '10',
        related: 'Daughter',
        birthdate: '2008-12-10'
      },
      {
        id: 109482,
        name: 'Joana',
        age: '12',
        related: 'Daughter',
        birthdate: '2008-12-10'
      },
      {
        id: 109483,
        name: 'Pedro',
        age: '13',
        related: 'Son',
        birthdate: '2008-12-10'
      },
      {
        id: 109484,
        name: 'Paulo',
        age: '15',
        related: 'Son',
        birthdate: '2008-12-10'
      },
      {
        id: 109485,
        name: 'José',
        age: '19',
        related: 'Son',
        birthdate: '2008-12-10'
      }
    ]
  };

  constructor() {}

  ngDoCheck() {
    this.poPageDynamicDetail.model = this.model;
  }
}
