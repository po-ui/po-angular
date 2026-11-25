import { Observable, of } from 'rxjs';

import { PoMenuFilter, PoMenuItem, PoMenuItemFiltered } from '@po-ui/ng-components';

/** Itens de atalho dos menus do portal (o mesmo item aparece também em outra categoria). */
const SHORTCUTS = new WeakSet<PoMenuItem>();

/** Marca o item como atalho: ele aparece no menu, mas não no resultado do filtro. */
export function menuShortcut(item: PoMenuItem): PoMenuItem {
  SHORTCUTS.add(item);

  return item;
}

export const isMenuShortcut = (item: PoMenuItem): boolean => SHORTCUTS.has(item);

/**
 * Filtro do menu como o local do po-menu (rótulo contém o termo, só itens com link ou ação, em lista plana),
 * mas sem os atalhos: buscar "Dialog" mostra só o item principal, não "Dialog (Serviços)" de cada categoria.
 */
export function filterMenuWithoutShortcuts(menus: Array<PoMenuItem>, search: string): Array<PoMenuItemFiltered> {
  const term = search.trim().toLowerCase();
  const found: Array<PoMenuItemFiltered> = [];
  const walk = (items: Array<PoMenuItem> = []) =>
    items.forEach(item => {
      if (!isMenuShortcut(item) && (item.link || item.action) && item.label.toLowerCase().includes(term)) {
        found.push({ label: item.label, link: item.link, action: item.action as () => void });
      }
      walk(item.subItems);
    });

  walk(menus);

  return found;
}

/**
 * `p-service` do po-menu: a busca passa por aqui em vez do filtro local, e os atalhos ficam de fora.
 * shortcut: o po-menu só chama o `p-service` a partir de 3 letras (com 1 ou 2 mostra a lista vazia);
 * se a busca curta fizer falta, pedir ao po-menu uma opção para excluir itens do filtro local.
 */
export class MenuShortcutFilter implements PoMenuFilter {
  constructor(private readonly menus: () => Array<PoMenuItem>) {}

  getFilteredData(search: string): Observable<Array<PoMenuItemFiltered>> {
    return of(filterMenuWithoutShortcuts(this.menus(), search));
  }
}
