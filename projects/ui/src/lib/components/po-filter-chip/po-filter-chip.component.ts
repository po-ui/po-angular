import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';

import { PoIconModule } from '../po-icon/po-icon.module';
import { PoFilterChipBaseComponent } from './po-filter-chip-base.component';

/**
 * @docsExtends PoFilterChipBaseComponent
 *
 * @example
 *
 * <example name="po-filter-chip-basic" title="PO Filter Chip Basic">
 *  <file name="sample-po-filter-chip-basic/sample-po-filter-chip-basic.component.html"> </file>
 *  <file name="sample-po-filter-chip-basic/sample-po-filter-chip-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-filter-chip-labs" title="PO Filter Chip Labs">
 *  <file name="sample-po-filter-chip-labs/sample-po-filter-chip-labs.component.html"> </file>
 *  <file name="sample-po-filter-chip-labs/sample-po-filter-chip-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-filter-chip-filter-list" title="PO Filter Chip - Filter List">
 *  <file name="sample-po-filter-chip-filter-list/sample-po-filter-chip-filter-list.component.html"> </file>
 *  <file name="sample-po-filter-chip-filter-list/sample-po-filter-chip-filter-list.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-filter-chip',
  templateUrl: './po-filter-chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PoIconModule]
})
export class PoFilterChipComponent extends PoFilterChipBaseComponent {
  private readonly _selected = signal<boolean>(false);
  private initialized = false;

  isSelected = computed(() => this._selected());

  constructor() {
    super();
    this.setupSelectedEffect();
  }

  protected onClick(): void {
    this.toggle();
  }

  protected onKeydown(event: Event): void {
    if (this.disabled()) {
      return;
    }

    event.preventDefault();
    this.toggle();
  }

  private setupSelectedEffect(): void {
    effect(() => {
      const value = this.selected();
      this._selected.set(value);

      if (this.initialized) {
        this.selectedChange.emit({ label: this.label() || '', selected: value });
      }
      this.initialized = true;
    });
  }

  private toggle(): void {
    if (this.disabled()) {
      return;
    }

    const newValue = !this._selected();
    this._selected.set(newValue);
    this.selectedChange.emit({ label: this.label() || '', selected: newValue });
  }
}
