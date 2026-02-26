import { Component } from '@angular/core';
import { PoThemeA11yEnum, poThemeDefault, PoThemeService, PoThemeTypeEnum } from 'projects/ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  constructor(private themeService: PoThemeService) {
    this.themeService.setTheme(poThemeDefault, PoThemeTypeEnum.dark, PoThemeA11yEnum.AA);
  }
}
