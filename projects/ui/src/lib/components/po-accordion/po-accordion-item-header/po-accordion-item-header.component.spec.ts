import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoAccordionModule } from '../po-accordion.module';
import { PoAccordionItemHeaderComponent } from './po-accordion-item-header.component';

describe('PoAccordionItemHeaderComponent:', () => {
  let component: PoAccordionItemHeaderComponent;
  let fixture: ComponentFixture<PoAccordionItemHeaderComponent>;

  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoAccordionModule]
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
      vi.spyOn(component.toggle as any, 'emit');

      component.onClick();

      expect(component.expanded).toBe(expectedValue);
      expect(component.toggle.emit).toHaveBeenCalledWith(expectedValue);
    });

    it('getTooltip: should return label', () => {
      component.label = 'my Label';
      Object.defineProperty(component.accordionElement.nativeElement, 'offsetWidth', {
        value: 156,
        configurable: true
      });
      Object.defineProperty(component.accordionHeaderElement.nativeElement, 'offsetWidth', {
        value: 100,
        configurable: true
      });

      const tooltip = component.getTooltip();
      expect(tooltip).toBe(component.label);
    });

    it('getTooltip: should not return label', () => {
      component.label = 'my Label';
      Object.defineProperty(component.accordionElement.nativeElement, 'offsetWidth', {
        value: 200,
        configurable: true
      });
      Object.defineProperty(component.accordionHeaderElement.nativeElement, 'offsetWidth', {
        value: 100,
        configurable: true
      });

      const tooltip = component.getTooltip();
      expect(tooltip).toBe(null);
    });
  });

  describe('Templates:', () => {
    let header;
    let button;
    let icon;

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

      const poIcon = nativeElement.querySelector('po-icon[p-icon="ICON_ARROW_DOWN"]');
      expect(poIcon).toBeTruthy();
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

      expect(button.innerText).toBe('');
    });

    it('should update button text from property label', () => {
      const expectedValue = 'header';

      component.label = expectedValue;

      fixture.detectChanges();

      expect(button.innerText.trim()).toBe(expectedValue);
    });

    it('should call `onClick` on button click', () => {
      vi.spyOn(component as any, 'onClick');

      button.click();

      expect(component.onClick).toHaveBeenCalled();
    });
  });
});
