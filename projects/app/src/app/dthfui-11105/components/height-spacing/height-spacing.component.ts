import { Component, OnInit } from '@angular/core';
import { PoTableColumn, PoTableColumnSpacing } from 'projects/ui/src/lib';

import { generateMockItems } from '../../mock-data';

@Component({
  selector: 'dthfui-11105-height-spacing',
  templateUrl: './height-spacing.component.html',
  standalone: false
})
export class HeightSpacingTestComponent implements OnInit {
  items: Array<any> = [];

  ngOnInit(): void {
    this.items = generateMockItems(500);
  }
  currentHeight = 400;
  currentSpacing: PoTableColumnSpacing = PoTableColumnSpacing.Medium;

  columns: Array<PoTableColumn> = [
    { property: 'id', label: 'ID', width: '80px' },
    { property: 'name', label: 'Nome', width: '200px' },
    { property: 'email', label: 'Email', width: '250px' },
    { property: 'city', label: 'Cidade', width: '150px' },
    { property: 'status', label: 'Status', width: '120px' },
    { property: 'value', label: 'Valor', width: '120px', type: 'currency', format: 'BRL' }
  ];

  setHeight(height: number): void {
    this.currentHeight = height;
  }

  setSpacing(spacing: string): void {
    this.currentSpacing = spacing as PoTableColumnSpacing;
  }
}
