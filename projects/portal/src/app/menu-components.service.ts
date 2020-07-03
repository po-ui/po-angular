import { Injectable } from '@angular/core';

@Injectable()
export class MenuComponentsService {
  constructor() {}

  getMenus(documentationItems) {
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
      { label: 'Diretivas', subItems: items.filter(item => item.type === 'directives') },
      { label: 'Interceptors', subItems: items.filter(item => item.type === 'interceptors') },
      { label: 'Serviços', subItems: items.filter(item => item.type === 'services') },
      { label: 'Modelos de Dados', subItems: items.filter(item => item.type === 'models') }
    ];
  }
}
