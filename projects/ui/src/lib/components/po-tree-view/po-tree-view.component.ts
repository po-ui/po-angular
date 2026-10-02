import {
  OnInit,
  inject,
  effect,
  Component,
  DestroyRef,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { poTreeViewLiterals } from './po-tree-view.literals';
import { PoTreeViewService } from './services/po-tree-view.service';
import { PoTreeViewBaseComponent } from './po-tree-view-base.component';
import { PoTreeViewItem } from './po-tree-view-item/po-tree-view-item.interface';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoTreeViewKeyboardService } from './services/po-tree-view-keyboard.service';

/**
 * @docsExtends PoTreeViewBaseComponent
 *
 * @example
 *
 * <example name="po-tree-view-basic" title="PO Tree View Basic">
 *  <file name="sample-po-tree-view-basic/sample-po-tree-view-basic.component.html"> </file>
 *  <file name="sample-po-tree-view-basic/sample-po-tree-view-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-tree-view-labs" title="PO Tree View Labs">
 *  <file name="sample-po-tree-view-labs/sample-po-tree-view-labs.component.html"> </file>
 *  <file name="sample-po-tree-view-labs/sample-po-tree-view-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-tree-view-folder-structure" title="PO Tree View - Folder Structure">
 *  <file name="sample-po-tree-view-folder-structure/sample-po-tree-view-folder-structure.component.html"> </file>
 *  <file name="sample-po-tree-view-folder-structure/sample-po-tree-view-folder-structure.component.ts"> </file>
 * </example>
 *
 * <example name="po-tree-view-supermarket" title="PO Tree View - Supermarket">
 *  <file name="sample-po-tree-view-supermarket/sample-po-tree-view-supermarket.component.html"> </file>
 *  <file name="sample-po-tree-view-supermarket/sample-po-tree-view-supermarket.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-tree-view',
  templateUrl: './po-tree-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PoTreeViewService, PoTreeViewKeyboardService],
  standalone: false
})
export class PoTreeViewComponent extends PoTreeViewBaseComponent implements OnInit, AfterViewInit {
  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly treeViewService = inject(PoTreeViewService);
  private readonly keyboardService = inject(PoTreeViewKeyboardService);
  private readonly languageService = inject(PoLanguageService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  protected readonly literals = poTreeViewLiterals[this.languageService.getShortLanguage()];

  protected ariaLiveMessage = '';

  protected get hasItems() {
    return !!this?.items?.length;
  }

  constructor() {
    super();

    effect(() => {
      const items = this.inputedItems();
      this.disabled();
      this.items = items;
    });
  }

  ngOnInit() {
    this.treeViewService
      .onExpand()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((treeViewItem: PoTreeViewItem) => {
        this.emitExpanded(treeViewItem);
        this.announce(treeViewItem, treeViewItem.expanded ? this.literals.expanded : this.literals.collapsed);
      });

    this.treeViewService
      .onSelect()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((treeViewItem: PoTreeViewItem) => {
        this.emitSelected(treeViewItem);
        if (treeViewItem.selected) {
          this.announce(treeViewItem, this.literals.selected);
        }
      });

    this.treeViewService
      .onActivate()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((treeViewItem: PoTreeViewItem) => {
        this.emitActivated(treeViewItem);
        this.announce(treeViewItem, this.literals.selected);
      });
  }

  ngAfterViewInit() {
    this.keyboardService.setHostElement(this.elementRef);
  }

  protected onTreeFocus(event: FocusEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('po-tree-view')) {
      this.keyboardService.focusLastOrFirst();
    }
  }

  protected onTreeKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      const tree = event.currentTarget as HTMLElement;
      tree.setAttribute('tabindex', '-1');
      setTimeout(() => tree.setAttribute('tabindex', '0'));
    }
  }

  protected trackByFunction(index: number) {
    return index;
  }

  private announce(treeViewItem: PoTreeViewItem, state: string): void {
    this.ariaLiveMessage = `${treeViewItem.label}, ${state}`;
    this.changeDetector.markForCheck();
  }
}
