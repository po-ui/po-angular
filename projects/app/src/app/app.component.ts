import { ChangeDetectorRef, Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import {
  PoSearchAiColumn,
  PoSearchAiError,
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
  isDark = false;
  isAAA = true;

  // Playground switches
  isDisabled = false;
  isReadonly = false;
  isRequired = false;
  hasClean = false;
  isLoading = false;
  useBrokenUrl = false;

  playgroundValue = '';
  result: PoSearchAiResult | null = null;
  lastError: PoSearchAiError | null = null;

  readonly columns: Array<PoSearchAiColumn> = [
    { property: 'name', label: 'Nome', type: 'string' },
    { property: 'age', label: 'Idade', type: 'number' },
    { property: 'city', label: 'Cidade', type: 'string' },
    { property: 'balance', label: 'Saldo', type: 'number' }
  ];

  readonly AI_URL = '/v1/ai/filter';
  readonly BROKEN_URL = 'http://localhost:9999/broken-endpoint';

  get playgroundUrl(): string {
    return this.useBrokenUrl ? this.BROKEN_URL : this.AI_URL;
  }

  markDirty(model: NgModel) {
    model.control.markAsDirty();
    model.control.updateValueAndValidity();
    this.cd.detectChanges();
  }

  constructor(
    private themeService: PoThemeService,
    private cd: ChangeDetectorRef
  ) {
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
    this.lastError = null;
  }

  onError(err: PoSearchAiError) {
    this.lastError = err;
    this.result = null;
  }

  onClear() {
    this.result = null;
    this.lastError = null;
  }
}
