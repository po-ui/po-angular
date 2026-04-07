import { Component } from '@angular/core';

import { PoBreadcrumb, PoNotificationService, PoPageAction } from '../../../../../../ui/src/public-api';

@Component({
  selector: 'app-scenario-header-types',
  templateUrl: './header-types.component.html',
  standalone: false
})
export class ScenarioHeaderTypesComponent {
  breadcrumb: PoBreadcrumb = { items: [{ label: 'Home', link: '/' }, { label: 'Modulo' }, { label: 'Pagina' }] };

  actions: Array<PoPageAction> = [
    { label: 'Salvar', action: () => this.notify.success('Salvar'), icon: 'an an-check' },
    { label: 'Cancelar', action: () => this.notify.success('Cancelar') },
    { label: 'Excluir', action: () => this.notify.success('Excluir'), type: 'danger' }
  ];

  constructor(private notify: PoNotificationService) {}

  onBack(): void {
    this.notify.success('Voltar clicado');
  }
}
