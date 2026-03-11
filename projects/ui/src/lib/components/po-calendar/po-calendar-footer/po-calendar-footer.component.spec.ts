import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoButtonModule } from '../../po-button/po-button.module';
import { PoCalendarFooterComponent } from './po-calendar-footer.component';

describe('PoCalendarFooterComponent:', () => {
  let component: PoCalendarFooterComponent;
  let fixture: ComponentFixture<PoCalendarFooterComponent>;
  let nativeElement: HTMLElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoButtonModule],
      declarations: [PoCalendarFooterComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCalendarFooterComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('should have default values', () => {
      expect(component.responsive).toBe(false);
      expect(component.todayDisabled).toBe(false);
      expect(component.hideTodayButton).toBe(false);
    });
  });

  describe('Methods:', () => {
    it('onClear: should emit clear event', () => {
      spyOn(component.clear, 'emit');

      component.onClear();

      expect(component.clear.emit).toHaveBeenCalled();
    });

    it('onSelectToday: should emit selectToday event', () => {
      spyOn(component.selectToday, 'emit');

      component.onSelectToday();

      expect(component.selectToday.emit).toHaveBeenCalled();
    });

    describe('onClearKeydown:', () => {
      it('should emit closeCalendar when Tab is pressed without Shift and hideTodayButton is true', () => {
        component.hideTodayButton = true;
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(component.closeCalendar, 'emit');

        component.onClearKeydown(event);

        expect(component.closeCalendar.emit).toHaveBeenCalled();
      });

      it('should not emit closeCalendar when hideTodayButton is false', () => {
        component.hideTodayButton = false;
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(component.closeCalendar, 'emit');

        component.onClearKeydown(event);

        expect(component.closeCalendar.emit).not.toHaveBeenCalled();
      });

      it('should not emit closeCalendar when Shift+Tab is pressed even with hideTodayButton true', () => {
        component.hideTodayButton = true;
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        spyOn(component.closeCalendar, 'emit');

        component.onClearKeydown(event);

        expect(component.closeCalendar.emit).not.toHaveBeenCalled();
      });

      it('should not emit closeCalendar when other keys are pressed with hideTodayButton true', () => {
        component.hideTodayButton = true;
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        spyOn(component.closeCalendar, 'emit');

        component.onClearKeydown(event);

        expect(component.closeCalendar.emit).not.toHaveBeenCalled();
      });
    });

    describe('onTodayKeydown:', () => {
      it('should emit closeCalendar when Tab is pressed without Shift', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(component.closeCalendar, 'emit');

        component.onTodayKeydown(event);

        expect(component.closeCalendar.emit).toHaveBeenCalled();
      });

      it('should not emit closeCalendar when Shift+Tab is pressed', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        spyOn(component.closeCalendar, 'emit');

        component.onTodayKeydown(event);

        expect(component.closeCalendar.emit).not.toHaveBeenCalled();
      });

      it('should not emit closeCalendar when other keys are pressed', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        spyOn(component.closeCalendar, 'emit');

        component.onTodayKeydown(event);

        expect(component.closeCalendar.emit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Templates:', () => {
    it('should render clear button', () => {
      component.labelClear = 'Limpar';
      fixture.detectChanges();

      const buttons = nativeElement.querySelectorAll('po-button');
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    it('should render today button when hideTodayButton is false', () => {
      component.labelClear = 'Limpar';
      component.labelToday = 'Hoje';
      component.hideTodayButton = false;
      fixture.detectChanges();

      const buttons = nativeElement.querySelectorAll('po-button');
      expect(buttons.length).toBe(2);
    });

    it('should hide today button when hideTodayButton is true', () => {
      component.labelClear = 'Limpar';
      component.labelToday = 'Hoje';
      component.hideTodayButton = true;
      fixture.detectChanges();

      const buttons = nativeElement.querySelectorAll('po-button');
      expect(buttons.length).toBe(1);
    });
  });
});
