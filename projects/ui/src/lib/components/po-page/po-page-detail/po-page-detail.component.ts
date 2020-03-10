import { Component, ViewContainerRef } from '@angular/core';

import { PoPageDetailBaseComponent } from './po-page-detail-base.component';
import { callAction, hasAction } from '../po-page-util/po-page-util';

/**
 * @docsExtends PoPageDetailBaseComponent
 *
 * @example
 *
 * <example name="po-page-detail-basic" title="Portinari Page Detail Basic">
 *  <file name="sample-po-page-detail-basic/sample-po-page-detail-basic.component.html"> </file>
 *  <file name="sample-po-page-detail-basic/sample-po-page-detail-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-detail-labs" title="Portinari Page Detail Labs">
 *  <file name="sample-po-page-detail-labs/sample-po-page-detail-labs.component.html"> </file>
 *  <file name="sample-po-page-detail-labs/sample-po-page-detail-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-detail-user" title="Portinari Page Detail - User">
 *  <file name="sample-po-page-detail-user/sample-po-page-detail-user.component.html"> </file>
 *  <file name="sample-po-page-detail-user/sample-po-page-detail-user.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-detail',
  templateUrl: './po-page-detail.component.html'
})
export class PoPageDetailComponent extends PoPageDetailBaseComponent {
  callActionFn = callAction;
  hasActionFn = hasAction;
  parentContext: ViewContainerRef;

  constructor(viewRef: ViewContainerRef) {
    super();
    this.parentContext = viewRef['_hostView'][8];
  }

  hasAnyAction(): boolean {
    return (
      this.hasActionFn('back', this.parentContext) ||
      this.hasActionFn('edit', this.parentContext) ||
      this.hasActionFn('remove', this.parentContext)
    );
  }

  hasEditFn(property: string): string {
    if (property === 'icon') {
      return this.hasActionFn('edit', this.parentContext) ? '' : 'po-icon-delete';
    } else if (property === 'type') {
      return this.hasActionFn('edit', this.parentContext) ? 'default' : 'primary';
    } else {
      return '';
    }
  }

  hasEditOrRemoveFn(property: string): string {
    if (property === 'icon') {
      return this.hasActionFn('edit', this.parentContext) || this.hasActionFn('remove', this.parentContext)
        ? ''
        : 'po-icon-arrow-left';
    } else if (property === 'type') {
      return this.hasActionFn('edit', this.parentContext) || this.hasActionFn('remove', this.parentContext)
        ? 'default'
        : 'primary';
    } else {
      return '';
    }
  }

  hasPageHeader(): boolean {
    return !!(this.title || this.hasAnyAction() || (this.breadcrumb && this.breadcrumb.items.length));
  }
}
