import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import {
  PoRadioGroupOption,
  PoTheme,
  PoThemeA11yEnum,
  PoThemeService,
  PoThemeTypeEnum,
  poAnimaliaTheme,
  poThemeDefault
} from '../../../ui/src/public-api';

type ThemeKey = 'default' | 'animalia';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [PoThemeService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AppComponent implements OnInit {
  selectedTheme: ThemeKey = 'animalia';
  type: PoThemeTypeEnum = PoThemeTypeEnum.light;
  a11y: PoThemeA11yEnum = PoThemeA11yEnum.AAA;

  readonly themeOptions: Array<PoRadioGroupOption> = [
    { label: 'Tema atual (default)', value: 'default' },
    { label: 'Novo tema (Animalia)', value: 'animalia' }
  ];

  readonly typeOptions: Array<PoRadioGroupOption> = [
    { label: 'Light', value: PoThemeTypeEnum.light },
    { label: 'Dark', value: PoThemeTypeEnum.dark }
  ];

  readonly a11yOptions: Array<PoRadioGroupOption> = [
    { label: 'AAA', value: PoThemeA11yEnum.AAA },
    { label: 'AA', value: PoThemeA11yEnum.AA }
  ];

  private readonly themes: Record<ThemeKey, PoTheme> = {
    default: poThemeDefault,
    animalia: poAnimaliaTheme
  };

  constructor(private readonly poTheme: PoThemeService) {}

  ngOnInit(): void {
    this.applyTheme();
  }

  onThemeChange(value: ThemeKey): void {
    this.selectedTheme = value;
    this.applyTheme();
  }

  onTypeChange(value: PoThemeTypeEnum): void {
    this.type = value;
    this.applyTheme();
  }

  onA11yChange(value: PoThemeA11yEnum): void {
    this.a11y = value;
    this.applyTheme();
  }

  private applyTheme(): void {
    this.poTheme.setTheme(this.themes[this.selectedTheme], this.type, this.a11y);
  }
}
