import { Component } from '@angular/core';
import { PoButtonGroupItem } from '../../../ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  buttons: Array<PoButtonGroupItem> = [
    { icon: 'po-icon-news', action: this.action.bind(this), tooltip: 'Novidades' },
    { icon: 'po-icon-user', action: this.action.bind(this), tooltip: 'Usuário' }
  ];

  action(button) {
    alert(`${button.label}`);
  }
}
