import { ChangeDetectionStrategy, Component, effect, inject, signal, WritableSignal } from '@angular/core';

import { PoContextMenuBaseComponent } from './po-context-menu-base.component';
import { PoContextMenuItem } from './po-context-menu-item.interface';
import { PoLanguageService } from '../../services/po-language/po-language.service';

interface PoContextMenuLiterals {
  close: string;
  open: string;
}

const poContextMenuLiteralsDefault = {
  en: {
    close: 'Close menu',
    open: 'Open menu'
  },
  es: {
    close: 'Cerrar menú',
    open: 'Abrir menú'
  },
  pt: {
    close: 'Fechar menu',
    open: 'Abrir menu'
  },
  ru: {
    close: 'Закрыть меню',
    open: 'Открыть меню'
  }
};

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
 *
 * <example name="po-context-menu-labs" title="PO Context Menu Labs">
 *  <file name="sample-po-context-menu-labs/sample-po-context-menu-labs.component.html"> </file>
 *  <file name="sample-po-context-menu-labs/sample-po-context-menu-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-context-menu-user" title="PO Context - Cadastro de Usuário">
 *  <file name="sample-po-context-menu-user/sample-po-context-menu-user.component.html"> </file>
 *  <file name="sample-po-context-menu-user/sample-po-context-menu-user.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-context-menu',
  templateUrl: './po-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoContextMenuComponent extends PoContextMenuBaseComponent {
  private readonly languageService = inject(PoLanguageService);
  readonly literals: PoContextMenuLiterals;

  protected _items = signal<Array<PoInternalContextMenuItem>>([]);
  protected _titleTooltipCalculated = false;
  protected _contextTitleTooltipCalculated = false;

  protected titleTooltip = signal<string | null>(null);
  protected contextTitleTooltip = signal<string | null>(null);

  constructor() {
    super();

    this.literals = {
      ...poContextMenuLiteralsDefault[this.languageService?.getLanguageDefault()],
      ...poContextMenuLiteralsDefault[this.languageService?.getShortLanguage()]
    };

    effect(() => {
      const currentItems = this.items();
      if (this.hasMultipleSelected(currentItems)) {
        this._items.set(this.sanitizeSelection(currentItems));
      } else {
        this._items.set(currentItems);
      }

      if (this.title() !== this.titleTooltip()) {
        this.titleTooltip.set(null);
        this._titleTooltipCalculated = false;
      }

      if (this.contextTitle() !== this.contextTitleTooltip()) {
        this.contextTitleTooltip.set(null);
        this._contextTitleTooltipCalculated = false;
      }
    });
  }

  toggleExpand(): void {
    this.expanded.update(v => !v);
  }

  selectItem(item: PoContextMenuItem): void {
    const updatedItems = this._items().map(i => ({
      ...i,
      selected: i === item
    }));
    this._items.set(updatedItems);

    const selectedItem = updatedItems.find(i => i.selected);
    this.itemSelected.emit(selectedItem);

    if (item.action) {
      item.action(selectedItem);
    }
  }

  protected handlerItemTooltip(item: PoInternalContextMenuItem, value: HTMLLIElement): void {
    if (item.tooltip) {
      return;
    }

    const label = value.firstElementChild as HTMLSpanElement;
    if (label.scrollHeight > label.offsetHeight) {
      this._items.update(items => items.map(i => (i === item ? { ...i, tooltip: item.label } : i)));
    }
  }

  protected handlerTitleTooltip(value: HTMLElement): void {
    if (this._titleTooltipCalculated) {
      return;
    }

    this.applyTooltipIfOverflows(value, this.title(), this.titleTooltip);
    this._titleTooltipCalculated = true;
  }

  protected handlerContextTitleTooltip(value: HTMLElement): void {
    if (this._contextTitleTooltipCalculated) {
      return;
    }

    this.applyTooltipIfOverflows(value, this.contextTitle(), this.contextTitleTooltip);
    this._contextTitleTooltipCalculated = true;
  }

  private hasMultipleSelected(items: Array<PoContextMenuItem>): boolean {
    return items.filter(i => i.selected).length > 1;
  }

  private sanitizeSelection(items: Array<PoContextMenuItem>): Array<PoInternalContextMenuItem> {
    const firstIndex = items.findIndex(i => i.selected);
    return items.map((item, index) => (item.selected && index !== firstIndex ? { ...item, selected: false } : item));
  }

  private applyTooltipIfOverflows(
    element: HTMLElement,
    textValue: string,
    storageSignal: WritableSignal<string>
  ): void {
    const hasOverflow = element.scrollHeight > element.offsetHeight;

    if (hasOverflow) {
      storageSignal.set(textValue);
    }
  }
}
