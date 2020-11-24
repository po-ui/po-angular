import { AfterViewInit, Component, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import {
  PoComponentInjectorService,
  PoLanguageService,
  PoModalAction,
  PoModalComponent,
  poLocaleDefault
} from '@po-ui/ng-components';

import { isExternalLink, isTypeof } from '../../utils/util';

import { PoModalPasswordRecoveryComponent } from '../po-modal-password-recovery/po-modal-password-recovery.component';
import { PoModalPasswordRecoveryType } from '../po-modal-password-recovery/enums/po-modal-password-recovery-type.enum';
import { PoPageChangePassword } from './interfaces/po-page-change-password.interface';
import { PoPageChangePasswordBaseComponent } from './po-page-change-password-base.component';
import { poPageChangePasswordLiterals } from './literals/i18n/po-page-change-password-literals';
import { PoPageChangePasswordRecovery } from './interfaces/po-page-change-password-recovery.interface';
import { PoPageChangePasswordRequirement } from './interfaces/po-page-change-password-requirement.interface';
import { PoPageChangePasswordService } from './po-page-change-password.service';

/**
 * @docsExtends PoPageChangePasswordBaseComponent
 *
 * @example
 *
 * <example name="po-page-change-password-basic" title="PO Page Change Password Basic">
 *  <file name="sample-po-page-change-password-basic/sample-po-page-change-password-basic.component.html"> </file>
 *  <file name="sample-po-page-change-password-basic/sample-po-page-change-password-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-change-password-labs" title="PO Page Change Password Labs">
 *  <file name="sample-po-page-change-password-labs/sample-po-page-change-password-labs.component.html"> </file>
 *  <file name="sample-po-page-change-password-labs/sample-po-page-change-password-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-change-password-modify" title="PO Page Change Password Modify">
 *  <file name="sample-po-page-change-password-modify/sample-po-page-change-password-modify.component.html"> </file>
 *  <file name="sample-po-page-change-password-modify/sample-po-page-change-password-modify.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-change-password-create" title="PO Page Change Password Create">
 *  <file name="sample-po-page-change-password-create/sample-po-page-change-password-create.component.html"> </file>
 *  <file name="sample-po-page-change-password-create/sample-po-page-change-password-create.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-change-password-request" title="PO Page Change Password Request">
 *  <file name="sample-po-page-change-password-request/sample-po-page-change-password-request.component.html"> </file>
 *  <file name="sample-po-page-change-password-request/sample-po-page-change-password-request.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-change-password',
  templateUrl: './po-page-change-password.component.html'
})
export class PoPageChangePasswordComponent
  extends PoPageChangePasswordBaseComponent
  implements AfterViewInit, OnDestroy, OnInit {
  literals: {
    backButton: string;
    confirmPassword: string;
    createNewPassword: string;
    createNewPasswordPhrase: string;
    currentPassword: string;
    enterSystemButton: string;
    forgotPassword: string;
    newPassword: string;
    passwordSuccessfullyCreated: string;
    passwordSuccessfullyUpdated: string;
    requirements: string;
    safetyTips: string;
    safetyTipsPhrase: string;
    safetyTipsFirst: string;
    safetyTipsSecond: string;
    safetyTipsThird: string;
    saveButton: string;
  } = poPageChangePasswordLiterals[poLocaleDefault];

  private newPasswordSubscription: Subscription;
  private componentRef: ComponentRef<any> = null;

  modalAction: PoModalAction = {
    action: this.navigateTo.bind(this, this.urlHome),
    label: this.literals.enterSystemButton
  };

  @ViewChild(PoModalComponent, { static: true }) modal: PoModalComponent;
  @ViewChild('pageChangePassword', { read: ViewContainerRef, static: true }) pageChangePassword: ViewContainerRef;
  @ViewChild('passwordForm', { read: NgForm, static: true }) passwordForm: NgForm;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private router: Router,
    private service: PoPageChangePasswordService,
    private poComponentInjector: PoComponentInjectorService,
    languageService: PoLanguageService,
    viewRef: ViewContainerRef
  ) {
    super();

    const language = languageService.getShortLanguage();

    this.literals = {
      ...poPageChangePasswordLiterals[poLocaleDefault],
      ...poPageChangePasswordLiterals[language]
    };
  }

  ngAfterViewInit() {
    if (this.urlNewPassword) {
      this.subscribeToTokenParameter();
    }
  }

  ngOnDestroy() {
    if (this.newPasswordSubscription) {
      this.newPasswordSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.checkingForRouteMetadata(this.activatedRoute.snapshot.data);
  }

  navigateTo(url: string) {
    isExternalLink(url) ? window.open(url) : this.router.navigate([url || '/']);
  }

  onForgotPasswordClick(recovery): void {
    if (isTypeof(recovery, 'function')) {
      recovery();
    } else {
      this.createModalPasswordRecoveryComponent(recovery);
    }
  }

  onLoginSubmit(): void {
    const form = this.getLoginForm();

    if (this.urlNewPassword) {
      this.postUrlNewPassword(form);
    } else if (this.submit && this.submit.observers.length) {
      this.emitSubmit(form);
    }
  }

  /**
   * Abre uma modal de confirmação com texto, imagem e botão que redireciona para o link definido na propriedade `p-url-home`
   */
  openConfirmation() {
    this.modal.open();
  }

  validatePassword() {
    const controls = this.passwordForm.form.controls;
    const controlConfirmPassword = controls['confirmPassword'];
    const controlNewPassword = controls['newPassword'];

    if (!this.newPassword) {
      this.setFormErrors({ 'required': true }, [controlNewPassword]);
    } else if (!this.confirmPassword) {
      this.setFormErrors({ 'required': true }, [controlConfirmPassword]);
    } else if (this.newPassword && this.confirmPassword && this.newPassword !== this.confirmPassword) {
      this.setFormErrors({ 'equalPassword': true }, [controlNewPassword, controlConfirmPassword]);
    } else {
      this.setFormErrors(null, [controlConfirmPassword, controlNewPassword]);
    }

    if (
      this.requirements.length &&
      this.requirements.find(requirement => this.validateRequirement(requirement) === false)
    ) {
      this.setFormErrors({ 'requirement': true }, [controlNewPassword]);
    }
  }

  validateRequirement(requirement: PoPageChangePasswordRequirement) {
    return typeof requirement.status === 'function' ? requirement.status(this.newPassword) : requirement.status;
  }

  private checkingForMetadataProperty(object, property) {
    if (Object.prototype.hasOwnProperty.call(object, property)) {
      return object[property];
    }
  }

  private checkingForRouteMetadata(data) {
    if (Object.keys(data).length !== 0) {
      this.urlNewPassword = this.checkingForMetadataProperty(data, 'serviceApi') || this.urlNewPassword;
      this.recovery = this.checkingForMetadataProperty(data, 'recovery') || this.recovery;
      this.hideCurrentPassword =
        this.checkingForMetadataProperty(data, 'hideCurrentPassword') || this.hideCurrentPassword;
    }
  }

  private createModalPasswordRecoveryComponent(recovery: PoPageChangePasswordRecovery) {
    if (this.componentRef) {
      this.poComponentInjector.destroyComponentInApplication(this.componentRef);
    }

    this.componentRef = this.poComponentInjector.createComponentInApplication(PoModalPasswordRecoveryComponent);
    this.componentRef.instance.recovery = recovery.url;
    this.componentRef.instance.contactEmail = recovery.contactMail;
    this.componentRef.instance.phoneMask = recovery.phoneMask;
    this.componentRef.instance.type = recovery.type || PoModalPasswordRecoveryType.Email;
    this.componentRef.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.componentRef.instance.open();
    });
  }

  private emitSubmit(form: PoPageChangePassword) {
    this.submit.emit(form);
  }

  private getLoginForm(): PoPageChangePassword {
    return {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };
  }

  private postUrlNewPassword(form: PoPageChangePassword) {
    form['token'] = this.token;

    this.service.post(this.urlNewPassword, form).subscribe(response => {
      if (response.status === 204) {
        this.openConfirmation();
      }
    });
  }

  private setFormErrors(error: any, controls?: Array<any>) {
    controls.forEach(control => {
      control.setErrors(error);
    });
  }

  private subscribeToTokenParameter() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (token) {
        this.token = token;
      }
    });
  }
}
