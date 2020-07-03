import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PoModule, PoI18nModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { PoCodeEditorModule } from '@po-ui/ng-code-editor';

import { customLanguage } from './po-language-terraform.constant';
import { HighlightCodeDirective } from './../documentation/documentation-code.directive';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    PoModule,
    PoTemplatesModule,
    PoI18nModule.config({
      contexts: {
        general: {
          en: {
            loginErrorPattern: 'Invalid ID',
            loginPlaceholder: 'Insert your ID',
            // tslint:disable-next-line:no-hardcoded-credentials
            passwordErrorPattern: 'Invalid PIN',
            // tslint:disable-next-line:no-hardcoded-credentials
            passwordPlaceholder: 'Insert your PIN',
            submitLabel: 'Access your account',
            forgotPassword: 'Forgot your ID or PIN?',
            highlightInfo: 'For us the future is now'
          },
          es: {
            loginErrorPattern: 'ID invalido',
            loginPlaceholder: 'Inserte su ID',
            // tslint:disable-next-line:no-hardcoded-credentials
            passwordErrorPattern: 'Contraseña incorrecta',
            // tslint:disable-next-line:no-hardcoded-credentials
            passwordPlaceholder: 'Inserte su contraseña',
            submitLabel: 'Accede a su cuenta',
            forgotPassword: '¿Olvidó su ID o contraseña?',
            highlightInfo: 'Para nosotros el futuro es ahora'
          },
          pt: {
            loginErrorPattern: 'ID inválido',
            loginPlaceholder: 'Insira seu ID',
            // tslint:disable-next-line:no-hardcoded-credentials
            passwordErrorPattern: 'Senha incorreta',
            // tslint:disable-next-line:no-hardcoded-credentials
            passwordPlaceholder: 'Insira sua senha',
            submitLabel: 'Acesse a sua conta',
            forgotPassword: 'Esqueceu seu ID ou sua senha?',
            highlightInfo: 'Para nós o futuro é agora'
          }
        }
      },
      default: {
        context: 'general',
        cache: true
      }
    }),

    PoCodeEditorModule.forRegister(customLanguage)
  ],
  declarations: [HighlightCodeDirective],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HighlightCodeDirective,

    PoModule,
    PoTemplatesModule,
    PoCodeEditorModule
  ],
  providers: []
})
export class SharedModule {}
