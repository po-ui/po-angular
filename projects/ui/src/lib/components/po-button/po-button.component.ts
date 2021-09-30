import { ChangeDetectionStrategy, Component, HostListener, ViewChild } from '@angular/core';

import { Button } from '@animaliads/ani-button';
import '@animaliads/ani-button';

import { PoButtonBaseComponent } from './po-button-base.component';

/**
 * @docsExtends PoButtonBaseComponent
 *
 * @example
 *
 * <example name="po-button-basic" title="PO Button Basic">
 *  <file name="sample-po-button-basic/sample-po-button-basic.component.html"> </file>
 *  <file name="sample-po-button-basic/sample-po-button-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-button-labs" title="PO Button Labs">
 *  <file name="sample-po-button-labs/sample-po-button-labs.component.html"> </file>
 *  <file name="sample-po-button-labs/sample-po-button-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-button-social-network" title="PO Button Social Network">
 *  <file name="sample-po-button-social-network/sample-po-button-social-network.component.html"> </file>
 *  <file name="sample-po-button-social-network/sample-po-button-social-network.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-button',
  templateUrl: './po-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoButtonComponent extends PoButtonBaseComponent {
  @ViewChild('button', { static: true }) buttonElement: Button;

  @HostListener('click') onClick = () => {
    if (!this.disabled) {
      this.click.emit(null);
    }
  };

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoButtonComponent } from '@po-ui/ng-components';
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
      this.buttonElement.nativeElement.setFocus();
    }
  }
}
