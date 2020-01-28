import { AfterViewInit, Component, DoCheck, ElementRef, forwardRef, NgZone, ViewChild, Provider } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoCodeEditorBaseComponent } from './po-code-editor-base.component';
import { PoCodeEditorRegister } from './po-code-editor-register.service';
import { PoCodeEditorRegisterableSuggestion } from './interfaces/po-code-editor-registerable-suggestion.interface';
import { PoCodeEditorSuggestionService } from './po-code-editor-suggestion.service';

// variáveis relacionadas ao Monaco
let loadedMonaco: boolean = false;
let loadPromise: Promise<void>;

declare const monaco: any;
// tslint:disable-next-line
declare const require: any;

/* istanbul ignore next */
const providers: Array<Provider> = [
  {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line
    useExisting: forwardRef(() => PoCodeEditorComponent),
    multi: true
  }
];

/**
 * @docsExtends PoCodeEditorBaseComponent
 *
 * @example
 *
 * <example name="po-code-editor-basic" title="PO Code Editor Basic">
 *  <file name="sample-po-code-editor-basic/sample-po-code-editor-basic.component.html"> </file>
 *  <file name="sample-po-code-editor-basic/sample-po-code-editor-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-code-editor-labs" title="PO Code Editor Labs">
 *  <file name="sample-po-code-editor-labs/sample-po-code-editor-labs.component.html"> </file>
 *  <file name="sample-po-code-editor-labs/sample-po-code-editor-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-code-editor-diff" title="PO Code Editor - Diff">
 *  <file name="sample-po-code-editor-diff/sample-po-code-editor-diff.component.html"> </file>
 *  <file name="sample-po-code-editor-diff/sample-po-code-editor-diff.component.ts"> </file>
 * </example>
 *
 * <example name="po-code-editor-terraform" title="PO Code Editor - Terraform">
 *  <file name="sample-po-code-editor-terraform/sample-po-code-editor-terraform.component.html"> </file>
 *  <file name="sample-po-code-editor-terraform/sample-po-code-editor-terraform.component.ts"> </file>
 *  <file name="sample-po-code-editor-terraform/sample-po-code-editor-terraform.constant.ts"> </file>
 *  <file name="sample-po-code-editor-terraform/sample-po-code-editor-terraform.module.ts"> </file>
 * </example>
 *
 * <example name="po-code-editor-suggestion" title="PO Code Editor Suggestion">
 *  <file name="sample-po-code-editor-suggestion/sample-po-code-editor-suggestion.component.html"> </file>
 *  <file name="sample-po-code-editor-suggestion/sample-po-code-editor-suggestion.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-code-editor',
  templateUrl: './po-code-editor.component.html',
  providers
})
export class PoCodeEditorComponent extends PoCodeEditorBaseComponent implements AfterViewInit, DoCheck {
  canLoad = false;

  @ViewChild('editorContainer', { static: true }) editorContainer: ElementRef;

  constructor(
    private zone: NgZone,
    private el: ElementRef,
    private poCodeEditorSuggestionService: PoCodeEditorSuggestionService,
    private codeEditorRegister?: PoCodeEditorRegister
  ) {
    super();
  }

  /* istanbul ignore next */
  ngAfterViewInit(): void {
    if (loadedMonaco) {
      /* istanbul ignore next */
      loadPromise.then(() => {
        setTimeout(() => {
          if (this.el.nativeElement.offsetWidth) {
            this.registerCustomLanguage();
            this.initMonaco(this.getOptions());
          } else {
            this.canLoad = true;
          }
        });
      });
    } else {
      loadedMonaco = true;
      loadPromise = new Promise<void>((resolve: any) => {
        /* istanbul ignore next */
        const onGotAmdLoader: any = () => {
          (<any>window).require.config({ paths: { 'vs': './assets/monaco/vs' } });
          (<any>window).require(['vs/editor/editor.main'], () => {
            setTimeout(() => {
              if (this.el.nativeElement.offsetWidth) {
                this.registerCustomLanguage();
                this.initMonaco(this.getOptions());
              } else {
                this.canLoad = true;
              }
              resolve();
            });
          });
        };

        if (!(<any>window).require) {
          const loaderScript: HTMLScriptElement = document.createElement('script');
          loaderScript.type = 'text/javascript';
          loaderScript.src = './assets/monaco/vs/loader.js';
          loaderScript.addEventListener('load', onGotAmdLoader);
          document.body.appendChild(loaderScript);
        }
      });
    }
  }

  ngDoCheck() {
    if (this.canLoad && this.el.nativeElement.offsetWidth) {
      this.registerCustomLanguage();
      this.initMonaco(this.getOptions());
      this.canLoad = false;
    }
  }

  /* istanbul ignore next */
  monacoCreateModel(value: string) {
    return monaco.editor.createModel(value);
  }

  setValueInEditor() {
    if (this.showDiff) {
      setTimeout(() => {
        if (this.editor) {
          this.editor.setModel({
            original: this.monacoCreateModel(this.value),
            modified: this.monacoCreateModel(this.modifiedValue)
          });
        }
      });
    } else {
      setTimeout(() => {
        if (this.editor) {
          this.editor.setValue(this.value);
        }
      });
    }
  }

  setLanguage(language: string) {
    if (this.showDiff) {
      this.setMonacoLanguage(this.editor.getModel().original, language);
      this.setMonacoLanguage(this.editor.getModel().modified, language);
    } else {
      this.setMonacoLanguage(this.editor.getModel(), language);
    }
  }

  /* istanbul ignore next */
  setTheme(theme: string) {
    monaco.editor.setTheme(theme);
  }

  setReadOnly(readOnly: boolean) {
    this.editor.updateOptions({ readOnly: readOnly });
  }

  /* istanbul ignore next */
  setSuggestions(newSuggestions: Array<PoCodeEditorRegisterableSuggestion>, language = this.language) {
    if (!newSuggestions) {
      return;
    }

    const suggestions = this.poCodeEditorSuggestionService.getSuggestion(language, newSuggestions);

    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: () => ({ suggestions })
    });
  }

  writeValue(value) {
    this.value = value && value instanceof Array ? value[0] : value;
    this.modifiedValue = value && value instanceof Array && value.length > 0 ? value[1] : '';
    this.setValueInEditor();
  }

  /* istanbul ignore next */
  private initMonaco(options: any): void {
    if (this.showDiff) {
      this.editor = monaco.editor.createDiffEditor(this.editorContainer.nativeElement, options);

      this.editor.setModel({
        original: monaco.editor.createModel(this.value),
        modified: monaco.editor.createModel(this.modifiedValue)
      });

      this.editor.onDidUpdateDiff((e: any) => {
        const original = this.editor.getModel().original.getValue();
        const modified = this.editor.getModel().modified.getValue();
        this.onChangePropagate([original, modified]);
      });
    } else {
      this.editor = monaco.editor.create(this.editorContainer.nativeElement, options);
      this.editor.setValue(this.value);
      this.editor.onDidChangeModelContent((e: any) => {
        const value = this.editor.getValue();
        this.onChangePropagate(value);
        this.zone.run(() => (this.value = value));
      });
    }
    setTimeout(() => {
      this.setLanguage(this.language);
      this.setSuggestions(this.suggestions);
    }, 500);
  }

  /* istanbul ignore next */
  private setMonacoLanguage(model, language) {
    monaco.editor.setModelLanguage(model, language);
  }

  private registerCustomLanguage() {
    if (this.codeEditorRegister.language) {
      monaco.languages.register({ id: this.codeEditorRegister.language });

      if (this.codeEditorRegister.options) {
        monaco.languages.setMonarchTokensProvider(this.codeEditorRegister.language, this.codeEditorRegister.options);
      }

      if (this.codeEditorRegister.suggestions) {
        this.setSuggestions(
          this.codeEditorRegister.suggestions.provideCompletionItems().suggestions,
          this.codeEditorRegister.language
        );
      }
    }
  }
}
