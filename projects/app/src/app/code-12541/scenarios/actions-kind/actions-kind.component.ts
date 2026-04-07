import { Component } from '@angular/core';

import { PoNotificationService, PoPageAction } from '../../../../../../ui/src/public-api';

@Component({
  selector: 'app-scenario-actions-kind',
  templateUrl: './actions-kind.component.html',
  standalone: false
})
export class ScenarioActionsKindComponent {
  actionsWithKind: Array<PoPageAction> = [
    { label: 'Primary Kind', action: () => this.notify.success('Primary'), kind: 'primary', icon: 'an an-star' },
    { label: 'Secondary Kind', action: () => this.notify.success('Secondary'), kind: 'secondary' },
    { label: 'Tertiary Kind', action: () => this.notify.success('Tertiary'), kind: 'tertiary' }
  ];

  actionsNoKind: Array<PoPageAction> = [
    { label: 'Sem kind 1', action: () => this.notify.success('1'), icon: 'an an-check' },
    { label: 'Sem kind 2', action: () => this.notify.success('2') },
    { label: 'Sem kind 3', action: () => this.notify.success('3') }
  ];

  actionsMixed: Array<PoPageAction> = [
    { label: 'Explicit Primary', action: () => this.notify.success('1'), kind: 'primary', icon: 'an an-check' },
    { label: 'Sem kind', action: () => this.notify.success('2') },
    { label: 'Explicit Tertiary', action: () => this.notify.success('3'), kind: 'tertiary' }
  ];

  constructor(private notify: PoNotificationService) {}

  onBack(): void {
    this.notify.success('Voltar');
  }
}
