import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { PoPageBlockedUserContactsComponent } from './po-page-blocked-user-contacts.component';

import { configureTestSuite } from '../../../util-test/util-expect.spec';

xdescribe('PoPageBlockedUserContactsComponent: ', () => {
  let component: PoPageBlockedUserContactsComponent;
  let fixture: ComponentFixture<PoPageBlockedUserContactsComponent>;
  let debugElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule.withRoutes([])],
      declarations: [PoPageBlockedUserContactsComponent],
      providers: [HttpClient, HttpHandler],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageBlockedUserContactsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    debugElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoPageBlockedUserContactsComponent).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('ngAfterViewInit: should call `checkContactItemWidth`', () => {
      spyOn(component, <any>'checkContactItemWidth');
      component.ngAfterViewInit();
      expect(component['checkContactItemWidth']).toHaveBeenCalled();
    });

    it('ngOnChanges: shouldn`t call `checkContactItemWidth`', () => {
      const fakeChanges = {};
      spyOn(component, <any>'checkContactItemWidth');
      component.ngOnChanges(fakeChanges);
      expect(component['checkContactItemWidth']).not.toHaveBeenCalled();
    });

    xit('ngOnChanges: should call `checkContactItemWidth`', () => {
      component.phone = '55-22-98787-8787';

      spyOn(component, <any>'checkContactItemWidth');

      component.ngOnChanges({
        phone: new SimpleChange(null, component.phone, true)
      });
      fixture.detectChanges();
      expect(component['checkContactItemWidth']).toHaveBeenCalled();
    });

    it('checkContactItemWidth: should update value of `overflowItem` with valid `true`.', () => {
      component.phone = '55-22-98787-8787';
      const expectedValue = true;

      component['checkContactItemWidth']();

      expect(component.overflowItem).toBe(expectedValue);
    });

    it('checkContactItemWidth: should update value of `overflowItem` with `false`.', () => {
      component.phone = '55-22-98787-8787';
      component.email = 'mail@mail.com';
      component.overflowItem = false;

      component['checkContactItemWidth']();

      expect(component.overflowItem).toBe(false);
    });
  });

  describe('Templates: ', () => {
    it('should contain `po-icon-telephone` and `po-icon-mail` classes if phone and mail have values', () => {
      component.email = 'mail@mail.com';
      component.phone = '99999999';

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-icon-mail')).toBeTruthy();
      expect(debugElement.querySelector('.po-icon-telephone')).toBeTruthy();
    });

    it('shouldn`t contain `po-icon-telephone` and `po-icon-mail` classes if phone and mail are undefined', () => {
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-icon-mail')).toBeFalsy();
      expect(debugElement.querySelector('.po-icon-telephone')).toBeFalsy();
    });

    it('should have classes `po-md-12` and `content-inline` if value of `overflowItem` is true', () => {
      component.phone = '99999999';
      component.email = '99999999';
      component.overflowItem = true;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-page-blocked-user-contact-content-inline')).toBeTruthy();
      expect(debugElement.querySelector('.po-md-12')).toBeTruthy();

      expect(debugElement.querySelector('.po-md-6')).toBeFalsy();
    });

    it('should have class `po-md-6` if value of `overflowItem` is false', () => {
      component.phone = '99999999';
      component.email = '99999999';
      component.overflowItem = false;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-md-6')).toBeTruthy();

      expect(debugElement.querySelector('.po-page-blocked-user-contact-content-inline')).toBeFalsy();
      expect(debugElement.querySelector('.po-md-12')).toBeFalsy();
    });
  });
});
