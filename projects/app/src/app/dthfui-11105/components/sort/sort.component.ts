import { Component } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';

import { generateMockItems } from '../../mock-data';

@Component({
  selector: 'dthfui-11105-sort',
  templateUrl: './sort.component.html',
  standalone: false
})
export class SortTestComponent {
  items = generateMockItems(1000);
  lastSortColumn = '';
  lastSortType = '';

  columns: Array<PoTableColumn> = [
    { property: 'id', label: 'ID (number)', width: '120px' },
    { property: 'name', label: 'Nome (string)', width: '200px' },
    { property: 'email', label: 'Email (string)', width: '250px' },
    { property: 'city', label: 'Cidade (string)', width: '150px' },
    { property: 'value', label: 'Valor (number)', width: '150px', type: 'currency', format: 'BRL' },
    { property: 'date', label: 'Data (date)', width: '150px', type: 'date' },
    { property: 'status', label: 'Status (string)', width: '120px' },
    { property: 'code', label: 'Código (string)', width: '150px' }
  ];

  height = this.getHeight();

  onSortBy(event: any): void {
    this.lastSortColumn = event?.column?.property || '';
    this.lastSortType = event?.type || '';
  }

  getHeight(): number {
    return window.innerHeight - 350;
  }
}
