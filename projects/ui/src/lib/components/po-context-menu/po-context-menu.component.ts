import { ChangeDetectionStrategy, Component, effect, output, signal } from '@angular/core';

import { PoContextMenuBaseComponent } from './po-context-menu-base.component';
import { PoContextMenuItem } from './po-context-menu-item.interface';

interface PoInternalContextMenuItem extends PoContextMenuItem {
  tooltip?: string;
}

/**
 * @docsExtends PoContextMenuBaseComponent
 *
 * @example
 *
 * <example name="po-context-menu-basic" title="PO Context Menu Basic">
 *  <file name="sample-po-context-menu-basic/sample-po-context-menu-basic.component.html"> </file>
 *  <file name="sample-po-context-menu-basic/sample-po-context-menu-basic.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-context-menu',
  templateUrl: './po-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoContextMenuComponent extends PoContextMenuBaseComponent {
  protected _items = signal<Array<PoInternalContextMenuItem>>([]);

  /** Evento emitido ao selecionar um item. Emite o item selecionado. */
  itemSelected = output<PoContextMenuItem>({ alias: 'p-item-selected' });

  constructor() {
    super();

    // Valida que apenas um item pode ter selected: true.
    // Se mais de um item tiver selected: true, mantem apenas o primeiro.
    effect(() => {
      const currentItems = this.items();
      if (this.hasMultipleSelected(currentItems)) {
        this._items.set(this.sanitizeSelection(currentItems));
      } else {
        this._items.set(currentItems);
      }
    });
  }

  toggleExpand(): void {
    this.expanded.update(v => !v);
  }

  selectItem(item: PoContextMenuItem): void {
    const updatedItems = this._items().map(i => ({
      ...i,
      selected: i.label === item.label
    }));
    this._items.set(updatedItems);

    this.itemSelected.emit(item);

    if (item.action) {
      item.action(item);
    }
  }

  protected handlerTooltip(item: PoInternalContextMenuItem, value: HTMLLIElement): void {
    if (item.tooltip) {
      return;
    }

    const label = value.firstElementChild as HTMLSpanElement;
    if (label.scrollHeight > label.offsetHeight) {
      this._items.update(items =>
        items.map(i => (i.label === item.label ? { ...i, tooltip: item.label } : i))
      );
    }
  }

  private hasMultipleSelected(items: Array<PoContextMenuItem>): boolean {
    return items.filter(i => i.selected).length > 1;
  }

  private sanitizeSelection(items: Array<PoContextMenuItem>): Array<PoInternalContextMenuItem> {
    const firstIndex = items.findIndex(i => i.selected);
    return items.map((item, index) => (item.selected && index !== firstIndex ? { ...item, selected: false } : item));
  }
}
