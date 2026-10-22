import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Em projetos externos, troque os imports abaixo por:
// import { poThemeDefault, poThemeDefaultDeprecated, PoModule, PoPopoverComponent,
//          PoThemeA11yEnum, PoThemeService, PoThemeTypeEnum } from '@po-ui/ng-components';
import { poThemeDefault, poThemeDefaultDeprecated, PoThemeService } from '../../../../ui/src/lib';
import { PoThemeA11yEnum } from '../../../../ui/src/lib/services/po-theme/enum/po-theme-a11y.enum';
import { PoThemeTypeEnum } from '../../../../ui/src/lib/services/po-theme/enum/po-theme-type.enum';
import { PoPopoverComponent } from '../../../../ui/src/lib/components/po-popover/po-popover.component';
import { PoModule } from '../../../../ui/src/public-api';

/**
 * Popover de aparência standalone, equivalente ao do portal THF, porém usando o `PoThemeService`
 * do `@po-ui/ng-components` (sem dependência de `@totvs/themes`).
 *
 * Permite alternar, em tempo real (via `PoThemeService.setTheme`), entre:
 * - Tema: EVO (`poThemeDefault`) e Depreciado (`poThemeDefaultDeprecated`);
 * - Tipo: Claro (light) e Escuro (dark);
 * - Acessibilidade/densidade: AA (compacto) e AAA (espaçoso).
 *
 * Este é um cenário de teste distinto da manipulação direta do `localStorage` feita pelo app:
 * aqui exercitamos a APLICAÇÃO do tema em runtime; lá se testa a REIDRATAÇÃO da preferência salva.
 *
 * Como usar em outro projeto:
 * 1. Copie este arquivo, o `appearance-popover.component.html` e o `.css`.
 * 2. Ajuste os imports para `@po-ui/ng-components`.
 * 3. Importe o componente (`imports: [AppearancePopoverComponent]`) e use `<app-appearance-popover>`.
 */
@Component({
  selector: 'app-appearance-popover',
  standalone: true,
  imports: [CommonModule, FormsModule, PoModule],
  templateUrl: './appearance-popover.component.html',
  styleUrl: './appearance-popover.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppearancePopoverComponent {
  @ViewChild('popover') popover!: PoPopoverComponent;

  private readonly poTheme = inject(PoThemeService);

  readonly themeOptions = [
    { label: 'EVO', value: 'default' },
    { label: 'Depreciado', value: 'defaultdeprecated' }
  ];

  selectedTheme = 'default';
  selectedMode = 'light';
  selectedA11y = 'AAA';

  constructor() {
    this.loadCurrentSettings();
  }

  openPopover(): void {
    this.popover.open();
  }

  onThemeChange(value: string): void {
    this.selectedTheme = value;
    this.applyTheme();
  }

  onModeChange(value: string): void {
    this.selectedMode = value;
    this.applyTheme();
  }

  onA11yChange(value: string): void {
    this.selectedA11y = value;
    this.applyTheme();
  }

  private loadCurrentSettings(): void {
    const active = this.poTheme.getThemeActive();
    if (!active) {
      return;
    }

    this.selectedTheme = active.name?.includes('deprecated') ? 'defaultdeprecated' : 'default';

    const activeConfig =
      typeof active.active === 'object'
        ? active.active
        : { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA };

    this.selectedMode = activeConfig.type === PoThemeTypeEnum.dark ? 'dark' : 'light';
    this.selectedA11y = activeConfig.a11y === PoThemeA11yEnum.AA ? 'AA' : 'AAA';
  }

  private applyTheme(): void {
    const themeConfig = this.selectedTheme === 'defaultdeprecated' ? poThemeDefaultDeprecated : poThemeDefault;
    const type = this.selectedMode === 'dark' ? PoThemeTypeEnum.dark : PoThemeTypeEnum.light;
    const a11y = this.selectedA11y === 'AA' ? PoThemeA11yEnum.AA : PoThemeA11yEnum.AAA;

    // Mesmo fluxo do popover do THF: a densidade acompanha o nível de acessibilidade.
    this.poTheme.setDensityMode(a11y === PoThemeA11yEnum.AA ? 'small' : 'medium');
    this.poTheme.setTheme(themeConfig, type, a11y);
  }
}
