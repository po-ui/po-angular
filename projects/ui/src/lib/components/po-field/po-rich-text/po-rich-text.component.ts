import { AfterViewInit, Component, ElementRef, forwardRef, OnDestroy, ViewChild } from '@angular/core';

import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoRichTextBaseComponent } from './po-rich-text-base.component';
import { PoRichTextBodyComponent } from './po-rich-text-body/po-rich-text-body.component';
import { PoRichTextService } from './po-rich-text.service';

/* istanbul ignore next */
const providers = [
  {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line
    useExisting: forwardRef(() => PoRichTextComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    // tslint:disable-next-line
    useExisting: forwardRef(() => PoRichTextComponent),
    multi: true
  },
  {
    provide: PoRichTextService
  }
];

/**
 * @docsExtends PoRichTextBaseComponent
 *
 * @example
 *
 * <example name="po-rich-text-basic" title="PO Rich Text Basic">
 *   <file name="sample-po-rich-text-basic/sample-po-rich-text-basic.component.html"> </file>
 *   <file name="sample-po-rich-text-basic/sample-po-rich-text-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-rich-text-labs" title="PO Rich Text Labs">
 *   <file name="sample-po-rich-text-labs/sample-po-rich-text-labs.component.html"> </file>
 *   <file name="sample-po-rich-text-labs/sample-po-rich-text-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-rich-text-recipe" title="PO Rich Text Recipe">
 *   <file name="sample-po-rich-text-recipe/sample-po-rich-text-recipe-image-base-64.ts"> </file>
 *   <file name="sample-po-rich-text-recipe/sample-po-rich-text-recipe.component.html"> </file>
 *   <file name="sample-po-rich-text-recipe/sample-po-rich-text-recipe.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-rich-text',
  templateUrl: './po-rich-text.component.html',
  providers
})
export class PoRichTextComponent extends PoRichTextBaseComponent implements AfterViewInit, OnDestroy {
  private listener = this.validateClassesForRequired.bind(this);
  private modelLastUpdate: any;

  @ViewChild(PoRichTextBodyComponent, { static: true }) bodyElement: PoRichTextBodyComponent;

  get errorMsg() {
    return this.errorMessage !== '' && !this.value && this.required && this.invalid ? this.errorMessage : '';
  }

  constructor(private element: ElementRef, richTextService: PoRichTextService) {
    super(richTextService);
  }

  ngAfterViewInit() {
    // Se não tem ngModel ou reactive form adiciona validação com classes css
    this.addKeyListeners();
    this.verifyAutoFocus();
  }

  ngOnDestroy() {
    if (!this.onChangeModel) {
      this.element.nativeElement.removeEventListener('keyup', this.listener);
      this.element.nativeElement.removeEventListener('keydown', this.listener);
      this.element.nativeElement.removeEventListener('cut', this.listener);
      this.element.nativeElement.removeEventListener('paste', this.listener);
    }
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoRichTextComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoRichTextComponent, { static: true }) richText: PoRichTextComponent;
   *
   * focusRichText() {
   *   this.richText.focus();
   * }
   * ```
   */
  focus(): void {
    this.bodyElement.focus();
  }

  onBlur() {
    this.onTouched?.();
  }

  onChangeValue(value: any) {
    this.change.emit(value);
  }

  updateValue(value: string) {
    this.value = value;
    this.invalid = !value;
    this.controlChangeModelEmitter(this.value);
    this.updateModel(this.value);
  }

  private addKeyListeners() {
    if (!this.onChangeModel) {
      this.element.nativeElement.addEventListener('keyup', this.listener);
      this.element.nativeElement.addEventListener('keydown', this.listener);
      this.element.nativeElement.addEventListener('cut', this.listener);
      this.element.nativeElement.addEventListener('paste', this.listener);
    }
  }

  private controlChangeModelEmitter(value: any) {
    if (this.modelLastUpdate !== value) {
      this.changeModel.emit(value);
      this.modelLastUpdate = value;
    }
  }

  private verifyAutoFocus() {
    if (this.autoFocus) {
      this.focus();
    }
  }

  private validateClassesForRequired() {
    setTimeout(() => {
      const value = this.value;
      const element = this.element.nativeElement;

      if (!value && this.required) {
        element.classList.add('ng-invalid');
        element.classList.add('ng-dirty');
      } else {
        element.classList.remove('ng-invalid');
      }
    });
  }
}
