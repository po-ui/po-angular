import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, input, output } from '@angular/core';

import { uuid } from '../../../utils/util';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoTreeViewItem } from '../po-tree-view-item/po-tree-view-item.interface';
import { PoTreeViewKeyboardService } from '../services/po-tree-view-keyboard.service';
import { poTreeViewItemContentLiterals } from './po-tree-view-item-content.literals';

@Component({
  selector: 'po-tree-view-item-content',
  templateUrl: './po-tree-view-item-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoTreeViewItemContentComponent {
  private readonly keyboardService = inject(PoTreeViewKeyboardService);
  private readonly languageService = inject(PoLanguageService);

  protected readonly literals = poTreeViewItemContentLiterals[this.languageService.getShortLanguage()];

  protected idRadio = `po-radio[${uuid()}]`;

  @ViewChild('inputCheckbox') private inputCheckbox;
  @ViewChild('lineElement', { static: false }) private lineElement: ElementRef<HTMLElement>;

  readonly componentsSize = input<string>(undefined, { alias: 'p-components-size' });

  readonly item = input<PoTreeViewItem>(undefined, { alias: 'p-item' });

  readonly level = input<number>(0, { alias: 'p-level' });

  readonly selectable = input<boolean>(false, { alias: 'p-selectable' });

  readonly selectedValue = input<string | number>(undefined, { alias: 'p-selected-value' });

  readonly singleSelect = input<boolean>(false, { alias: 'p-single-select' });

  readonly expanded = output<void>({ alias: 'p-expanded' });

  readonly selected = output<PoTreeViewItem>({ alias: 'p-selected' });

  readonly activated = output<PoTreeViewItem>({ alias: 'p-activated' });

  protected get hasSubItems() {
    const item = this.item();
    return !!item?.subItems?.length;
  }

  protected get expandIcon(): string {
    return this.item()?.expanded ? 'ICON_ARROW_DOWN' : 'ICON_ARROW_RIGHT';
  }

  protected get isDisabled(): boolean {
    return !!this.item()?.disabled;
  }

  protected get isExpanded(): boolean {
    return !!this.item()?.expanded;
  }

  protected get isSelected(): boolean {
    if (this.singleSelect()) {
      return this.item()?.value === this.selectedValue();
    }
    return !!this.item()?.selected;
  }

  protected get isMaxLevel(): boolean {
    return this.level() >= 3;
  }

  protected get itemIcon(): string | undefined {
    const item = this.item();
    if (!item?.showIcon || this.selectable()) {
      return undefined;
    }
    return this.hasSubItems ? 'ICON_FOLDER_SIMPLE' : 'ICON_FILE';
  }

  protected onLineFocus(event: FocusEvent) {
    this.keyboardService.setLastFocusedNode(event.currentTarget as HTMLElement);
  }

  protected onLineClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.closest('po-checkbox, po-radio, input, label.po-checkbox-label')) {
      return;
    }

    const isArrowClick = !!target.closest('.po-tree-view-item-content-button-icon');

    if (this.isDisabled && !isArrowClick) {
      return;
    }

    if (this.lineElement) {
      this.lineElement.nativeElement.focus();
    }

    if (this.hasSubItems) {
      this.expanded.emit();
    } else if (!this.isDisabled) {
      this.activated.emit(this.item());
    }
  }

  protected onKeydown(event: KeyboardEvent) {
    const node = event.currentTarget as HTMLElement;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.keyboardService.focusNext(node);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.keyboardService.focusPrevious(node);
        break;

      case 'ArrowRight':
        event.preventDefault();
        this.handleArrowRight(node);
        break;

      case 'ArrowLeft':
        event.preventDefault();
        this.handleArrowLeft(node);
        break;

      case 'Home':
        event.preventDefault();
        this.keyboardService.focusFirst();
        break;

      case 'End':
        event.preventDefault();
        this.keyboardService.focusLast();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.applyPressedState(node);
        this.handleSelect();
        break;

      default:
        this.handleCharacterNavigation(event, node);
        break;
    }
  }

  private handleArrowRight(node: HTMLElement) {
    if (!this.hasSubItems) {
      return;
    }

    if (!this.isExpanded) {
      this.expanded.emit();
    } else {
      this.keyboardService.focusFirstChild(node);
    }
  }

  private handleArrowLeft(node: HTMLElement) {
    if (this.hasSubItems && this.isExpanded) {
      this.expanded.emit();
    } else if (this.keyboardService.hasParentNode(node)) {
      this.keyboardService.focusParent(node);
    }
  }

  private handleSelect() {
    if (this.isDisabled) {
      return;
    }

    if (this.selectable()) {
      const item = this.item();
      item.selected = !item.selected;
      this.selected.emit(item);
      return;
    }

    if (!this.hasSubItems) {
      this.activated.emit(this.item());
    }
  }

  private applyPressedState(node: HTMLElement) {
    const pressedClass = 'po-tree-view-item-content-pressed';
    node.classList.add(pressedClass);
    setTimeout(() => node.classList.remove(pressedClass), 150);
  }

  private handleCharacterNavigation(event: KeyboardEvent, node: HTMLElement) {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    const key = event.key;

    if (key.length !== 1) {
      return;
    }

    event.preventDefault();
    this.keyboardService.focusByCharacter(key, node);
  }
}
