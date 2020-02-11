import { AbstractControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewChecked, ChangeDetectorRef, Component, ComponentRef, IterableDiffers, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';

import { isExternalLink } from '../../utils/util';
import { PoComponentInjectorService } from '@portinari/portinari-ui';

import { PoModalPasswordRecoveryComponent } from '../po-modal-password-recovery/po-modal-password-recovery.component';
import { PoModalPasswordRecoveryType } from '../po-modal-password-recovery/enums/po-modal-password-recovery-type.enum';
import { PoPageLoginBaseComponent } from './po-page-login-base.component';
import { PoPageLoginRecovery } from './interfaces/po-page-login-recovery.interface';
import { PoPageLoginService } from './po-page-login.service';

/**
 * @docsExtends PoPageLoginBaseComponent
 *
 * @example
 *
 * <example name="po-page-login-basic" title="Portinari Page Login Basic">
 *  <file name="sample-po-page-login-basic/sample-po-page-login-basic.component.html"> </file>
 *  <file name="sample-po-page-login-basic/sample-po-page-login-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-login-labs" title="Portinari Page Login Labs">
 *  <file name="sample-po-page-login-labs/sample-po-page-login-labs.component.html"> </file>
 *  <file name="sample-po-page-login-labs/sample-po-page-login-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-login-human-resources" title="Portinari Page Login - Human Resources">
 *  <file name="sample-po-page-login-human-resources/sample-po-page-login-human-resources.component.html"> </file>
 *  <file name="sample-po-page-login-human-resources/sample-po-page-login-human-resources.component.ts"> </file>
 *  <file name="sample-po-page-login-human-resources/sample-po-page-login-human-resources.module.ts"> </file>
 * </example>
 *
 * <example name="po-page-login-automatic-service" title="Portinari Page Login - Automatic Service">
 *  <file name="sample-po-page-login-automatic-service/sample-po-page-login-automatic-service.component.html"> </file>
 *  <file name="sample-po-page-login-automatic-service/sample-po-page-login-automatic-service.component.ts"> </file>
 * </example>
 */

@Component({
  selector: 'po-page-login',
  templateUrl: './po-page-login.component.html'
})

export class PoPageLoginComponent extends PoPageLoginBaseComponent implements AfterViewChecked, OnInit {

  private componentRef: ComponentRef<any> = null;
  private differ: any;
  private readonly customPasswordError = { custom : false };

  @ViewChild('loginForm', { read: NgForm, static: true }) loginForm: NgForm;
  @ViewChild('pageLogin', { read: ViewContainerRef, static: true }) pageLogin: ViewContainerRef;

  constructor(
    public changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private poComponentInjector: PoComponentInjectorService,
    differs: IterableDiffers,
    loginService: PoPageLoginService,
    router: Router,
    ) {
    super(loginService, router);
    this.differ = differs.find([]).create(null);
  }

  ngAfterViewChecked() {
    if (this.differ) {
      this.validateArrayChanges(this.differ, [
        { array: this.loginErrors, callback: this.generateLoginError.bind(this) },
        { array: this.passwordErrors, callback: this.generatePasswordError.bind(this) }
      ]);
    }
  }

  ngOnInit() {
    this.checkingForRouteMetadata(this.activatedRoute.snapshot.data);
  }

  changeLoginModel() {
    if (this.authenticationUrl) {
      this.loginErrors = [];
    } else {
      this.setLoginErrors(this.loginErrors);
      this.loginChange.emit(this.login);
    }
  }

  changePasswordModel() {
    if (this.authenticationUrl) {
      this.passwordErrors = [];
    } else {
      this.setPasswordErrors(this.passwordErrors);
      this.passwordChange.emit(this.password);
    }
  }

  openUrl(recovery: any): void {
    switch (typeof recovery) {
      case 'string': {
        this.setUrlRedirect(recovery);
        break;
      }
      case 'function': {
        recovery();
        break;
      }
      case 'object': {
        this.createModalPasswordRecoveryComponent(recovery);
        break;
      }
    }
  }

  private checkingForMetadataProperty(object, property) {
    if (Object.prototype.hasOwnProperty.call(object, property)) {
      return object[property];
    }
  }

  private checkingForRouteMetadata(data) {
    if (Object.keys(data).length !== 0) {
      this.authenticationUrl = this.checkingForMetadataProperty(data, 'serviceApi') || this.authenticationUrl;
      this.authenticationType = this.checkingForMetadataProperty(data, 'authenticationType') || this.authenticationType;
      this.environment = this.checkingForMetadataProperty(data, 'environment') || this.environment;
      this.recovery = this.checkingForMetadataProperty(data, 'recovery') || this.recovery;
      this.registerUrl = this.checkingForMetadataProperty(data, 'registerUrl') || this.registerUrl;
    }
  }

  private createModalPasswordRecoveryComponent(poPageLoginRecovery: PoPageLoginRecovery) {
    if (this.componentRef) {
      this.poComponentInjector.destroyComponentInApplication(this.componentRef);
    }

    this.componentRef = this.poComponentInjector.createComponentInApplication(PoModalPasswordRecoveryComponent);
    this.componentRef.instance.urlRecovery = poPageLoginRecovery.url;
    this.componentRef.instance.contactEmail = poPageLoginRecovery.contactMail;
    this.componentRef.instance.phoneMask = poPageLoginRecovery.phoneMask;
    this.componentRef.instance.type = poPageLoginRecovery.type || PoModalPasswordRecoveryType.Email;
    this.componentRef.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.componentRef.instance.open();
    });
  }

  private generateLoginError() {
    if (this.loginErrors && this.loginErrors.length) {
      this.setLoginErrors(this.loginErrors);
    } else {
      const control = this.loginForm.form.controls['login'];
      if (control) {
        this.resetControl(control);
      }
    }
  }

  private generatePasswordError() {
    if (this.passwordErrors && this.passwordErrors.length) {
      this.setPasswordErrors(this.passwordErrors);
    } else {
      const control = this.loginForm.form.controls['password'];

      if (control) {
        this.resetControl(control);
      }
    }
  }

  private resetControl(control: AbstractControl) {
    control.markAsPristine();
    control.markAsUntouched();
    control.updateValueAndValidity();
  }

  private setControlErrors(allErrors: string, control: AbstractControl, errors: Array<string>, patternError: string) {

    if (control) {

      this[allErrors] = control.hasError('pattern') ? [...errors, ...[patternError]] : [...errors];

      if (errors && errors.length && (control.valid || control.pristine)) {
        control.markAsTouched();
        control.markAsDirty();
        control.setErrors(this.customPasswordError);
      }
    }

  }

  private setUrlRedirect(url) {
    isExternalLink(url) ?  window.open(url, '_blank') : this.router.navigate([url]);
  }

  private validateArrayChanges(differ: any, array: Array<{ array: Array<any>, callback: any }>) {

    array.forEach(element => {
      const changes = differ.diff(element.array);
      if (changes) {
        element.callback();
        this.changeDetector.detectChanges();
      }
    });
  }

  protected setLoginErrors(errors: Array<string>) {
    const control = this.loginForm.form.controls['login'];
    this.setControlErrors('allLoginErrors', control, errors, this.literals.loginErrorPattern);
  }

  protected setPasswordErrors(errors: Array<string>) {
    const control = this.loginForm.form.controls['password'];
    this.setControlErrors('allPasswordErrors', control, errors, this.literals.passwordErrorPattern);
  }

  onSelectedLanguage(language: string) {
    this.selectedLanguage = language;
    this.getLiterals(language, this.containsCustomLiterals ? this.customizedDefaultLiterals : undefined);
    this.setTitleLiteral(language, this.productName);
    this.setLoginHintLiteral(language, this.contactEmail);
  }

}
