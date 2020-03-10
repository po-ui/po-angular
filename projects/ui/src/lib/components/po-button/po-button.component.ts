import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

import { PoButtonBaseComponent } from './po-button-base.component';

/**
 * @docsExtends PoButtonBaseComponent
 *
 * @example
 *
 * <example name="po-button-basic" title="Portinari Button Basic">
 *  <file name="sample-po-button-basic/sample-po-button-basic.component.html"> </file>
 *  <file name="sample-po-button-basic/sample-po-button-basic.component.ts"> </file>
 *  <file name="sample-po-button-basic/sample-po-button-basic.component.e2e-spec.ts"> </file>
 *  <file name="sample-po-button-basic/sample-po-button-basic.component.po.ts"> </file>
 * </example>
 *
 * <example name="po-button-labs" title="Portinari Button Labs">
 *  <file name="sample-po-button-labs/sample-po-button-labs.component.html"> </file>
 *  <file name="sample-po-button-labs/sample-po-button-labs.component.ts"> </file>
 *  <file name="sample-po-button-labs/sample-po-button-labs.component.e2e-spec.ts"> </file>
 *  <file name="sample-po-button-labs/sample-po-button-labs.component.po.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-button',
  templateUrl: './po-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoButtonComponent extends PoButtonBaseComponent {
  @ViewChild('button', { static: true }) buttonElement: ElementRef;

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoButtonComponent } from '@portinari/portinari-ui';
   *
   * ...
   *
   * @ViewChild(PoButtonComponent, { static: true }) button: PoButtonComponent;
   *
   * focusButton() {
   *   this.button.focus();
   * }
   * ```
   */
  focus(): void {
    if (!this.disabled) {
      this.buttonElement.nativeElement.focus();
    }
  }

  onClick() {
    this.click.emit(null);
  }
}
