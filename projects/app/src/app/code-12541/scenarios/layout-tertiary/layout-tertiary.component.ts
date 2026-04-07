import { Component } from '@angular/core';

import { PoNotificationService, PoPageAction } from '../../../../../../ui/src/public-api';

@Component({
  selector: 'app-scenario-layout-tertiary',
  templateUrl: './layout-tertiary.component.html',
  standalone: false
})
export class ScenarioLayoutTertiaryComponent {
  actions: Array<PoPageAction> = [
    { label: 'Salvar', action: () => this.notify.success('Salvar'), icon: 'an an-check' },
    { label: 'Cancelar', action: () => this.notify.success('Cancelar') },
    { label: 'Excluir', action: () => this.notify.success('Excluir'), type: 'danger' },
    { label: 'Duplicar', action: () => this.notify.success('Duplicar') },
    { label: 'Exportar', action: () => this.notify.success('Exportar') }
  ];

  constructor(private notify: PoNotificationService) {}
}
