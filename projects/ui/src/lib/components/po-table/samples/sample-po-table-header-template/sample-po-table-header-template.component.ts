import { Component } from '@angular/core';

import { PoTableColumn } from '@po-ui/ng-components';

interface SampleOrder {
  code: number;
  customer: string;
  city: string;
  status: string;
}

@Component({
  selector: 'sample-po-table-header-template',
  templateUrl: './sample-po-table-header-template.component.html',
  standalone: false
})
export class SamplePoTableHeaderTemplateComponent {
  columns: Array<PoTableColumn> = [
    { property: 'code', label: 'Code', type: 'number', width: '120px' },
    { property: 'customer', label: 'Customer' },
    { property: 'city', label: 'City' },
    { property: 'status', label: 'Status', width: '160px' }
  ];

  filters: Record<string, string> = {};

  private readonly orders: Array<SampleOrder> = [
    { code: 1200, customer: 'Supermarket Silva', city: 'São Paulo', status: 'Delivered' },
    { code: 1355, customer: 'Bakery Santos', city: 'Campinas', status: 'In transport' },
    { code: 1402, customer: 'Market Oliveira', city: 'Santos', status: 'Delivered' },
    { code: 1520, customer: 'Restaurant Souza', city: 'São Paulo', status: 'Canceled' },
    { code: 1631, customer: 'Grocery Lima', city: 'Sorocaba', status: 'In transport' }
  ];

  items: Array<SampleOrder> = [...this.orders];

  onFilter(property: string, event: Event): void {
    this.filters = { ...this.filters, [property]: (event.target as HTMLInputElement).value };

    this.items = this.orders.filter(order =>
      Object.entries(this.filters).every(([key, value]) =>
        String(order[key as keyof SampleOrder])
          .toLowerCase()
          .includes(value.trim().toLowerCase())
      )
    );
  }
}
