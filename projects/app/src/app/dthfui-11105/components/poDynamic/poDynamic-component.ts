import { Component } from '@angular/core';

@Component({
  templateUrl: './poDynamic-component.html',
  standalone: false
})
export class PoDynamicComponent {
  readonly serviceApi = 'https://po-sample-api.onrender.com/v1/people';

  readonly fields: Array<any> = [
    { property: 'id', key: true, visible: false },
    { property: 'name', label: 'Name' },
    { property: 'genre', label: 'Genre', sortable: false },
    { property: 'city', label: 'City' }
  ];
}
