import { Component } from '@angular/core';
import { poThemeDefault, PoThemeService } from '../../../ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private poTheme: PoThemeService) {
    this.poTheme.setTheme(poThemeDefault, 1)
  }
}
