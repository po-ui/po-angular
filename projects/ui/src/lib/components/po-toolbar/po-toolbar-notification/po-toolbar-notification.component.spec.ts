import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite, expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';
import { PoPopupComponent } from '../../po-popup//po-popup.component';

import { PoToolbarNotificationComponent } from './po-toolbar-notification.component';

describe('PoToolbarNotificationComponent: ', () => {
  let component: PoToolbarNotificationComponent;
  let fixture: ComponentFixture<PoToolbarNotificationComponent>;
  let nativeElement;

  configureTestSuite(() => {
    const elementRef = {};
    const renderer2 = {
      listen: () => ({})
    };
    const poControlPositionService = {
      setElements: () => ({}),
      setElementPosition: () => ({})
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [PoToolbarNotificationComponent, PoPopupComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ElementRef, useValue: { elementRef } },
        { provide: Renderer2, useValue: renderer2 },
        { provide: PoControlPositionService, useValue: poControlPositionService }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoToolbarNotificationComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    component['_notificationNumber'] = 0;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('notificationNumber: should update property `p-notification-number` with `0` when invalid values', () => {
      const invalidValues = [undefined, null, {}, NaN, 'string', 0.1, false, true];

      expectPropertiesValues(component, 'notificationNumber', invalidValues, 0);
    });

    it('notificationNumber: should update property `p-notification-number` with valid values', () => {
      const validValues = [2, 3];

      expectPropertiesValues(component, 'notificationNumber', validValues, validValues);
    });
  });

  describe('Templates: ', () => {
    it('should not show count badge when notificationNumber is 0', () => {
      component['_notificationNumber'] = 0;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-toolbar-notification-badge')).toBeFalsy();
    });

    it('should not show count badge when notificationNumber is undefined', () => {
      component['_notificationNumber'] = undefined;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-toolbar-notification-badge')).toBeFalsy();
    });

    it('should not show count badge when notificationNumber is null', () => {
      component['_notificationNumber'] = null;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-toolbar-notification-badge')).toBeFalsy();
    });

    it('should show count badge when have notificationNumber', () => {
      component['_notificationNumber'] = 10;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-toolbar-notification-badge')).toBeTruthy();
    });
  });
});
