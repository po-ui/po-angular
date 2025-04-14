import { Component } from '@angular/core';
import { PoThemeA11yEnum, poThemeDefault, PoThemeService } from 'projects/ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  size = 'medium';
  theme = '';

  constructor(private poTheme: PoThemeService) {
    const defaultTheme = PoThemeA11yEnum.AAA;

    this.poTheme.setTheme(poThemeDefault, 0, defaultTheme);
    this.theme = defaultTheme;

    this.poTheme.setA11yDefaultSizeSmall(true);
  }

  toggleTheme() {
    const currentTheme = this.poTheme.getThemeActive();

    // @ts-expect-error Incorrect type
    if (currentTheme.active.a11y === 'AA') {
      this.poTheme.setTheme(poThemeDefault, 0, PoThemeA11yEnum.AAA);
      this.theme = PoThemeA11yEnum.AAA;
    } else {
      this.poTheme.setTheme(poThemeDefault, 0, PoThemeA11yEnum.AA);
      this.theme = PoThemeA11yEnum.AA;
    }

    this.poTheme.setA11yDefaultSizeSmall(true);
  }

  toggleSize() {
    if (this.size === 'small') {
      this.size = 'medium';
    } else {
      this.size = 'small';
    }
  }
}
