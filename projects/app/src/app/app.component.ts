import { Component } from '@angular/core';
import { PoButtonGroupItem } from '../../../ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  buttons: Array<PoButtonGroupItem> = [
    { label: 'Button 1', action: this.action.bind(this) },
    { label: 'Button 2', action: this.action.bind(this), tooltip: 'teste tooltip' }
  ];

  action(button) {
    alert(`${button.label}`);
  }

  testa() {
    console.log('disparou :)');
  }
}
