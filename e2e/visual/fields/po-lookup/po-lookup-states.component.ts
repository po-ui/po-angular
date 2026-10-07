import { Component } from '@angular/core';

@Component({
  selector: 'app-visual-test-po-lookup-states',
  templateUrl: './po-lookup-states.component.html',
  standalone: false
})
export class VisualTestPoLookupStatesComponent {
  filterService = 'https://po-sample-api.onrender.com/v1/heroes';
  cleanValue = '1';
}
