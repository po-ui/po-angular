/**
 * Exemplo de configuração de um módulo com forRegister.
 */

// import { NgModule } from '@angular/core';

// import { HttpClientModule } from '@angular/common/http';

// import { PoModule } from '@po-ui/ng-components';
//
// import { PoCodeEditorModule, PoCodeEditorRegisterable } from '@po-ui/ng-code-editor';

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
//   }
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
