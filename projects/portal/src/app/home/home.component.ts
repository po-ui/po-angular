import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { PoListViewFieldProperties, PoListViewLiterals, PoNotificationService, PoTreeViewItem } from '@po-ui/ng-components';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeComponent {
  readonly listViewLiterals: PoListViewLiterals = {
    loadMoreData: 'Carregar'
  };

  readonly notificationFieldProperties: PoListViewFieldProperties = {
    title: 'title',
    subtitle: 'content',
    avatar: 'avatar',
    tag: { value: 'tag', type: 'tagType' }
  };

  readonly notificationList = [
    {
      title: 'Relatório de faturamento',
      content: 'O arquivo solicitado já está disponível para download',
      tag: 'Concluído',
      tagType: 'success',
      avatar: { icon: 'an an-check-circle', color: '#ffffff', backgroundColor: '#0c9b4b' }
    },
    {
      title: 'Nova versão 22',
      content: 'Atualize seu projeto para a versão mais recente',
      tag: 'Novidade',
      tagType: 'neutral',
      avatar: { icon: 'an an-arrow-circle-up', color: '#ffffff', backgroundColor: '#000000' }
    }
  ];

  readonly folderItems: Array<PoTreeViewItem> = [
    {
      label: 'meu_projeto',
      value: 1,
      expanded: true,
      subItems: [
        { label: 'package.json', value: 11 },
        { label: 'README.md', value: 12 },
        {
          label: 'src',
          value: 13,
          expanded: true,
          subItems: [{ label: 'main.ts', value: 131 }]
        }
      ]
    }
  ];

  constructor(
    private router: Router,
    private poNotification: PoNotificationService
  ) {}

  showMore() {
    this.poNotification.success('Mais notificações carregadas com sucesso!');
  }

  openInternalLink(route) {
    this.router.navigate([`/${route}`]);
  }

  openExternalLink(url) {
    window.open(url, '_blank');
  }

  imageHeart() {
    return localStorage.getItem('po-ui-theme') === 'po-theme-dark'
      ? './assets/graphics/home-icon-heart-white.svg'
      : './assets/graphics/home-icon-heart.svg';
  }
}
