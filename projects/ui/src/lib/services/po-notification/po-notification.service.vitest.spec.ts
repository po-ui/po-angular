import { TestBed } from '@angular/core/testing';

import { PoComponentInjectorService } from './../po-component-injector/po-component-injector.service';
import { PoNotificationService } from './po-notification.service';
import { PoToasterOrientation } from '../../components/po-toaster';

describe('PoNotificationService:', () => {
  let notificationService: PoNotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [PoComponentInjectorService, PoNotificationService]
    }).compileComponents();
  });

  beforeEach(() => {
    notificationService = TestBed.inject(PoNotificationService);
    notificationService.stackTop = [];
    notificationService.stackTop.length = 0;
    notificationService.stackBottom = [];
    notificationService.stackBottom.length = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be a create toaster top', async () => {
    notificationService.success({
      message: '',
      orientation: PoToasterOrientation.Top,
      duration: 10000
    });

    expect(notificationService.stackTop.length === 1).toBeTruthy();

    await new Promise(r => setTimeout(r, 10301));

    expect(notificationService.stackTop.length === 0).toBeTruthy();
  }, 15000);

  it('should be a create toaster bottom', async () => {
    notificationService.success({
      message: '',
      orientation: PoToasterOrientation.Bottom,
      duration: 3000
    });

    expect(notificationService.stackBottom.length === 1).toBeTruthy();

    await new Promise(r => setTimeout(r, 3301));

    expect(notificationService.stackBottom.length === 0).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('should be a create toaster with 3 seconds duration', async () => {
      notificationService.success({
        message: '',
        orientation: PoToasterOrientation.Top,
        duration: 3000
      });

      expect(notificationService.stackTop.length === 1).toBeTruthy();

      await new Promise(r => setTimeout(r, 3301));

      expect(notificationService.stackTop.length === 0).toBeTruthy();
    });

    it('should be a create toaster with 3 seconds duration as default duration', async () => {
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

      await new Promise(r => setTimeout(r, 3601));

      expect(notificationService.stackTop.length === 0).toBeTruthy();
    });

    it('should be a destroy toaster on close', () => {
      const spy = vi.spyOn(notificationService, 'destroyToaster').mockImplementation(() => {});
      const fakeRef = <any>{
        instance: {
          observableOnClose: { subscribe: callback => callback(fakeRef) }
        }
      };
      notificationService['observableOnClose'](fakeRef);
      expect(spy).toHaveBeenCalled();
    });

    it('should destroy toaster when `stackTop` is more than 5', async () => {
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
      await new Promise(r => setTimeout(r, 301));
      expect(notificationService.stackTop.length).toBe(5);
    });

    it('should destroy toaster when `stackBottom` is more than 5', async () => {
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

      await new Promise(r => setTimeout(r, 301));
      expect(notificationService.stackBottom.length).toBe(5);
    });
  });
});
