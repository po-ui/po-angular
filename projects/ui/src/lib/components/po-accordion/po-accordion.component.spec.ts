import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../util-test/util-expect.spec';

import { PoAccordionComponent } from './po-accordion.component';
import { PoAccordionModule } from './po-accordion.module';
import { PoAccordionService } from './services/po-accordion.service';

@Component({
  template: `
    <po-accordion>
      <po-accordion-item p-label="PO Accordion 1"> Item 1 </po-accordion-item>
      <po-accordion-item p-label="PO Accordion 2"> Item 2 </po-accordion-item>
    </po-accordion>
  `
})
class PoAccordionMockComponent {}

describe('PoAccordionComponent:', () => {
  let component: PoAccordionComponent;
  let fixture: ComponentFixture<PoAccordionComponent>;
  let componentMock: PoAccordionMockComponent;
  let fixtureMock: ComponentFixture<PoAccordionMockComponent>;
  let nativeElement: any;
  let nativeElementMock: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoAccordionMockComponent],
      providers: [PoAccordionService],
      imports: [PoAccordionModule, BrowserAnimationsModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;

    fixtureMock = TestBed.createComponent(PoAccordionMockComponent);
    componentMock = fixtureMock.componentInstance;
    fixtureMock.detectChanges();
    nativeElementMock = fixtureMock.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngOnDestroy: should call `accordionServiceSubscription.unsubscribe`', () => {
      spyOn(component['accordionServiceSubscription'], 'unsubscribe');

      component.ngOnDestroy();

      expect(component['accordionServiceSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('headerToggle: should call `toggle` with `poAccordionItem` and set `poAccordionItem.expanded` to true', () => {
      spyOn(component, <any>'toggle');

      const poAccordionItem = {
        expanded: false,
        label: 'Test Label'
      };

      const poAccordionItemExpected = {
        expanded: true,
        label: 'Test Label'
      };

      const event = true;

      component.headerToggle(event, <any>poAccordionItem);

      expect(component['toggle']).toHaveBeenCalledWith(<any>poAccordionItemExpected);
    });

    it('receiveFromChildAccordionSubscription: should call `toggle` if `receiveFromChildAccordionClicked` emit for a subscription', () => {
      const poAccordionItem = {
        expanded: false,
        label: 'Test Label'
      };

      const fakeThis = {
        toggle: arg => {},
        accordionServiceSubscription: undefined,
        accordionService: {
          receiveFromChildAccordionClicked: () => {
            return { subscribe: callback => callback(poAccordionItem) };
          }
        }
      };

      spyOn(fakeThis, <any>'toggle');

      component['receiveFromChildAccordionSubscription'].call(fakeThis);

      expect(fakeThis['toggle']).toHaveBeenCalledWith(poAccordionItem);
    });

    it('toggle: should set `expandedActiveAccordionItem` to null if current accordion is collapsed', () => {
      const currentAccordionItem = {
        expanded: false
      };

      component['expandedActiveAccordionItem'] = <any>currentAccordionItem;

      component['toggle'](<any>currentAccordionItem);

      expect(component['expandedActiveAccordionItem']).toBeNull();
    });

    it('toggle: should call `expandedActiveAccordionItem.collapse` if `expandedActiveAccordionItem` is defined', () => {
      const expandedActiveAccordionItem = {
        expanded: true,
        collapse: () => {}
      };

      const currentAccordionItem = {
        expanded: true,
        collapse: () => {}
      };

      spyOn(expandedActiveAccordionItem, 'collapse');

      component['expandedActiveAccordionItem'] = <any>expandedActiveAccordionItem;

      component['toggle'](<any>currentAccordionItem);

      expect(expandedActiveAccordionItem.collapse).toHaveBeenCalled();
      expect(<any>component['expandedActiveAccordionItem']).toEqual(currentAccordionItem);
    });

    it('toggle: should set `expandedActiveAccordionItem` to currentAccordionItem', () => {
      const currentAccordionItem = {
        expanded: true,
        collapse: () => {}
      };

      component['expandedActiveAccordionItem'] = undefined;

      component['toggle'](<any>currentAccordionItem);

      expect(<any>component['expandedActiveAccordionItem']).toEqual(currentAccordionItem);
    });
  });

  describe('Templates:', () => {
    it('should contain `po-accordion-item-active` if any item is active', () => {
      const header = nativeElementMock.querySelector('.po-accordion-item-header-button');

      header.click();

      fixtureMock.detectChanges();

      const activeItem = nativeElementMock.querySelector('.po-accordion-item-active');

      expect(activeItem).toBeTruthy();
    });

    it('shouldn`t contain `po-accordion-item-active` if no item is active', () => {
      const activeItem = nativeElementMock.querySelector('.po-accordion-item-active');

      expect(activeItem).toBeFalsy();
    });
  });
});
