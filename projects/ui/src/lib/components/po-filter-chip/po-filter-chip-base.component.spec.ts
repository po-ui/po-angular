import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoFilterChipBaseComponent } from './po-filter-chip-base.component';
import { PoFilterChipComponent } from './po-filter-chip.component';

describe('PoFilterChipBaseComponent:', () => {
  let component: PoFilterChipBaseComponent;
  let fixture: ComponentFixture<PoFilterChipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoFilterChipComponent]
    });

    fixture = TestBed.createComponent(PoFilterChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoFilterChipBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    describe('p-disabled:', () => {
      it('should have default value as false', () => {
        expect(component.disabled()).toBe(false);
      });

      it('should convert string "true" to boolean true', () => {
        fixture.componentRef.setInput('p-disabled', 'true');
        fixture.detectChanges();

        expect(component.disabled()).toBe(true);
      });

      it('should convert string "false" to boolean false', () => {
        fixture.componentRef.setInput('p-disabled', 'false');
        fixture.detectChanges();

        expect(component.disabled()).toBe(false);
      });

      it('should convert boolean true to true', () => {
        fixture.componentRef.setInput('p-disabled', true);
        fixture.detectChanges();

        expect(component.disabled()).toBe(true);
      });

      it('should convert boolean false to false', () => {
        fixture.componentRef.setInput('p-disabled', false);
        fixture.detectChanges();

        expect(component.disabled()).toBe(false);
      });

      it('should convert empty string to true', () => {
        fixture.componentRef.setInput('p-disabled', '');
        fixture.detectChanges();

        expect(component.disabled()).toBe(true);
      });

      it('should convert null to false', () => {
        fixture.componentRef.setInput('p-disabled', null);
        fixture.detectChanges();

        expect(component.disabled()).toBe(false);
      });

      it('should convert undefined to false', () => {
        fixture.componentRef.setInput('p-disabled', undefined);
        fixture.detectChanges();

        expect(component.disabled()).toBe(false);
      });
    });

    describe('p-label:', () => {
      it('should have default value as undefined', () => {
        expect(component.label()).toBeUndefined();
      });

      it('should accept string value', () => {
        fixture.componentRef.setInput('p-label', 'Test Label');
        fixture.detectChanges();

        expect(component.label()).toBe('Test Label');
      });

      it('should accept empty string', () => {
        fixture.componentRef.setInput('p-label', '');
        fixture.detectChanges();

        expect(component.label()).toBe('');
      });
    });

    describe('p-selected:', () => {
      it('should have default value as false', () => {
        expect(component.selected()).toBe(false);
      });

      it('should convert string "true" to boolean true', () => {
        fixture.componentRef.setInput('p-selected', 'true');
        fixture.detectChanges();

        expect(component.selected()).toBe(true);
      });

      it('should convert string "false" to boolean false', () => {
        fixture.componentRef.setInput('p-selected', 'false');
        fixture.detectChanges();

        expect(component.selected()).toBe(false);
      });

      it('should convert boolean true to true', () => {
        fixture.componentRef.setInput('p-selected', true);
        fixture.detectChanges();

        expect(component.selected()).toBe(true);
      });

      it('should convert boolean false to false', () => {
        fixture.componentRef.setInput('p-selected', false);
        fixture.detectChanges();

        expect(component.selected()).toBe(false);
      });

      it('should convert empty string to true', () => {
        fixture.componentRef.setInput('p-selected', '');
        fixture.detectChanges();

        expect(component.selected()).toBe(true);
      });

      it('should convert null to false', () => {
        fixture.componentRef.setInput('p-selected', null);
        fixture.detectChanges();

        expect(component.selected()).toBe(false);
      });

      it('should convert undefined to false', () => {
        fixture.componentRef.setInput('p-selected', undefined);
        fixture.detectChanges();

        expect(component.selected()).toBe(false);
      });
    });

    describe('p-selected-change (selectedChange output):', () => {
      it('should be defined', () => {
        expect(component.selectedChange).toBeDefined();
      });

      it('should emit object with label and selected when subscribed', () => {
        let emittedValue: any;
        component.selectedChange.subscribe(value => {
          emittedValue = value;
        });

        component.selectedChange.emit({ label: 'Test', selected: true });

        expect(emittedValue).toEqual({ label: 'Test', selected: true });
      });

      it('should emit object with selected false when subscribed', () => {
        let emittedValue: any;
        component.selectedChange.subscribe(value => {
          emittedValue = value;
        });

        component.selectedChange.emit({ label: 'Test', selected: false });

        expect(emittedValue).toEqual({ label: 'Test', selected: false });
      });
    });
  });
});
