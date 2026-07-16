import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PoAccordionManagerComponent } from './po-accordion-manager.component';

describe('PoAccordionManagerComponent:', () => {
  let component: PoAccordionManagerComponent;
  let fixture: ComponentFixture<PoAccordionManagerComponent>;

  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoAccordionManagerComponent],
      imports: [BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoAccordionManagerComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoAccordionManagerComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onClick: should call `clickManager.emit`', () => {
      const expectedValue = true;
      component.expandedAllItems = expectedValue;
      const clickManagerSpy = vi.spyOn(component.clickManager, 'emit');

      component.onClick();

      expect(component.expandedAllItems).toBe(expectedValue);
      expect(clickManagerSpy).toHaveBeenCalled();
    });

    it('onChange: should set labelValue to `literals.closeAllItems`', () => {
      component.literals = {
        expandAllItems: 'Teste label',
        closeAllItems: 'Teste label 2'
      };

      const changes: any = {
        expandedAllItems: {
          currentValue: true
        }
      };

      component.ngOnChanges(changes);

      expect(component.labelValue).toBe(component.literals.closeAllItems);
    });

    it('onChange: should set labelValue to `literals.expandAllItems`', () => {
      component.literals = {
        expandAllItems: 'Teste label',
        closeAllItems: 'Teste label 2'
      };

      const changes: any = {
        expandedAllItems: {
          currentValue: false
        }
      };

      component.ngOnChanges(changes);

      expect(component.labelValue).toBe(component.literals.expandAllItems);
    });

    it('getTooltip: should return label', () => {
      component.labelValue = 'Test Label';
      component.expandedAllItems = true;
      vi.spyOn(component.accordionElement.nativeElement, 'offsetWidth', 'get').mockReturnValue(160);
      vi.spyOn(component.accordionHeaderElement.nativeElement, 'offsetWidth', 'get').mockReturnValue(100);

      const tooltip = component.getTooltip();
      expect(tooltip).toBe(component.labelValue);
    });

    it('getTooltip: should not return label', () => {
      component.labelValue = 'Test Label';
      component.expandedAllItems = true;
      vi.spyOn(component.accordionElement.nativeElement, 'offsetWidth', 'get').mockReturnValue(200);
      vi.spyOn(component.accordionHeaderElement.nativeElement, 'offsetWidth', 'get').mockReturnValue(100);

      const tooltip = component.getTooltip();
      expect(tooltip).toBe(null);
    });
  });
});
