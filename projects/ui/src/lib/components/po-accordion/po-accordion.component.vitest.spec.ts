import { vi, describe, it, expect, beforeEach } from 'vitest';
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
  `,
  standalone: false
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
      const unsubscribeSpy = vi.spyOn(component['accordionServiceSubscription'], 'unsubscribe');

      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('collapse: should set `expanded` to `false` and emits `p-collapse` event', () => {
      const collapseEmitSpy = vi.spyOn(component.collapseAllEvent, 'emit');

      component.showManagerAccordion = true;
      component.collapseAllItems();

      expect(component.expandedAllItems).toBe(false);
      expect(collapseEmitSpy).toHaveBeenCalled();
    });

    it('expand: should set `expanded` to `true` and emits `p-expand` event', () => {
      const expandEmitSpy = vi.spyOn(component.expandAllEvent, 'emit');

      component.showManagerAccordion = true;
      component.expandAllItems();

      expect(component.expandedAllItems).toBe(true);
      expect(expandEmitSpy).toHaveBeenCalled();
    });

    it('headerToggle: should call `toggle` with `poAccordionItem` and set `poAccordionItem.expanded` to true', () => {
      const toggleSpy = vi.spyOn(component as any, 'toggle');

      const poAccordionItem = {
        expanded: false,
        label: 'Test Label'
      };

      const poAccordionItemExpected = {
        expanded: true,
        label: 'Test Label'
      };

      const event = true;

      component.headerToggle(event, poAccordionItem as any);

      expect(toggleSpy).toHaveBeenCalledWith(poAccordionItemExpected as any);
    });

    it('changeVisibleAllItems: should call `toggle` with `poAccordionItem` and expand all items if not disabled', () => {
      const toggleSpy = vi.spyOn(component as any, 'toggle');
      const expandEmitSpy = vi.spyOn(component.expandAllEvent, 'emit');

      const poAccordionList = [
        {
          expanded: false,
          label: 'Test Label',
          collapse: () => {}
        },
        {
          expanded: false,
          label: 'Test Label',
          collapse: () => {}
        },
        {
          expanded: false,
          disabledItem: true,
          label: 'Test Label',
          collapse: () => {}
        }
      ];

      component.poAccordionItems = poAccordionList as any;

      component.changeVisibleAllItems(false);

      expect(toggleSpy).toHaveBeenCalled();
      expect(expandEmitSpy).toHaveBeenCalled();
      expect(component.expandedAllItems).toBe(true);
      expect(component.poAccordionItems[0].expanded).toBe(true);
      expect(component.poAccordionItems[2].expanded).toBe(false);
    });

    it('changeVisibleAllItems: should call `toggle` with `poAccordionItem` and collapse all items', () => {
      const toggleSpy = vi.spyOn(component as any, 'toggle');
      const collapseEmitSpy = vi.spyOn(component.collapseAllEvent, 'emit');

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

      expect(toggleSpy).toHaveBeenCalled();
      expect(collapseEmitSpy).toHaveBeenCalled();
      expect(component.expandedAllItems).toBe(false);
    });

    it('receiveFromChildAccordionSubscription: should call `toggle` if `receiveFromChildAccordionClicked` emit for a subscription', () => {
      const poAccordionItem = {
        expanded: false,
        label: 'Test Label'
      };

      const fakeThis = {
        toggle: (arg: any) => {},
        accordionServiceSubscription: undefined,
        accordionService: {
          receiveFromChildAccordionClicked: () => ({ subscribe: (callback: any) => callback(poAccordionItem) })
        }
      };

      const toggleSpy = vi.spyOn(fakeThis, 'toggle');

      component['receiveFromChildAccordionSubscription'].call(fakeThis);

      expect(toggleSpy).toHaveBeenCalledWith(poAccordionItem);
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

      component['expandedActiveAccordionItem'] = currentAccordionItem as any;

      component['toggle'](currentAccordionItem as any);

      expect(component['expandedActiveAccordionItem']).toBe(currentAccordionItem as any);
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

      component['toggle'](poAccordionItem as any);

      expect(component.expandedAllItems).toBe(false);
      expect(component['expandedActiveAccordionItem']).toBeNull();
    });

    it('toggle: should set `expandedActiveAccordionItem` to null if current accordion is collapsed', () => {
      const currentAccordionItem = {
        expanded: false
      };

      component['expandedActiveAccordionItem'] = currentAccordionItem as any;

      component['toggle'](currentAccordionItem as any);

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

      const collapseSpy = vi.spyOn(expandedActiveAccordionItem, 'collapse');

      component.allowExpandItems = false;
      component.showManagerAccordion = false;
      component['expandedActiveAccordionItem'] = expandedActiveAccordionItem as any;

      component['toggle'](currentAccordionItem as any);

      expect(collapseSpy).toHaveBeenCalled();
      expect(component['expandedActiveAccordionItem'] as any).toEqual(currentAccordionItem);
    });

    it('toggle: should set `expandedActiveAccordionItem` to currentAccordionItem', () => {
      const currentAccordionItem = {
        expanded: true,
        collapse: () => {}
      };

      component['expandedActiveAccordionItem'] = undefined;

      component['toggle'](currentAccordionItem as any);

      expect(component['expandedActiveAccordionItem'] as any).toEqual(currentAccordionItem);
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
