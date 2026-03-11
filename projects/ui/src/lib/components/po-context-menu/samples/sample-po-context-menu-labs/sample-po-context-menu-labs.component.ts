import { Component } from '@angular/core';

import { PoContextMenuItem, PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-context-menu-labs',
  templateUrl: './sample-po-context-menu-labs.component.html',
  standalone: false
})
export class SamplePoContextMenuLabsComponent {
  contextTitle: string = 'Jornada';
  title: string = 'Prestador de compra';
  expanded: boolean = true;
  newItemLabel: string = '';

  menuItems: Array<PoContextMenuItem> = [
    { label: 'Dados cadastrais', selected: true },
    { label: 'Endereços' },
    { label: 'Dependentes' }
  ];

  constructor(private poNotification: PoNotificationService) {}

  onItemSelected(item: PoContextMenuItem): void {
    this.poNotification.success(`Item selecionado: ${item.label}`);
  }

  addItem(): void {
    if (!this.newItemLabel) {
      return;
    }

    this.menuItems = [...this.menuItems, { label: this.newItemLabel }];
    this.newItemLabel = '';
  }

  restore(): void {
    this.contextTitle = 'Jornada';
    this.title = 'Prestador de compra';
    this.expanded = true;
    this.newItemLabel = '';
    this.menuItems = [{ label: 'Dados cadastrais', selected: true }, { label: 'Endereços' }, { label: 'Dependentes' }];
  }
}
