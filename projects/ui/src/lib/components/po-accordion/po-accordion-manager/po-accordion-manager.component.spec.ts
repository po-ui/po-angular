import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoAccordionModule } from '../po-accordion.module';
import { PoAccordionManagerComponent } from './po-accordion-manager.component';

describe('PoAccordionManagerComponent:', () => {
  let component: PoAccordionManagerComponent;
  let fixture: ComponentFixture<PoAccordionManagerComponent>;

  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoAccordionModule]
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
      vi.spyOn(component.clickManager as any, 'emit');

      component.onClick();

      expect(component.expandedAllItems).toBe(expectedValue);
      expect(component.clickManager.emit).toHaveBeenCalled();
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
      Object.defineProperty(component.accordionElement.nativeElement, 'offsetWidth', {
        value: 160,
        configurable: true
      });
      Object.defineProperty(component.accordionHeaderElement.nativeElement, 'offsetWidth', {
        value: 100,
        configurable: true
      });

      const tooltip = component.getTooltip();
      expect(tooltip).toBe(component.labelValue);
    });

    it('getTooltip: should not return label', () => {
      component.labelValue = 'Test Label';
      component.expandedAllItems = true;
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
});
