import { Component } from '@angular/core';

@Component({
  selector: 'app-visual-test-po-combo-states',
  templateUrl: './po-combo-states.component.html',
  standalone: false
})
export class VisualTestPoComboStatesComponent {
  options = [
    { label: 'Opcao 1', value: '1' },
    { label: 'Opcao 2', value: '2' },
    { label: 'Opcao 3', value: '3' }
  ];
}
