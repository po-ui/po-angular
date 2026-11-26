import { AfterViewInit, ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';

import {
  PoModalAction,
  PoModalComponent,
  PoRadioGroupOption,
  PoTheme,
  PoThemeA11yEnum,
  PoThemeTypeEnum
} from '@po-ui/ng-components';

import { PoDensityMode } from '../../../../../ui/src/lib/enums/po-density-mode.enum';
import { poThemeDefault, poThemeDefaultDeprecated, PoThemeService } from '../../../../../ui/src/lib';

type ThemeKey = 'default' | 'deprecated';

/**
 * Até onde a aparência abre num modal em vez do popover: o mesmo breakpoint da busca
 * (`search-box.component.css`, onde o campo vira um ícone que abre o modal).
 */
export const APPEARANCE_MODAL_QUERY = '(max-width: 767px)';

@Component({
  selector: 'app-appearance-popover',
  templateUrl: './appearance-popover.component.html',
  styleUrls: ['./appearance-popover.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AppearancePopoverComponent implements AfterViewInit {
  @ViewChild('popoverContent', { static: true }) popoverContentRef!: TemplateRef<any>;
  @ViewChild('modal', { static: true }) modal!: PoModalComponent;

  /** O conteúdo só entra no modal enquanto ele está aberto (o popover usa o mesmo template). */
  modalOpen = false;

  readonly closeAction: PoModalAction = { label: 'Fechar', action: () => this.modal.close() };

  selectedTheme: ThemeKey = 'default';
  selectedMode: 'light' | 'dark' = 'light';
  selectedA11y: 'AA' | 'AAA' = 'AAA';

  readonly themeOptions: Array<PoRadioGroupOption> = [
    { label: 'EVO', value: 'default' },
    { label: 'PO UI Depreciado', value: 'deprecated' }
  ];

  private readonly themes: Record<ThemeKey, PoTheme> = {
    default: poThemeDefault,
    deprecated: poThemeDefaultDeprecated
  };

  constructor(private readonly poTheme: PoThemeService) {}

  ngAfterViewInit(): void {
    this.loadCurrentSettings();
  }

  /** Celular: abre a aparência no modal (o desktop usa o popover do header). */
  openModal(): void {
    this.loadCurrentSettings();
    this.modalOpen = true;
    this.modal.open();
  }

  onThemeChange(value: ThemeKey): void {
    this.selectedTheme = value;
    this.applyTheme();
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
    this.selectedTheme = 'default';
    this.selectedMode = 'light';
    this.selectedA11y = 'AAA';
    this.applyTheme();
  }

  loadCurrentSettings(): void {
    const theme = this.poTheme.getThemeActive();
    if (!theme) {
      return;
    }

    let shouldForceUpdate = false;

    switch (theme?.name) {
      case poThemeDefault.name:
        this.selectedTheme = 'default';
        break;

      case poThemeDefaultDeprecated.name:
        this.selectedTheme = 'deprecated';
        break;
    
      default:
        this.selectedTheme = 'default';
        shouldForceUpdate = true;
        break;
    }

    this.selectedTheme = theme.name === poThemeDefaultDeprecated.name ? 'deprecated' : 'default';

    const active =
      typeof theme.active === 'object' ? theme.active : { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA };

    this.selectedMode = active.type === PoThemeTypeEnum.dark ? 'dark' : 'light';
    this.selectedA11y = active.a11y === PoThemeA11yEnum.AA ? 'AA' : 'AAA';

    if (shouldForceUpdate) {
      this.applyTheme();
    }
  }

  private applyTheme(): void {
    const themeConfig = this.themes[this.selectedTheme];
    const mode = this.selectedMode === 'dark' ? PoThemeTypeEnum.dark : PoThemeTypeEnum.light;
    const a11y = this.selectedA11y === 'AAA' ? PoThemeA11yEnum.AAA : PoThemeA11yEnum.AA;

    if (a11y === PoThemeA11yEnum.AA) {
      this.poTheme.setA11yDefaultSizeSmall(true);
      this.poTheme.setDensityMode(PoDensityMode.Small);
    } else {
      this.poTheme.setDensityMode(PoDensityMode.Medium);
    }

    this.poTheme.setTheme(themeConfig, mode, a11y);
  }
}
