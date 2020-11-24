import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { PoPageBlockedUserContactsComponent } from './po-page-blocked-user-contacts.component';

describe('PoPageBlockedUserContactsComponent: ', () => {
  let component: PoPageBlockedUserContactsComponent;
  let fixture: ComponentFixture<PoPageBlockedUserContactsComponent>;
  let debugElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, RouterTestingModule.withRoutes([])],
        declarations: [PoPageBlockedUserContactsComponent],
        providers: [HttpClient, HttpHandler],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      TestBed.overrideComponent(PoPageBlockedUserContactsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      }).createComponent(PoPageBlockedUserContactsComponent);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageBlockedUserContactsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    debugElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoPageBlockedUserContactsComponent).toBeTruthy();
  });

  describe('Properties', () => {
    it('p-email: should call `checkContactItemWidth`', () => {
      spyOn(component, <any>'checkContactItemWidth');

      component.email = 'mail@test.com';

      expect(component['checkContactItemWidth']).toHaveBeenCalled();
    });

    it('p-phone: should call `checkContactItemWidth`', () => {
      spyOn(component, <any>'checkContactItemWidth');

      component.phone = '999999';

      expect(component['checkContactItemWidth']).toHaveBeenCalled();
    });
  });

  describe('Methods: ', () => {
    it('checkContactItemWidth: should apply `true` to `overflowItem`', () => {
      component.overflowItem = false;

      component['checkContactItemWidth']();

      expect(component.overflowItem).toBeTruthy();
    });

    it('checkContactItemWidth: should call `detectChanges`', () => {
      component.email = 'mail@test.com';
      component.phone = '999999';

      const spyDetectChanges = spyOn(component['changeDetector'], <any>'detectChanges');

      component['checkContactItemWidth']();

      expect(spyDetectChanges).toHaveBeenCalled();
    });

    it(`checkContactItemWidth: should apply 'false' to 'overflowItem' if 'phoneItem' and 'mailItem' summed measures are less than 'contactGroup' width`, () => {
      component.email = 'mail@test.com';
      component.phone = '999999';

      spyOnProperty(component.phoneItem.nativeElement, 'offsetWidth').and.returnValue(20);
      spyOnProperty(component.mailItem.nativeElement, 'offsetWidth').and.returnValue(20);
      spyOnProperty(component.contactGroup.nativeElement, 'offsetWidth').and.returnValue(200);

      component['checkContactItemWidth']();

      expect(component.overflowItem).toBeFalsy();
    });

    it(`checkContactItemWidth: should apply 'true' to 'overflowItem' if 'phoneItem' and 'mailItem' summed measures are greater than 'contactGroup' width`, () => {
      component.email = 'mail@test.com';
      component.phone = '999999';

      spyOnProperty(component.phoneItem.nativeElement, 'offsetWidth').and.returnValue(20);
      spyOnProperty(component.mailItem.nativeElement, 'offsetWidth').and.returnValue(150);
      spyOnProperty(component.contactGroup.nativeElement, 'offsetWidth').and.returnValue(200);

      component['checkContactItemWidth']();

      expect(component.overflowItem).toBeTruthy();
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
