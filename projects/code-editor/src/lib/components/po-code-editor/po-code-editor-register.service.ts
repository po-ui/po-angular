import { Injectable } from '@angular/core';

import { PoCodeEditorRegisterable } from './interfaces/po-code-editor-registerable.interface';
import { PoCodeEditorRegisterableOptions } from './interfaces/po-code-editor-registerable-options.interface';

/**
 * @description
 *
 * Wrapper para registro de sintaxes customizadas para o po-code-editor.
 *
 * Para utilização do serviço de idiomas **PoCodeEditorRegister**,
 * deve-se importar o módulo PoCodeEditorModule mesmo já tendo importado
 * o módulo PoModule.
 * Na importação opcionalmente pode ser invocado o método **forRegister** informando um objeto para configuração.
 *
 * Exemplo de configuração:
 * ```
 * import { PoCodeEditorModule, PoCodeEditorRegisterable } from '@portinari/portinari-code-editor';
 *
 * const customEditor: PoCodeEditorRegisterable = {
 *   language: 'terraform',
 *   options: {
 *     keywords: ['resource', 'provider', 'variable', 'output', 'module', 'true', 'false'],
 *     operators: ['{', '}', '(', ')', '[', ']', '?', ':'],
 *     symbols:  /[=><!~?:&|+\-*\/\^%]+/,
 *     escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
 *     tokenizer: {
 *      ...
 *     }
 *   }
 * };
 * As configurações para o registro de uma nova sintaxe no Monaco code editor podem ser encontradas em
 * [**Monaco Editor**](https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages).
 *
 * @NgModule({
 *   declarations: [],
 *   imports: [
 *     PoModule,
 *     PoCodeEditorModule.forRegister(customEditor)
 *   ],
 *   bootstrap: [AppComponent]
 * })
 * ```
 */
@Injectable()
export class PoCodeEditorRegister implements PoCodeEditorRegisterable {
  /** Sintaxe a ser registrada. */
  language: string;

  /** Opções da sintaxe para registro no po-code-editor */
  options: PoCodeEditorRegisterableOptions;
}
