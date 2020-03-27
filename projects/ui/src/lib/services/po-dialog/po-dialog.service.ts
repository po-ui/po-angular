import { Injectable, ComponentRef } from '@angular/core';

import { PoComponentInjectorService } from './../po-component-injector/po-component-injector.service';
import { PoDialogAlertOptions, PoDialogConfirmOptions } from './interfaces/po-dialog.interface';
import { PoDialogBaseService } from './po-dialog-base.service';
import { PoDialogComponent } from './po-dialog.component';
import { PoDialogType } from './po-dialog.enum';

/**
 * @docsExtends PoDialogBaseService
 *
 * @example
 *
 * <example name="po-dialog-basic" title="PO Dialog Basic">
 *  <file name="sample-po-dialog-basic/sample-po-dialog-basic.component.html"> </file>
 *  <file name="sample-po-dialog-basic/sample-po-dialog-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-dialog-labs" title="PO Dialog Labs">
 *  <file name="sample-po-dialog-labs/sample-po-dialog-labs.component.html"> </file>
 *  <file name="sample-po-dialog-labs/sample-po-dialog-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-dialog-cancel-credit-card" title="PO Dialog - Cancel Credit Card">
 *  <file name="sample-po-dialog-cancel-credit-card/sample-po-dialog-cancel-credit-card.component.html"> </file>
 *  <file name="sample-po-dialog-cancel-credit-card/sample-po-dialog-cancel-credit-card.component.ts"> </file>
 * </example>
 */
@Injectable()
export class PoDialogService extends PoDialogBaseService {
  constructor(private poComponentInjector: PoComponentInjectorService) {
    super();
  }

  openDialog(dialogType: PoDialogType, dialogOptions: PoDialogAlertOptions | PoDialogConfirmOptions): void {
    const componentRef: ComponentRef<any> = this.poComponentInjector.createComponentInApplication(PoDialogComponent);
    componentRef.changeDetectorRef.detectChanges();
    componentRef.instance.open(dialogOptions, dialogType, componentRef);
  }
}
