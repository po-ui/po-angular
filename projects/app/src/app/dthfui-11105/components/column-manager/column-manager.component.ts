import { Component } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';

import { generateMockItems } from '../../mock-data';

@Component({
  selector: 'dthfui-11105-column-manager',
  templateUrl: './column-manager.component.html',
  standalone: false
})
export class ColumnManagerTestComponent {
  items = generateMockItems(500);
  frozenEnabled = false;
  lastVisibleChange = '';

  columns: Array<PoTableColumn> = this.buildColumns();

  height = this.getHeight();

  toggleFrozen(): void {
    this.frozenEnabled = !this.frozenEnabled;
    this.columns = this.buildColumns();
  }

  onVisibleColumnsChange(columns: Array<PoTableColumn>): void {
    this.lastVisibleChange = `${columns.length} colunas visíveis`;
  }

  private buildColumns(): Array<PoTableColumn> {
    const base: Array<PoTableColumn> = [
      { property: 'id', label: 'ID', width: '80px' },
      { property: 'name', label: 'Nome', width: '200px' },
      { property: 'email', label: 'Email', width: '250px' },
      { property: 'city', label: 'Cidade', width: '150px' },
      { property: 'status', label: 'Status', width: '120px' },
      { property: 'value', label: 'Valor', width: '120px', type: 'currency', format: 'BRL' },
      { property: 'date', label: 'Data', width: '150px', type: 'date' },
      { property: 'category', label: 'Categoria', width: '150px' },
      { property: 'description', label: 'Descrição', width: '300px' },
      { property: 'code', label: 'Código', width: '150px' }
    ];

    if (this.frozenEnabled) {
      base[0] = { ...base[0], fixed: true };
      base[1] = { ...base[1], fixed: true };
    }

    return base;
  }

  getHeight(): number {
    return window.innerHeight - 400;
  }
}
