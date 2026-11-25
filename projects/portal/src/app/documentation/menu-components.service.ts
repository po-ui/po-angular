import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { PoMenuItem } from '@po-ui/ng-components';

import { Documentation } from './documentation.class';
import { menuShortcut } from '../shared/menu-shortcut-filter';
import { docLabel, groupDocs, shortcutTarget } from './docs-groups';

// Gerado a partir de projects/portal/docs/templates/menu-components.service.template.ts (gulp build:menus).
@Injectable({
  providedIn: 'root'
})
export class MenuComponentsService {
  private readonly router = inject(Router);

  /**
   * Menu da documentação em Seção › Categoria › Item, a partir das tags do JSDoc gravadas no api-list.json.
   * - Ordem: @docsOrder primeiro, depois alfabética (helper `groupDocs`, o mesmo da listagem "API Reference").
   * - Subcomponentes ficam fora do menu (a página deles marca o pai, ver DocumentationComponent).
   * - Atalho: `action` sem `link`. Assim, pela URL, o po-menu marca só o item canônico (ele para no primeiro
   *   link igual que encontra). O sufixo do rótulo é também o texto acessível (o po-menu usa o rótulo como aria-label).
   */
  getMenus(documentationItems: Array<Documentation>): Array<PoMenuItem> {
    const link = (doc: Documentation) => '/documentation/' + doc.name;

    const sections = groupDocs(documentationItems).map(section => {
      const categories = section.categories.map(category => ({
        label: category.label,
        subItems: category.entries.map(({ doc, shortcut }) =>
          shortcut
            ? menuShortcut({
                label: docLabel(doc) + ' (' + shortcutTarget(doc) + ')',
                action: () => this.router.navigateByUrl(link(doc))
              })
            : { label: docLabel(doc), link: link(doc) }
        )
      }));

      return { label: section.label, subItems: section.flat ? categories.flatMap(c => c.subItems) : categories };
    });

    return [
      ...sections,
      {
        label: 'Ferramentas para IA',
        subItems: [
          { label: 'LLMS', link: '/documentation/ia-tools-llms' },
          { label: 'MCP PO-UI', link: '/documentation/ia-tools-mcp' }
        ]
      }
    ];
  }
}
