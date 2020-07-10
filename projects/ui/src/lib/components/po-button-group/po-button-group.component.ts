import { Component, ViewContainerRef } from '@angular/core';

import { PoButtonGroupBaseComponent } from './po-button-group-base.component';

/**
 * @docsExtends PoButtonGroupBaseComponent
 *
 * @example
 *
 * <example name="po-button-group-basic" title="PO Button Group Basic">
 *  <file name="sample-po-button-group-basic/sample-po-button-group-basic.component.html"> </file>
 *  <file name="sample-po-button-group-basic/sample-po-button-group-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-button-group-labs" title="PO Button Group Labs">
 *  <file name="sample-po-button-group-labs/sample-po-button-group-labs.component.html"> </file>
 *  <file name="sample-po-button-group-labs/sample-po-button-group-labs.component.ts"> </file>
 * </example>
 *
 *
 * <example name="po-button-group-attendance" title="PO Button Group - Attendance">
 *  <file name="sample-po-button-group-attendance/sample-po-button-group-attendance.component.html"> </file>
 *  <file name="sample-po-button-group-attendance/sample-po-button-group-attendance.component.ts"> </file>
 * </example>
 *
 * <example name="po-button-group-post" title="PO Button Group - Post">
 *  <file name="sample-po-button-group-post/sample-po-button-group-post.component.html"> </file>
 *  <file name="sample-po-button-group-post/sample-po-button-group-post.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-button-group',
  templateUrl: './po-button-group.component.html'
})
export class PoButtonGroupComponent extends PoButtonGroupBaseComponent {
  constructor(viewRef: ViewContainerRef) {
    super();
  }
}
