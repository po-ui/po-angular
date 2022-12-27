import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PoModule, PoI18nModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { PoCodeEditorModule } from '@po-ui/ng-code-editor';

import { customLanguage } from './po-language-terraform.constant';
import { HighlightCodeDirective } from './../documentation/documentation-code.directive';

@NgModule({
  imports: [
    CommonModule,
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
            // eslint-disable-next-line
            passwordErrorPattern: 'Invalid PIN',
            // eslint-disable-next-line
            passwordPlaceholder: 'Insert your PIN',
            submitLabel: 'Access your account',
            forgotPassword: 'Forgot your ID or PIN?',
            highlightInfo: 'For us the future is now'
          },
          es: {
            loginErrorPattern: 'ID invalido',
            loginPlaceholder: 'Inserte su ID',
            // eslint-disable-next-line
            passwordErrorPattern: 'Contraseña incorrecta',
            // eslint-disable-next-line
            passwordPlaceholder: 'Inserte su contraseña',
            submitLabel: 'Accede a su cuenta',
            forgotPassword: '¿Olvidó su ID o contraseña?',
            highlightInfo: 'Para nosotros el futuro es ahora'
          },
          pt: {
            loginErrorPattern: 'ID inválido',
            loginPlaceholder: 'Insira seu ID',
            // eslint-disable-next-line
            passwordErrorPattern: 'Senha incorreta',
            // eslint-disable-next-line
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
