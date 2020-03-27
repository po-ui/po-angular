import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PoDividerBaseComponent } from './po-divider-base.component';

/**
 * @docsExtends PoDividerBaseComponent
 *
 * @example
 *
 * <example name="po-divider-basic" title="PO Divider Basic" >
 *  <file name="sample-po-divider-basic/sample-po-divider-basic.component.html"> </file>
 *  <file name="sample-po-divider-basic/sample-po-divider-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-divider-labs" title="PO Divider Labs" >
 *  <file name="sample-po-divider-labs/sample-po-divider-labs.component.html"> </file>
 *  <file name="sample-po-divider-labs/sample-po-divider-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-divider-user-detail" title="PO Divider - User Detail" >
 *  <file name="sample-po-divider-user-detail/sample-po-divider-user-detail.component.html"> </file>
 *  <file name="sample-po-divider-user-detail/sample-po-divider-user-detail.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-divider',
  templateUrl: './po-divider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoDividerComponent extends PoDividerBaseComponent {}
