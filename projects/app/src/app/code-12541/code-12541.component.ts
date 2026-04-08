import { Component } from '@angular/core';

@Component({
  selector: 'app-code-12541',
  templateUrl: './code-12541.component.html',
  standalone: false
})
export class Code12541Component {
  activeTab: string = 'header-types';

  tabs = [
    { label: 'Header Types', value: 'header-types' },
    { label: 'Layout Primary', value: 'layout-primary' },
    { label: 'Layout Secondary', value: 'layout-secondary' },
    { label: 'Layout Tertiary', value: 'layout-tertiary' },
    { label: 'Qtd. Acoes', value: 'actions-count' },
    { label: 'Kind Acoes', value: 'actions-kind' },
    { label: 'Estados Acoes', value: 'actions-states' },
    { label: 'Propriedades', value: 'properties' },
    { label: 'Edge Cases', value: 'edge-cases' },
    { label: 'Botao Voltar', value: 'back-button' },
    { label: 'Flexbox Layout', value: 'flexbox-layout' },
    { label: 'Token Background', value: 'background-token' },
    { label: 'Consumidores', value: 'page-consumers' }
  ];

  setTab(tab: string): void {
    this.activeTab = tab;
  }
}
