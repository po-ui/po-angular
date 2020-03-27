import { Component } from '@angular/core';

import { isKeyCodeEnter } from '../../utils/util';

import { PoDisclaimerBaseComponent } from './po-disclaimer-base.component';

/**
 * @docsPrivate
 *
 * @docsExtends PoDisclaimerBaseComponent
 *
 * @examplePrivate
 *
 * <example-private name="po-disclaimer" title="PO Disclaimer">
 *   <file name="sample-po-disclaimer.component.html"> </file>
 *   <file name="sample-po-disclaimer.component.ts"> </file>
 * </example-private>
 */
@Component({
  selector: 'po-disclaimer',
  templateUrl: './po-disclaimer.component.html'
})
export class PoDisclaimerComponent extends PoDisclaimerBaseComponent {
  onKeyPress(event: any) {
    if (isKeyCodeEnter(event)) {
      this.close();
    }
  }
}
