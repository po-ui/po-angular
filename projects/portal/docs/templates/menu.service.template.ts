import { Injectable } from '@angular/core';

import { PoMenuItem } from '@po-ui/ng-components';

import { Documentation } from './documentation/documentation.class';

@Injectable()
export class MenuService {

  constructor() { }

  getMenus(documentationItems: Array<Documentation>) {
    return new Array<PoMenuItem>(
      { label: 'Início', link: 'home' },
      { label: 'Documentação', subItems: this.getDocumentationMenu(documentationItems) },
      { label: 'Guias', subItems: [
        <% menuItems.guide.sort((a, b) => a.orderBy < b.orderBy).forEach(function(menu) {
          %>{ <% %>label: '<%- menu.label %>', <% %>link: '<%- menu.link %>' },
        <%
        });%>]
      },
      { label: 'Ferramentas', subItems: [
        { label: 'Formulário dinâmico', link: 'tools/dynamic-form' },
        { label: 'Visualização dinâmica', link: 'tools/dynamic-view' }
      ]});
  }

  private getDocumentationMenu(documentationItems: Array<Documentation>) {

    const items = [];

    documentationItems.forEach(item => {
      items.push({
        label: item.title,
        link: '/documentation/' + item.name,
        type: item.type
      });
    });

    return [
      { label: 'Componentes', subItems: items.filter(item => item.type === 'components') },
      { label: 'Diretivas' , subItems: items.filter(item => item.type === 'directives') },
      { label: 'Interceptors' , subItems: items.filter(item => item.type === 'interceptors') },
      { label: 'Serviços' , subItems: items.filter(item => item.type === 'services') },
      { label: 'Modelos de Dados' , subItems: items.filter(item => item.type === 'models') }
    ];
  }
}
