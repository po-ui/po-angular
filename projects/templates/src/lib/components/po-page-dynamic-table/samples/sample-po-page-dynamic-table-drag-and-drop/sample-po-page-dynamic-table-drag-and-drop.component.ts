import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-page-dynamic-table-drag-and-drop',
  templateUrl: './sample-po-page-dynamic-table-drag-and-drop.component.html'
})
export class SamplePoPageDynamicTableDragAndDropComponent {
  readonly serviceApi = 'https://po-sample-api.fly.dev/v1/people';

  readonly fields: Array<any> = [
    { property: 'id', key: true, visible: false },
    { property: 'name', label: 'Name' },
    { property: 'genre', label: 'Genre', sortable: false },
    { property: 'city', label: 'City' }
  ];

  constructor() {}
}
