import { Component } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';

import { generateMockItems } from '../../mock-data';

@Component({
  selector: 'dthfui-11105-resize',
  templateUrl: './resize.component.html',
  standalone: false
})
export class ResizeTestComponent {
  items = generateMockItems(500);
  containerWidth = '100%';
  frozenEnabled = false;

  columns: Array<PoTableColumn> = this.buildColumns();

  height = this.getHeight();

  setContainerWidth(width: string): void {
    this.containerWidth = width;
  }

  toggleFrozen(): void {
    this.frozenEnabled = !this.frozenEnabled;
    this.columns = this.buildColumns();
  }

  private buildColumns(): Array<PoTableColumn> {
    const base: Array<PoTableColumn> = [
      { property: 'id', label: 'ID' },
      { property: 'name', label: 'Nome' },
      { property: 'email', label: 'Email' },
      { property: 'city', label: 'Cidade' },
      { property: 'status', label: 'Status' },
      { property: 'value', label: 'Valor', type: 'currency', format: 'BRL' },
      { property: 'date', label: 'Data', type: 'date' },
      { property: 'category', label: 'Categoria' }
    ];

    if (this.frozenEnabled) {
      base[0] = { ...base[0], fixed: true, width: '80px' };
      base[1] = { ...base[1], fixed: true, width: '200px' };
    }

    return base;
  }

  getHeight(): number {
    return window.innerHeight - 400;
  }
}
