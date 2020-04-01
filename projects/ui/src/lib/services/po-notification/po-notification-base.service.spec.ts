import { ViewContainerRef, Injectable, ComponentRef, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoNotificationBaseService } from './po-notification-base.service';
import { PoToasterOrientation } from './po-toaster/po-toaster-orientation.enum';
import { PoToasterType } from './po-toaster/po-toaster-type.enum';
import { PoToaster } from './po-toaster/po-toaster.interface';
import { PoToasterBaseComponent } from './po-toaster/po-toaster-base.component';

@Injectable()
class PoNotificationService extends PoNotificationBaseService {
  createToaster(toaster: PoToaster, viewContainerRef?: ViewContainerRef): void {
    const elementRef: ElementRef = {
      nativeElement: undefined
    };
    const componentReference: ComponentRef<any> = {
      location: elementRef,
      injector: undefined,
      instance: {
        action: toaster.action,
        poToasterAction: function () {
          this.action(this);
        }
      },
      hostView: undefined,
      changeDetectorRef: undefined,
      componentType: undefined,
      destroy: function () {},
      onDestroy: function () {}
    };
    if (toaster.orientation === PoToasterOrientation.Bottom) {
      this.stackBottom.push(componentReference);
    } else {
      this.stackTop.push(componentReference);
    }
  }

  destroyToaster(toaster: number | ComponentRef<PoToasterBaseComponent>): void {}
}

describe('PoNotificationService ', () => {
  let service: PoNotificationBaseService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [PoNotificationBaseService]
    });
  });

  beforeEach(() => {
    service = new PoNotificationService();
  });

  it('should have a `service` attribute that is a PoNotificationBaseService', () => {
    expect(service instanceof PoNotificationBaseService).toBeTruthy();
  });

  it('should be success toaster in stack', () => {
    spyOn(service, 'createToaster');
    service.success({ message: 'teste', orientation: PoToasterOrientation.Top });

    expect(service.createToaster).toHaveBeenCalledWith(
      mockToaster({ type: PoToasterType.Success, orientation: PoToasterOrientation.Top })
    );
  });

  it('should be warning toaster in stack', () => {
    spyOn(service, 'createToaster');
    service.warning({ message: 'teste', orientation: PoToasterOrientation.Top });

    expect(service.createToaster).toHaveBeenCalledWith(
      mockToaster({ type: PoToasterType.Warning, orientation: PoToasterOrientation.Top })
    );
  });

  it('should be error toaster in stack', () => {
    spyOn(service, 'createToaster');
    service.error({ message: 'teste', orientation: PoToasterOrientation.Top });

    expect(service.createToaster).toHaveBeenCalledWith(
      mockToaster({ type: PoToasterType.Error, orientation: PoToasterOrientation.Top })
    );
  });

  it('should be information toaster in stack', () => {
    spyOn(service, 'createToaster');
    service.information({ message: 'teste', orientation: PoToasterOrientation.Top });

    expect(service.createToaster).toHaveBeenCalledWith(
      mockToaster({ type: PoToasterType.Information, orientation: PoToasterOrientation.Top })
    );
  });

  it('call be method information with string', () => {
    spyOn(service, 'createToaster');
    service.information('teste');

    expect(service.createToaster).toHaveBeenCalledWith(mockToaster({ type: PoToasterType.Information }));
  });

  it('call be method error with string', () => {
    spyOn(service, 'createToaster');
    service.error('teste');

    expect(service.createToaster).toHaveBeenCalledWith(mockToaster({ type: PoToasterType.Error }));
  });

  it('call be method warning with string', () => {
    spyOn(service, 'createToaster');
    service.warning('teste');

    expect(service.createToaster).toHaveBeenCalledWith(mockToaster({ type: PoToasterType.Warning }));
  });

  it('call be method success with string', () => {
    spyOn(service, 'createToaster');
    service.success('teste');

    expect(service.createToaster).toHaveBeenCalledWith(mockToaster({ type: PoToasterType.Success }));
  });

  it('should be orientation bottom', () => {
    spyOn(service, 'createToaster');
    service.success({ message: 'teste', orientation: PoToasterOrientation.Bottom });

    expect(service.createToaster).toHaveBeenCalledWith(
      mockToaster({ type: PoToasterType.Success, orientation: PoToasterOrientation.Bottom })
    );
  });

  it('call action defined by developer with bottom orientation', () => {
    const notification = {
      message: 'teste',
      orientation: PoToasterOrientation.Bottom,
      action: function () {}
    };
    service.success(notification);

    spyOn(notification, 'action');
    service.stackBottom[0].instance.poToasterAction();
    expect(notification.action).toHaveBeenCalledWith();
  });

  it('call action defined by developer with top orientation', () => {
    const notification = {
      message: 'teste',
      orientation: PoToasterOrientation.Top,
      action: function () {}
    };
    service.success(notification);

    spyOn(notification, 'action');
    service.stackTop[0].instance.poToasterAction();
    expect(notification.action).toHaveBeenCalledWith();
  });

  describe('Methods: ', () => {
    it('should be duration 10000 when not informed', () => {
      spyOn(service, 'createToaster');
      service.success({ message: 'teste' });

      expect(service.createToaster).toHaveBeenCalledWith(mockToaster({ type: PoToasterType.Success, duration: 10000 }));
    });

    it('should be duration equals 5 seconds', () => {
      spyOn(service, 'createToaster');
      service.success({ message: 'teste', duration: 5000 });

      expect(service.createToaster).toHaveBeenCalledWith(mockToaster({ type: PoToasterType.Success, duration: 5000 }));
    });

    it('should change default duration to 3 seconds', () => {
      spyOn(service, 'setDefaultDuration').and.callThrough();
      service.setDefaultDuration(3000);

      expect(service.setDefaultDuration).toHaveBeenCalledWith(3000);
      expect(service['defaultDuration']).toBe(3000);
    });
  });
});

function mockToaster(obj: any) {
  const toasterDefault: any = {
    componentRef: undefined,
    message: 'teste',
    type: PoToasterType.Success,
    orientation: PoToasterOrientation.Bottom,
    action: undefined,
    actionLabel: undefined,
    position: 0,
    duration: 10000
  };

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop) && toasterDefault.hasOwnProperty(prop)) {
      toasterDefault[prop] = obj[prop];
    }
  }
  return toasterDefault;
}
