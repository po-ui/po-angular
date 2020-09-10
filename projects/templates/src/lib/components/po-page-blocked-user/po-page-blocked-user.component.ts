import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { PoLanguageService, poLocaleDefault } from '@po-ui/ng-components';

import { isExternalLink } from '../../utils/util';

import { PoPageBlockedUserBaseComponent } from './po-page-blocked-user-base.component';

export const poPageBlockedUserButtonLiterals: Object = {
  en: <any>{
    primaryButton: 'Back to home screen'
  },
  es: <any>{
    primaryButton: 'Volver al inicio'
  },
  pt: <any>{
    primaryButton: 'Voltar para o início'
  },
  ru: <any>{
    primaryButton: 'Перейти к началу страницы'
  }
};

/**
 * @docsExtends PoPageBlockedUserBaseComponent
 *
 * @example
 *
 * <example name="po-page-blocked-user-basic" title="PO Page Blocked User Basic">
 *  <file name="sample-po-page-blocked-user-basic/sample-po-page-blocked-user-basic.component.html"> </file>
 *  <file name="sample-po-page-blocked-user-basic/sample-po-page-blocked-user-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-blocked-user-labs" title="PO Page Blocked User Labs">
 *  <file name="sample-po-page-blocked-user-labs/sample-po-page-blocked-user-labs.component.html"> </file>
 *  <file name="sample-po-page-blocked-user-labs/sample-po-page-blocked-user-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-blocked-user-exceeded-attempts" title="PO Page Blocked User Exceeded Attempts">
 *  <file name="sample-po-page-blocked-user-exceeded-attempts/sample-po-page-blocked-user-exceeded-attempts.component.html"> </file>
 *  <file name="sample-po-page-blocked-user-exceeded-attempts/sample-po-page-blocked-user-exceeded-attempts.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-blocked-user-expired-password" title="PO Page Blocked User Expired Password">
 *  <file name="sample-po-page-blocked-user-expired-password/sample-po-page-blocked-user-expired-password.component.html"> </file>
 *  <file name="sample-po-page-blocked-user-expired-password/sample-po-page-blocked-user-expired-password.component.ts"> </file>
 * </example>
 */

@Component({
  selector: 'po-page-blocked-user',
  templateUrl: './po-page-blocked-user.component.html'
})
export class PoPageBlockedUserComponent extends PoPageBlockedUserBaseComponent implements OnInit {
  literals;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, languageService: PoLanguageService) {
    super();

    const language = languageService.getShortLanguage();

    this.literals = {
      ...poPageBlockedUserButtonLiterals[poLocaleDefault],
      ...poPageBlockedUserButtonLiterals[language]
    };
  }

  ngOnInit() {
    this.checkingForRouteMetadata(this.activatedRoute.snapshot.data);
  }

  navigateTo(url: string) {
    isExternalLink(url) ? window.open(url) : this.router.navigate([url || '/']);
  }

  private checkingForMetadataProperty(object, property) {
    if (Object.prototype.hasOwnProperty.call(object, property)) {
      return object[property];
    }
  }

  private checkingForRouteMetadata(data) {
    if (Object.keys(data).length !== 0) {
      this.contactEmail = this.checkingForMetadataProperty(data, 'contactEmail') || this.contactEmail;
      this.contactPhone = this.checkingForMetadataProperty(data, 'contactPhone') || this.contactPhone;
      this.reason = this.checkingForMetadataProperty(data, 'reason') || this.reason;
      this.urlBack = this.checkingForMetadataProperty(data, 'urlBack') || this.urlBack;
    }
  }
}
