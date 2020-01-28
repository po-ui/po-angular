import { Injectable } from '@angular/core';

import { PoCodeEditorRegisterable } from './interfaces/po-code-editor-registerable.interface';
import { PoCodeEditorRegisterableOptions } from './interfaces/po-code-editor-registerable-options.interface';
import { PoCodeEditorRegisterableSuggestionType } from './interfaces/po-code-editor-registerable-suggestion.interface';

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
 * import { PoCodeEditorModule, PoCodeEditorRegisterable } from '@po-ui/ng-code-editor';
 *
 * declare const monaco: any; // Importante para usar configurações com tipos definidos pelo Monaco
 *
 * // A função `provideCompletionItems` precisa ser exportada para ser compatível com AOT.
 * export function provideCompletionItems() {
 *   const suggestions = [{
 *     label: 'terraform',
 *     insertText: '#terraform language'
 *   }, {
 *     label: 'server',
 *     insertText: 'server ${1:ip}'
 *   }];
 *
 *   return { suggestions: suggestions };
 * }
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
 *   },
 *   suggestions: { provideCompletionItems: provideCompletionItems }
 * };
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
 *
 * > As configurações para o registro de uma nova sintaxe no Monaco code editor podem ser encontradas em
 * > [**Monaco Editor**](https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages).
 */
@Injectable()
export class PoCodeEditorRegister implements PoCodeEditorRegisterable {
  /** Sintaxe a ser registrada. */
  language: string;

  /** Opções da sintaxe para registro no po-code-editor. */
  options: PoCodeEditorRegisterableOptions;

  /** Lista de sugestões para a função de autocomplete (CTRL + SPACE). */
  suggestions?: PoCodeEditorRegisterableSuggestionType;
}
