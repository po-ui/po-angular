import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'projects/templates/src/lib/util-test/util-expect.spec';
import { Observable } from 'rxjs';

import { PoProgressComponent } from './po-progress.component';
import { PoProgressModule } from './po-progress.module';
import { PoProgressStatus } from './enums/po-progress-status.enum';

describe('PoProgressComponent:', () => {

  let component: PoProgressComponent;
  let fixture: ComponentFixture<PoProgressComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        PoProgressModule
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoProgressComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoProgressComponent).toBeTruthy();
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

  });

  describe('Templates:', () => {

    it('should contain the value of text property', () => {
      component.text = 'files';

      fixture.detectChanges();

      const text = nativeElement
        .querySelector('.po-progress-description .po-progress-description-text')
        .textContent
        .trim();

      expect(text).toBe(component.text);
    });

    it('should contain `po-icon-agro-business` if `p-info-icon` is `po-icon-agro-business`', () => {
      component.infoIcon = 'po-icon-agro-business';

      fixture.detectChanges();

      const infoIcon = nativeElement.querySelector('.po-progress-info-icon');

      expect(infoIcon.classList).toContain('po-icon-agro-business');
    });

    it('should contain `p-info` value', () => {
      component.info = 'test info';

      fixture.detectChanges();

      const info = nativeElement.querySelector('.po-progress-info-text').textContent.trim();

      expect(info).toBe(component.info);
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
      component.status = <any> 'test';

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

  });

});
