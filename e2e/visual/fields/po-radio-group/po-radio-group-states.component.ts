import { Component } from '@angular/core';

@Component({
  selector: 'app-visual-test-po-radio-group-states',
  templateUrl: './po-radio-group-states.component.html',
  standalone: false
})
export class VisualTestPoRadioGroupStatesComponent {
  options = [
    { label: 'Opcao 1', value: '1' },
    { label: 'Opcao 2', value: '2' },
    { label: 'Opcao 3', value: '3' }
  ];
}
