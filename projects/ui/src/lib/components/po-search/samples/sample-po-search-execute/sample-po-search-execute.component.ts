import { Component, ViewChild } from '@angular/core';

import { PoModalComponent, PoSearchFilterMode } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-search-execute',
  templateUrl: './sample-po-search-execute.component.html',
  styles: [
    `
      .full {
        width: 100%;
      }
    `
  ],
  standalone: false
})
export class SamplePoSearchExecuteComponent {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  filterType = PoSearchFilterMode.contains;
  filterKeysAction: Array<string> = ['rotina', 'codigo', 'modulo', 'versao'];
  keysLabel: Array<string> = ['rotina', 'codigo'];

  itemsAction = [
    {
      rotina: 'Contas a Pagar',
      codigo: 'MATA103',
      modulo: 'Adm',
      versao: '1.2.3',
      action: () => alert(`Contas a Pagar`)
    },
    {
      rotina: 'Cotação de Fornecedores',
      codigo: 'MATA140',
      modulo: 'Adm',
      versao: '1.2.3',
      action: () => alert(`Cotação de Fornecedores`)
    },
    {
      rotina: 'Meus Funcionarios',
      codigo: 'XPTO987',
      modulo: 'RH',
      versao: '1.2.3',
      url: 'documentation/po-widget'
    }
  ];

  columns = [
    { property: 'rotina', label: 'Rotina' },
    { property: 'codigo', label: 'Código' },
    { property: 'modulo', label: 'Módulo' },
    { property: 'versao', label: 'Versão' }
  ];

  footerAction() {
    this.poModal.open();
  }
}
