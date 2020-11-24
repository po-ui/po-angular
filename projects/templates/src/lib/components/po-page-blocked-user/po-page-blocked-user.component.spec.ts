import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import * as utilsFunctions from './../../utils/util';

import { PoPageBlockedUserBaseComponent } from './po-page-blocked-user-base.component';
import { PoPageBlockedUserComponent } from './po-page-blocked-user.component';
import { PoPageBlockedUserReason } from './enums/po-page-blocked-user-reason.enum';

describe('PoPageBlockedUserComponent:', () => {
  let component: PoPageBlockedUserComponent;
  let fixture: ComponentFixture<PoPageBlockedUserComponent>;
  let nativeElement: any;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([])],
        declarations: [PoPageBlockedUserComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageBlockedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoPageBlockedUserBaseComponent).toBeTruthy();
    expect(component instanceof PoPageBlockedUserComponent).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('ngOnInit: should call checkingForRouteMetadata', () => {
      const activatedRoute = { snapshot: { data: {} } };

      spyOn(component, <any>'checkingForRouteMetadata');

      component.ngOnInit();

      expect(component['checkingForRouteMetadata']).toHaveBeenCalledWith(activatedRoute.snapshot.data);
    });

    it('navigateTo: should call `component[`router`].navigaten` if `urlBack` is an internal url', () => {
      component.urlBack = '/people';

      spyOn(utilsFunctions, 'isExternalLink').and.returnValue(false);
      spyOn(component['router'], <any>'navigate');
      spyOn(window, 'open');

      component.navigateTo(component.urlBack);

      expect(component['router'].navigate).toHaveBeenCalledWith([component.urlBack]);
      expect(window.open).not.toHaveBeenCalled();
    });

    it('navigateTo: should call `window.open` if `urlBack` is an external url', () => {
      component.urlBack = 'http://po.com.br';

      spyOn(utilsFunctions, 'isExternalLink').and.returnValue(true);
      spyOn(component['router'], <any>'navigate');
      spyOn(window, 'open');

      component.navigateTo(component.urlBack);

      expect(component['router'].navigate).not.toHaveBeenCalled();
      expect(window.open).toHaveBeenCalled();
    });

    it('navigateTo: should call `router.navigate` with `/` if is `internalLink` and url is not defined', () => {
      component.urlBack = '';

      spyOn(utilsFunctions, 'isExternalLink').and.returnValue(false);
      spyOn(component['router'], <any>'navigate');
      spyOn(window, 'open');

      component.navigateTo(undefined);

      expect(component['router'].navigate).toHaveBeenCalledWith(['/']);
      expect(window.open).not.toHaveBeenCalled();
    });

    it('checkingForMetadataProperty: should return value if the object contains the expected property', () => {
      const object = { property: 'value' };
      const property = 'property';
      const expectedResult = component['checkingForMetadataProperty'](object, property);

      expect(expectedResult).toBe('value');
    });

    it('checkingForMetadataProperty: shoudn`t return anything if object doesn`t contain the expected property', () => {
      const object = { property: 'value' };
      const property = 'absentProperty';
      const expectedResult = component['checkingForMetadataProperty'](object, property);

      expect(expectedResult).toBe(undefined);
    });

    it('checkingForRouteMetadata: shouldn`t set authenticationUrl nor recovery if activatedRoute.data is empty', () => {
      const data = {};

      spyOn(component, <any>'checkingForMetadataProperty');

      component['checkingForRouteMetadata'](data);

      expect(component['checkingForMetadataProperty']).not.toHaveBeenCalled();
    });

    it('checkingForRouteMetadata: should call `checkingForMetadataProperty twice`', () => {
      const data = {
        contactEmail: 'email',
        contactPhone: '99999999999',
        reason: 'none',
        urlBack: 'urlBack'
      };

      spyOn(component, <any>'checkingForMetadataProperty');

      component['checkingForRouteMetadata'](data);

      expect(component['checkingForMetadataProperty']).toHaveBeenCalledTimes(4);
    });

    it('checkingForRouteMetadata: should set contactEmail, contactPhone, reason and urlBack values according with data values', () => {
      const data = {
        contactEmail: 'email',
        contactPhone: '99999999999',
        reason: 'none',
        urlBack: 'urlBack'
      };

      component['checkingForRouteMetadata'](data);

      expect(component.contactEmail).toEqual(data.contactEmail);
      expect(component.contactPhone).toEqual(data.contactPhone);
      expect(component.reason).toEqual(data.reason);
      expect(component.urlBack).toEqual(data.urlBack);
    });

    it('checkingForRouteMetadata: should keep properties with their own values if data doesn`t contain a match property', () => {
      component.contactEmail = 'email';
      component.contactPhone = '99999999999';
      component.reason = PoPageBlockedUserReason.ExceededAttempts;
      component.urlBack = 'urlBack';
      const data = { anotherProperty: 'anotherValue' };

      component['checkingForRouteMetadata'](data);

      expect(component.contactEmail).toBe('email');
      expect(component.contactPhone).toBe('99999999999');
      expect(component.reason).toBe(PoPageBlockedUserReason.ExceededAttempts);
      expect(component.urlBack).toBe('urlBack');
    });
  });
});
