import { Component, ChangeDetectorRef } from '@angular/core';

import { PoLanguageService } from './../../../services/po-language/po-language.service';

import { PoLoadingOverlayBaseComponent } from './po-loading-overlay-base.component';

/**
 *
 * @docsExtends PoLoadingOverlayBaseComponent
 *
 * @example
 *
 * <example name="po-loading-overlay-basic" title="PO Loading Overlay Basic">
 *  <file name="sample-po-loading-overlay-basic/sample-po-loading-overlay-basic.component.html"> </file>
 *  <file name="sample-po-loading-overlay-basic/sample-po-loading-overlay-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-loading-overlay-labs" title="PO Loading Overlay Labs">
 *  <file name="sample-po-loading-overlay-labs/sample-po-loading-overlay-labs.component.html"> </file>
 *  <file name="sample-po-loading-overlay-labs/sample-po-loading-overlay-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-loading-overlay-connection-test" title="PO Loading Overlay - Connection Test">
 *  <file name="sample-po-loading-overlay-connection-test/sample-po-loading-overlay-connection-test.component.html"> </file>
 *  <file name="sample-po-loading-overlay-connection-test/sample-po-loading-overlay-connection-test.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-loading-overlay',
  templateUrl: 'po-loading-overlay.component.html'
})
export class PoLoadingOverlayComponent extends PoLoadingOverlayBaseComponent {
  constructor(public changeDetector: ChangeDetectorRef, languageService: PoLanguageService) {
    super(languageService);
  }
}
