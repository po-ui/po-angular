import { Component, OnInit, ViewChild } from '@angular/core';
import { PoTableColumn, PoTableComponent } from 'projects/ui/src/lib';

import { generateMockItems } from '../../mock-data';

@Component({
  selector: 'dthfui-11105-selection',
  templateUrl: './selection.component.html',
  standalone: false
})
export class SelectionTestComponent implements OnInit {
  @ViewChild('tableComp') tableComponent!: PoTableComponent;

  items: Array<any> = [];
  selectedCount = 0;
  lastEvent = '';

  columns: Array<PoTableColumn> = [
    { property: 'id', label: 'ID', width: '80px' },
    { property: 'name', label: 'Nome', width: '200px' },
    { property: 'email', label: 'Email', width: '250px' },
    { property: 'city', label: 'Cidade', width: '150px' },
    { property: 'status', label: 'Status', width: '120px' },
    { property: 'value', label: 'Valor', width: '120px', type: 'currency', format: 'BRL' }
  ];

  height = 400;

  ngOnInit(): void {
    this.items = generateMockItems(1000);
    this.height = this.getHeight();
  }

  onSelected(event: any): void {
    this.selectedCount++;
    this.lastEvent = `selected: ${JSON.stringify(event?.name || event)}`;
  }

  onUnselected(event: any): void {
    this.selectedCount = Math.max(0, this.selectedCount - 1);
    this.lastEvent = `unselected: ${JSON.stringify(event?.name || event)}`;
  }

  onAllSelected(): void {
    this.selectedCount = this.items.length;
    this.lastEvent = 'all-selected';
  }

  onAllUnselected(): void {
    this.selectedCount = 0;
    this.lastEvent = 'all-unselected';
  }

  selectByIndex(index: number): void {
    if (index >= 0 && index < this.items.length) {
      this.items[index].$selected = true;
      this.items = [...this.items];
      this.lastEvent = `manual select index: ${index}`;
    }
  }

  getHeight(): number {
    return window.innerHeight - 400;
  }
}
