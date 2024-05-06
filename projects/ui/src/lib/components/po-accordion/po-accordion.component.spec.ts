import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoAccordionComponent } from './po-accordion.component';
import { PoAccordionModule } from './po-accordion.module';
import { PoAccordionService } from './services/po-accordion.service';

@Component({
  template: `
    <po-accordion p-show-manager-accordion="true">
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
  let debugElement: any;
  let nativeElementMock: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoAccordionMockComponent],
      providers: [PoAccordionService],
      imports: [PoAccordionModule, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement.nativeElement;

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

    it('collapse: should set `expanded` to `false` and emits `p-collapse` event', () => {
      spyOn(component.collapseAllEvent, 'emit');

      component.showManagerAccordion = true;
      component.collapseAllItems();

      expect(component.expandedAllItems).toBe(false);
      expect(component.collapseAllEvent.emit).toHaveBeenCalled();
    });

    it('expand: should set `expanded` to `true` and emits `p-expand` event', () => {
      spyOn(component.expandAllEvent, 'emit');

      component.showManagerAccordion = true;
      component.expandAllItems();

      expect(component.expandedAllItems).toBe(true);
      expect(component.expandAllEvent.emit).toHaveBeenCalled();
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

    it('changeVisibleAllItems: should call `toggle` with `poAccordionItem` and expand all items if not disabled', () => {
      spyOn(component, <any>'toggle');
      spyOn(component.expandAllEvent, 'emit');

      const poAccordionList = [
        {
          expanded: false,
          label: 'Test Label'
        },
        {
          expanded: false,
          label: 'Test Label'
        },
        {
          expanded: false,
          disabledItem: true,
          label: 'Test Label'
        }
      ];

      component.poAccordionItems = poAccordionList as any;

      component.changeVisibleAllItems(false);

      expect(component['toggle']).toHaveBeenCalled();
      expect(component.expandAllEvent.emit).toHaveBeenCalled();
      expect(component.expandedAllItems).toBe(true);
      expect(component.poAccordionItems[0].expanded).toBe(true);
      expect(component.poAccordionItems[2].expanded).toBe(false);
    });

    it('changeVisibleAllItems: should call `toggle` with `poAccordionItem` and collapse all items', () => {
      spyOn(component, <any>'toggle');
      spyOn(component.collapseAllEvent, 'emit');

      const poAccordionList = [
        {
          expanded: true,
          label: 'Test Label'
        },
        {
          expanded: true,
          label: 'Test Label'
        }
      ];

      component.poAccordionItems = poAccordionList as any;

      component.changeVisibleAllItems(true);

      expect(component['toggle']).toHaveBeenCalled();
      expect(component.collapseAllEvent.emit).toHaveBeenCalled();
      expect(component.expandedAllItems).toBe(false);
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
          receiveFromChildAccordionClicked: () => ({ subscribe: callback => callback(poAccordionItem) })
        }
      };

      spyOn(fakeThis, <any>'toggle');

      component['receiveFromChildAccordionSubscription'].call(fakeThis);

      expect(fakeThis['toggle']).toHaveBeenCalledWith(poAccordionItem);
    });

    it('toggle: should call `checkVisibleAllItems` and `expandedAllItems` is true', () => {
      const currentAccordionItem = {
        expanded: true
      };

      const poAccordionList = [
        {
          expanded: true,
          label: 'Test Label'
        },
        {
          expanded: true,
          label: 'Test Label'
        }
      ];

      const queryList = new QueryList<any>();
      queryList.reset(poAccordionList);
      component.showManagerAccordion = true;
      component.poAccordionItems = queryList as any;
      component.showManagerAccordion = true;

      component['expandedActiveAccordionItem'] = <any>currentAccordionItem;

      component['toggle'](<any>currentAccordionItem);

      expect(component['expandedActiveAccordionItem']).toBe(<any>currentAccordionItem);
    });

    it('toggle: should call `checkVisibleAllItems` and `expandedAllItems` is false', () => {
      const poAccordionList = [
        {
          expanded: false,
          label: 'Test Label'
        },
        {
          expanded: true,
          label: 'Test Label'
        },
        {
          expanded: false,
          disabledItem: true,
          label: 'Test Label'
        }
      ];

      const poAccordionItem = {
        expanded: false,
        label: 'Test Label'
      };

      const queryList = new QueryList<any>();
      queryList.reset(poAccordionList);
      component.showManagerAccordion = true;
      component.poAccordionItems = queryList as any;

      component['toggle'](<any>poAccordionItem);

      expect(component.expandedAllItems).toBe(false);
      expect(component['expandedActiveAccordionItem']).toBeNull();
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

      component.allowExpandItems = false;
      component.showManagerAccordion = false;
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

    it('should contain `po-accordion-manager` if `showManagerAccordion` is active', () => {
      fixture.detectChanges();
      const managerAccordion = nativeElementMock.querySelector('.po-accordion-manager');

      expect(managerAccordion).toBeTruthy();
    });
  });
});
