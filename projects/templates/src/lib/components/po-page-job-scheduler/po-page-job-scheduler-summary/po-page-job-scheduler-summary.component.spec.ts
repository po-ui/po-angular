import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PoLanguageService, poLocaleDefault } from '@po-ui/ng-components';

import { poPageJobSchedulerLiteralsDefault } from '../po-page-job-scheduler-literals';
import { PoPageJobSchedulerModule } from '../po-page-job-scheduler.module';
import { PoPageJobSchedulerSummaryComponent } from './po-page-job-scheduler-summary.component';

describe('PoPageJobSchedulerSummaryComponent:', () => {
  const languageService: PoLanguageService = new PoLanguageService();

  let component: PoPageJobSchedulerSummaryComponent;
  let fixture: ComponentFixture<PoPageJobSchedulerSummaryComponent>;

  let debugElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([]), PoPageJobSchedulerModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageJobSchedulerSummaryComponent);
    component = fixture.componentInstance;

    component.literals = {
      ...poPageJobSchedulerLiteralsDefault[poLocaleDefault],
      ...poPageJobSchedulerLiteralsDefault[languageService.getShortLanguage()]
    };

    fixture.detectChanges();

    debugElement = fixture.debugElement.nativeElement;
  });

  it('should be create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngOnInit: should call `getPeriodicityLabel`, `getExecutionValue`, `getFirstExecutionLabel` and `getRecurrentValue`', () => {
      component.periodicityValue = undefined;
      component.executionValue = undefined;
      component.firstExecutionValue = undefined;
      component.recurrentValue = undefined;

      component.value = {
        periodicity: 'single',
        processID: 'ab03',
        firstExecution: new Date(),
        firstExecutionHour: '11:30',
        recurrent: false
      };

      spyOn(component, <any>'getPeriodicityLabel').and.callThrough();
      spyOn(component, <any>'getExecutionValue').and.callThrough();
      spyOn(component, <any>'getFirstExecutionLabel').and.callThrough();
      spyOn(component, <any>'getRecurrentValue').and.callThrough();

      component.ngOnInit();

      expect(component['getPeriodicityLabel']).toHaveBeenCalled();
      expect(component['getExecutionValue']).toHaveBeenCalled();
      expect(component['getFirstExecutionLabel']).toHaveBeenCalled();
      expect(component['getRecurrentValue']).toHaveBeenCalled();

      expect(component.periodicityValue).toBeDefined();
      expect(component.executionValue).toBeDefined();
      expect(component.firstExecutionValue).toBeDefined();
      expect(component.recurrentValue).toBeDefined();
    });

    it('getExecutionValue: should return `literals.notReported` if periodicity is `single`', () => {
      const periodicity = 'single';

      expect(component['getExecutionValue'](periodicity)).toBe(component.literals.notReported);
    });

    it('getExecutionValue: should call `getHourLabel` if periodicity is `daily`', () => {
      const periodicity = 'daily';
      const hour = '11:20';

      spyOn(component, <any>'getHourLabel').and.callThrough();

      const executionValue = component['getExecutionValue'](periodicity, hour);

      expect(typeof executionValue === 'string').toBe(true);
      expect(component['getHourLabel']).toHaveBeenCalled();
    });

    it('getExecutionValue: should call `getMonthlyLabelExecution` if periodicity is `monthly`', () => {
      const periodicity = 'monthly';
      const hour = '11:20';
      const dayOfMonth = 20;

      spyOn(component, <any>'getMonthlyLabelExecution').and.callThrough();

      const executionValue = component['getExecutionValue'](periodicity, hour, undefined, dayOfMonth);

      expect(typeof executionValue === 'string').toBe(true);
      expect(component['getMonthlyLabelExecution']).toHaveBeenCalled();
    });

    it('getExecutionValue: should call `getMonthlyLabelExecution` if periodicity is `weekly`', () => {
      const periodicity = 'weekly';
      const hour = '11:20';
      const daysOfWeek = ['Saturday'];

      spyOn(component, <any>'getWeeklyLabelExecution').and.callThrough();

      const executionValue = component['getExecutionValue'](periodicity, hour, daysOfWeek);

      expect(typeof executionValue === 'string').toBe(true);
      expect(component['getWeeklyLabelExecution']).toHaveBeenCalled();
    });

    it('getFirstExecutionLabel: should return `literals.notReported` if `firstExecution` is falsy', () => {
      const firstExecution = undefined;

      const firstExecutionLabel = component['getFirstExecutionLabel'](firstExecution);

      expect(firstExecutionLabel).toBe(component.literals.notReported);
    });

    it('getFirstExecutionLabel: should return formatted string value if `firstExecution` is truthy', () => {
      const firstExecution = new Date();
      const firstExecutionHour = '10:30';

      spyOn(component['datePipe'], 'transform').and.callThrough();

      const firstExecutionLabel = component['getFirstExecutionLabel'](firstExecution, firstExecutionHour);

      expect(component['datePipe'].transform).toHaveBeenCalled();
      expect(firstExecutionLabel).not.toBe(component.literals.notReported);
    });

    it('getRecurrentValue: should return `No` if recurrent is false', () => {
      const recurrent = false;

      expect(component['getRecurrentValue'](recurrent)).toBe(component.literals.no);
    });

    it('getRecurrentValue: should return `No` if recurrent is true', () => {
      const recurrent = true;

      expect(component['getRecurrentValue'](recurrent)).toBe(component.literals.yes);
    });

    it('getHourLabel: should return formatted string value with 00:00h if `hour`is undefined', () => {
      const expectedValue = `${component.literals.at} 00:00h`;

      expect(component['getHourLabel'](undefined)).toBe(expectedValue);
    });

    it('getHourLabel: should return formatted string value with 12:00h if `hour` is 12:00', () => {
      const hour = '12:00';
      const expectedValue = `${component.literals.at} ${hour}h`;

      expect(component['getHourLabel'](hour)).toBe(expectedValue);
    });

    it('getMonthlyLabelExecution: should return formatted string value with 12:00h if `hour` is 12:00', () => {
      const hour = '12:00';
      const dayOfMonth = 10;

      const expectedValue = `${component.literals.day} ${dayOfMonth} ${component['getHourLabel'](hour)}`;

      spyOn(component, <any>'getHourLabel').and.callThrough();

      const monthlyLabelExecution = component['getMonthlyLabelExecution'](dayOfMonth, hour);

      expect(monthlyLabelExecution).toBe(expectedValue);
      expect(component['getHourLabel']).toHaveBeenCalledWith(hour);
    });

    it('getPeriodicityLabel: should return `literals.single`', () => {
      const periodicity = 'single';

      const periodicityLabel = component['getPeriodicityLabel'](periodicity);

      expect(periodicityLabel).toBe(component.literals.single);
    });

    it('getPeriodicityLabel: should return `literals.daily`', () => {
      const periodicity = 'daily';

      const periodicityLabel = component['getPeriodicityLabel'](periodicity);

      expect(periodicityLabel).toBe(component.literals.daily);
    });

    it('getPeriodicityLabel: should return `literals.monthly`', () => {
      const periodicity = 'monthly';

      const periodicityLabel = component['getPeriodicityLabel'](periodicity);

      expect(periodicityLabel).toBe(component.literals.monthly);
    });

    it('getPeriodicityLabel: should return `literals.weekly`', () => {
      const periodicity = 'weekly';

      const periodicityLabel = component['getPeriodicityLabel'](periodicity);

      expect(periodicityLabel).toBe(component.literals.weekly);
    });

    it('getWeeklyLabelExecution: should call `getWeekDaysLabel` and `getHourLabel` if daysOfWeek is Array', () => {
      const daysOfWeek = ['Saturday'];
      const hour = '10:30';

      spyOn(component, <any>'getWeekDaysLabel').and.callThrough();
      spyOn(component, <any>'getHourLabel').and.callThrough();

      const weeklyLabelExecution = component['getWeeklyLabelExecution'](daysOfWeek, hour);

      expect(weeklyLabelExecution).not.toBe(component.literals.notReported);

      expect(component['getWeekDaysLabel']).toHaveBeenCalled();
      expect(component['getHourLabel']).toHaveBeenCalled();
    });

    it(`getWeeklyLabelExecution: shouldn't call 'getWeekDaysLabel', 'getHourLabel' and return 'literals.notReported'
      if daysOfWeek is undefined`, () => {
      const daysOfWeek = undefined;
      const hour = '10:30';

      spyOn(component, <any>'getWeekDaysLabel').and.callThrough();
      spyOn(component, <any>'getHourLabel').and.callThrough();

      const weeklyLabelExecution = component['getWeeklyLabelExecution'](daysOfWeek, hour);

      expect(weeklyLabelExecution).toBe(component.literals.notReported);

      expect(component['getWeekDaysLabel']).not.toHaveBeenCalled();
      expect(component['getHourLabel']).not.toHaveBeenCalled();
    });

    it('getWeekDaysLabel: should return `` if days is undefined', () => {
      const days = undefined;

      const weekDaysLabel = component['getWeekDaysLabel'](days);

      expect(weekDaysLabel).toBe('');
    });

    it('getWeekDaysLabel: should return `Sunday, Monday` if days is [`Sunday`, `Monday`]', () => {
      const days = ['Sunday', 'Monday'];

      const weekDaysLabel = component['getWeekDaysLabel'](days);

      const result = `${component.literals.sunday}, ${component.literals.monday}`;

      expect(weekDaysLabel).toBe(result);
    });

    it('sortWeekDays: should return soterdWeekDays', () => {
      const days = ['Sunday', 'Friday', 'Tuesday', 'Monday'];
      const expectedValue = ['Sunday', 'Monday', 'Tuesday', 'Friday'];

      const weekDaysSorted = component['sortWeekDays'](days);

      expect(weekDaysSorted).toEqual(expectedValue);
    });

    it('sortWeekDays: should return empty array if `days` is undefined', () => {
      const days = undefined;

      const weekDaysSorted = component['sortWeekDays'](days);

      expect(weekDaysSorted).toEqual([]);
    });

    it('getTranslateWeekDay: should return specific translate day from week day', () => {
      expect(component['getTranslateWeekDay']('Sunday')).toBe(component.literals.sunday);
      expect(component['getTranslateWeekDay']('Monday')).toBe(component.literals.monday);
      expect(component['getTranslateWeekDay']('Tuesday')).toBe(component.literals.tuesday);
      expect(component['getTranslateWeekDay']('Wednesday')).toBe(component.literals.wednesday);
      expect(component['getTranslateWeekDay']('Thursday')).toBe(component.literals.thursday);
      expect(component['getTranslateWeekDay']('Friday')).toBe(component.literals.friday);
      expect(component['getTranslateWeekDay']('Saturday')).toBe(component.literals.saturday);
      expect(component['getTranslateWeekDay']('Not found')).toBe('');
    });

    it('getSorterWeekDays: should return object of sorterWeekDays', () => {
      const sorterWeekDays = component['getSorterWeekDays']();

      expect(typeof sorterWeekDays === 'object').toBe(true);
      expect(Object.keys(sorterWeekDays).length).toBe(7);
    });
  });

  describe('Templates:', () => {
    it('should find `po-dynamic-view` and `po-widget` if parameters.length > 0', () => {
      component.parameters = [{ property: 'server' }];

      fixture.detectChanges();

      const widget = debugElement.querySelector('po-widget');
      const dynamicView = debugElement.querySelector('po-dynamic-view');

      expect(dynamicView).toBeTruthy();
      expect(widget).toBeTruthy();
    });

    it('shouldn`t find `po-dynamic-view` and `po-widget` if parameters.length > 0', () => {
      component.parameters = [];

      fixture.detectChanges();

      const widget = debugElement.querySelector('po-widget');
      const dynamicView = debugElement.querySelector('po-dynamic-view');

      expect(dynamicView).toBeFalsy();
      expect(widget).toBeFalsy();
    });
  });
});
