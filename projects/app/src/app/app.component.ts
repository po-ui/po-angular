import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { poThemeDefault, poThemeDefaultDeprecated, PoThemeService } from '../../../ui/src/lib';
import { THEME_DEFAULT_DEPRECATED, THEME_DEFAULT_EVO } from './localstorage-themes';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AppComponent {
  theme = 'default';
  a11y = 'AAA';
  type = 'light';
  // private poThemeService = inject(PoThemeService);

  widget = { title: 'Arraste-me', body: 'Este widget pode ser arrastado livremente.' };

  constructor() {
    const storedTheme = localStorage.getItem('totvs-theme');
    if (storedTheme) {
      const storedThemeObject = JSON.parse(storedTheme);
      this.theme = storedThemeObject.name;
      this.a11y = storedThemeObject.active.a11y;
      this.type = storedThemeObject.active.type === 1 ? 'dark' : 'light';
    }
  }

  onChangeThemePreferences() {
    this.setLocalstorageTheme(this.theme as any, this.a11y as any, this.type as any);
  }

  setLocalstorageTheme(theme: 'default' | 'defaultdeprecated', a11y: 'AAA' | 'AA', type: 'light' | 'dark') {
    console.log('setLocalstorageTheme', {
      theme,
      a11y,
      type
    });
    let desiredTheme = theme === 'defaultdeprecated' ? THEME_DEFAULT_DEPRECATED : THEME_DEFAULT_EVO;

    desiredTheme.active.type = type === 'light' ? 0 : 1;
    desiredTheme.active.a11y = a11y;

    localStorage.setItem('totvs-theme', JSON.stringify(desiredTheme));
  }

  reload() {
    window.location.reload();
  }
}
