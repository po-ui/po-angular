import { Component, inject } from '@angular/core';

import {
  PoMenuItem,
  PoThemeA11yEnum,
  PoThemeService,
  PoThemeTypeEnum,
  PoToolbarAction,
  poThemeDefault
} from '../../../ui/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  private readonly themeService = inject(PoThemeService);

  isDarkTheme = false;
  isAAALevel = true;

  menus: PoMenuItem[] = [
    {
      label: 'Home',
      icon: 'an an-house',
      link: '/',
      shortLabel: 'Home'
    },
    {
      label: 'Fase 1 - CDK Puro',
      icon: 'an an-squares-four',
      link: '/fase1',
      shortLabel: 'Fase 1'
    },
    {
      label: 'Fase 2 - CDK + Widget',
      icon: 'an an-layout',
      link: '/fase2',
      shortLabel: 'Fase 2'
    },
    {
      label: 'Fase 2.1 - CDK + Widget + Linhas Explícitas',
      icon: 'an an-grid-four',
      link: '/fase2-1',
      shortLabel: 'Fase 2.1'
    },
    {
      label: 'Fase 2.2 - Grid Layout SUI',
      icon: 'an an-squares-four',
      link: '/fase2-2',
      shortLabel: 'Fase 2.2'
    },
    {
      label: 'Fase 2.3 - SUI + UX',
      icon: 'an an-cursor-click',
      link: '/fase2-3',
      shortLabel: 'Fase 2.3'
    }
  ];

  toolbarActions: PoToolbarAction[] = [
    {
      icon: 'an an-moon',
      label: 'Alternar Tema (Claro/Escuro)',
      action: () => this.toggleTheme()
    },
    {
      icon: 'an an-eye',
      label: 'Acessibilidade AA',
      action: () => this.setA11yAA()
    },
    {
      icon: 'an an-eye',
      label: 'Acessibilidade AAA',
      action: () => this.setA11yAAA()
    }
  ];

  private toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    const themeType = this.isDarkTheme ? PoThemeTypeEnum.dark : PoThemeTypeEnum.light;
    this.themeService.setTheme(poThemeDefault, themeType, this.isAAALevel ? PoThemeA11yEnum.AAA : PoThemeA11yEnum.AA, true);
  }

  private setA11yAA(): void {
    this.isAAALevel = false;
    const themeType = this.isDarkTheme ? PoThemeTypeEnum.dark : PoThemeTypeEnum.light;
    this.themeService.setTheme(poThemeDefault, themeType, PoThemeA11yEnum.AA, true);
  }

  private setA11yAAA(): void {
    this.isAAALevel = true;
    const themeType = this.isDarkTheme ? PoThemeTypeEnum.dark : PoThemeTypeEnum.light;
    this.themeService.setTheme(poThemeDefault, themeType, PoThemeA11yEnum.AAA, true);
  }
}
