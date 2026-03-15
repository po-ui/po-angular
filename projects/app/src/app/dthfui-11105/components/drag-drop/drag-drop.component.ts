import { Component, OnInit } from '@angular/core';
import { PoTableColumn } from 'projects/ui/src/lib';

import { generateMockItems } from '../../mock-data';

@Component({
  selector: 'dthfui-11105-drag-drop',
  templateUrl: './drag-drop.component.html',
  standalone: false
})
export class DragDropTestComponent implements OnInit {
  items: Array<any> = [];
  columnsManagerEnabled = true;

  columns: Array<PoTableColumn> = [
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

  height = 400;

  ngOnInit(): void {
    this.items = generateMockItems(200);
    this.height = this.getHeight();
  }

  toggleColumnsManager(): void {
    this.columnsManagerEnabled = !this.columnsManagerEnabled;
  }

  getHeight(): number {
    return window.innerHeight - 350;
  }
}
