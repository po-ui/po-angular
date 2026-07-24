import { vi, describe, it, expect, beforeEach } from 'vitest';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoContextTabsComponent } from './po-context-tabs.component';

describe('PoContextTabsComponent:', () => {
  let component: PoContextTabsComponent;
  let fixture: ComponentFixture<PoContextTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoContextTabsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoContextTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    beforeEach(() => {
      component['tabsChildren'] = {
        _results: [{ hide: false }, { hide: false }, { hide: false }, { hide: false }]
      } as any;
    });

    it('isShowTabDropdown: should return true when number of visible tabs exceeds quantityTabsButton', () => {
      component.quantityTabsButton = 2;

      expect(component.isShowTabDropdown).toBe(true);
    });

    it('isShowTabDropdown: should return false when number of visible tabs is equal to quantityTabsButton', () => {
      component.quantityTabsButton = 4;

      expect(component.isShowTabDropdown).toBe(false);
    });

    it('isShowTabDropdown: should return false when number of visible tabs is less than quantityTabsButton', () => {
      component.quantityTabsButton = 10;

      expect(component.isShowTabDropdown).toBe(false);
    });

    it('overflowedTabs: should return overflowedTabs', () => {
      component.quantityTabsButton = 3;

      expect(component.overflowedTabs.length).toBe(1);
    });
  });

  describe('Methods:', () => {
    it('closeTab: should close the tab, update its state, remove its element and call afterRemoveTab', () => {
      const tabMock = {
        id: 1,
        closeTab: new EventEmitter(),
        widthButton: 100,
        removed: false,
        hide: false,
        elementRef: {
          nativeElement: {
            remove: vi.fn()
          }
        }
      } as any;
      component['tabsChildren'] = {
        _results: [
          { id: 1, hide: false, showTooltip: true },
          { id: 'otherTab', hide: false, showTooltip: true },
          { id: 'tab1', hide: false, showTooltip: true },
          { id: 'tab2' },
          { id: 'tab3', hide: false }
        ]
      } as any;

      const emitSpy = vi.spyOn(tabMock.closeTab, 'emit');
      const onTabChangeStateSpy = vi.spyOn(component, 'onTabChangeState');
      const afterRemoveTabSpy = vi.spyOn(component as any, 'afterRemoveTab');

      component.closeTab(tabMock);

      expect(emitSpy).toHaveBeenCalled();
      expect(tabMock.removed).toBe(true);
      expect(tabMock.hide).toBe(true);
      expect(onTabChangeStateSpy).toHaveBeenCalled();
      expect(tabMock.elementRef.nativeElement.remove).toHaveBeenCalled();
      expect(afterRemoveTabSpy).toHaveBeenCalledWith(100);
    });

    it('closeTab: should close the tab using initialTabsWidth when widthButton is not set', () => {
      const tabMock = {
        id: 1,
        closeTab: new EventEmitter(),
        removed: false,
        hide: false,
        elementRef: {
          nativeElement: {
            remove: vi.fn()
          }
        }
      } as any;
      component.initialTabsWidth = [{ id: 1, width: 100 }];

      const onTabChangeStateSpy = vi.spyOn(component, 'onTabChangeState');
      const afterRemoveTabSpy = vi.spyOn(component as any, 'afterRemoveTab');

      component.closeTab(tabMock);

      expect(onTabChangeStateSpy).toHaveBeenCalled();
      expect(tabMock.elementRef.nativeElement.remove).toHaveBeenCalled();
      expect(afterRemoveTabSpy).toHaveBeenCalledWith(100);
    });

    it('afterRemoveTab: should update layout after removing a tab', () => {
      const widthTab = 100;
      component.quantityTabsButton = 3;
      component['sumOfWidth'] = 300;

      component.containerTabs = {
        nativeElement: { offsetWidth: 320 }
      } as any;

      component['tabsChildren'] = {
        _results: [
          { id: '0', hide: false, showTooltip: true },
          { id: 'otherTab', hide: false, showTooltip: true },
          { id: 'tab1', hide: false, showTooltip: true },
          { id: 'tab2' },
          { id: 'tab3', hide: false }
        ]
      } as any;

      const mockButton = {
        nativeElement: {
          id: 'tab1',
          hidden: true,
          style: {
            width: '100px',
            display: 'none'
          }
        }
      };

      component.tabButton = [mockButton, { nativeElement: { id: 'tab2' } }] as any;
      component.initialTabsWidth = [
        { id: 'tab1', width: 90 },
        { id: 'tab2', width: 100 }
      ];

      vi.spyOn(component, 'handleKeyboardNavigationTab');

      component['afterRemoveTab'](widthTab);

      expect(component.quantityTabsButton).toBe(3);
      expect(component['sumOfWidth']).toBe(200 + 90);
      expect(component.handleKeyboardNavigationTab).toHaveBeenCalled();
    });

    it('afterRemoveTab: should break for if byQuantityFunction is equal quantityTabsButton', () => {
      const widthTab = 100;
      component.quantityTabsButton = 3;
      component.byQuantityFunction = 3;
      component['sumOfWidth'] = 400;

      component.containerTabs = {
        nativeElement: { offsetWidth: 400 }
      } as any;

      component['tabsChildren'] = {
        _results: [
          { id: '0', hide: false, showTooltip: true },
          { id: 'otherTab', hide: false, showTooltip: true },
          { id: 'tab1', hide: false, showTooltip: true },
          { id: 'tab2' },
          { id: 'tab3', hide: false }
        ]
      } as any;

      const mockButton = {
        nativeElement: {
          id: 'tab1',
          hidden: true,
          style: {
            width: '100px',
            display: 'none'
          }
        }
      };

      component.tabButton = [mockButton, { nativeElement: { id: 'tab2' } }] as any;
      component.initialTabsWidth = [
        { id: 'tab1', width: 90 },
        { id: 'tab2', width: 100 }
      ];

      vi.spyOn(component, 'handleKeyboardNavigationTab');

      component['afterRemoveTab'](widthTab);

      expect(component.quantityTabsButton).toBe(3);
      expect(component['sumOfWidth']).toBe(390);
      expect(component.handleKeyboardNavigationTab).toHaveBeenCalled();
    });

    it('calculateTabs: should calculate visible tabs and hide the rest when screen size is limited', () => {
      const screenSize = 300;

      component.containerTabs = {
        nativeElement: { offsetWidth: screenSize }
      } as any;

      const tabElements = [80, 90, 100, 120].map((width, i) => ({
        nativeElement: {
          id: `tab-${i}`,
          offsetWidth: width,
          hidden: false,
          style: { display: 'block' }
        }
      }));

      component.tabButton = tabElements as any;
      component.initialTabsWidth = [];
      component.byQuantityFunction = undefined;

      component.calculateTabs(true);

      expect(component.initialTabsWidth.length).toBe(4);
      expect(component.quantityTabsButton).toBe(1);
      expect(tabElements[0].nativeElement.hidden).toBe(false);
      expect(tabElements[1].nativeElement.hidden).toBe(true);
      expect(tabElements[2].nativeElement.hidden).toBe(true);
      expect(tabElements[3].nativeElement.hidden).toBe(true);
    });

    it('calculateTabs: should calculate 2 visible tabs if byQuantityFunction is 2', () => {
      const screenSize = 500;

      component.containerTabs = {
        nativeElement: { offsetWidth: screenSize }
      } as any;

      const tabElements = [80, 90, 100, 120].map((width, i) => ({
        nativeElement: {
          id: `tab-${i}`,
          offsetWidth: width,
          hidden: i === 1,
          style: { display: 'block' }
        }
      }));

      component.tabButton = tabElements as any;
      component.initialTabsWidth = [];
      component.byQuantityFunction = 2;

      component.calculateTabs(true);

      expect(component.initialTabsWidth.length).toBe(4);
      expect(component.quantityTabsButton).toBe(2);
      expect(tabElements[0].nativeElement.hidden).toBe(false);
      expect(tabElements[1].nativeElement.hidden).toBe(true);
      expect(tabElements[2].nativeElement.hidden).toBe(false);
      expect(tabElements[3].nativeElement.hidden).toBe(true);
    });

    it('onTabActiveByDropdown: should handle tab activation by dropdown correctly', () => {
      const tabMock = {
        id: 'tab1',
        click: { emit: vi.fn() },
        activatedTab: { emit: vi.fn() },
        widthButton: 0,
        showTooltip: false
      } as any;

      const lastTabElement = {
        hidden: false,
        offsetWidth: 150,
        style: { display: '', width: '' },
        id: 'tab2'
      };

      const currentTabElement = {
        hidden: true,
        style: { display: '', width: '' },
        id: 'tab1'
      };

      component.initialTabsWidth = [{ id: 'tab1', width: 200 }];

      const tabButtonArray = [{ nativeElement: currentTabElement }, { nativeElement: lastTabElement }] as any;
      tabButtonArray.toArray = () => tabButtonArray;
      component.tabButton = tabButtonArray;

      component['tabsChildren'] = [
        { id: 'tab1', hide: false, showTooltip: true, active: false },
        { id: 'tab2', hide: false, showTooltip: true, active: false }
      ] as any;
      (component['tabsChildren'] as any)._results = component['tabsChildren'];

      vi.spyOn(component, 'changeTabPositionByDropdown').mockImplementation(() => {});
      vi.spyOn(component, 'reorderTabs').mockImplementation(() => {});
      vi.spyOn(component, 'handleKeyboardNavigationTab').mockImplementation(() => {});

      component.onTabActiveByDropdown(tabMock);

      expect(component.changeTabPositionByDropdown).toHaveBeenCalledWith(tabMock, true);
      expect(lastTabElement.style.display).toBe('none');
      expect(lastTabElement.hidden).toBe(true);
      expect(currentTabElement.hidden).toBe(false);
      expect(currentTabElement.style.display).toBe('inline-block');
      expect(component.reorderTabs).toHaveBeenCalledWith(tabMock, lastTabElement);
      expect(tabMock.widthButton).toBe(150);
      expect(tabMock.showTooltip).toBe(true);
      expect(currentTabElement.style.width).toBe('150px');
      expect(component.handleKeyboardNavigationTab).toHaveBeenCalled();
      expect(tabMock.click.emit).toHaveBeenCalledWith(tabMock);
    });

    it('onTabActiveByDropdown: should return if tab is disabled', () => {
      const tabMock = {
        id: 'tab1',
        click: { emit: vi.fn() },
        widthButton: 0,
        showTooltip: false,
        disabled: true
      } as any;

      vi.spyOn(component, 'onTabChangeState');
      vi.spyOn(component, 'changeTabPositionByDropdown');

      component.onTabActiveByDropdown(tabMock);

      expect(component.changeTabPositionByDropdown).not.toHaveBeenCalled();
      expect(component.onTabChangeState).toHaveBeenCalled();
    });

    it('setQuantityTabsButton: should values valid', () => {
      vi.spyOn(component as any, 'calculateTabs');

      component.quantityTabsButton = 5;
      component.setQuantityTabsButton(2);

      expect(component['calculateTabs']).toHaveBeenCalled();
      expect(component.quantityTabsButton).toBe(2);
      expect(component.byQuantityFunction).toBe(2);
    });

    it('setQuantityTabsButton: should call afterRemoveTab', () => {
      vi.spyOn(component as any, 'calculateTabs');
      vi.spyOn(component as any, 'afterRemoveTab');

      component.byQuantityFunction = 2;
      component.setQuantityTabsButton(4);

      expect(component['calculateTabs']).not.toHaveBeenCalled();
      expect(component['afterRemoveTab']).toHaveBeenCalled();
      expect(component.quantityTabsButton).toBe(4);
      expect(component.byQuantityFunction).toBe(4);
    });
  });
});
