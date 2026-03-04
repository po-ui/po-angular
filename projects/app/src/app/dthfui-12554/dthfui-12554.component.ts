import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';

import {
  PoHeaderActions,
  PoHeaderActionTool,
  PoHeaderActionToolItem,
  PoHeaderBrand,
  PoHeaderUser,
  PoNotificationService,
  PoToasterOrientation
} from '@po-ui/ng-components';

@Component({
  selector: 'app-dthfui-12554',
  templateUrl: './dthfui-12554.component.html',
  styleUrls: ['./dthfui-12554.component.css'],
  standalone: false,
  styles: `
    /* alterado apenas para demonstração no portal*/
    po-header {
      --nav-position: flex;
    }
  `
})
export class Dthfui12554Component implements AfterViewInit {
  @ViewChild('meuTemplate') meuTemplate!: TemplateRef<any>;
  @ViewChild('userTemplate') userTemplate!: TemplateRef<any>;
  popoverWidth: number = 300;

  listItem: Array<PoHeaderActionToolItem> = [
    {
      label: 'Ação 1',
      action: this.myAction.bind(this, 'Ação 1')
    },
    { label: 'Ação 2', action: this.myAction.bind(this, 'Ação 2') },
    { label: 'Ação 3', action: this.myAction.bind(this, 'Ação 3') }
  ];

  headerBrand: PoHeaderBrand = {
    title: 'PO UI',
    logo: 'https://po-ui.io/assets/po-logos/po_color.png',
    action: this.myAction.bind(this, 'Logo ação')
  };

  menuItems: Array<PoHeaderActions> = [
    {
      label: 'Item 1',
      action: this.myAction.bind(this, 'Item 1')
    },
    { label: 'Item 2', action: this.myAction.bind(this, 'Item 2') },
    { label: 'Item 3', action: this.myAction.bind(this, 'Item 3') }
  ];

  actionTools: Array<PoHeaderActionTool> = [
    {
      label: 'Configurações',
      icon: 'an an-gear-six',
      tooltip: 'Configurações do sistema',
      action: this.myAction.bind(this, 'Configuração')
    },
    {
      label: 'Aplicativos',
      icon: 'an an-dots-nine',
      tooltip: 'Aplicativos do sistema',
      popover: {
        content: this.meuTemplate
      }
    },
    {
      label: 'Notificações',
      icon: 'an an-chat-circle-dots',
      tooltip: 'Notificações do usuário',
      badge: 5,
      items: this.listItem
    }
  ];

  headerUser: PoHeaderUser = {
    avatar: 'https://po-ui.io/assets/graphics/avatar1.png',
    customerBrand: 'https://po-ui.io/assets/po-logos/po_black.png',
    popover: {
      content: this.userTemplate
    },
    status: 'positive'
  };

  userMenuItems = [
    {
      label: 'Meu Perfil',
      icon: 'an an-user',
      action: () => this.myAction('Meu Perfil')
    },
    {
      label: 'Configurações',
      icon: 'an an-gear-six',
      action: () => this.myAction('Configurações')
    },
    {
      label: 'Preferências',
      icon: 'an an-sliders',
      action: () => this.myAction('Preferências')
    },
    {
      label: 'Ajuda',
      icon: 'an an-question',
      action: () => this.myAction('Ajuda')
    },
    {
      label: 'Sair',
      icon: 'an an-sign-out',
      action: () => this.myAction('Logout')
    }
  ];

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

    this.headerUser = {
      ...this.headerUser,
      popover: {
        content: this.userTemplate
      }
    };

    this.cd.detectChanges();
  }

  myAction(action: string): any {
    this.poNotification.success({ message: `Action clicked: ${action}`, orientation: PoToasterOrientation.Top });
  }

  increaseWidth(): void {
    this.popoverWidth += 100;
  }

  resetWidth(): void {
    this.popoverWidth = 300;
  }
}
