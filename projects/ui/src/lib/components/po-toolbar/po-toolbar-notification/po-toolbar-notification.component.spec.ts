import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';
import { ElementRef, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';

import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';
import { PoPopupComponent } from '../../po-popup//po-popup.component';

import { PoToolbarNotificationComponent } from './po-toolbar-notification.component';

@Component({
  template: `<po-toolbar-notification
    [p-notification-number]="notificationNumber"
    [p-notification-actions]="notificationActions"
  ></po-toolbar-notification>`,
  standalone: false
})
class HostComponent {
  notificationNumber: any = 0;
  notificationActions = undefined;

  notification = viewChild(PoToolbarNotificationComponent);
}

describe('PoToolbarNotificationComponent: ', () => {
  let hostComponent: HostComponent;
  let component: PoToolbarNotificationComponent;
  let fixture: ComponentFixture<HostComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    const renderer2 = { listen: () => ({}) };
    const poControlPositionService = {
      setElements: () => ({}),
      setElementPosition: () => ({})
    };

    await TestBed.configureTestingModule({
      declarations: [HostComponent, PoToolbarNotificationComponent, PoPopupComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Renderer2, useValue: renderer2 },
        { provide: PoControlPositionService, useValue: poControlPositionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
    component = hostComponent.notification();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly reference the ViewChild notification element', () => {
    const notificationElement = nativeElement.querySelector('po-icon');
    expect(component.notificationRef().nativeElement).toBe(notificationElement);
  });

  describe('Properties: ', () => {
    it('notificationNumber: should return `0` when invalid values', () => {
      const invalidValues = [undefined, null, {}, NaN, 'string', 0.1, false, true];

      invalidValues.forEach(val => {
        hostComponent.notificationNumber = val;
        fixture.detectChanges();
        expect(component.notificationNumber()).toBe(0);
      });
    });

    it('notificationNumber: should return valid integer values', () => {
      hostComponent.notificationNumber = 2;
      fixture.detectChanges();
      expect(component.notificationNumber()).toBe(2);

      hostComponent.notificationNumber = 3;
      fixture.detectChanges();
      expect(component.notificationNumber()).toBe(3);
    });
  });

  describe('Templates: ', () => {
    it('should not show count badge when notificationNumber is 0', () => {
      hostComponent.notificationNumber = 0;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-toolbar-notification-badge')).toBeFalsy();
    });

    it('should show count badge when notificationNumber transitions from 0 to positive', () => {
      hostComponent.notificationNumber = 0;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-toolbar-notification-badge')).toBeFalsy();

      hostComponent.notificationNumber = 1;
      fixture.detectChanges();

      const badge = nativeElement.querySelector('.po-toolbar-notification-badge');
      expect(badge).toBeTruthy();
      expect(badge.textContent.trim()).toBe('1');
    });

    it('should show count badge when have notificationNumber', () => {
      hostComponent.notificationNumber = 10;
      fixture.detectChanges();

      const badge = nativeElement.querySelector('.po-toolbar-notification-badge');
      expect(badge).toBeTruthy();
      expect(badge.textContent.trim()).toBe('10');
    });
  });
});
