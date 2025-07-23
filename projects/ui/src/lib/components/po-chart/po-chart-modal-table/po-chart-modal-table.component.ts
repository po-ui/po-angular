import { Component, Input, ViewChild } from '@angular/core';

import { PoModalComponent, PoModalModule } from '../../po-modal';
import { PoTableModule } from '../../po-table';

@Component({
  standalone: true,
  imports: [PoModalModule, PoTableModule],
  selector: 'po-chart-modal-table',
  template: `
    <po-modal #modalComponent [p-click-out]="true" [p-title]="title" [p-primary-action]="actionModal">
      <po-table [p-hide-columns-manager]="true" [p-items]="itemsTable" [p-columns]="columnsTable"></po-table>
    </po-modal>
  `
})
export class PoChartModalTableComponent {
  @ViewChild('modalComponent', { static: true }) modalComponent: PoModalComponent;

  @Input() title: string;
  @Input() itemsTable: Array<any>;
  @Input() columnsTable: Array<any>;
  @Input() actionModal: any;
}
