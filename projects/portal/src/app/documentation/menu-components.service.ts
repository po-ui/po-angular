import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuComponentsService {
  constructor() {}

  getMenus(documentationItems) {
    const sortLabel = (prev, next) => (prev.label < next.label ? -1 : 1);
    const items = [];

    documentationItems.forEach(item => {
      items.push({
        label: item.title.replace('Po ', ''),
        link: '/documentation/' + item.name,
        type: item.type
      });
    });

    items.sort(sortLabel);

    return [
      { label: 'Componentes', subItems: items.filter(item => item.type === 'components') },
      {
        label: 'Ferramentas para I.A.',
        subItems: [
          { label: 'LLMS', link: '/documentation/ia-tools-llms' },
          { label: 'MCP PO-UI', link: '/documentation/ia-tools-mcp' }
        ]
      },
      { label: 'Diretivas', subItems: items.filter(item => item.type === 'directives') },
      { label: 'Interceptors', subItems: items.filter(item => item.type === 'interceptors') },
      { label: 'Serviços', subItems: items.filter(item => item.type === 'services') },
      { label: 'Modelos de Dados', subItems: items.filter(item => item.type === 'models') }
    ];
  }
}
