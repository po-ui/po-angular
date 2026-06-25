import { Component } from '@angular/core';
import {
  PoSearchAiColumn,
  PoSearchAiResult,
  PoThemeA11yEnum,
  poThemeDefault,
  PoThemeService
} from 'projects/ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  result: PoSearchAiResult;
  isDark = false;
  isAAA = true;

  readonly columns: Array<PoSearchAiColumn> = [
    { property: 'name', label: 'Nome', type: 'string' },
    { property: 'age', label: 'Idade', type: 'number' },
    { property: 'city', label: 'Cidade', type: 'string' }
  ];

  constructor(private themeService: PoThemeService) {
    this.themeService.setTheme(poThemeDefault, 0, PoThemeA11yEnum.AAA);
    this.themeService.setA11yDefaultSizeSmall(true);
  }

  onThemeChange(dark: boolean) {
    this.themeService.setTheme(poThemeDefault, dark ? 1 : 0, this.isAAA ? PoThemeA11yEnum.AAA : PoThemeA11yEnum.AA);
  }

  onA11yChange(aaa: boolean) {
    this.isAAA = aaa;
    this.themeService.setTheme(poThemeDefault, this.isDark ? 1 : 0, aaa ? PoThemeA11yEnum.AAA : PoThemeA11yEnum.AA);
  }

  onResult(result: PoSearchAiResult) {
    this.result = result;
  }

  onClear() {
    this.result = undefined;
  }
}
