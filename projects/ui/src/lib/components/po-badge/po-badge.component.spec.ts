import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../util-test/util-expect.spec';

import { PoBadgeBaseComponent } from './po-badge-base.component';
import { PoBadgeComponent } from './po-badge.component';

describe('PoBadgeComponent:', () => {
  let component: PoBadgeComponent;
  let fixture: ComponentFixture<PoBadgeComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoBadgeComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof PoBadgeBaseComponent).toBeTruthy();
    expect(component instanceof PoBadgeComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('setStatus: should call setStatus when "status" changes', () => {
      const changesFake = { status: 'status' };
      spyOn(component, 'setStatus');

      component.ngOnChanges(<any>changesFake);

      expect(component.setStatus).toHaveBeenCalled();
    });

    it('getChangeStyle: should return `po-badge-default`', () => {
      component.status = 'positive';

      const getChangeStyle = component.getChangeStyle();

      expect(getChangeStyle).toEqual('po-badge-default');
    });

    it('getChangeStyle: should return `po-color-03`', () => {
      component.status = undefined;
      component.color = 'color-03';

      const getChangeStyle = component.getChangeStyle();

      expect(getChangeStyle).toEqual('po-color-03');
    });

    it('setLiterals: should set notificationLabel when value > 1', () => {
      const labelFake = 'Home';
      const valueFake = 2;
      component.value = valueFake;
      component.ariaLabel = labelFake;
      component.literals = { notifications: 'notifications', notification: 'notification' };

      component.setLiterals();

      expect(component.notificationLabel).toBe(`${labelFake} ${valueFake} notifications`);
    });

    it('setLiterals: should set notificationLabel when value < 1', () => {
      const labelFake = 'Home';
      const valueFake = 1;
      component.value = valueFake;
      component.ariaLabel = labelFake;
      component.literals = { notifications: 'notifications', notification: 'notification' };

      component.setLiterals();

      expect(component.notificationLabel).toBe(`${labelFake} ${valueFake} notification`);
    });

    it('setLiterals: should set notificationLabel when value > 1 and ariaLabel is empty', () => {
      const valueFake = 2;
      component.value = valueFake;
      component.literals = { notifications: 'notifications', notification: 'notification' };

      component.setLiterals();

      expect(component.notificationLabel).toBe(` ${valueFake} notifications`);
    });

    it('setLiterals: should set notificationLabel when value < 1 and ariaLabel is empty', () => {
      const valueFake = 1;
      component.value = valueFake;
      component.literals = { notifications: 'notifications', notification: 'notification' };

      component.setLiterals();

      expect(component.notificationLabel).toBe(` ${valueFake} notification`);
    });

    it('setStatus: should called', () => {
      component.badgeValue = null;

      component.setStatus();

      expect(component.isNotification).toBeFalsy();
      expect(component.badgeValue).toEqual(null);
    });

    it('switchIconStatus: should apply all icon positive if status is posivite', () => {
      component.status = 'positive';
      component.icon = true;

      component.switchIconStatus();

      expect(component.badgeIcon).toBe('po-icon-ok');
    });

    it('switchIconStatus: should apply all icon negative if status is negative', () => {
      component.status = 'negative';
      component.icon = true;

      component.switchIconStatus();

      expect(component.badgeIcon).toBe('po-icon-minus');
    });

    it('switchIconStatus: should apply all icon warning if status is warning', () => {
      component.status = 'warning';
      component.icon = true;

      component.switchIconStatus();

      expect(component.badgeIcon).toBe('po-icon-warning');
    });

    it('switchIconStatus: should apply all icon disabled if status is disabled', () => {
      component.status = 'disabled';
      component.icon = true;

      component.switchIconStatus();

      expect(component.badgeIcon).toBe('');
    });

    it('setBadgeNotification: should return true and set isNotification true when not status', () => {
      const setBadgeNotification = component['setBadgeNotification'](2);

      expect(component.isNotification).toBeTrue();
      expect(setBadgeNotification).toBeTrue();
    });

    it('setBadgeNotification: should return true and set isNotification true when status', () => {
      component.status = 'positive';
      component.badgeValue = null;

      const setBadgeNotification = component['setBadgeNotification'](1);

      expect(component.isNotification).toBeFalse();
      expect(component.badgeValue).toBe(null);
      expect(setBadgeNotification).toBeFalse();
    });

    it('setBadgeValue: should call checkBadgeValue', () => {
      spyOn(component, <any>'checkBadgeValue');
      component.value = 2;

      component['setBadgeValue']();

      expect(component['checkBadgeValue']).toHaveBeenCalledWith(component.value);
    });

    it('checkBadgeValue: should called with value is valid', () => {
      component['checkBadgeValue'](2);

      expect(component.isValidValue).toBeTrue();
      expect(component.badgeValue).toBe('2');
    });

    it('checkBadgeValue: should called with value is invalid', () => {
      component['checkBadgeValue'](-10);

      expect(component.isValidValue).toBeFalse();
      expect(component.badgeValue).toBe('');
    });

    it('formatBadgeValue: should called formatBadgeValue and return 9+', () => {
      const formatBadgeValue = component['formatBadgeValue'](11);

      expect(formatBadgeValue).toBe('9+');
    });

    it('formatBadgeValue: should called formatBadgeValue with 2 and return 2', () => {
      const formatBadgeValue = component['formatBadgeValue'](2);

      expect(formatBadgeValue).toBe('2');
    });
  });
});
