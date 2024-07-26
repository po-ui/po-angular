import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PoMenuItem, PoNavbarItem, PoNavbarIconAction, PoNotificationService } from '@po-ui/ng-components';

import { VersionService } from './shared/version.service';

const KEY_STORAGE_REVIEW_SURVEY = 'review_survey_po_ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  menus: Array<PoMenuItem> = [];
  items: Array<PoNavbarItem> = [];
  iconActions: Array<PoNavbarIconAction> = [];

  private location;

  constructor(
    private versionService: VersionService,
    private notification: PoNotificationService,
    public router: Router
  ) {}

  async ngOnInit() {
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

    this.iconActions = [
      { icon: 'ph ph-github-logo', link: 'https://github.com/po-ui', label: 'Github' },
      { icon: 'ph ph-x-logo', link: 'https://twitter.com/@pouidev', label: 'Twitter' },
      { icon: 'ph ph-instagram-logo', link: 'https://www.instagram.com/pouidev/', label: 'Instagram' }
    ];
  }

  openExternalLink(url) {
    window.open(url, '_blank');
  }
}
