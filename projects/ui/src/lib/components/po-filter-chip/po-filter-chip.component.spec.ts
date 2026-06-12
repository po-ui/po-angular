import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoFilterChipComponent } from './po-filter-chip.component';

describe('PoFilterChipComponent:', () => {
  let component: PoFilterChipComponent;
  let fixture: ComponentFixture<PoFilterChipComponent>;
  let nativeElement: HTMLElement;
  let wrapperElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoFilterChipComponent]
    });

    fixture = TestBed.createComponent(PoFilterChipComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    fixture.componentRef.setInput('p-label', 'Test');
    fixture.detectChanges();

    wrapperElement = nativeElement.querySelector('.po-filter-chip-wrapper');
  });

  it('should be created', () => {
    expect(component instanceof PoFilterChipComponent).toBeTruthy();
  });

  describe('Label rendering:', () => {
    it('should render the label text defined by p-label', () => {
      const labelElement = nativeElement.querySelector('.po-filter-chip-label');
      expect(labelElement).toBeTruthy();
      expect(labelElement.textContent.trim()).toBe('Test');
    });

    it('should update label when p-label changes', () => {
      fixture.componentRef.setInput('p-label', 'Updated Label');
      fixture.detectChanges();

      const labelElement = nativeElement.querySelector('.po-filter-chip-label');
      expect(labelElement.textContent.trim()).toBe('Updated Label');
    });
  });

  describe('Default state:', () => {
    it('should not have po-filter-chip-selected class', () => {
      expect(wrapperElement.classList.contains('po-filter-chip-selected')).toBe(false);
    });

    it('should have aria-selected="false"', () => {
      expect(wrapperElement.getAttribute('aria-selected')).toBe('false');
    });

    it('should have tabindex="0"', () => {
      expect(wrapperElement.getAttribute('tabindex')).toBe('0');
    });

    it('should have role="option"', () => {
      expect(wrapperElement.getAttribute('role')).toBe('option');
    });

    it('should not display check icon', () => {
      const icon = nativeElement.querySelector('.po-filter-chip-icon');
      expect(icon).toBeNull();
    });
  });

  describe('Selected state:', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('p-selected', true);
      fixture.detectChanges();
    });

    it('should have po-filter-chip-selected class', () => {
      expect(wrapperElement.classList.contains('po-filter-chip-selected')).toBe(true);
    });

    it('should have aria-selected="true"', () => {
      expect(wrapperElement.getAttribute('aria-selected')).toBe('true');
    });

    it('should display check icon', () => {
      const icon = nativeElement.querySelector('.po-filter-chip-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('Toggle on click:', () => {
    it('should toggle from default to selected on click', () => {
      expect(component.isSelected()).toBe(false);

      wrapperElement.click();
      fixture.detectChanges();

      expect(component.isSelected()).toBe(true);
      expect(wrapperElement.classList.contains('po-filter-chip-selected')).toBe(true);
    });

    it('should toggle from selected to default on click', () => {
      fixture.componentRef.setInput('p-selected', true);
      fixture.detectChanges();

      expect(component.isSelected()).toBe(true);

      wrapperElement.click();
      fixture.detectChanges();

      expect(component.isSelected()).toBe(false);
      expect(wrapperElement.classList.contains('po-filter-chip-selected')).toBe(false);
    });
  });

  describe('Toggle on keyboard:', () => {
    it('should toggle on Enter key', () => {
      expect(component.isSelected()).toBe(false);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component['onKeydown'](event);
      fixture.detectChanges();

      expect(component.isSelected()).toBe(true);
    });

    it('should toggle on Space key', () => {
      expect(component.isSelected()).toBe(false);

      const event = new KeyboardEvent('keydown', { key: ' ' });
      component['onKeydown'](event);
      fixture.detectChanges();

      expect(component.isSelected()).toBe(true);
    });

    it('should call preventDefault when not disabled', () => {
      const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
      component['onKeydown'](event);

      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('Disabled state:', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('p-disabled', true);
      fixture.detectChanges();
    });

    it('should block click interaction', () => {
      expect(component.isSelected()).toBe(false);

      component['onClick']();
      fixture.detectChanges();

      expect(component.isSelected()).toBe(false);
    });

    it('should block keyboard interaction', () => {
      expect(component.isSelected()).toBe(false);

      const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
      component['onKeydown'](event);
      fixture.detectChanges();

      expect(component.isSelected()).toBe(false);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should have aria-disabled="true"', () => {
      expect(wrapperElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('should have tabindex="-1"', () => {
      expect(wrapperElement.getAttribute('tabindex')).toBe('-1');
    });

    it('should have po-filter-chip-disabled class', () => {
      expect(wrapperElement.classList.contains('po-filter-chip-disabled')).toBe(true);
    });
  });

  describe('Two-way binding:', () => {
    it('should reflect external p-selected=true in component state', () => {
      fixture.componentRef.setInput('p-selected', true);
      fixture.detectChanges();

      expect(component.isSelected()).toBe(true);
      expect(wrapperElement.classList.contains('po-filter-chip-selected')).toBe(true);
      expect(wrapperElement.getAttribute('aria-selected')).toBe('true');
    });

    it('should reflect external p-selected=false in component state', () => {
      fixture.componentRef.setInput('p-selected', true);
      fixture.detectChanges();

      fixture.componentRef.setInput('p-selected', false);
      fixture.detectChanges();

      expect(component.isSelected()).toBe(false);
      expect(wrapperElement.classList.contains('po-filter-chip-selected')).toBe(false);
      expect(wrapperElement.getAttribute('aria-selected')).toBe('false');
    });

    it('should emit p-selected-change event on toggle', () => {
      let emittedValue: any;
      component.selectedChange.subscribe(value => {
        emittedValue = value;
      });

      component['onClick']();
      fixture.detectChanges();

      expect(emittedValue).toEqual({ label: 'Test', selected: true });
    });

    it('should emit p-selected-change with selected false when toggling from selected', () => {
      fixture.componentRef.setInput('p-selected', true);
      fixture.detectChanges();

      let emittedValue: any;
      component.selectedChange.subscribe(value => {
        emittedValue = value;
      });

      component['onClick']();
      fixture.detectChanges();

      expect(emittedValue).toEqual({ label: 'Test', selected: false });
    });
  });

  describe('convertToBoolean transform on p-disabled:', () => {
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
  });

  describe('convertToBoolean transform on p-selected:', () => {
    it('should convert string "true" to boolean true', () => {
      fixture.componentRef.setInput('p-selected', 'true');
      fixture.detectChanges();

      expect(component.isSelected()).toBe(true);
    });

    it('should convert string "false" to boolean false', () => {
      fixture.componentRef.setInput('p-selected', 'false');
      fixture.detectChanges();

      expect(component.isSelected()).toBe(false);
    });
  });

  describe('Check icon visibility:', () => {
    it('should show check icon when selected is true', () => {
      fixture.componentRef.setInput('p-selected', true);
      fixture.detectChanges();

      const icon = nativeElement.querySelector('.po-filter-chip-icon');
      expect(icon).toBeTruthy();
    });

    it('should hide check icon when selected is false', () => {
      fixture.componentRef.setInput('p-selected', false);
      fixture.detectChanges();

      const icon = nativeElement.querySelector('.po-filter-chip-icon');
      expect(icon).toBeNull();
    });

    it('should toggle check icon visibility when state changes', () => {
      expect(nativeElement.querySelector('.po-filter-chip-icon')).toBeNull();

      component['onClick']();
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-filter-chip-icon')).toBeTruthy();

      component['onClick']();
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-filter-chip-icon')).toBeNull();
    });
  });

  describe('Methods:', () => {
    it('toggle should not change state when disabled', () => {
      fixture.componentRef.setInput('p-disabled', true);
      fixture.detectChanges();

      component['onClick']();
      expect(component.isSelected()).toBe(false);
    });

    it('toggle should invert state when not disabled', () => {
      component['onClick']();
      expect(component.isSelected()).toBe(true);

      component['onClick']();
      expect(component.isSelected()).toBe(false);
    });

    it('onKeydown should call preventDefault and toggle when not disabled', () => {
      const event = new Event('keydown', { cancelable: true });
      vi.spyOn(event as any, 'preventDefault');

      component['onKeydown'](event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.isSelected()).toBe(true);
    });

    it('onKeydown should not call preventDefault or toggle when disabled', () => {
      fixture.componentRef.setInput('p-disabled', true);
      fixture.detectChanges();

      const event = new Event('keydown', { cancelable: true });
      vi.spyOn(event as any, 'preventDefault');

      component['onKeydown'](event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(component.isSelected()).toBe(false);
    });

    it('toggle should emit empty string as label when p-label is undefined', () => {
      fixture.componentRef.setInput('p-label', undefined);
      fixture.detectChanges();

      let emittedValue: any;
      component.selectedChange.subscribe(value => {
        emittedValue = value;
      });

      component['onClick']();
      fixture.detectChanges();

      expect(emittedValue.label).toBe('');
      expect(emittedValue.selected).toBe(true);
    });
  });
});
