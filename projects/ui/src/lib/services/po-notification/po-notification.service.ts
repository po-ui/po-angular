import { ComponentRef, Injectable } from '@angular/core';

import { PoComponentInjectorService } from './../po-component-injector/po-component-injector.service';
import { PoNotificationBaseService } from './po-notification-base.service';
import { PoToaster } from './po-toaster/po-toaster.interface';
import { PoToasterOrientation } from './po-toaster/po-toaster-orientation.enum';
import { PoToasterType } from './po-toaster/po-toaster-type.enum';
import { PoToasterComponent } from './po-toaster/po-toaster.component';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

const PoNotificationMaxLength = 5;
const PoNotificationFadeTime = 200;

/**
 * @docsExtends PoNotificationBaseService
 *
 * @example
 *
 * <example name="po-notification-basic" title="PO Notification Basic">
 *  <file name="sample-po-notification-basic/sample-po-notification-basic.component.html"> </file>
 *  <file name="sample-po-notification-basic/sample-po-notification-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-notification-labs" title="PO Notification Labs">
 *  <file name="sample-po-notification-labs/sample-po-notification-labs.component.html"> </file>
 *  <file name="sample-po-notification-labs/sample-po-notification-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-notification-sales" title="PO Notification - Sales">
 *  <file name="sample-po-notification-sales/sample-po-notification-sales.component.html"> </file>
 *  <file name="sample-po-notification-sales/sample-po-notification-sales.component.ts"> </file>
 * </example>
 */

@Injectable({
  providedIn: 'root'
})
export class PoNotificationService extends PoNotificationBaseService {
  constructor(private poComponentInjector: PoComponentInjectorService) {
    super();
  }

  createToaster(toaster: PoToaster): void {
    const componentRef: ComponentRef<any> = this.poComponentInjector.createComponentInApplication(PoToasterComponent);
    toaster.componentRef = componentRef;

    componentRef.changeDetectorRef.detectChanges();
    componentRef.instance.configToaster(toaster);

    const stack = toaster.orientation === PoToasterOrientation.Top ? this.stackTop : this.stackBottom;
    stack.push(componentRef);

    this.verifyLimitToaster(stack);

    this.observableOnClose(componentRef);

    if (!((toaster.action && toaster.actionLabel) || toaster.type === PoToasterType.Error)) {
      timer(toaster.duration)
        .pipe(takeWhile(() => componentRef.instance.alive))
        .subscribe(() => {
          this.destroyToaster(componentRef);
        });
    }
  }

  destroyToaster(toaster: any): void {
    let stack;
    if (toaster.instance.orientation === PoToasterOrientation.Top) {
      stack = this.stackTop;
    } else {
      stack = this.stackBottom;
    }

    toaster.instance.setFadeOut();
    const index = stack.indexOf(toaster);
    stack.splice(index, 1);

    setTimeout(() => {
      this.poComponentInjector.destroyComponentInApplication(toaster);
      for (let count = 0; count < stack.length; count++) {
        stack[count].instance.changePosition(count);
      }
    }, PoNotificationFadeTime);
  }

  private observableOnClose(componentRef: any) {
    componentRef.instance.observableOnClose.subscribe(() => {
      this.destroyToaster(componentRef);
    });
  }

  private verifyLimitToaster(stack: Array<any>) {
    if (stack.length > PoNotificationMaxLength) {
      this.destroyToaster(stack[0]);
    }
  }
}
