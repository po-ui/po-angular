import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoAccordionItemHeaderComponent } from './po-accordion-item-header.component';

describe('PoAccordionItemHeaderComponent:', () => {
  let component: PoAccordionItemHeaderComponent;
  let fixture: ComponentFixture<PoAccordionItemHeaderComponent>;

  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoAccordionItemHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoAccordionItemHeaderComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoAccordionItemHeaderComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onClick: should toggle `expanded` and call `toggle.emit` with `expanded`', () => {
      const expectedValue = false;
      component.expanded = !expectedValue;
      const toggleSpy = vi.spyOn(component.toggle, 'emit');

      component.onClick();

      expect(component.expanded).toBe(expectedValue);
      expect(toggleSpy).toHaveBeenCalledWith(expectedValue);
    });

    it('getTooltip: should return label', () => {
      component.label = 'my Label';
      vi.spyOn(component.accordionElement.nativeElement, 'offsetWidth', 'get').mockReturnValue(156);
      vi.spyOn(component.accordionHeaderElement.nativeElement, 'offsetWidth', 'get').mockReturnValue(100);

      const tooltip = component.getTooltip();
      expect(tooltip).toBe(component.label);
    });

    it('getTooltip: should not return label', () => {
      component.label = 'my Label';
      vi.spyOn(component.accordionElement.nativeElement, 'offsetWidth', 'get').mockReturnValue(200);
      vi.spyOn(component.accordionHeaderElement.nativeElement, 'offsetWidth', 'get').mockReturnValue(100);

      const tooltip = component.getTooltip();
      expect(tooltip).toBe(null);
    });
  });

  describe('Templates:', () => {
    let header: HTMLElement;
    let button: HTMLElement;
    let icon: HTMLElement;

    beforeEach(() => {
      component.disabledItem = false;
      header = nativeElement.querySelector('div');
      button = header.querySelector('button');
      icon = button.querySelector('po-icon');
    });

    it('should have a header with po-accordion-item-header class', () => {
      expect(header).toBeTruthy();
      expect(header.classList.contains('po-accordion-item-header')).toBeTruthy();
    });

    it('should have a header with button', () => {
      expect(header.querySelector('button')).toBeTruthy();
    });

    it('should have a button with class po-accordion-item-header-button', () => {
      expect(button.classList.contains('po-accordion-item-header-button')).toBeTruthy();
    });

    it('should have a button with class po-clickable', () => {
      expect(button.classList.contains('po-clickable')).toBeTruthy();
    });

    it('should have a button with icon (icon)', () => {
      expect(button.querySelector('po-icon')).toBeTruthy();
    });

    it('should render the accordion icon using Animalia classes', () => {
      component.label = 'Accordion 1';
      fixture.detectChanges();

      const icon = nativeElement.querySelector('po-icon');
      expect(icon).toBeTruthy();
    });

    it('should have a icon with class po-accordion-item-header-icon', () => {
      expect(icon.classList.contains('po-accordion-item-header-icon')).toBeTruthy();
    });

    it('should have a icon with class po-accordion-item-header-icon by default', () => {
      fixture.detectChanges();

      expect(icon.classList.contains('po-accordion-item-header-icon')).toBeTruthy();
    });

    it(`shouldn't have text in button if label is empty`, () => {
      component.label = '';

      fixture.detectChanges();

      expect(button.textContent?.trim()).toBe('');
    });

    it('should update button text from property label', () => {
      const expectedValue = 'header';

      component.label = expectedValue;

      fixture.detectChanges();

      expect(button.textContent?.trim()).toBe(expectedValue);
    });

    it('should call `onClick` on button click', () => {
      const onClickSpy = vi.spyOn(component, 'onClick');

      button.click();

      expect(onClickSpy).toHaveBeenCalled();
    });
  });
});
