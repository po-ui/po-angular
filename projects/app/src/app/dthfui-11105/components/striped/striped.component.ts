import { Component } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';

import { generateMockItems } from '../../mock-data';

@Component({
  selector: 'dthfui-11105-striped',
  templateUrl: './striped.component.html',
  standalone: false
})
export class StripedTestComponent {
  items = generateMockItems(500);
  striped = true;
  selectable = false;

  columns: Array<PoTableColumn> = [
    { property: 'id', label: 'ID', width: '80px' },
    { property: 'name', label: 'Nome', width: '200px' },
    { property: 'email', label: 'Email', width: '250px' },
    { property: 'city', label: 'Cidade', width: '150px' },
    { property: 'status', label: 'Status', width: '120px' },
    { property: 'value', label: 'Valor', width: '120px', type: 'currency', format: 'BRL' }
  ];

  height = this.getHeight();

  toggleStriped(): void {
    this.striped = !this.striped;
  }

  toggleSelectable(): void {
    this.selectable = !this.selectable;
  }

  getHeight(): number {
    return window.innerHeight - 350;
  }
}
