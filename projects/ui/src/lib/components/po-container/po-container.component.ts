import { Component } from '@angular/core';

import { PoContainerBaseComponent } from './po-container-base.component';

/**
 * @docsExtends PoContainerBaseComponent
 *
 * @example
 *
 * <example name="po-container-basic" title="PO Container Basic">
 *  <file name="sample-po-container-basic/sample-po-container-basic.component.html"> </file>
 *  <file name="sample-po-container-basic/sample-po-container-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-container-labs" title="PO Container Labs">
 *  <file name="sample-po-container-labs/sample-po-container-labs.component.html"> </file>
 *  <file name="sample-po-container-labs/sample-po-container-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-container-dashboard" title="PO Container - Dashboard">
 *  <file name="sample-po-container-dashboard/sample-po-container-dashboard.component.html"> </file>
 *  <file name="sample-po-container-dashboard/sample-po-container-dashboard.component.ts"> </file>
 *  <file name="sample-po-container-dashboard/sample-po-container-dashboard.service.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-container',
  templateUrl: './po-container.component.html'
})
export class PoContainerComponent extends PoContainerBaseComponent {}
