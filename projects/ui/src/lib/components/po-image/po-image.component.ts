import { Component } from '@angular/core';
import { PoImageBaseComponent } from './po-image-base.component';

/**
 * @docsExtends PoImageBaseComponent
 *
 * @example
 *
 * <example name="po-image-basic" title="PO Image Basic" >
 *  <file name="sample-po-image-basic/sample-po-image-basic.component.html"> </file>
 *  <file name="sample-po-image-basic/sample-po-image-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-image-labs" title="PO Image Labs" >
 *  <file name="sample-po-image-labs/sample-po-image-labs.component.html"> </file>
 *  <file name="sample-po-image-labs/sample-po-image-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-image-travel" title="PO Image Travel" >
 *  <file name="sample-po-image-travel/sample-po-image-travel.component.html"> </file>
 *  <file name="sample-po-image-travel/sample-po-image-travel.component.ts"> </file>
 * </example>
 *
 */

@Component({
  selector: 'po-image',
  templateUrl: './po-image.component.html'
})
export class PoImageComponent extends PoImageBaseComponent {}
