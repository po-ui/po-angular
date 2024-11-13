import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  options = [
    { value: 'Option 1', label: 'Opção 1' },
    { value: 'Option 2', label: 'Opção 2' },
    { value: 'Option 3', label: 'Opção 3' },
    { value: 'Option 4', label: 'Opção 4' }
  ];

  // Valores iniciais para os combos
  selectedOption1 = 'Option 2';
  selectedOption2 = 'Option 2';
  selectedOption3 = '0148093543698'; // Valor inicial do Combo 3 com ID específico da API

  fields = [
    {
      property: 'partner',
      gridColumns: 6,
      gridSmColumns: 12,
      optionsService: 'https://po-sample-api.onrender.com/v1/people',
      fieldLabel: 'name',
      fieldValue: 'id',
      control: 'combo',
      optional: true,
      removeInitialFilter: true
    }
  ];

  value = {
    partner: '0148093543698'
  };
}
