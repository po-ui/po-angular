import { Component } from '@angular/core';

@Component({
  selector: 'app-scenario-flexbox-layout',
  templateUrl: './flexbox-layout.component.html',
  standalone: false
})
export class ScenarioFlexboxLayoutComponent {
  actionsDefault = [
    { label: 'Salvar', action: () => {} },
    { label: 'Cancelar', action: () => {} }
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
      { label: 'Pagina Atual' }
    ]
  };

  longContent: string[] = Array.from({ length: 50 }, (_, i) => `Item de conteudo ${i + 1} - texto para simular scroll`);

  menuItems = [
    { label: 'Dashboard', icon: 'an an-house-line', link: '/' },
    { label: 'Cadastros', icon: 'an an-list', link: '/' },
    { label: 'Relatorios', icon: 'an an-chart-line', link: '/' }
  ];
}
