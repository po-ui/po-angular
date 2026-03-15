import { Component, OnInit } from '@angular/core';
import { PoTableColumn } from 'projects/ui/src/lib';

import { generateMockItems } from '../../mock-data';

@Component({
  selector: 'dthfui-11105-frozen-columns',
  templateUrl: './frozen-columns.component.html',
  standalone: false
})
export class FrozenColumnsComponent implements OnInit {
  items: Array<any> = [];
  frozenEnabled = true;
  frozenCount = 2;

  columns: Array<PoTableColumn> = this.buildColumns();

  height = 400;

  ngOnInit(): void {
    this.items = generateMockItems(1000);
    this.height = this.getHeight();
  }

  toggleFrozen(): void {
    this.frozenEnabled = !this.frozenEnabled;
    this.columns = this.buildColumns();
  }

  setFrozenCount(count: number): void {
    this.frozenCount = count;
    this.columns = this.buildColumns();
  }

  private buildColumns(): Array<PoTableColumn> {
    const allColumns: Array<PoTableColumn> = [
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
      for (let i = 0; i < this.frozenCount && i < allColumns.length; i++) {
        allColumns[i] = { ...allColumns[i], fixed: true };
      }
    }

    return allColumns;
  }

  getHeight(): number {
    return window.innerHeight - 350;
  }
}
