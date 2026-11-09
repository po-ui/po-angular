import { AfterViewInit, ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';

import { PoThemeA11yEnum, PoThemeTypeEnum } from '@po-ui/ng-components';

import { PoDensityMode } from '../../../../../ui/src/lib/enums/po-density-mode.enum';
import { poThemeDefault, PoThemeService } from '../../../../../ui/src/lib';

@Component({
  selector: 'app-appearance-popover',
  templateUrl: './appearance-popover.component.html',
  styleUrls: ['./appearance-popover.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AppearancePopoverComponent implements AfterViewInit {
  @ViewChild('popoverContent', { static: true }) popoverContentRef!: TemplateRef<any>;

  selectedMode: 'light' | 'dark' = 'light';
  selectedA11y: 'AA' | 'AAA' = 'AAA';

  constructor(private readonly poTheme: PoThemeService) {}

  ngAfterViewInit(): void {
    this.loadCurrentSettings();
  }

  onModeChange(value: 'light' | 'dark'): void {
    this.selectedMode = value;
    this.applyTheme();
  }

  onA11yChange(value: 'AA' | 'AAA'): void {
    this.selectedA11y = value;
    this.applyTheme();
  }

  resetAll(): void {
    this.selectedMode = 'light';
    this.selectedA11y = 'AAA';
    this.applyTheme();
  }

  loadCurrentSettings(): void {
    const theme = this.poTheme.getThemeActive();
    if (!theme) {
      return;
    }

    const active =
      typeof theme.active === 'object'
        ? theme.active
        : { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA };

    this.selectedMode = active.type === PoThemeTypeEnum.dark ? 'dark' : 'light';
    this.selectedA11y = active.a11y === PoThemeA11yEnum.AA ? 'AA' : 'AAA';
  }

  private applyTheme(): void {
    const mode = this.selectedMode === 'dark' ? PoThemeTypeEnum.dark : PoThemeTypeEnum.light;
    const a11y = this.selectedA11y === 'AAA' ? PoThemeA11yEnum.AAA : PoThemeA11yEnum.AA;

    if (a11y === PoThemeA11yEnum.AA) {
      this.poTheme.setA11yDefaultSizeSmall(true);
      this.poTheme.setDensityMode(PoDensityMode.Small);
    } else {
      this.poTheme.setDensityMode(PoDensityMode.Medium);
    }

    this.poTheme.setTheme(poThemeDefault, mode, a11y);
  }
}
