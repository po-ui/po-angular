import { Component, ViewContainerRef } from '@angular/core';

import { PoCleanBaseComponent } from './po-clean-base.component';

/**
 * @docsPrivate
 *
 * @docsExtends PoCleanBaseComponent
 *
 * @examplePrivate
 *
 * <example-private name="po-clean-labs" title="Portinari Clean Labs">
 *   <file name="sample-po-clean-labs.component.html"> </file>
 *   <file name="sample-po-clean-labs.component.ts"> </file>
 * </example-private>
 */
@Component({
  selector: 'po-clean',
  templateUrl: './po-clean.component.html'
})
export class PoCleanComponent extends PoCleanBaseComponent {
  constructor(private viewRef: ViewContainerRef) {
    super();
    this.parentComponent = this.viewRef['_hostView'][8];
  }

  setInputValue(value?: string) {
    if (this.inputRef && this.inputRef.nativeElement) {
      this.inputRef.nativeElement.value = value;
    }
  }

  getInputValue() {
    if (this.inputRef && this.inputRef.nativeElement) {
      return this.inputRef.nativeElement.value;
    }
  }
}
