import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { getObservable } from '../../../util-test/util-expect.spec';

import { PoPageJobSchedulerModule } from '../po-page-job-scheduler.module';
import { PoPageJobSchedulerParametersComponent } from './po-page-job-scheduler-parameters.component';

describe('PoPageJobSchedulerParametersComponent:', () => {
  let component: PoPageJobSchedulerParametersComponent;
  let fixture: ComponentFixture<PoPageJobSchedulerParametersComponent>;

  let debugElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([]), PoPageJobSchedulerModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageJobSchedulerParametersComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    debugElement = fixture.debugElement.nativeElement;
  });

  it('should be create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngAfterViewInit: shouldn`t call `valueChange.emit` if `form` is falsy', () => {
      component.form = undefined;

      spyOn(component.valueChange, 'emit');

      component.ngAfterViewInit();

      expect(component.valueChange.emit).not.toHaveBeenCalled();
    });

    it('ngAfterViewInit: should call `valueChange.emit` on valueChanges subscribe', fakeAsync(() => {
      const jobscheduler = { processID: 1 };

      component.form = <any>{
        valueChanges: getObservable(jobscheduler)
      };

      spyOn(component.form.valueChanges, <any>'subscribe').and.callThrough();
      spyOn(component.valueChange, <any>'emit');

      component.ngAfterViewInit();

      tick(50);

      expect(component.valueChange.emit).toHaveBeenCalledWith(jobscheduler);
      expect(component.form.valueChanges.subscribe).toHaveBeenCalled();
    }));
  });

  describe('Templates:', () => {
    it('should find `div.po-text-center` and not find `po-dynamic-form`', () => {
      component.parameters = [];

      fixture.detectChanges();

      const notFoundDiv = debugElement.querySelector('div.po-text-center');
      const parametersForm = debugElement.querySelector('form');

      expect(parametersForm).toBeFalsy();
      expect(notFoundDiv).toBeTruthy();
    });

    it('should find `po-dynamic-form` and not find `div.po-text-center`', () => {
      component.parameters = [{ property: 'server' }];

      fixture.detectChanges();

      const notFoundDiv = debugElement.querySelector('div.po-text-center');
      const dynamicForm = debugElement.querySelector('po-dynamic-form');

      expect(notFoundDiv).toBeFalsy();
      expect(dynamicForm).toBeTruthy();
    });
  });
});
