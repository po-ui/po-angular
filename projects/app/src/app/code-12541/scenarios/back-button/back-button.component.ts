import { Component } from '@angular/core';

import { PoNotificationService, PoPageAction } from '../../../../../../ui/src/public-api';

@Component({
  selector: 'app-scenario-back-button',
  templateUrl: './back-button.component.html',
  standalone: false
})
export class ScenarioBackButtonComponent {
  backCount = 0;

  actions: Array<PoPageAction> = [
    { label: 'Salvar', action: () => this.notify.success('Salvar'), icon: 'an an-check' },
    { label: 'Cancelar', action: () => this.notify.success('Cancelar') }
  ];

  constructor(private notify: PoNotificationService) {}

  onBack(): void {
    this.backCount++;
    this.notify.success('Voltar clicado #' + this.backCount);
  }
}
