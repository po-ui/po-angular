import { Component } from '@angular/core';

import { PoPageDetailBaseComponent } from './po-page-detail-base.component';

/**
 * @docsExtends PoPageDetailBaseComponent
 *
 * @example
 *
 * <example name="po-page-detail-basic" title="PO Page Detail Basic">
 *  <file name="sample-po-page-detail-basic/sample-po-page-detail-basic.component.html"> </file>
 *  <file name="sample-po-page-detail-basic/sample-po-page-detail-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-detail-labs" title="PO Page Detail Labs">
 *  <file name="sample-po-page-detail-labs/sample-po-page-detail-labs.component.html"> </file>
 *  <file name="sample-po-page-detail-labs/sample-po-page-detail-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-detail-user" title="PO Page Detail - User">
 *  <file name="sample-po-page-detail-user/sample-po-page-detail-user.component.html"> </file>
 *  <file name="sample-po-page-detail-user/sample-po-page-detail-user.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-detail',
  templateUrl: './po-page-detail.component.html'
})
export class PoPageDetailComponent extends PoPageDetailBaseComponent {
  hasAnyAction(): boolean {
    return this.hasEvent('back') || this.hasEvent('edit') || this.hasEvent('remove');
  }

  hasEditFn(property: string): string {
    if (property === 'icon') {
      return this.hasEvent('edit') ? '' : 'po-icon-delete';
    } else if (property === 'type') {
      return this.hasEvent('edit') ? 'default' : 'primary';
    } else {
      return '';
    }
  }

  hasEditOrRemoveFn(property: string): string {
    if (property === 'icon') {
      return this.hasEvent('edit') || this.hasEvent('remove') ? '' : 'po-icon-arrow-left';
    } else if (property === 'type') {
      return this.hasEvent('edit') || this.hasEvent('remove') ? 'default' : 'primary';
    } else {
      return '';
    }
  }

  hasEvent(event: string) {
    return !!this[event].observers.length;
  }

  hasPageHeader(): boolean {
    return !!(this.title || this.hasAnyAction() || (this.breadcrumb && this.breadcrumb.items.length));
  }
}
