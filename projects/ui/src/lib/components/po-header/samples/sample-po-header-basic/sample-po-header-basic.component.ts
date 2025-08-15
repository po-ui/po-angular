import { AfterViewInit, ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';

import {
  PoHeaderActions,
  PoHeaderActionTool,
  PoHeaderActionToolItem,
  PoHeaderBrand,
  PoHeaderUser,
  PoNotificationService
} from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-header-basic',
  templateUrl: './sample-po-header-basic.component.html',
  standalone: false,
  styles: `
    .app-wrapper {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      justify-items: center;
      padding: 1rem;
    }

    po-header {
      --nav-position: sticky;
    }
  `
})
export class SamplePoHeaderBasicComponent implements AfterViewInit {
  @ViewChild('meuTemplate') meuTemplate!: TemplateRef<any>;

  listItem: Array<PoHeaderActionToolItem> = [
    {
      label: 'Ação 1',
      action: this.myAction.bind(this, 'Ação 1')
    },
    { label: 'Ação 2', action: this.myAction.bind(this, 'Ação 2') },
    { label: 'Ação 3', action: this.myAction.bind(this, 'Ação 3') }
  ];

  headerBrand: PoHeaderBrand = {
    title: 'Minha empresa',
    logo: 'https://totvs.com/imagens/image-share.jpg',
    action: this.myAction.bind(this, 'Logo ação')
  };

  menuItems: Array<PoHeaderActions> = [
    {
      label: 'Contato 1',
      action: this.myAction.bind(this, 'Contato 1')
    },
    { label: 'Contato 2', action: this.myAction.bind(this, 'Contato 2') },
    { label: 'Contato 3', action: this.myAction.bind(this, 'Contato 3') }
  ];

  actionTools: Array<PoHeaderActionTool> = [
    {
      title: 'Configurações',
      icon: 'an an-dots-nine',
      tooltip: 'Configurações do sistema',
      action: this.myAction.bind(this, 'Configuração')
    },
    {
      title: 'Aplicativos',
      icon: 'an an-dots-three-outline-vertical',
      tooltip: 'Aplicativos do sistema',
      popover: {
        title: 'usuario caso',
        content: this.meuTemplate
      }
    },
    {
      title: 'Notificações',
      icon: 'an an-chat-circle-dots',
      tooltip: 'Notificações do usuário',
      badge: 5,
      items: this.listItem
    }
  ];

  headerUser: PoHeaderUser = {
    avatar: 'https://pbs.twimg.com/profile_images/1613553278029012994/9BlkFbe1_400x400.jpg',
    customerBrand: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Logo_VIVO_%282%29.svg',
    action: this.myAction.bind(this, 'Meu Usuário'),
    status: 'positive'
  };

  systemApps = [
    {
      icon: 'an an-reddit-logo',
      action: this.myAction.bind(this, 'Aplicativo 1')
    },
    {
      icon: 'an an-twitter-logo',
      action: this.myAction.bind(this, 'Aplicativo 2')
    },
    {
      icon: 'an an-twitch-logo',
      action: this.myAction.bind(this, 'Aplicativo 3')
    },
    {
      icon: 'an an-facebook-logo',
      action: this.myAction.bind(this, 'Aplicativo 4')
    },
    {
      icon: 'an an-meta-logo',
      action: this.myAction.bind(this, 'Aplicativo 5')
    },
    {
      icon: 'an an-amazon-logo',
      action: this.myAction.bind(this, 'Aplicativo 6')
    }
  ];

  constructor(
    private poNotification: PoNotificationService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.actionTools = this.actionTools.map(action => {
      if (action.popover) {
        return {
          ...action,
          popover: {
            ...action.popover,
            content: this.meuTemplate
          }
        };
      }
      return action;
    });

    this.cd.detectChanges();
  }

  myAction(action: string): any {
    this.poNotification.success(`Action clicked: ${action}`);
  }
}
