import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import * as utilFunctions from './../../utils/util';
import { configureTestSuite, expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoPageBackgroundComponent } from './po-page-background.component';

describe('PoPageBackgroundComponent:', () => {
  let component: PoPageBackgroundComponent;
  let fixture: ComponentFixture<PoPageBackgroundComponent>;
  let debugElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoPageBackgroundComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageBackgroundComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    debugElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoPageBackgroundComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-logo: shoud be undefined.', () => {
      expect(component.logo).toBeUndefined();
    });

    it('p-logo: should set property with `undefined` if invalid values.', () => {
      const invalidValues = ['', ' ', null, undefined, 0, false, true];
      const expectedValue = undefined;

      expectPropertiesValues(component, 'logo', invalidValues, expectedValue);
    });

    it('p-logo: should set property with valid values.', () => {
      const validValues = ['https://portinari.io/logo', 'https://other.com/images/logo'];

      expectPropertiesValues(component, 'logo', validValues, validValues);
    });

    it('p-secondary-logo: shoud be undefined.', () => {
      expect(component.secondaryLogo).toBeUndefined();
    });

    it('p-secondary-logo: should set property with `undefined` if invalid values.', () => {
      const invalidValues = ['', ' ', null, undefined, 0, false, true];
      const expectedValue = undefined;

      expectPropertiesValues(component, 'secondaryLogo', invalidValues, expectedValue);
    });

    it('p-secondary-logo: should set property with valid values.', () => {
      const validValues = ['https://portinari.io/logo', 'https://other.com/images/logo'];

      expectPropertiesValues(component, 'secondaryLogo', validValues, validValues);
    });

    it('p-show-select-language: should be update with valid and invalid values.', () => {
      const trueValues = [true, 'true', 1, '', [], {}];
      const falseValues = [false, 'false', 0, null, undefined, NaN];

      expectPropertiesValues(component, 'showSelectLanguage', trueValues, true);
      expectPropertiesValues(component, 'showSelectLanguage', falseValues, false);
    });
  });

  describe('Methods:', () => {
    it('ngOnInit: should get the browserLanguage and apply it to `selectedLanguageOption`', () => {
      component.ngOnInit();

      expect(component.selectedLanguageOption).toBe(utilFunctions.browserLanguage());
    });

    it('onChangeLanguage: should emit `selectedLanguage`', () => {
      spyOn(component.selectedLanguage, 'emit');
      component.onChangeLanguage();

      expect(component.selectedLanguage.emit).toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it('should contain `po-page-background-main-logo` class if have `logo`.', () => {
      component.logo = 'logo-path';

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-page-background-main-logo')).toBeTruthy();
    });

    it('shouldn`t contain `po-page-background-main-logo` class if not have `logo`.', () => {
      component.logo = undefined;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-page-background-main-logo')).toBeNull();
    });

    it('should contain `po-page-background-secondary-logo-image` class if have `secondaryLogo`.', () => {
      component.secondaryLogo = 'logo-path';

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-page-background-secondary-logo-image')).toBeTruthy();
    });

    it('shouldn`t contain `po-page-background-secondary-logo-image` class if not have `secondaryLogo`.', () => {
      component.secondaryLogo = undefined;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-page-background-secondary-logo-image')).toBeNull();
    });

    it('should contain `po-page-background-hide-logo` class if `hideLogo` is true and have `logo`.', () => {
      component.logo = 'logo-path';
      component.hideLogo = true;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-page-background-hide-logo')).toBeTruthy();
    });

    it('shouldn`t contain `po-page-background-hide-logo` class if `hideLogo` is true and not have `logo`.', () => {
      component.logo = undefined;
      component.hideLogo = true;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-page-background-hide-logo')).toBeNull();
    });

    it('shouldn`t contain `po-page-background-hide-logo` class if `!hideLogo`', () => {
      component.hideLogo = false;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-page-background-hide-logo')).toBeFalsy();
    });

    it('should contain `po-page-background-secondary-logo` class if `secondaryLogo` has value', () => {
      component.secondaryLogo = 'logo-path';

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-page-background-secondary-logo')).toBeTruthy();
    });

    it('should create `po-page-login-highlight-image` if has background', () => {
      component.background = 'background-path';

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-page-login-highlight-image')).toBeTruthy();
      expect(debugElement.querySelector('.po-page-login-highlight-image-off')).toBeFalsy();
    });

    it('shouldn`t create `po-page-login-highlight-image` if doesn`t have background', () => {
      component.background = undefined;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-page-login-highlight-image')).toBeFalsy();
    });

    it('should add `po-font-display` with text if has background and highlightInfo', () => {
      const info = 'info';

      component.background = 'background-path';
      component.highlightInfo = info;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-font-display').innerHTML).toContain(info);
    });

    it('should contain `po-page-background-footer-select` if showSelectLanguage is `true`', () => {
      component.showSelectLanguage = true;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-page-background-footer-select')).toBeTruthy();
      expect(debugElement.querySelector('.po-page-background-secondary-logo-right')).toBeTruthy();
      expect(debugElement.querySelector('.po-page-background-secondary-logo-centered')).toBeFalsy();
    });

    it('shouldn`t contain `po-page-background-footer-select` if showSelectLanguage is `false`', () => {
      component.showSelectLanguage = false;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-page-background-footer-select')).toBeFalsy();
      expect(debugElement.querySelector('.po-page-background-secondary-logo-right')).toBeFalsy();
      expect(debugElement.querySelector('.po-page-background-secondary-logo-centered')).toBeTruthy();
    });
  });
});
