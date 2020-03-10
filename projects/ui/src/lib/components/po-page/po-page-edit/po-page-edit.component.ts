import { Component, ViewContainerRef } from '@angular/core';

import { PoPageEditBaseComponent } from './po-page-edit-base.component';
import { callAction, hasAction } from '../po-page-util/po-page-util';

/**
 * @docsExtends PoPageEditBaseComponent
 *
 * @example
 *
 * <example name="po-page-edit-basic" title="Portinari Page Edit Basic">
 *  <file name="sample-po-page-edit-basic/sample-po-page-edit-basic.component.html"> </file>
 *  <file name="sample-po-page-edit-basic/sample-po-page-edit-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-edit-labs" title="Portinari Page Edit Labs">
 *  <file name="sample-po-page-edit-labs/sample-po-page-edit-labs.component.html"> </file>
 *  <file name="sample-po-page-edit-labs/sample-po-page-edit-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-edit-user" title="Portinari Page Edit - User">
 *  <file name="sample-po-page-edit-user/sample-po-page-edit-user.component.html"> </file>
 *  <file name="sample-po-page-edit-user/sample-po-page-edit-user.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-edit',
  templateUrl: './po-page-edit.component.html'
})
export class PoPageEditComponent extends PoPageEditBaseComponent {
  hasAction: Function = hasAction;
  callAction: Function = callAction;
  parentContext: ViewContainerRef;

  constructor(viewRef: ViewContainerRef) {
    super();
    this.parentContext = viewRef['_hostView'][8];
  }

  getIcon(icon: string): string {
    if (icon === 'cancel') {
      return this.isPrimaryAction('cancel') ? 'po-icon-close' : '';
    }

    if (icon === 'saveNew') {
      return this.isPrimaryAction('saveNew') ? 'po-icon-ok' : '';
    }

    return '';
  }

  getType(type: string): string {
    const isCancelPrimaryAction = type === 'cancel' && this.isPrimaryAction('cancel');
    const isSaveNewPrimaryAction = type === 'saveNew' && this.isPrimaryAction('saveNew');

    return isCancelPrimaryAction || isSaveNewPrimaryAction ? 'primary' : 'default';
  }

  hasAnyAction(): boolean {
    return (
      hasAction('cancel', this.parentContext) ||
      hasAction('saveNew', this.parentContext) ||
      hasAction('save', this.parentContext)
    );
  }

  hasPageHeader(): boolean {
    return !!(this.title || this.hasAnyAction() || (this.breadcrumb && this.breadcrumb.items.length));
  }

  private isPrimaryAction(action: string): boolean {
    const hasSaveAction = !hasAction('save', this.parentContext);

    if (action === 'saveNew') {
      return hasSaveAction;
    }

    if (action === 'cancel') {
      return !hasAction('saveNew', this.parentContext) && hasSaveAction;
    }

    return false;
  }
}
