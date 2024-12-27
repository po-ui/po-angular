import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { PoProgressStatus } from './enums/po-progress-status.enum';
import { PoProgressComponent } from './po-progress.component';
import { PoProgressModule } from './po-progress.module';

describe('PoProgressComponent:', () => {
  let component: PoProgressComponent;
  let fixture: ComponentFixture<PoProgressComponent>;

  let nativeElement: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PoProgressModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoProgressComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoProgressComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it(`emitCancellation: should call 'emit' with 'status'`, () => {
      component.status = PoProgressStatus.Success;

      spyOn(component.cancel, 'emit');

      component.emitCancellation();

      expect(component.cancel.emit).toHaveBeenCalledWith(component.status);
    });

    it(`emitRetry: should call 'emit'`, () => {
      component.status = PoProgressStatus.Success;

      spyOn(component.retry, 'emit');

      component.emitRetry();

      expect(component.retry.emit).toHaveBeenCalled();
    });

    it('callAction: should emit customActionClick event', () => {
      spyOn(component.customActionClick, 'emit');

      component.callAction();

      expect(component.customActionClick.emit).toHaveBeenCalled();
    });

    it('isActionVisible: should return true if visible is true or a function that returns true', () => {
      component.customAction = { label: 'Action', visible: true };
      expect(component.isActionVisible(component.customAction)).toBeTrue();

      component.customAction = { label: 'Action', visible: () => true };
      expect(component.isActionVisible(component.customAction)).toBeTrue();
    });

    it('isActionVisible: should return false if visible is false or a function that returns false', () => {
      component.customAction = { label: 'Action', visible: false };
      expect(component.isActionVisible(component.customAction)).toBeFalse();

      component.customAction = { label: 'Action', visible: () => false };
      expect(component.isActionVisible(component.customAction)).toBeFalse();
    });

    it('isActionVisible: should return true if action.icon is defined and action.visible is true', () => {
      component.customAction = { icon: 'ph ph-icon', visible: true };
      expect(component.isActionVisible(component.customAction)).toBeTrue();
    });

    it('isActionVisible: should return false if action.icon is defined but action.visible is false', () => {
      component.customAction = { icon: 'ph ph-icon', visible: false };
      expect(component.isActionVisible(component.customAction)).toBeFalse();
    });

    it('isActionVisible: should return true if action.icon is defined and action.visible is a function that returns true', () => {
      component.customAction = { icon: 'ph ph-icon', visible: () => true };
      expect(component.isActionVisible(component.customAction)).toBeTrue();
    });

    it('isActionVisible: should return false if action.icon is defined and action.visible is a function that returns false', () => {
      component.customAction = { icon: 'ph ph-icon', visible: () => false };
      expect(component.isActionVisible(component.customAction)).toBeFalse();
    });

    it('actionIsDisabled: should return true if disabled is true or a function that returns true', () => {
      component.customAction = { label: 'Action', disabled: true };
      expect(component.actionIsDisabled(component.customAction)).toBeTrue();

      component.customAction = { label: 'Action', disabled: () => true };
      expect(component.actionIsDisabled(component.customAction)).toBeTrue();
    });

    it('actionIsDisabled: should return false if disabled is false or a function that returns false', () => {
      component.customAction = { label: 'Action', disabled: false };
      expect(component.actionIsDisabled(component.customAction)).toBeFalse();

      component.customAction = { label: 'Action', disabled: () => false };
      expect(component.actionIsDisabled(component.customAction)).toBeFalse();
    });
  });

  describe('Properties:', () => {
    it('statusClass: should return `po-progress-success` if `status` is `PoProgressStatus.Success`', () => {
      component.status = PoProgressStatus.Success;

      expect(component.statusClass).toBe('po-progress-success');
    });

    it('statusClass: should return `po-progress-error` if `status` is `PoProgressStatus.Error`', () => {
      component.status = PoProgressStatus.Error;

      expect(component.statusClass).toBe('po-progress-error');
    });

    it('statusClass: should return `po-progress-default` if `status` is `PoProgressStatus.Default`', () => {
      component.status = PoProgressStatus.Default;

      expect(component.statusClass).toBe('po-progress-default');
    });

    it('statusClass: should return `po-progress-default` if `status` is undefined', () => {
      component.status = undefined;

      expect(component.statusClass).toBe('po-progress-default');
    });

    it('statusClass: should return `po-progress-default` if `status` is invalid', () => {
      component.status = <any>'test';

      expect(component.statusClass).toBe('po-progress-default');
    });

    it(`isAllowCancel: should be 'true' if 'cancel' contain 'function' and status is PoProgressStatus.Default`, () => {
      const cancelFunction = () => {};
      component.cancel.observers.push(<any>[new Observable(cancelFunction)]);
      component.status = PoProgressStatus.Default;

      expect(component.isAllowCancel).toBe(true);
    });

    it(`isAllowCancel: should be 'false' if 'cancel' does not contain 'function' and status is PoProgressStatus.Success`, () => {
      component.cancel.observers.length = 0;
      component.status = PoProgressStatus.Success;

      expect(component.isAllowCancel).toBe(false);
    });

    it(`isAllowCancel: should be 'false' if 'cancel' contain 'function' and status is PoProgressStatus.Success`, () => {
      const cancelFunction = () => {};
      component.cancel.observers.push(<any>[new Observable(cancelFunction)]);
      component.status = PoProgressStatus.Success;

      expect(component.isAllowCancel).toBe(false);
    });

    it(`isAllowRetry: should be 'true' if 'retry' contain 'function' and status is PoProgressStatus.Error`, () => {
      const retryFunction = () => {};
      component.retry.observers.push(<any>[new Observable(retryFunction)]);
      component.status = PoProgressStatus.Error;

      expect(component.isAllowRetry).toBe(true);
    });

    it(`isAllowRetry: should be 'false' if 'retry' does not contain 'function' and status isn't PoProgressStatus.Error`, () => {
      component.retry.observers.length = 0;
      component.status = PoProgressStatus.Default;

      expect(component.isAllowRetry).toBe(false);
    });

    it(`isAllowRetry: should be 'false' if 'retry' contain 'function' and status isn't PoProgressStatus.Error`, () => {
      const retryFunction = () => {};
      component.retry.observers.push(<any>[new Observable(retryFunction)]);
      component.status = PoProgressStatus.Default;

      expect(component.isAllowRetry).toBe(false);
    });

    describe('p-custom-action:', () => {
      it('should set customAction correctly when a valid object is assigned', () => {
        const customAction = {
          label: 'Download',
          icon: 'ph ph-download',
          type: 'default',
          visible: true,
          disabled: false
        };

        component.customAction = customAction;

        expect(component.customAction).toEqual(customAction);
      });

      it('should handle undefined or null values for customAction', () => {
        [undefined, null].forEach(value => {
          component.customAction = value;
          expect(component.customAction).toBe(value);
        });
      });
    });
  });

  describe('Templates:', () => {
    it('should contain the value of text property', () => {
      component.text = 'files';

      fixture.detectChanges();

      const text = nativeElement.querySelector('.po-progress-description').textContent.trim();

      expect(text).toBe(component.text);
    });

    it('should contain `po-icon-agro-business` if `p-info-icon` is `po-icon-agro-business`', () => {
      component.infoIcon = 'po-icon-agro-business';

      fixture.detectChanges();

      const infoIcon = nativeElement.querySelector('.po-icon-agro-business');

      expect(infoIcon).toBeTruthy();
    });

    it('shouldn`t find `.po-progress-info-icon` if `infoIcon` is `undefined`', () => {
      component.infoIcon = undefined;

      fixture.detectChanges();

      const infoIcon = nativeElement.querySelector('.po-progress-info-icon');

      expect(infoIcon).toBe(null);
    });

    it('should contain `p-info` value', () => {
      component.info = 'test info';

      fixture.detectChanges();

      const info = nativeElement.querySelector('.po-progress-info-text').textContent.trim();

      expect(info).toBe(component.info);
    });

    it('shouldn`t find `.po-progress-info-text` if `info` is undefined ', () => {
      component.info = undefined;

      fixture.detectChanges();

      const info = nativeElement.querySelector('.po-progress-info-text');

      expect(info).toBe(null);
    });

    it('should contain `po-progress-default` if `status` is `default`', () => {
      component.status = PoProgressStatus.Default;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-default')).toBeTruthy();
    });

    it('should contain `po-progress-error` if `status` is `error`', () => {
      component.status = PoProgressStatus.Error;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-error')).toBeTruthy();
    });

    it('should contain `po-progress-success` if `status` is `success`', () => {
      component.status = PoProgressStatus.Success;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-success')).toBeTruthy();
    });

    it('should contain `po-progress-default` if `status` does not exist', () => {
      component.status = <any>'test';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-default')).toBeTruthy();
    });

    it('should contain `po-progress-bar-indeterminate-track` if `indeterminate` is `true`', () => {
      component.indeterminate = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-bar-indeterminate-track')).toBeTruthy();
    });

    it('shouldn`t contain `po-progress-bar-indeterminate` if `indeterminate` is `false`', () => {
      component.indeterminate = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-bar-indeterminate')).toBeFalsy();
    });

    it('should contain `ph-x` if `cancel` is defined', () => {
      const cancelFunction = () => {};
      component.cancel.observers.push(<any>[new Observable(cancelFunction)]);

      fixture.detectChanges();

      expect(nativeElement.querySelector('.ph-x')).toBeTruthy();
    });

    it('shouldn`t contain `ph-x` if `cancel` is undefined', () => {
      component.cancel.observers.length = 0;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.ph-x')).toBeFalsy();
    });

    it('should emit cancellation with status if `cancel` is clicked', () => {
      const cancelFunction = () => {};
      component.cancel.observers.push(<any>[new Observable(cancelFunction)]);

      fixture.detectChanges();

      spyOn(component.cancel, 'emit');

      nativeElement.querySelector('.ph-x').click();

      expect(component.cancel.emit).toHaveBeenCalledWith(component.status);
    });

    it('should emit retry with status if `retry` is clicked', () => {
      const retryFunction = () => {};

      component.retry.observers.push(<any>[new Observable(retryFunction)]);
      component.status = PoProgressStatus.Error;

      fixture.detectChanges();

      spyOn(component.retry, 'emit');

      nativeElement.querySelector('.ph-arrow-clockwise').click();

      expect(component.retry.emit).toHaveBeenCalled();
    });

    it('shouldn`t find `.po-progress-description` and `.po-progress-description-mobile` if `text` is undefined', () => {
      component.text = undefined;

      fixture.detectChanges();

      const descriptionMobile = nativeElement.querySelector('.po-progress-description-mobile');
      const description = nativeElement.querySelector('.po-progress-description');

      expect(descriptionMobile).toBe(null);
      expect(description).toBe(null);
    });

    it('should find `.po-progress-info` if `info` is truthy', () => {
      component.info = 'filename.jpg';

      fixture.detectChanges();

      const progressInfo = nativeElement.querySelector('.po-progress-info');

      expect(progressInfo).toBeTruthy();
    });

    it('shouldn`t find `.po-progress-info-text` if `info`, `infoIcon`, `isAllowRetry` and `isAllowCancel` are falsy', () => {
      component.info = undefined;
      component.infoIcon = undefined;
      component.retry.observers.length = 0;
      component.cancel.observers.length = 0;

      fixture.detectChanges();

      const progressInfo = nativeElement.querySelector('.po-progress-info-text');

      expect(progressInfo).toBe(null);
    });

    it('should display customAction button with correct label and icon when customAction is defined and visible', () => {
      component.customAction = {
        label: 'Download',
        icon: 'ph ph-download',
        visible: true
      };

      fixture.detectChanges();

      const customActionButton = nativeElement.querySelector('po-button');
      expect(customActionButton).toBeTruthy();
      expect(customActionButton.textContent.trim()).toBe('Download');
      expect(customActionButton.querySelector('.ph.ph-download')).toBeTruthy();
    });

    it('should display customAction button when visible is undefined', () => {
      component.customAction = {
        icon: 'ph ph-download'
      };

      fixture.detectChanges();

      const customActionButton = nativeElement.querySelector('po-button');
      expect(customActionButton).toBeTruthy();
    });

    it('should not display customAction button when customAction is not visible', () => {
      component.customAction = {
        label: 'Hidden Action',
        visible: false
      };

      fixture.detectChanges();

      const customActionButton = nativeElement.querySelector('po-button');
      expect(customActionButton).toBeFalsy();
    });

    it('should emit customActionClick event when customAction button is clicked', () => {
      component.customAction = { label: 'Download', icon: 'download', type: 'default', visible: true };
      spyOn(component.customActionClick, 'emit');

      fixture.detectChanges();

      const customButton = nativeElement.querySelector('.po-progress-custom-button');
      expect(customButton).toBeTruthy();

      component.callAction();
      expect(component.customActionClick.emit).toHaveBeenCalled();
    });

    it('should disable customAction button when disabled is true', () => {
      component.customAction = {
        icon: 'download',
        label: 'Download',
        visible: true,
        disabled: true
      };

      fixture.detectChanges();

      const customActionButton = nativeElement.querySelector('.po-progress-custom-button button');
      expect(customActionButton).toBeTruthy();

      expect(customActionButton.disabled).toBeTrue();
    });

    it('should not disable customAction button when disabled is false', () => {
      component.customAction = {
        label: 'Enabled Action',
        visible: true,
        disabled: false
      };

      fixture.detectChanges();

      const customActionButton = nativeElement.querySelector('.po-progress-custom-button button');
      expect(customActionButton.hasAttribute('disabled')).toBeFalse();
    });
  });
});
