import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-page-dynamic-table-people',
  templateUrl: './sample-po-page-dynamic-table-people.component.html'
})
export class SamplePoPageDynamicTablePeopleComponent {
  readonly serviceApi = 'https://po-sample-api.onrender.com/v1/people';

  readonly fields: Array<any> = [
    { property: 'id', key: true, visible: false },
    { property: 'name', label: 'Name' },
    { property: 'genre', label: 'Genre', sortable: false },
    { property: 'city', label: 'City' }
  ];

  constructor() {}
}
