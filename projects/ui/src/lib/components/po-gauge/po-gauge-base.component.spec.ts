import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoGaugeBaseComponent } from './po-gauge-base.component';
import { poGaugeMinHeight } from './po-gauge-default-values.constant';
import { PoGaugeRanges } from './interfaces/po-gauge-ranges.interface';

@Component({ selector: 'po-gauge-base-test', template: '', standalone: false })
class TestComponent extends PoGaugeBaseComponent {}

describe('PoGaugeBaseComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('should set and get description', () => {
      component.description = 'Descriptive text';
      expect(component.description).toBe('Descriptive text');
    });

    it('should return default height as poGaugeMinHeight', () => {
      expect(component.height).toBe(poGaugeMinHeight);
    });

    it('should set height greater than poGaugeMinHeight', () => {
      component.height = 500;
      expect(component.height).toBe(500);
    });

    it('should fallback to poGaugeMinHeight if height is invalid or less than minimum', () => {
      component.height = 100;
      expect(component.height).toBe(poGaugeMinHeight);

      component.height = undefined;
      expect(component.height).toBe(poGaugeMinHeight);

      component.height = null;
      expect(component.height).toBe(poGaugeMinHeight);
    });

    it('should set ranges when it is an array', () => {
      const ranges: Array<PoGaugeRanges> = [{ from: 0, to: 50, color: 'red' }];
      component.ranges = ranges;
      expect(component.ranges).toEqual(ranges);
    });

    it('should fallback ranges to empty array if input is not array', () => {
      component.ranges = null;
      expect(component.ranges).toEqual([]);

      component.ranges = <any>'invalid';
      expect(component.ranges).toEqual([]);
    });

    it('should set and get title', () => {
      component.title = 'My Gauge';
      expect(component.title).toBe('My Gauge');
    });

    it('should set value when it is a valid number', () => {
      component.value = 75;
      expect(component.value).toBe(75);
    });

    it('should convert string number to number in value', () => {
      component.value = <any>'123';
      expect(component.value).toBe(123);
    });

    it('should set value to undefined if invalid', () => {
      component.value = <any>'   ';
      expect(component.value).toBeUndefined();

      component.value = <any>null;
      expect(component.value).toBeUndefined();
    });

    it('should have default values for showFromToLegend and showPointer', () => {
      expect(component.showFromToLegend).toBeFalse();
      expect(component.showPointer).toBeTrue();
    });

    it('should set value as undefined when gaugeValue is a non-numeric string', () => {
      component.value = <any>'abc';
      expect(component.value).toBeUndefined();
    });
  });
});
