import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';

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

  constructor() {
    super();

    effect(() => {
      const currentItems = this.items();
      if (this.hasMultipleSelected(currentItems)) {
        this._items.set(this.sanitizeSelection(currentItems));
      }

      this._items.set(currentItems);
    });
  }

  toggleExpand(): void {
    this.expanded.update(v => !v);
  }

  selectItem(item: PoContextMenuItem): void {
    const updatedItems = this.items().map(i => ({
      ...i,
      selected: i === item
    }));
    this._items.set(updatedItems);

    if (item.action) {
      item.action(item);
    }
  }

  private hasMultipleSelected(items: Array<PoContextMenuItem>): boolean {
    return items.filter(i => i.selected).length > 1;
  }

  private sanitizeSelection(items: Array<PoContextMenuItem>): Array<PoInternalContextMenuItem> {
    let foundFirst = false;
    return items.map(item => {
      if (item.selected && !foundFirst) {
        foundFirst = true;
        return item;
      }
      return item.selected ? { ...item, selected: false } : item;
    });
  }

  protected handlerTooltip(item: PoInternalContextMenuItem, value: HTMLLIElement) {
    if (item.tooltip) {
      return;
    }

    const label = value.firstElementChild as HTMLSpanElement;
    if (label.scrollHeight > label.offsetHeight) {
      item.tooltip = item.label;
    }
  }
}
