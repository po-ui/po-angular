import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, DecimalPipe } from '@angular/common';

import { PoTimerComponent } from './po-timer.component';
import { PoTimerModule } from './po-timer.module';

describe('PoTimerComponent:', () => {
  let component: PoTimerComponent;
  let fixture: ComponentFixture<PoTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, DecimalPipe, PoTimerModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default literals', () => {
    expect(component.literals).toBeDefined();
    expect(component.literals.hours).toBeDefined();
    expect(component.literals.minutes).toBeDefined();
  });

  describe('writeValue:', () => {
    it('should set value from string', () => {
      component.writeValue('14:30');
      expect(component.selectedHour).toBe(14);
      expect(component.selectedMinute).toBe(30);
    });

    it('should handle null value', () => {
      component.writeValue(null);
      expect(component.selectedHour).toBeNull();
    });
  });

  describe('registerOnChange:', () => {
    it('should register change function', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      expect(component['propagateChange']).toBe(fn);
    });
  });

  describe('registerOnTouched:', () => {
    it('should register touched function', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      expect(component['onTouched']).toBe(fn);
    });
  });

  describe('onCellKeydown:', () => {
    it('should navigate up on ArrowUp key', () => {
      component.format = '24';
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      spyOn(event, 'preventDefault');

      component.onCellKeydown(event, 'hour', 5);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should navigate down on ArrowDown key', () => {
      component.format = '24';
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      spyOn(event, 'preventDefault');

      component.onCellKeydown(event, 'hour', 5);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should select value on Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(event, 'preventDefault');
      spyOn(component, 'selectHour');

      component.onCellKeydown(event, 'hour', 10);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.selectHour).toHaveBeenCalledWith(10);
    });

    it('should select minute on Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(event, 'preventDefault');
      spyOn(component, 'selectMinute');

      component.onCellKeydown(event, 'minute', 30);
      expect(component.selectMinute).toHaveBeenCalledWith(30);
    });

    it('should select second on Enter key', () => {
      component.showSeconds = true;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(event, 'preventDefault');
      spyOn(component, 'selectSecond');

      component.onCellKeydown(event, 'second', 45);
      expect(component.selectSecond).toHaveBeenCalledWith(45);
    });

    it('should emit close on Escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      spyOn(event, 'preventDefault');
      spyOn(component.close, 'emit');

      component.onCellKeydown(event, 'hour', 10);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('should select value on Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      spyOn(event, 'preventDefault');
      spyOn(component, 'selectHour');

      component.onCellKeydown(event, 'hour', 10);
      expect(component.selectHour).toHaveBeenCalledWith(10);
    });

    it('should wrap around on ArrowUp from first item', () => {
      component.format = '24';
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      spyOn(event, 'preventDefault');

      component.onCellKeydown(event, 'hour', 0);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should wrap around on ArrowDown from last item', () => {
      component.format = '24';
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      spyOn(event, 'preventDefault');

      component.onCellKeydown(event, 'hour', 23);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should return empty list for unknown column', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      spyOn(event, 'preventDefault');

      component.onCellKeydown(event, 'unknown', 0);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});
