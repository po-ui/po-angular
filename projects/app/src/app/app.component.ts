import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  menus = [
    {
      label: 'Normal',
      link: '/normal'
    },
    {
      label: 'Virtual',
      link: '/virtual'
    }
  ];
}
