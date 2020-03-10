import { Component, NgModule } from '@angular/core';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoComponentInjectorService } from './../po-component-injector/po-component-injector.service';
import { PoNotificationService } from './po-notification.service';
import { PoToasterComponent } from './po-toaster/po-toaster.component';
import { PoToasterOrientation } from './po-toaster/po-toaster-orientation.enum';
import { PoToasterType } from './po-toaster/po-toaster-type.enum';

@NgModule({
  imports: [CommonModule],
  declarations: [PoToasterComponent],
  providers: [PoNotificationService]
})
class TestModule {}

@Component({
  template: `
    test component
  `
})
class TestComponent {
  constructor(service: PoNotificationService) {}
}

describe('PoNotificationService ', () => {
  let fixture: ComponentFixture<TestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [TestComponent],
      providers: [PoComponentInjectorService, PoNotificationService]
    });
  });

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  // TODO NG V9
  xit('should be a create toaster top', inject(
    [PoNotificationService],
    (poNotificationService: PoNotificationService) => {
      poNotificationService.createToaster({
        message: '',
        type: PoToasterType.Error,
        orientation: PoToasterOrientation.Top,
        position: 1,
        duration: 10000
      });

      jasmine.clock().tick(10001);

      expect(poNotificationService.stackTop.length === 0).toBeTruthy();
    }
  ));

  it('should be a create toaster bottom', inject(
    [PoNotificationService],
    (poNotificationService: PoNotificationService) => {
      poNotificationService.createToaster({
        message: '',
        type: PoToasterType.Error,
        orientation: PoToasterOrientation.Bottom,
        position: 1,
        duration: 10000
      });

      jasmine.clock().tick(5001);

      poNotificationService.createToaster({
        message: '',
        type: PoToasterType.Error,
        orientation: PoToasterOrientation.Bottom,
        position: 1,
        duration: 10000
      });

      jasmine.clock().tick(5000);

      expect(poNotificationService.stackBottom.length === 1).toBeTruthy();
    }
  ));

  it('should be a create toaster with action', inject(
    [PoNotificationService],
    (poNotificationService: PoNotificationService) => {
      poNotificationService.createToaster({
        action: () => true,
        message: '',
        type: PoToasterType.Error,
        orientation: PoToasterOrientation.Top,
        position: 1
      });

      jasmine.clock().tick(10001);

      expect(poNotificationService.stackTop.length === 0).toBeFalsy();
    }
  ));

  describe('Methods: ', () => {
    // TODO Ng V9
    xit('should be a create toaster with 3 seconds duration', inject(
      [PoNotificationService],
      (poNotificationService: PoNotificationService) => {
        poNotificationService.createToaster({
          message: '',
          type: PoToasterType.Success,
          position: 1,
          duration: 3000
        });

        jasmine.clock().tick(3001);

        expect(poNotificationService.stackTop.length === 0).toBeTruthy();
      }
    ));

    // TODO Ng V9
    xit('should be a create toaster with 3 seconds duration as default duration', inject(
      [PoNotificationService],
      (poNotificationService: PoNotificationService) => {
        poNotificationService.setDefaultDuration(3000);
        poNotificationService.createToaster({
          message: '',
          type: PoToasterType.Success,
          position: 1
        });

        jasmine.clock().tick(3001);

        expect(poNotificationService.stackTop.length === 0).toBeTruthy();
      }
    ));
  });
});
