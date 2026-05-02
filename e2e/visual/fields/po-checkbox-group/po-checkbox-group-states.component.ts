import { Component } from '@angular/core';

@Component({
  selector: 'app-visual-test-po-checkbox-group-states',
  templateUrl: './po-checkbox-group-states.component.html',
  standalone: false
})
export class VisualTestPoCheckboxGroupStatesComponent {
  options = [
    { label: 'Opcao 1', value: '1' },
    { label: 'Opcao 2', value: '2' },
    { label: 'Opcao 3', value: '3' }
  ];
}
