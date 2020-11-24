import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { PoProgressComponent } from './po-progress.component';
import { PoProgressModule } from './po-progress.module';
import { PoProgressStatus } from './enums/po-progress-status.enum';

describe('PoProgressComponent:', () => {
  let component: PoProgressComponent;
  let fixture: ComponentFixture<PoProgressComponent>;

  let nativeElement: any;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [PoProgressModule]
      }).compileComponents();
    })
  );

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
  });

  describe('Templates:', () => {
    it('should contain the value of text property', () => {
      component.text = 'files';

      fixture.detectChanges();

      const text = nativeElement
        .querySelector('.po-progress-description .po-progress-description-text')
        .textContent.trim();

      expect(text).toBe(component.text);
    });

    it('should contain `po-icon-agro-business` if `p-info-icon` is `po-icon-agro-business`', () => {
      component.infoIcon = 'po-icon-agro-business';

      fixture.detectChanges();

      const infoIcon = nativeElement.querySelector('.po-progress-info-icon');

      expect(infoIcon.classList).toContain('po-icon-agro-business');
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

    it('should contain `po-progress-bar-indeterminate` if `indeterminate` is `true`', () => {
      component.indeterminate = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-bar-indeterminate')).toBeTruthy();
    });

    it('shouldn`t contain `po-progress-bar-indeterminate` if `indeterminate` is `false`', () => {
      component.indeterminate = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-progress-bar-indeterminate')).toBeFalsy();
    });

    it('should contain `po-icon-close` if `cancel` is defined', () => {
      const cancelFunction = () => {};
      component.cancel.observers.push(<any>[new Observable(cancelFunction)]);

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-icon-close')).toBeTruthy();
    });

    it('shouldn`t contain `po-icon-close` if `cancel` is undefined', () => {
      component.cancel.observers.length = 0;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-icon-close')).toBeFalsy();
    });

    it('should emit cancellation with status if `cancel` is clicked', () => {
      const cancelFunction = () => {};
      component.cancel.observers.push(<any>[new Observable(cancelFunction)]);

      fixture.detectChanges();

      spyOn(component.cancel, 'emit');

      nativeElement.querySelector('.po-icon-close').click();

      expect(component.cancel.emit).toHaveBeenCalledWith(component.status);
    });

    it('should emit retry with status if `retry` is clicked', () => {
      const retryFunction = () => {};

      component.retry.observers.push(<any>[new Observable(retryFunction)]);
      component.status = PoProgressStatus.Error;

      fixture.detectChanges();

      spyOn(component.retry, 'emit');

      nativeElement.querySelector('.po-icon-refresh').click();

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

    it('shouldn`t find `.po-progress-info` if `info`, `infoIcon`, `isAllowRetry` and `isAllowCancel` are falsy', () => {
      component.info = undefined;
      component.infoIcon = undefined;
      component.retry.observers.length = 0;
      component.cancel.observers.length = 0;

      fixture.detectChanges();

      const progressInfo = nativeElement.querySelector('.po-progress-info');

      expect(progressInfo).toBe(null);
    });
  });
});
