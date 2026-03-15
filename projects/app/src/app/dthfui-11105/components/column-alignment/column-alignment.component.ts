import { Component, OnInit } from '@angular/core';
import { PoTableColumn } from 'projects/ui/src/lib';

import { generateMockItems, COLUMNS_WITH_WIDTH, COLUMNS_WITHOUT_WIDTH, COLUMNS_MANY } from '../../mock-data';

@Component({
  selector: 'dthfui-11105-column-alignment',
  templateUrl: './column-alignment.component.html',
  standalone: false
})
export class ColumnAlignmentComponent implements OnInit {
  items: Array<any> = [];
  columns: Array<PoTableColumn> = [...COLUMNS_WITH_WIDTH];
  currentMode = 'withWidth';

  height = 400;

  ngOnInit(): void {
    this.items = generateMockItems(500);
    this.height = this.getHeight();
  }

  useColumnsWithWidth(): void {
    this.columns = [...COLUMNS_WITH_WIDTH];
    this.currentMode = 'withWidth';
  }

  useColumnsWithoutWidth(): void {
    this.columns = [...COLUMNS_WITHOUT_WIDTH];
    this.currentMode = 'withoutWidth';
  }

  useManyColumns(): void {
    this.columns = [...COLUMNS_MANY];
    this.currentMode = 'many';
  }

  useFewColumns(): void {
    this.columns = [
      { property: 'id', label: 'ID', width: '80px' },
      { property: 'name', label: 'Nome', width: '200px' },
      { property: 'status', label: 'Status' }
    ];
    this.currentMode = 'few';
  }

  useMixedWidths(): void {
    this.columns = [
      { property: 'id', label: 'ID', width: '80px' },
      { property: 'name', label: 'Nome' },
      { property: 'email', label: 'Email', width: '250px' },
      { property: 'city', label: 'Cidade' },
      { property: 'status', label: 'Status', width: '120px' },
      { property: 'value', label: 'Valor' }
    ];
    this.currentMode = 'mixed';
  }

  getHeight(): number {
    return window.innerHeight - 350;
  }
}
