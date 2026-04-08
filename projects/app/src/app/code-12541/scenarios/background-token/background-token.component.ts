import { Component } from '@angular/core';

@Component({
  selector: 'app-scenario-background-token',
  templateUrl: './background-token.component.html',
  standalone: false
})
export class ScenarioBackgroundTokenComponent {
  actionsDefault = [
    { label: 'Salvar', action: () => {} },
    { label: 'Cancelar', action: () => {} }
  ];

  breadcrumb = {
    items: [
      { label: 'Home', link: '/' },
      { label: 'Token Background' }
    ]
  };
}
