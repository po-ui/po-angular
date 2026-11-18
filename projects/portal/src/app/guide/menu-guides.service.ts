import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { PoMenuItem } from '@po-ui/ng-components';

/** Nó do `assets/json/guides-menu.json`, gravado pelo `gulp build:guides` a partir do frontmatter dos guias. */
export interface GuideMenuNode {
  name: string;
  label: string;
  /** `@link` do guia (`guides/<arquivo>`). */
  link: string;
  /** Atalho: o guia é de outra categoria (`origin`). */
  shortcut?: boolean;
  origin?: string;
  /** Subguias (`parent` no frontmatter). */
  children?: Array<GuideMenuNode>;
}

export interface GuideMenuCategory {
  key: string;
  label: string;
  items: Array<GuideMenuNode>;
}

// Gerado a partir de projects/portal/docs/templates/menu-guides.service.template.ts (gulp build:menus).
@Injectable({
  providedIn: 'root'
})
export class MenuGuidesService {
  private readonly router = inject(Router);

  /**
   * Menu de Guias em Categoria › Guia › Subguia.
   * - Link absoluto (`/` + `@link`): o po-menu só marca o item pela URL se o link for igual à rota inteira.
   * - Guia com subguias vira grupo; o 1º item, "Visão geral", é a página do próprio guia.
   * - Atalho: `action` sem `link`, para o po-menu marcar só o item principal pela URL.
   */
  getMenus(categories: Array<GuideMenuCategory>): Array<PoMenuItem> {
    return categories.map(category => ({ label: category.label, subItems: category.items.map(node => this.item(node)) }));
  }

  private item(node: GuideMenuNode): PoMenuItem {
    if (node.shortcut) {
      return { label: node.label + ' (' + node.origin + ')', action: () => this.router.navigateByUrl('/' + node.link) };
    }

    const link = '/' + node.link;

    return node.children?.length
      ? { label: node.label, subItems: [{ label: 'Visão geral', link }, ...node.children.map(child => this.item(child))] }
      : { label: node.label, link };
  }
}
