import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoRichTextToolbarActions } from './enum/po-rich-text-toolbar-actions.enum';
import { PoRichTextBaseComponent } from './po-rich-text-base.component';
import { PoRichTextBodyComponent } from './po-rich-text-body/po-rich-text-body.component';
import { PoRichTextToolbarComponent } from './po-rich-text-toolbar/po-rich-text-toolbar.component';
import { PoRichTextService } from './po-rich-text.service';

/* istanbul ignore next */
const providers = [
  {
    provide: NG_VALUE_ACCESSOR,
    // eslint-disable-next-line
    useExisting: forwardRef(() => PoRichTextComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    // eslint-disable-next-line
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers,
  standalone: false
})
export class PoRichTextComponent
  extends PoRichTextBaseComponent
  implements AfterViewInit, OnDestroy, OnInit, OnChanges
{
  @ViewChild(PoRichTextBodyComponent, { static: true }) bodyElement: PoRichTextBodyComponent;
  @ViewChild(PoRichTextToolbarComponent, { static: false }) richTextToolbar: PoRichTextToolbarComponent;

  private listener = this.validateClassesForRequired.bind(this);
  private modelLastUpdate: any;
  toolbarActions: Array<PoRichTextToolbarActions> = [];

  get errorMsg() {
    return this.errorMessage !== '' && !this.value && this.required && this.invalid ? this.errorMessage : '';
  }

  constructor(
    private element: ElementRef,
    richTextService: PoRichTextService
  ) {
    super(richTextService);
  }

  ngOnInit(): void {
    this.toolbarActions = [...this.hideToolbarActions];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hideToolbarActions || changes.disabledTextAlign) {
      this.toolbarActions = [...this.hideToolbarActions];
      this.updateAlignOnHideToolbarActionsList();
    }
  }

  ngAfterViewInit() {
    // Se não tem ngModel ou reactive form adiciona validação com classes css
    this.addKeyListeners();
    this.verifyAutoFocus();

    this.updateAlignOnHideToolbarActionsList();
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

    if (this.additionalHelp.observed ? null : this.additionalHelpTooltip && this.displayAdditionalHelp) {
      this.showAdditionalHelp();
    }
  }

  onChangeValue(value: any) {
    this.change.emit(value);
  }

  onKeyDown(event: KeyboardEvent): void {
    this.keydown.emit(event);
  }

  /**
   * Método que exibe `p-additionalHelpTooltip` ou executa a ação definida em `p-additionalHelp`.
   * Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.
   *
   * ```
   * <po-rich-text
   *  #richtext
   *  ...
   *  p-additional-help-tooltip="Mensagem de ajuda complementar"
   *  (p-keydown)="onKeyDown($event, richtext)"
   * ></po-rich-text>
   * ```
   * ```
   * ...
   * onKeyDown(event: KeyboardEvent, inp: PoRichTextComponent): void {
   *  if (event.code === 'F9') {
   *    inp.showAdditionalHelp();
   *  }
   * }
   * ```
   */
  showAdditionalHelp(): boolean {
    this.displayAdditionalHelp = !this.displayAdditionalHelp;
    return this.displayAdditionalHelp;
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

  isAllActionsHidden(): boolean {
    return Object.values(PoRichTextToolbarActions).every(action => this.toolbarActions.includes(action));
  }

  updateAlignOnHideToolbarActionsList() {
    if (this.disabledTextAlign && !this.toolbarActions.includes(PoRichTextToolbarActions.Align)) {
      this.toolbarActions.push(PoRichTextToolbarActions.Align);
    }
  }
}
