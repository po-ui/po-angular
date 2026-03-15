import { Component } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';

import { generateMockItems } from '../../mock-data';

@Component({
  selector: 'dthfui-11105-loading-empty',
  templateUrl: './loading-empty.component.html',
  standalone: false
})
export class LoadingEmptyTestComponent {
  items: Array<any> = [];
  loading = false;
  currentState = 'vazio';

  columns: Array<PoTableColumn> = [
    { property: 'id', label: 'ID', width: '80px' },
    { property: 'name', label: 'Nome', width: '200px' },
    { property: 'email', label: 'Email', width: '250px' },
    { property: 'city', label: 'Cidade', width: '150px' },
    { property: 'status', label: 'Status', width: '120px' },
    { property: 'value', label: 'Valor', width: '120px', type: 'currency', format: 'BRL' }
  ];

  height = this.getHeight();

  toggleLoading(): void {
    this.loading = !this.loading;
    this.currentState = this.loading ? 'loading' : (this.items.length > 0 ? 'populado' : 'vazio');
  }

  clearItems(): void {
    this.items = [];
    this.currentState = 'vazio';
  }

  populateItems(): void {
    this.items = generateMockItems(5000);
    this.currentState = 'populado';
  }

  simulateLoadCycle(): void {
    this.loading = true;
    this.currentState = 'loading';

    setTimeout(() => {
      this.items = generateMockItems(5000);
      this.loading = false;
      this.currentState = 'populado';
    }, 2000);
  }

  getHeight(): number {
    return window.innerHeight - 400;
  }
}
