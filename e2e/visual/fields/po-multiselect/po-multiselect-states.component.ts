import { Component } from '@angular/core';

@Component({
  selector: 'app-visual-test-po-multiselect-states',
  templateUrl: './po-multiselect-states.component.html',
  standalone: false
})
export class VisualTestPoMultiselectStatesComponent {
  options = [
    { label: 'Opcao 1', value: '1' },
    { label: 'Opcao 2', value: '2' },
    { label: 'Opcao 3', value: '3' }
  ];
}
