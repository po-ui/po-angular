import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoContextTabsComponent } from './po-context-tabs.component';

describe('PoContextTabsComponent:', () => {
  let component: PoContextTabsComponent;
  let fixture: ComponentFixture<PoContextTabsComponent>;
  let tabElements;

  beforeEach(() => {
    TestBed.configureTestingModule({
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

      expect(component.isShowTabDropdown).toBeTrue();
    });

    it('isShowTabDropdown: should return false when number of visible tabs is equal to quantityTabsButton', () => {
      component.quantityTabsButton = 4;

      expect(component.isShowTabDropdown).toBeFalse();
    });

    it('isShowTabDropdown: should return false when number of visible tabs is less than quantityTabsButton', () => {
      component.quantityTabsButton = 10;

      expect(component.isShowTabDropdown).toBeFalse();
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
            remove: jasmine.createSpy('remove')
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

      const emitSpy = spyOn(tabMock.closeTab, 'emit');
      const onTabChangeStateSpy = spyOn(component, 'onTabChangeState');
      const afterRemoveTabSpy = spyOn(component as any, 'afterRemoveTab');

      component.closeTab(tabMock);

      expect(emitSpy).toHaveBeenCalled();
      expect(tabMock.removed).toBeTrue();
      expect(tabMock.hide).toBeTrue();
      expect(onTabChangeStateSpy).toHaveBeenCalled();
      expect(tabMock.elementRef.nativeElement.remove).toHaveBeenCalled();
      expect(afterRemoveTabSpy).toHaveBeenCalledWith(100);
    });

    it('closeTab: should close the tab, update its state, remove its element and call afterRemoveTab', () => {
      const tabMock = {
        id: 1,
        closeTab: new EventEmitter(),
        removed: false,
        hide: false,
        elementRef: {
          nativeElement: {
            remove: jasmine.createSpy('remove')
          }
        }
      } as any;
      component.initialTabsWidth = [{ id: 1, width: 100 }];

      const onTabChangeStateSpy = spyOn(component, 'onTabChangeState');
      const afterRemoveTabSpy = spyOn(component as any, 'afterRemoveTab');

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

      spyOn(component, 'handleKeyboardNavigationTab');

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

      spyOn(component, 'handleKeyboardNavigationTab');

      component['afterRemoveTab'](widthTab);

      expect(component.quantityTabsButton).toBe(3);
      expect(component['sumOfWidth']).toBe(390);
      expect(component.handleKeyboardNavigationTab).toHaveBeenCalled();
    });

    it('calculateTabs: should calculate visible tabs and hide the rest when screen size is limited', () => {
      const screenSize = 300;

      component.containerTabs = {
        nativeElement: {
          offsetWidth: screenSize
        }
      } as any;

      const tabElements = [80, 90, 100, 120].map((width, i) => {
        const id = `tab-${i}`;
        return {
          nativeElement: {
            id,
            offsetWidth: width,
            hidden: false,
            style: { display: 'block' }
          }
        };
      });

      component.tabButton = tabElements as any;

      component.initialTabsWidth = [];
      component.byQuantityFunction = undefined;

      component.calculateTabs(true);

      expect(component.initialTabsWidth.length).toBe(4);
      expect(component.quantityTabsButton).toBe(1);
      expect(tabElements[0].nativeElement.hidden).toBeFalse();
      expect(tabElements[1].nativeElement.hidden).toBeTrue();
      expect(tabElements[2].nativeElement.hidden).toBeTrue();
      expect(tabElements[3].nativeElement.hidden).toBeTrue();
    });

    it('calculateTabs: should calculate 2 visible tabs if byQuantityFunction is 2', () => {
      const screenSize = 500;

      component.containerTabs = {
        nativeElement: {
          offsetWidth: screenSize
        }
      } as any;

      const tabElements = [80, 90, 100, 120].map((width, i) => {
        const id = `tab-${i}`;
        return {
          nativeElement: {
            id,
            offsetWidth: width,
            hidden: i === 1,
            style: { display: 'block' }
          }
        };
      });

      component.tabButton = tabElements as any;

      component.initialTabsWidth = [];
      component.byQuantityFunction = 2;

      component.calculateTabs(true);

      expect(component.initialTabsWidth.length).toBe(4);
      expect(component.quantityTabsButton).toBe(2);
      expect(tabElements[0].nativeElement.hidden).toBeFalse();
      expect(tabElements[1].nativeElement.hidden).toBeTrue();
      expect(tabElements[2].nativeElement.hidden).toBeFalse();
      expect(tabElements[3].nativeElement.hidden).toBeTrue();
    });

    it('onTabActiveByDropdown: should handle tab activation by dropdown correctly', () => {
      const tabMock = {
        id: 'tab1',
        click: { emit: jasmine.createSpy('emit') },
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

      const tabButtonArray = [{ nativeElement: currentTabElement }, { nativeElement: lastTabElement }];

      component.tabButton = {
        toArray: () => tabButtonArray
      } as any;

      spyOn(component, 'changeTabPositionByDropdown');
      spyOn(component, 'reorderTabs');
      spyOn(component, 'handleKeyboardNavigationTab');

      component.onTabActiveByDropdown(tabMock);

      expect(component.changeTabPositionByDropdown).toHaveBeenCalledWith(tabMock, true);
      expect(lastTabElement.style.display).toBe('none');
      expect(lastTabElement.hidden).toBeTrue();
      expect(currentTabElement.hidden).toBeFalse();
      expect(currentTabElement.style.display).toBe('inline-block');
      expect(component.reorderTabs).toHaveBeenCalledWith(tabMock, lastTabElement);
      expect(tabMock.widthButton).toBe(150);
      expect(tabMock.showTooltip).toBeTrue();
      expect(currentTabElement.style.width).toBe('150px');
      expect(component.handleKeyboardNavigationTab).toHaveBeenCalled();
      expect(tabMock.click.emit).toHaveBeenCalledWith(tabMock);
    });

    it('onTabActiveByDropdown: should return if tab is disabled', () => {
      const tabMock = {
        id: 'tab1',
        click: { emit: jasmine.createSpy('emit') },
        widthButton: 0,
        showTooltip: false,
        disabled: true
      } as any;

      spyOn(component, 'onTabChangeState');
      spyOn(component, 'changeTabPositionByDropdown');

      component.onTabActiveByDropdown(tabMock);

      expect(component.changeTabPositionByDropdown).not.toHaveBeenCalled();
      expect(component.onTabChangeState).toHaveBeenCalled();
    });

    it('onChangeVisibilityTab: should recalculate tab width and call calculateTabs when tab is visible', () => {
      const mockTab = {
        id: 'tab-1',
        hide: false,
        widthButton: undefined
      } as any;

      const mockTabElement = {
        nativeElement: { id: 'tab-1', offsetWidth: 123 }
      };

      component.initialTabsWidth = [{ id: 'tab-1', width: 100 }];
      component.tabButton = [mockTabElement as any] as any;

      spyOn(component.changeDetector, 'detectChanges');
      spyOn(component, 'calculateTabs');

      component.onChangeVisibilityTab(mockTab);

      expect(component.initialTabsWidth[0].width).toBe(123);
      expect(mockTab.widthButton).toBe(123);
      expect(component.changeDetector.detectChanges).toHaveBeenCalledTimes(2);
      expect(component.calculateTabs).toHaveBeenCalledWith(true);
    });

    it('onChangeVisibilityTab: should call afterRemoveTab with correct width when tab is hidden', () => {
      const mockTab = {
        id: 'tab-2',
        hide: true,
        widthButton: undefined
      } as any;

      component.initialTabsWidth = [{ id: 'tab-2', width: 200 }];
      const afterMethod = spyOn(component as any, 'afterRemoveTab');

      component.onChangeVisibilityTab(mockTab);

      expect(afterMethod).toHaveBeenCalledWith(200);
    });

    it('updateTabsState: should correctly update tabs state considering checkChangesTabs logic', () => {
      component.initCheckChangesTab = true;
      component.quantityTabsButton = 2;
      component.byQuantityFunction = undefined;
      component.initialTabsWidth = [
        { id: 'tab-1', width: 100 },
        { id: 'tab-2-hide', width: 120 },
        { id: 'tab-2', width: 120 }
      ];

      component['tabsChildren'] = {
        _results: [
          { id: 'tab-1', hide: false, showTooltip: true },
          { id: 'tab-other', removed: true, hide: true },
          { id: 'tab-2-hide', hide: true },
          { id: 'tab-2', hide: false, showTooltip: true },
          { id: 'tab-3', hide: false }
        ]
      } as any;

      const mockTab1 = { nativeElement: { id: 'tab-1', style: { display: '' }, hidden: false } };
      const mockTab2Hidden = { nativeElement: { id: 'tab-2-hide', style: { display: '' }, hidden: true } };
      const mockTab2 = { nativeElement: { id: 'tab-2', style: { display: '' }, hidden: false } };
      const mockTab3 = { nativeElement: { id: 'tab-3', style: { display: 'none' }, hidden: true } };

      component.tabButton = [mockTab1, mockTab2Hidden, mockTab2, mockTab3] as any;

      spyOn(component as any, 'calculateTabs');
      spyOn(component as any, 'executeTabsState');

      component.updateTabsState(false, { id: 'tab-2', hide: true, widthButton: undefined } as any);

      expect(mockTab3.nativeElement.hidden).toBeFalse();
      expect(mockTab3.nativeElement.style.display).toBe('inline-block');

      expect(mockTab2Hidden.nativeElement.hidden).toBeTrue();
      expect(mockTab2Hidden.nativeElement.style.display).toBe('');

      expect(mockTab1.nativeElement.hidden).toBeFalse();
      expect(mockTab2.nativeElement.hidden).toBeFalse();

      expect((component as any).calculateTabs).toHaveBeenCalled();
      expect((component as any).executeTabsState).not.toHaveBeenCalled();
      expect(component.initialTabsWidth.length).toBe(4);
    });

    it('checkChangesTabs: should hide tabs exceeding quantityTabs', () => {
      component.quantityTabsButton = 2;

      const mockTab1 = { nativeElement: { id: 'tab-1', style: { display: '' }, hidden: false, offsetWidth: 100 } };
      const mockTab2 = { nativeElement: { id: 'tab-2', style: { display: '' }, hidden: false, offsetWidth: 100 } };
      const mockTab3 = { nativeElement: { id: 'tab-3', style: { display: '' }, hidden: false, offsetWidth: 100 } };
      const mockTab4 = { nativeElement: { id: 'tab-4', style: { display: '' }, hidden: false, offsetWidth: 100 } };

      component.tabButton = [mockTab1, mockTab2, mockTab3, mockTab4] as any;

      component['tabsChildren'] = {
        _results: [
          { id: 'tab-1', hide: false },
          { id: 'tab-2', hide: false },
          { id: 'tab-3', hide: false },
          { id: 'tab-4', hide: false }
        ]
      } as any;

      spyOn(component as any, 'calculateTabs');

      component['checkChangesTabs']();

      expect(mockTab4.nativeElement.hidden).toBeTrue();
      expect(mockTab4.nativeElement.style.display).toBe('none');

      expect(mockTab1.nativeElement.hidden).toBeFalse();
      expect(mockTab2.nativeElement.hidden).toBeFalse();

      expect((component as any).calculateTabs).toHaveBeenCalled();
    });

    it('updateTabsState: should return defaultLastTabWidth is valid', () => {
      component.quantityTabsButton = 2;
      component.initialTabsWidth = [
        { id: 'tab-1', width: 100 },
        { id: 'tab-2', width: 120 }
      ];
      const mockTab1 = {
        nativeElement: {
          id: 'tab-1',
          style: { display: '' },
          hidden: false
        }
      };

      const mockTab2 = {
        nativeElement: {
          id: 'tab-2',
          style: { display: '' },
          hidden: false
        }
      };

      const mockTab3 = {
        nativeElement: {
          id: 'tab-3',
          style: { display: '' },
          hidden: false,
          offsetWidth: 120
        }
      };

      component.tabButton = [mockTab1, mockTab2, mockTab3] as any;

      spyOn(component as any, 'calculateTabs');
      spyOn(component as any, 'executeTabsState');

      component.updateTabsState(false);

      expect((component as any).calculateTabs).not.toHaveBeenCalled();
      expect(component.defaultLastTabWidth).toBe(120);
      expect((component as any).executeTabsState).toHaveBeenCalled();
    });

    it('updateTabsState: should keep newly added tab visible when there is space available (no dropdown)', () => {
      component.initCheckChangesTab = true;
      component.quantityTabsButton = 3;
      component.byQuantityFunction = undefined;
      component.initialTabsWidth = [
        { id: 'tab-1', width: 100 },
        { id: 'tab-2', width: 120 }
      ];

      const mockTabsChildren = [
        { id: 'tab-1', hide: false, showTooltip: true },
        { id: 'tab-2', hide: false, showTooltip: true },
        { id: 'tab-3', hide: false, showTooltip: true }
      ];

      component['tabsChildren'] = {
        _results: mockTabsChildren,
        toArray: () => mockTabsChildren
      } as any;

      const mockTab1 = {
        nativeElement: {
          id: 'tab-1',
          style: { display: '' },
          hidden: false,
          offsetWidth: 100
        }
      };

      const mockTab2 = {
        nativeElement: {
          id: 'tab-2',
          style: { display: '' },
          hidden: false,
          offsetWidth: 120
        }
      };

      const mockTab3 = {
        nativeElement: {
          id: 'tab-3',
          style: { display: '' },
          hidden: false,
          offsetWidth: 110
        }
      };

      component['containerTabs'] = {
        nativeElement: { offsetWidth: 600 }
      } as any;

      component.tabButton = [mockTab1, mockTab2, mockTab3] as any;

      spyOn(component as any, 'calculateTabs').and.callThrough();

      component.updateTabsState(false, { id: 'tab-3', hide: false } as any);

      expect(mockTab3.nativeElement.hidden).toBeFalse();
      expect(component.tabsDefault.some(t => t.id === 'tab-3')).toBeTrue();
      expect(component.overflowedTabs.some(t => t.id === 'tab-3')).toBeFalse();

      expect((component as any).calculateTabs).toHaveBeenCalled();
    });

    it('setQuantityTabsButton: should values valid', () => {
      spyOn(component as any, 'calculateTabs');

      component.quantityTabsButton = 5;
      component.setQuantityTabsButton(2);

      expect((component as any).calculateTabs).toHaveBeenCalled();
      expect(component.quantityTabsButton).toBe(2);
      expect(component.byQuantityFunction).toBe(2);
    });

    it('setQuantityTabsButton: should call afterRemoveTab', () => {
      spyOn(component as any, 'calculateTabs');
      spyOn(component as any, 'afterRemoveTab');

      component.byQuantityFunction = 2;
      component.setQuantityTabsButton(4);

      expect((component as any).calculateTabs).not.toHaveBeenCalled();
      expect((component as any).afterRemoveTab).toHaveBeenCalled();
      expect(component.quantityTabsButton).toBe(4);
      expect(component.byQuantityFunction).toBe(4);
    });
  });
});
