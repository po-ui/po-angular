import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { PoPageBlockedUserContactsComponent } from './po-page-blocked-user-contacts.component';

import { configureTestSuite } from '../../../util-test/util-expect.spec';

describe('PoPageBlockedUserContactsComponent: ', () => {
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

    it('ngAfterViewInit: should call `checkContactItemWidth` and `ChangeDetector.detectChanges`', () => {
      spyOn(component, <any>'checkContactItemWidth');
      spyOn(component.changeDetector, 'detectChanges');

      component.ngAfterViewInit();
      expect(component['checkContactItemWidth']).toHaveBeenCalled();
      expect(component.changeDetector.detectChanges).toHaveBeenCalled();
    });

    it('ngOnChanges: shouldn`t call `checkContactItemWidth`', () => {
      const fakeChanges = {};
      spyOn(component, <any>'checkContactItemWidth');
      component.ngOnChanges(fakeChanges);
      expect(component['checkContactItemWidth']).not.toHaveBeenCalled();
    });

    it('ngOnChanges: should call `checkContactItemWidth`', () => {
      component.phone = '55-22-98787-8787';

      const changes = { phone: { firstChange: true } };

      spyOn(component, <any>'checkContactItemWidth');

      component.ngOnChanges(<any>changes);

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

    it('shouldn`t contain `po-invisible` classs if phone and mail have values', () => {
      component.email = 'mail@mail.com';
      component.phone = '99999999';

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-invisible')).toBeFalsy();
    });

    it('should contain `po-invisible` classs if phone and mail are undefined', () => {
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-invisible')).toBeTruthy();
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
