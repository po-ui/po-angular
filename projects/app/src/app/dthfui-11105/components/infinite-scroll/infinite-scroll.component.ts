import { Component, OnInit } from '@angular/core';
import { PoTableColumn } from 'projects/ui/src/lib';

import { generateMockItems } from '../../mock-data';

@Component({
  selector: 'dthfui-11105-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  standalone: false
})
export class InfiniteScrollTestComponent implements OnInit {
  readonly pageSize = 50;
  readonly totalAvailable = 500;

  items: Array<any> = [];
  columns: Array<PoTableColumn> = [
    { property: 'id', label: 'ID', width: '80px' },
    { property: 'name', label: 'Nome', width: '200px' },
    { property: 'email', label: 'Email', width: '250px' },
    { property: 'city', label: 'Cidade', width: '150px' },
    { property: 'status', label: 'Status', width: '120px' },
    { property: 'value', label: 'Valor', width: '120px', type: 'currency', format: 'BRL' }
  ];

  loading = false;
  allDataPool: Array<any> = [];
  currentPage = 0;

  height = 400;

  ngOnInit(): void {
    this.allDataPool = generateMockItems(this.totalAvailable);
    this.loadPage();
    this.height = this.getHeight();
  }

  loadMore(): void {
    if (this.loading || this.items.length >= this.totalAvailable) {
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.loadPage();
      this.loading = false;
    }, 800);
  }

  reset(): void {
    this.items = [];
    this.currentPage = 0;
    this.loading = false;
    this.loadPage();
  }

  private loadPage(): void {
    const start = this.currentPage * this.pageSize;
    const end = Math.min(start + this.pageSize, this.totalAvailable);
    const newItems = this.allDataPool.slice(start, end);
    this.items = [...this.items, ...newItems];
    this.currentPage++;
  }

  getHeight(): number {
    return window.innerHeight - 400;
  }
}
