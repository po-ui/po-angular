import { PoFilterMode } from './po-search-filter-mode.enum';

import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { InputBoolean } from '../../decorators';

@Directive()
export class PoSearchBaseComponent {
  @Input('p-disabled') @InputBoolean() disabled: boolean;

  @Input('p-loading') loading: boolean;

  @Input('p-items') items: Array<any> = [];

  @Input('p-filter-keys') filterKeys: Array<any> = [];

  @Input('p-filter-type') filterType: PoFilterMode = PoFilterMode.startsWith;

  @Output('p-filtered-items-change') filteredItemsChange = new EventEmitter<Array<any>>();

  @Output('p-filter') filter: EventEmitter<any> = new EventEmitter<any>();
}
