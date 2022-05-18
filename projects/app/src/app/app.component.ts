import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  empresaSemPadrao;

  empresas1 = [
    {
      value: 1,
      label: 'TOTVS SA'
    },
    {
      value: 6,
      label: 'INSTITUTO TOTVS DE ENSINO SA'
    },
    {
      value: 7,
      label: 'INSTITUTO TOTVS DE ENSINO SUPERIOR SA'
    }
  ];

  empresas2 = [
    {
      codigo: 1,
      nomeFantasia: 'TOTVS SA'
    },
    {
      codigo: 6,
      nomeFantasia: 'INSTITUTO TOTVS DE ENSINO SA'
    },
    {
      codigo: 7,
      nomeFantasia: 'INSTITUTO TOTVS DE ENSINO SUPERIOR SA'
    }
  ];

  empresas3 = [
    {
      codigo: 1,
      nomeFantasia: 'TOTVS SA'
    },
    {
      codigo: 6,
      nomeFantasia: 'INSTITUTO TOTVS DE ENSINO SA'
    },
    {
      codigo: 7,
      nomeFantasia: 'INSTITUTO TOTVS DE ENSINO SUPERIOR SA'
    },
    {
      codigo: 7,
      nomeFantasia: 'INSTITUTO TOTVS DE ENSINO SUPERIOR SA'
    }
  ];
}
