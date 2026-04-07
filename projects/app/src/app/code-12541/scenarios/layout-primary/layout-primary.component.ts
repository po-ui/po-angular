import { Component } from '@angular/core';

import { PoBreadcrumb, PoNotificationService, PoPageAction } from '../../../../../../ui/src/public-api';

@Component({
  selector: 'app-scenario-layout-primary',
  templateUrl: './layout-primary.component.html',
  standalone: false
})
export class ScenarioLayoutPrimaryComponent {
  breadcrumb: PoBreadcrumb = { items: [{ label: 'Home', link: '/' }, { label: 'Pagina' }] };

  actions: Array<PoPageAction> = [
    { label: 'Salvar', action: () => this.notify.success('Salvar'), icon: 'an an-check' },
    { label: 'Cancelar', action: () => this.notify.success('Cancelar') },
    { label: 'Excluir', action: () => this.notify.success('Excluir'), type: 'danger' },
    { label: 'Duplicar', action: () => this.notify.success('Duplicar') },
    { label: 'Exportar', action: () => this.notify.success('Exportar') }
  ];

  constructor(private notify: PoNotificationService) {}
}
