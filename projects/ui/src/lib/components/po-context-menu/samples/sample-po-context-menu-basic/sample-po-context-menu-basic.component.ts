import { Component } from '@angular/core';

import { PoContextMenuItem } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-context-menu-basic',
  templateUrl: './sample-po-context-menu-basic.component.html',
  standalone: false
})
export class SamplePoContextMenuBasicComponent {
  menuItems: Array<PoContextMenuItem> = [
    { label: 'Dados cadastrais', selected: true },
    { label: 'Endereços' },
    { label: 'Dependentes' },
    { label: 'Documentos' }
  ];

  onItemSelected(item: PoContextMenuItem): void {
    console.log('Item selecionado:', item.label);
  }
}
