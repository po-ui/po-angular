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
      spyOn(component.clickManager, 'emit');

      component.onClick();

      expect(component.expandedAllItems).toBe(expectedValue);
      expect(component.clickManager.emit).toHaveBeenCalled();
    });
  });
});
