import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';

// import { PoThemeService } from '../../services';
import { PoButtonBaseComponent } from './po-button-base.component';
import { validateSize } from '../../utils/util';
import { PoButtonSize } from './enums/po-button-size.enum';

/**
 * @docsExtends PoButtonBaseComponent
 *
 * @example
 *
 * <example name="po-button-basic" title="PO Button Basic">
 *  <file name="sample-po-button-basic/sample-po-button-basic.component.html"> </file>
 *  <file name="sample-po-button-basic/sample-po-button-basic.component.ts"> </file>
 *  <file name="sample-po-button-basic/sample-po-button-basic.component.e2e-spec.ts"> </file>
 *  <file name="sample-po-button-basic/sample-po-button-basic.component.po.ts"> </file>
 * </example>
 *
 * <example name="po-button-labs" title="PO Button Labs">
 *  <file name="sample-po-button-labs/sample-po-button-labs.component.html"> </file>
 *  <file name="sample-po-button-labs/sample-po-button-labs.component.ts"> </file>
 *  <file name="sample-po-button-labs/sample-po-button-labs.component.e2e-spec.ts"> </file>
 *  <file name="sample-po-button-labs/sample-po-button-labs.component.po.ts"> </file>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoButtonComponent extends PoButtonBaseComponent {
  @ViewChild('button', { static: true }) buttonElement: ElementRef;

  constructor(protected cd: ChangeDetectorRef) {
    // protected poThemeService: PoThemeService
    super(cd);
    // poThemeService
  }

  ngAfterViewInit(): void {
    window.addEventListener('po-change-a11y', this.themeChangeListener.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('po-change-a11y', this.themeChangeListener.bind(this));
  }

  themeChangeListener() {
    const size = validateSize(this.size, undefined, PoButtonSize, this._originalSize);

    this.size = size;
    this.cd.detectChanges();
  }

  onBlur(): void {
    this.blur.emit();
  }

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
      this.buttonElement.nativeElement.focus();
    }
  }

  mapSizeToIcon(size: string): string {
    const sizeMap: { [key: string]: string } = {
      small: 'xs',
      medium: 'sm',
      large: 'sm'
    };
    return sizeMap[size] || 'sm';
  }

  onClick() {
    this.click.emit(null);
  }
}
