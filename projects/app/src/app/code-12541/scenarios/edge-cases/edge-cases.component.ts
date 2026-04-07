import { Component } from '@angular/core';

import { PoBreadcrumb, PoNotificationService, PoPageAction } from '../../../../../../ui/src/public-api';

@Component({
  selector: 'app-scenario-edge-cases',
  templateUrl: './edge-cases.component.html',
  standalone: false
})
export class ScenarioEdgeCasesComponent {
  breadcrumb: PoBreadcrumb = { items: [{ label: 'Home', link: '/' }, { label: 'Pagina' }] };
  actions: Array<PoPageAction> = [
    { label: 'Salvar', action: () => this.notify.success('Salvar'), icon: 'an an-check' },
    { label: 'Cancelar', action: () => this.notify.success('Cancelar') }
  ];

  constructor(private notify: PoNotificationService) {}

  onBack(): void {
    this.notify.success('Voltar');
  }
}
