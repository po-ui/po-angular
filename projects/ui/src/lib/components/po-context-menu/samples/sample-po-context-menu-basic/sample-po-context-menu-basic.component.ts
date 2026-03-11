import { Component, inject } from '@angular/core';

import { PoContextMenuItem, PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-context-menu-basic',
  templateUrl: './sample-po-context-menu-basic.component.html',
  standalone: false
})
export class SamplePoContextMenuBasicComponent {
  readonly poNotification = inject(PoNotificationService);

  menuItems: Array<PoContextMenuItem> = [
    { label: 'Dados cadastrais', selected: true },
    { label: 'Endereços' },
    { label: 'Documentos' }
  ];

  onItemSelected(item: PoContextMenuItem): void {
    this.poNotification.success(`Item selecionado: ${item.label}`);
  }
}
