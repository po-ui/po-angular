import { Component } from '@angular/core';

@Component({
  selector: 'app-scenario-page-consumers',
  templateUrl: './page-consumers.component.html',
  standalone: false
})
export class ScenarioPageConsumersComponent {
  actionsDefault = [
    { label: 'Acao 1', action: () => {} },
    { label: 'Acao 2', action: () => {} },
    { label: 'Acao 3', action: () => {} }
  ];

  actionsOverflow = [
    { label: 'Acao 1', action: () => {} },
    { label: 'Acao 2', action: () => {} },
    { label: 'Acao 3', action: () => {} },
    { label: 'Acao 4', action: () => {} },
    { label: 'Acao 5', action: () => {} }
  ];

  breadcrumb = {
    items: [
      { label: 'Home', link: '/' },
      { label: 'Modulo', link: '/' },
      { label: 'Pagina' }
    ]
  };

  longContent: string[] = Array.from({ length: 30 }, (_, i) => `Linha de conteudo ${i + 1}`);
}
