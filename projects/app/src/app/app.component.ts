import { Component } from '@angular/core';
import { PoThemeA11yEnum, poThemeDefault, PoThemeService } from 'projects/ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  constructor(private poTheme: PoThemeService) {
    const defaultTheme = PoThemeA11yEnum.AAA;

    this.poTheme.setTheme(poThemeDefault, 0, defaultTheme);

    this.poTheme.setA11yDefaultSizeSmall(true);
  }
}
