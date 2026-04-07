import { Component } from '@angular/core';

import { PoNotificationService, PoPageAction } from '../../../../../../ui/src/public-api';

@Component({
  selector: 'app-scenario-actions-states',
  templateUrl: './actions-states.component.html',
  standalone: false
})
export class ScenarioActionsStatesComponent {
  actionsDisabled: Array<PoPageAction> = [
    { label: 'Ativa', action: () => this.notify.success('Ativa'), icon: 'an an-check' },
    { label: 'Desabilitada', action: () => this.notify.success('Desabilitada'), disabled: true },
    { label: 'Desabilitada 2', action: () => this.notify.success('Desabilitada 2'), disabled: true }
  ];

  actionsDanger: Array<PoPageAction> = [
    { label: 'Salvar', action: () => this.notify.success('Salvar'), icon: 'an an-check' },
    { label: 'Excluir', action: () => this.notify.success('Excluir'), type: 'danger' },
    { label: 'Remover Tudo', action: () => this.notify.success('Remover'), type: 'danger' }
  ];

  actionsVisible: Array<PoPageAction> = [
    { label: 'Visivel 1', action: () => this.notify.success('Visivel 1'), visible: true },
    { label: 'Oculta', action: () => this.notify.success('Oculta'), visible: false },
    { label: 'Visivel 2', action: () => this.notify.success('Visivel 2'), visible: true }
  ];

  actionsMixed: Array<PoPageAction> = [
    { label: 'Normal', action: () => this.notify.success('Normal'), icon: 'an an-check' },
    { label: 'Disabled', action: () => this.notify.success('Disabled'), disabled: true },
    { label: 'Danger', action: () => this.notify.success('Danger'), type: 'danger' }
  ];

  constructor(private notify: PoNotificationService) {}

  onBack(): void {
    this.notify.success('Voltar');
  }
}
