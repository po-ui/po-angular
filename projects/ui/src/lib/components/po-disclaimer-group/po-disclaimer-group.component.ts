import { Component, IterableDiffers } from '@angular/core';

import { PoDisclaimerGroupBaseComponent } from './po-disclaimer-group-base.component';

/**
 * @docsExtends PoDisclaimerGroupBaseComponent
 *
 * @example
 *
 * <example name="po-disclaimer-group-basic" title="Portinari Disclaimer Group Basic">
 *   <file name="sample-po-disclaimer-group-basic/sample-po-disclaimer-group-basic.component.html"> </file>
 *   <file name="sample-po-disclaimer-group-basic/sample-po-disclaimer-group-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-disclaimer-group-labs" title="Portinari Disclaimer Group Labs">
 *   <file name="sample-po-disclaimer-group-labs/sample-po-disclaimer-group-labs.component.html"> </file>
 *   <file name="sample-po-disclaimer-group-labs/sample-po-disclaimer-group-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-disclaimer-group-sw-planets" title="Portinari Disclaimer Group - Star Wars Planets">
 *   <file name="sample-po-disclaimer-group-sw-planets/sample-po-disclaimer-group-sw-planets.component.html"> </file>
 *   <file name="sample-po-disclaimer-group-sw-planets/sample-po-disclaimer-group-sw-planets.component.ts"> </file>
 *   <file name="sample-po-disclaimer-group-sw-planets/sample-po-disclaimer-group-sw-planets.service.ts"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-disclaimer-group',
  templateUrl: './po-disclaimer-group.component.html'
})
export class PoDisclaimerGroupComponent extends PoDisclaimerGroupBaseComponent {
  constructor(differs: IterableDiffers) {
    super(differs);
  }
}
