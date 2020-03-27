import { Component } from '@angular/core';

import { PoPageEditBaseComponent } from './po-page-edit-base.component';

/**
 * @docsExtends PoPageEditBaseComponent
 *
 * @example
 *
 * <example name="po-page-edit-basic" title="PO Page Edit Basic">
 *  <file name="sample-po-page-edit-basic/sample-po-page-edit-basic.component.html"> </file>
 *  <file name="sample-po-page-edit-basic/sample-po-page-edit-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-edit-labs" title="PO Page Edit Labs">
 *  <file name="sample-po-page-edit-labs/sample-po-page-edit-labs.component.html"> </file>
 *  <file name="sample-po-page-edit-labs/sample-po-page-edit-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-edit-user" title="PO Page Edit - User">
 *  <file name="sample-po-page-edit-user/sample-po-page-edit-user.component.html"> </file>
 *  <file name="sample-po-page-edit-user/sample-po-page-edit-user.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-edit',
  templateUrl: './po-page-edit.component.html'
})
export class PoPageEditComponent extends PoPageEditBaseComponent {
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
    return this.hasEvent('cancel') || this.hasEvent('saveNew') || this.hasEvent('save');
  }

  hasPageHeader(): boolean {
    return !!(this.title || this.hasAnyAction() || (this.breadcrumb && this.breadcrumb.items.length));
  }

  hasEvent(event: string) {
    return !!this[event].observers.length;
  }

  private isPrimaryAction(action: string): boolean {
    const hasSaveAction = this.hasEvent('save');

    if (action === 'saveNew') {
      return !hasSaveAction;
    }

    if (action === 'cancel') {
      const hasSaveNewAction = this.hasEvent('saveNew');

      return !hasSaveNewAction && !hasSaveAction;
    }

    return false;
  }
}
