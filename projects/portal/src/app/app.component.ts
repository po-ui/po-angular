import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PoMenuItem, PoNavbarIconAction, PoNavbarItem, PoNotificationService } from '@po-ui/ng-components';

import { PoThemeService, PoThemeTypeEnum } from '../../../ui/src/lib';
import { poThemeConstant } from './shared/po-theme.constant';
import { VersionService } from './shared/version.service';

const KEY_STORAGE_REVIEW_SURVEY = 'review_survey_po_ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  menus: Array<PoMenuItem> = [];
  items: Array<PoNavbarItem> = [];
  iconActions: Array<PoNavbarIconAction> = [];
  themeStorage = 'po-theme-default';
  logoPoUI = './assets/po-logos/po_black.png';
  theme: PoThemeTypeEnum = 0;

  private location;
  private themeChangeListener: any;

  constructor(
    private versionService: VersionService,
    private notification: PoNotificationService,
    private poTheme: PoThemeService,
    public router: Router
  ) {
    const _poTheme = this.poTheme.persistThemeActive();
    if (!_poTheme) {
      this.theme = poThemeConstant.active;
    } else {
      this.theme = _poTheme.active || 0;
    }

    this.poTheme.setTheme(poThemeConstant, this.theme);
  }

  async ngOnInit() {
    if (localStorage.getItem('po-ui-theme')) {
      this.themeStorage = localStorage.getItem('po-ui-theme');
    }

    const version = await this.versionService.getCurrentVersion().toPromise();

    this.items = [
      { label: 'Iniciar', link: '/' },
      { label: 'Componentes', link: '/documentation' },
      { label: 'Guias', link: '/guides' },
      { label: 'Ferramentas', link: '/tools' },
      { label: 'Construtor de temas', link: '/construtor-de-temas' },
      { label: 'Como contribuir', link: 'https://github.com/po-ui/po-angular/blob/master/CONTRIBUTING.md' },
      { label: 'Licença', link: 'https://github.com/po-ui/po-angular/blob/master/LICENSE' },
      { label: 'Core Team', link: 'https://github.com/orgs/po-ui/people' },
      { label: `v${version}`, link: 'https://github.com/po-ui/po-angular/blob/master/CHANGELOG.md' }
    ];

    this.iconActions = this.actions;
    this.logoPoUI =
      this.themeStorage === 'po-theme-default' ? './assets/po-logos/po_black.png' : './assets/po-logos/po_white.png';

    this.themeChangeListener = () => {
      this.changeTheme(false);
    };
    window.addEventListener('po-sample-change-theme', this.themeChangeListener);
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

    this.poTheme.setTheme(poThemeConstant, this.theme);

    if (dispatchEvent) {
      window.dispatchEvent(new Event(this.themeStorage));
    }
  }

  get actions() {
    return [
      { icon: 'ph ph-github-logo', link: 'https://github.com/po-ui', label: 'Github' },
      { icon: 'ph ph-x-logo', link: 'https://twitter.com/@pouidev', label: 'Twitter' },
      { icon: 'ph ph-instagram-logo', link: 'https://www.instagram.com/pouidev/', label: 'Instagram' },
      {
        icon: `${this.themeStorage === 'po-theme-dark' ? 'ph ph-sun' : 'ph ph-moon'}`,
        label: 'tema',
        action: this.changeTheme.bind(this)
      }
    ];
  }

  ngOnDestroy(): void {
    window.removeEventListener('po-sample-change-theme', this.themeChangeListener);
  }
}
