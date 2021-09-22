import { Component } from '@angular/core';
import { PoButtonGroupItem, PoButtonGroupToggle } from '../../../ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  toggle = PoButtonGroupToggle.Multiple;
  buttons: Array<PoButtonGroupItem> = [
    { label: 'Button 1', action: this.action.bind(this), selected: true },
    { label: 'Button 2', action: this.action.bind(this), tooltip: 'teste tooltip' },
    { label: 'Button 3', action: this.action.bind(this), tooltip: 'teste tooltip 2', disabled: true }
  ];

  action(button) {
    console.log(`${button.label}`);
  }

  testa() {
    console.log('disparou :)');
  }
}
