import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoAccordionItemHeaderComponent } from './po-accordion-item-header.component';

describe('PoAccordionItemHeaderComponent:', () => {
  let component: PoAccordionItemHeaderComponent;
  let fixture: ComponentFixture<PoAccordionItemHeaderComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoAccordionItemHeaderComponent]
    });
  });

  beforeEach(() => {
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
      spyOn(component.toggle, 'emit');

      component.onClick();

      expect(component.expanded).toBe(expectedValue);
      expect(component.toggle.emit).toHaveBeenCalledWith(expectedValue);
    });
  });

  describe('Templates:', () => {
    let header;
    let button;
    let span;

    beforeEach(() => {
      header = nativeElement.querySelector('header');
      button = header.querySelector('button');
      span = button.querySelector('span');
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

    it('should have a button with span (icon)', () => {
      expect(button.querySelector('span')).toBeTruthy();
    });

    it('should have a span with class po-icon', () => {
      expect(span.classList.contains('po-icon')).toBeTruthy();
    });

    it('should have a span with class po-accordion-item-header-icon', () => {
      expect(span.classList.contains('po-accordion-item-header-icon')).toBeTruthy();
    });

    it('should have a span with class po-icon-arrow-down by default', () => {
      fixture.detectChanges();

      expect(span.classList.contains('po-icon-arrow-down')).toBeTruthy();
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
      spyOn(component, 'onClick');

      button.click();

      expect(component.onClick).toHaveBeenCalled();
    });
  });
});
