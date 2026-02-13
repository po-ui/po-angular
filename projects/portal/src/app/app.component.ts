import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PoMenuItem, PoNavbarIconAction, PoNavbarItem, PoThemeA11yEnum } from '@po-ui/ng-components';

import { PoDensityMode } from 'projects/ui/src/lib/enums/po-density-mode.enum';
import { firstValueFrom } from 'rxjs';
import { PoThemeService, PoThemeTypeEnum } from '../../../ui/src/lib';
import { poThemeConstant } from './shared/po-theme.constant';
import { VersionService } from './shared/version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  menus: Array<PoMenuItem> = [];
  items: Array<PoNavbarItem> = [];
  iconActions: Array<PoNavbarIconAction> = [];
  themeStorage = 'po-theme-default';
  a11yStorage = 'po-a11y-AAA';
  logoPoUI = './assets/po-logos/po_black.png';
  theme: PoThemeTypeEnum = 0;
  a11yLevel: PoThemeA11yEnum;

  private themeChangeListener: any;
  private a11yChangeListener: any;

  constructor(
    protected versionService: VersionService,
    protected poTheme: PoThemeService,
    public router: Router
  ) {
    const _poTheme = this.poTheme.applyTheme();
    this.a11yLevel = this.poTheme.getA11yLevel();

    if (!_poTheme) {
      this.theme = poThemeConstant.active.type;
      this.poTheme.setTheme(poThemeConstant, this.theme, this.a11yLevel);
    } else {
      this.theme = typeof _poTheme.active === 'object' ? _poTheme.active.type : _poTheme.active;
    }

    if (this.a11yLevel === PoThemeA11yEnum.AA) {
      this.poTheme.setA11yDefaultSizeSmall(true);
      this.poTheme.setDensityMode(PoDensityMode.Small);
    } else {
      this.poTheme.setDensityMode(PoDensityMode.Medium);
    }
  }

  ngOnInit() {
    if (localStorage.getItem('po-ui-theme')) {
      this.themeStorage = localStorage.getItem('po-ui-theme');
    }

    if (localStorage.getItem('po-ui-a11y')) {
      this.a11yStorage = localStorage.getItem('po-ui-a11y');
    }

    firstValueFrom(this.versionService.getCurrentVersion()).then(version => {
      this.items = [
        { label: 'Iniciar', link: '/' },
        { label: 'Componentes', link: '/documentation' },
        { label: 'Guias', link: '/guides' },
        { label: 'Ícones', link: '/icons' },
        { label: 'Ferramentas', link: '/tools' },
        { label: 'Construtor de temas', link: '/construtor-de-temas' },
        { label: 'Como contribuir', link: 'https://github.com/po-ui/po-angular/blob/master/CONTRIBUTING.md' },
        { label: 'Licença', link: 'https://github.com/po-ui/po-angular/blob/master/LICENSE' },
        { label: 'Core Team', link: 'https://github.com/orgs/po-ui/people' },
        { label: `v${version}`, link: 'https://github.com/po-ui/po-angular/blob/master/CHANGELOG.md' }
      ];
    });

    this.iconActions = this.actions;
    this.logoPoUI =
      this.themeStorage === 'po-theme-default' ? './assets/po-logos/po_black.png' : './assets/po-logos/po_white.png';

    this.themeChangeListener = () => {
      this.changeTheme(false);
    };

    this.a11yChangeListener = () => {
      this.changeA11yLevel(false);
    };

    window.addEventListener('po-sample-change-theme', this.themeChangeListener);
    window.addEventListener('po-sample-change-a11y', this.a11yChangeListener);
  }

  openExternalLink(url) {
    window.open(url, '_blank');
  }

  changeTheme(dispatchEvent = true) {
    this.themeStorage = this.themeStorage === 'po-theme-default' ? 'po-theme-dark' : 'po-theme-default';
    localStorage.setItem('po-ui-theme', this.themeStorage);
    this.theme = this.themeStorage === 'po-theme-default' ? 0 : 1;
    this.logoPoUI =
      this.themeStorage === 'po-theme-default' ? './assets/po-logos/po_black.png' : './assets/po-logos/po_white.png';
    this.iconActions = this.actions;

    this.a11yLevel = this.poTheme.getA11yLevel();

    this.poTheme.setTheme(poThemeConstant, this.theme, this.a11yLevel);

    if (this.a11yLevel === PoThemeA11yEnum.AA) {
      this.poTheme.setA11yDefaultSizeSmall(true);
    }

    if (dispatchEvent) {
      window.dispatchEvent(new Event(this.themeStorage));
    }
  }

  changeA11yLevel(dispatchEvent = true) {
    this.a11yStorage = this.a11yStorage === 'po-a11y-AAA' ? 'po-a11y-AA' : 'po-a11y-AAA';
    localStorage.setItem('po-ui-a11y', this.a11yStorage);
    this.a11yLevel = this.a11yStorage === 'po-a11y-AAA' ? PoThemeA11yEnum.AAA : PoThemeA11yEnum.AA;
    this.iconActions = this.actions;

    this.poTheme.setTheme(poThemeConstant, this.theme, this.a11yLevel);

    if (this.a11yLevel === PoThemeA11yEnum.AA) {
      this.poTheme.setA11yDefaultSizeSmall(true);
      this.poTheme.setDensityMode(PoDensityMode.Small);
    } else {
      this.poTheme.setDensityMode(PoDensityMode.Medium);
    }

    if (dispatchEvent) {
      window.dispatchEvent(new Event(this.a11yStorage));
    }
  }

  get actions() {
    return [
      { icon: 'an an-github-logo', link: 'https://github.com/po-ui', label: 'Github', tooltip: 'Github' },
      {
        icon: 'an an-instagram-logo',
        link: 'https://www.instagram.com/pouidev/',
        label: 'Instagram',
        tooltip: 'Instagram'
      },
      {
        icon: `${this.themeStorage === 'po-theme-dark' ? 'an an-sun' : 'an an-moon'}`,
        label: `Theme ${this.themeStorage === 'po-theme-dark' ? 'Light' : 'Dark'}`,
        tooltip: `Theme ${this.themeStorage === 'po-theme-dark' ? 'Dark' : 'Light'}`,
        action: this.changeTheme.bind(this)
      },
      {
        icon: `${this.a11yStorage === 'po-a11y-AAA' ? 'an-fill an-text-aa' : 'an an-text-aa'}`,
        label: `Accessibility level ${this.a11yStorage === 'po-a11y-AAA' ? PoThemeA11yEnum.AA : PoThemeA11yEnum.AAA}`,
        tooltip: `Accessibility level ${this.a11yStorage === 'po-a11y-AAA' ? PoThemeA11yEnum.AAA : PoThemeA11yEnum.AA}`,
        action: this.changeA11yLevel.bind(this)
      }
    ];
  }

  ngOnDestroy(): void {
    window.removeEventListener('po-sample-change-theme', this.themeChangeListener);
    window.removeEventListener('po-sample-change-a11y', this.a11yChangeListener);
  }
}
