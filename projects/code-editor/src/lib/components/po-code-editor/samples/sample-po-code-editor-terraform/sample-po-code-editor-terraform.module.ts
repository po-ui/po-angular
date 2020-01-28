/**
 * Exemplo de configuração de um módulo com forRegister.
 */

// import { NgModule } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
//
// import { PoModule } from '@portinari/portinari-ui';
// import { PoCodeEditorModule, PoCodeEditorRegisterable } from '@portinari/portinari-code-editor';
//
// declare const monaco: any; // Importante para usar configurações com tipos definidos pelo Monaco
//
// /** A função `provideCompletionItems` precisa ser exportada para ser compatível com AOT. */
// export function provideCompletionItems() {
//   const suggestions = [{
//     label: 'terraform',
//     insertText: '#terraform language'
//   }, {
//     label: 'server',
//     insertText: 'server ${1:ip}',
//     // Insere uma sugestão do tipo Snippet
//     insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
//   }];
//
//   return { suggestions: suggestions };
// }
//
// const customRegister: PoCodeEditorRegisterable = {
//   language: 'terraform'
//   options: {
//     keywords: ['resource', 'provider', 'variable', 'output', 'module', 'true', 'false'],
//     operators: ['{', '}', '(', ')', '[', ']', '?', ':'],
//     symbols:  /[=><!~?:&|+\-*\/\^%]+/,
//     escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
//     tokenizer: {
//      ...
//     }
//   },
//   suggestions: { provideCompletionItems: provideCompletionItems }
// };
//
// @NgModule({
//   imports: [
//     HttpClientModule,
//     PoModule,
//     PoCodeEditorModule.forRegister(customRegister)
//   ],
//   declarations: [
//   ],
//   exports: [],
//   providers: []
// })
// export class SamplePoCodeEditorRegisterModule { }
