import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  PoListViewFieldProperties,
  PoListViewLiterals,
  PoNotificationService,
  PoTreeViewItem
} from '@po-ui/ng-components';

@Component({
  selector: 'app-home-features',
  templateUrl: './home-features.component.html',
  styleUrls: ['./home-features.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeFeaturesComponent {
  readonly listViewLiterals: PoListViewLiterals = {
    loadMoreData: 'Carregar'
  };

  readonly notificationFieldProperties: PoListViewFieldProperties = {
    title: 'title',
    subtitle: 'content',
    avatar: 'avatar',
    tag: { value: 'tag', type: 'tagType' }
  };

  // the avatar colors come from theme tokens (they were fixed hex colors in the old Home), so they follow the light/dark theme
  readonly notificationList = [
    {
      title: 'Relatório de faturamento',
      content: 'O arquivo solicitado já está disponível para download',
      tag: 'Concluído',
      tagType: 'success',
      avatar: {
        icon: 'an an-check-circle',
        color: 'var(--color-neutral-light-00)',
        backgroundColor: 'var(--color-feedback-positive-base)'
      }
    },
    {
      title: 'Nova versão 22',
      content: 'Atualize seu projeto para a versão mais recente',
      tag: 'Novidade',
      tagType: 'neutral',
      avatar: {
        icon: 'an an-arrow-circle-up',
        color: 'var(--color-neutral-light-00)',
        backgroundColor: 'var(--color-neutral-dark-90)'
      }
    }
  ];

  /** Same height on both widgets: po-widget itself keeps the action at the bottom (p-height). */
  readonly widgetHeight = 492;

  readonly folderItems: Array<PoTreeViewItem> = [
    {
      label: 'meu_projeto',
      value: 1,
      expanded: true,
      subItems: [
        {
          label: 'src',
          value: 10,
          expanded: false,
          subItems: [
            {
              label: 'app',
              value: 101,
              expanded: false,
              subItems: [
                { label: 'app.component.html', value: 1011 },
                { label: 'app.component.ts', value: 1012 },
                { label: 'app.config.ts', value: 1013 },
                { label: 'app.routes.ts', value: 1014 }
              ]
            },
            {
              label: 'assets',
              value: 102,
              expanded: false,
              subItems: [{ label: 'logo.svg', value: 1021 }]
            },
            { label: 'index.html', value: 103 },
            { label: 'main.ts', value: 104 },
            { label: 'styles.css', value: 105 }
          ]
        },
        {
          label: 'public',
          value: 15,
          expanded: false,
          subItems: [{ label: 'favicon.ico', value: 151 }]
        },
        { label: '.gitignore', value: 16 },
        { label: 'angular.json', value: 11 },
        { label: 'package.json', value: 12 },
        { label: 'README.md', value: 13 },
        { label: 'tsconfig.json', value: 14 }
      ]
    }
  ];

  constructor(
    private router: Router,
    private poNotification: PoNotificationService
  ) {}

  showMore(): void {
    this.poNotification.success('Mais notificações carregadas com sucesso!');
  }

  openInternalLink(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
