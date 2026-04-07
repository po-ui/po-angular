import { Component } from '@angular/core';

import { PoBreadcrumb, PoNotificationService, PoPageAction, PoPageDefaultLiterals } from '../../../../../../ui/src/public-api';

@Component({
  selector: 'app-scenario-properties',
  templateUrl: './properties.component.html',
  standalone: false
})
export class ScenarioPropertiesComponent {
  breadcrumb: PoBreadcrumb = { items: [{ label: 'Home', link: '/' }, { label: 'Modulo' }, { label: 'Pagina' }] };
  actions: Array<PoPageAction> = [
    { label: 'Salvar', action: () => this.notify.success('Salvar'), icon: 'an an-check' },
    { label: 'Cancelar', action: () => this.notify.success('Cancelar') }
  ];

  customLiterals: PoPageDefaultLiterals = {
    otherActions: 'Mais opcoes'
  };

  constructor(private notify: PoNotificationService) {}

  onBack(): void {
    this.notify.success('Voltar');
  }
}
