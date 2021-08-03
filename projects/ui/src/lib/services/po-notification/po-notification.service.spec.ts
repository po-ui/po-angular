import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoComponentInjectorService } from './../po-component-injector/po-component-injector.service';
import { PoNotificationService } from './po-notification.service';
import { PoToasterOrientation } from './po-toaster/po-toaster-orientation.enum';

describe('PoNotificationService:', () => {
  let notificationService: PoNotificationService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [PoComponentInjectorService, PoNotificationService]
    });
  });

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    notificationService = TestBed.inject(PoNotificationService);
    notificationService.stackTop = [];
    notificationService.stackTop.length = 0;
    notificationService.stackBottom = [];
    notificationService.stackBottom.length = 0;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be a create toaster top', fakeAsync(() => {
    notificationService.success({
      message: '',
      orientation: PoToasterOrientation.Top,
      duration: 10000
    });

    expect(notificationService.stackTop.length === 1).toBeTruthy();

    tick(10301);

    expect(notificationService.stackTop.length === 0).toBeTruthy();
  }));

  it('should be a create toaster bottom', fakeAsync(() => {
    notificationService.success({
      message: '',
      orientation: PoToasterOrientation.Bottom,
      duration: 3000
    });

    expect(notificationService.stackBottom.length === 1).toBeTruthy();

    tick(3301);

    expect(notificationService.stackBottom.length === 0).toBeTruthy();
  }));

  describe('Methods: ', () => {
    it('should be a create toaster with 3 seconds duration', fakeAsync(() => {
      notificationService.success({
        message: '',
        orientation: PoToasterOrientation.Top,
        duration: 3000
      });

      expect(notificationService.stackTop.length === 1).toBeTruthy();

      tick(3301);

      expect(notificationService.stackTop.length === 0).toBeTruthy();
    }));

    it('should be a create toaster with 3 seconds duration as default duration', fakeAsync(() => {
      notificationService.setDefaultDuration(3000);

      notificationService.success({
        message: '',
        orientation: PoToasterOrientation.Top
      });

      notificationService.success({
        message: '',
        orientation: PoToasterOrientation.Top
      });

      expect(notificationService.stackTop.length === 2).toBeTruthy();

      tick(3601);

      expect(notificationService.stackTop.length === 0).toBeTruthy();
    }));

    it('should be a destroy toaster on close', () => {
      const spy = spyOn(notificationService, 'destroyToaster');
      const fakeRef = <any>{
        instance: {
          observableOnClose: { subscribe: callback => callback(fakeRef) }
        }
      };
      notificationService['observableOnClose'](fakeRef);
      expect(spy).toHaveBeenCalled();
    });

    it('should destroy toaster when `stackTop` is more than 5', fakeAsync(() => {
      for (let i = 0; i < 6; i++) {
        notificationService.success({
          message: '',
          orientation: PoToasterOrientation.Top,
          action: () => {
            alert('');
          },
          actionLabel: 'close'
        });
      }
      tick(301);
      expect(notificationService.stackTop.length).toBe(5);
    }));

    it('should destroy toaster when `stackBottom` is more than 5', fakeAsync(() => {
      for (let i = 0; i < 6; i++) {
        notificationService.success({
          message: '',
          orientation: PoToasterOrientation.Bottom,
          action: () => {
            alert('');
          },
          actionLabel: 'close'
        });
      }

      tick(301);
      expect(notificationService.stackBottom.length).toBe(5);
    }));
  });
});
