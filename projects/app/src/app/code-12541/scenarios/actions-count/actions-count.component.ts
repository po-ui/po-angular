import { Component } from '@angular/core';

import { PoNotificationService, PoPageAction } from '../../../../../../ui/src/public-api';

@Component({
  selector: 'app-scenario-actions-count',
  templateUrl: './actions-count.component.html',
  standalone: false
})
export class ScenarioActionsCountComponent {
  noActions: Array<PoPageAction> = [];

  oneAction: Array<PoPageAction> = [
    { label: 'Unica', action: () => this.notify.success('Unica'), icon: 'an an-check' }
  ];

  oneActionNoIcon: Array<PoPageAction> = [
    { label: 'Sem Icone', action: () => this.notify.success('Sem Icone') }
  ];

  twoActions: Array<PoPageAction> = [
    { label: 'Salvar', action: () => this.notify.success('Salvar'), icon: 'an an-check' },
    { label: 'Cancelar', action: () => this.notify.success('Cancelar') }
  ];

  threeActions: Array<PoPageAction> = [
    { label: 'Salvar', action: () => this.notify.success('Salvar'), icon: 'an an-check' },
    { label: 'Cancelar', action: () => this.notify.success('Cancelar') },
    { label: 'Excluir', action: () => this.notify.success('Excluir'), type: 'danger' }
  ];

  fiveActions: Array<PoPageAction> = [
    { label: 'Acao 1', action: () => this.notify.success('1'), icon: 'an an-check' },
    { label: 'Acao 2', action: () => this.notify.success('2') },
    { label: 'Acao 3', action: () => this.notify.success('3') },
    { label: 'Acao 4', action: () => this.notify.success('4') },
    { label: 'Acao 5', action: () => this.notify.success('5') }
  ];

  constructor(private notify: PoNotificationService) {}

  onBack(): void {
    this.notify.success('Voltar');
  }
}
