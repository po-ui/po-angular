import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';
import * as UtilsFunction from './../../utils/util';

import { PoTabsComponent } from './po-tabs.component';
import { PoTabsModule } from './po-tabs.module';

describe('PoTabsComponent:', () => {
  let component: PoTabsComponent;
  let fixture: ComponentFixture<PoTabsComponent>;
  let nativeElement: any;

  let defaultTab;
  let activeTab;
  let disabledTab;
  let hiddenTab;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoTabsModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTabsComponent);
    component = fixture.componentInstance;

    defaultTab = { id: '1', active: false, label: 'Tab 1' };
    activeTab = { id: '2', active: true, label: 'Tab 2' };
    disabledTab = { id: '3', disabled: true, label: 'Tab 3' };
    hiddenTab = { id: '4', hide: true, label: 'Tab 4' };

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('overflowedTabs: should return `overflowedTabs` that position greater than `maxNumberOfTabs - 2`', () => {
      const tabs = [defaultTab, defaultTab, defaultTab, defaultTab];
      const overflowedTabs = [defaultTab, defaultTab, defaultTab];
      component.tabs = <any>[...tabs, ...overflowedTabs];

      expect(component.overflowedTabs).toEqual(overflowedTabs);
    });

    it('isShowTabDropdown: should return `true` if `visibleTabs` is greater than `maxNumberOfTabs` and isn`t a mobile device.', () => {
      spyOn(UtilsFunction, <any>'isMobile').and.returnValue(false);
      component.tabs = <any>[defaultTab, defaultTab, defaultTab, defaultTab, defaultTab, defaultTab];

      expect(component.isShowTabDropdown).toBe(true);
    });

    it('isShowTabDropdown: should return `false` if `visibleTabs` is lower than `maxNumberOfTabs` and is a mobile device.', () => {
      spyOn(UtilsFunction, <any>'isMobile').and.returnValue(true);
      component.tabs = <any>[defaultTab, defaultTab, defaultTab, defaultTab];

      expect(component.isShowTabDropdown).toBe(false);
    });

    it('visibleTabs: should return `tabs` that aren`t hide', () => {
      component.tabs = <any>[defaultTab, activeTab, hiddenTab];

      expect(component.visibleTabs.length).toBe(2);
      expect(component.visibleTabs.some(visibleTab => visibleTab.hide)).toBeFalsy();
    });

    it('isVisibleTab: should return `true` if `visibleTabs` is lower than `maxNumberOfTabs`', () => {
      component.tabs = <any>[defaultTab, activeTab, hiddenTab];
      const tab = component.tabs[0];

      expect(component.isVisibleTab(tab)).toBe(true);
    });

    it('isVisibleTab: should return `false` if `visibleTabs` is greater than `maxNumberOfTabs`', () => {
      component.tabs = <any>[{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
      const tab = component.tabs[component.tabs.length - 1];

      expect(component.isVisibleTab(tab)).toBe(false);
    });

    it('onTabChangeState: shouldn`t call `activeDistinctTab`, `detectChanges` if `tab.active` is false', () => {
      const tab = defaultTab;

      spyOn(component, <any>'activeDistinctTab');
      spyOn(component['changeDetector'], 'detectChanges');

      component.onTabChangeState(tab);

      expect(component['activeDistinctTab']).not.toHaveBeenCalled();
      expect(component['changeDetector'].detectChanges).not.toHaveBeenCalled();
    });

    it('onTabChangeState: should set `tab.active` with false and call `activeDistinctTab`, `detectChanges` if `tab.active` is true', () => {
      const tab = activeTab;

      spyOn(component, <any>'activeDistinctTab');
      spyOn(component['changeDetector'], 'detectChanges');

      component.onTabChangeState(tab);

      expect(tab.active).toBe(false);
      expect(component['activeDistinctTab']).toHaveBeenCalled();
      expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
    });

    it('onTabActive: should set `previousActiveTab` and call `deactivateTab`', () => {
      component['previousActiveTab'] = undefined;
      component.tabs = <any>[defaultTab, activeTab];
      const tab = component.tabs[0];

      spyOn(component, <any>'deactivateTab');

      component.onTabActive(tab);

      expect(component['previousActiveTab']).toBeDefined();
      expect(component['deactivateTab']).toHaveBeenCalled();
    });

    it('selectedTab: should set `tab.active` with true, call `detectChanges` and `tab.click` if exists', () => {
      const tab = defaultTab;
      tab.click = { emit: () => {} };

      spyOn(component['changeDetector'], 'detectChanges');
      spyOn(tab.click, 'emit');

      component.selectedTab(tab);

      expect(tab.active).toBe(true);
      expect(tab.click.emit).toHaveBeenCalledWith(tab);
      expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
    });

    it('selectedTab: should set `tab.active` with true and call `detectChanges`', () => {
      const tab = defaultTab;

      spyOn(component['changeDetector'], 'detectChanges');

      component.selectedTab(tab);

      expect(tab.active).toBe(true);
      expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
    });

    it('trackByFn: should return `tab.id`', () => {
      const tabId = '1';

      expect(component.trackByFn(0, defaultTab)).toBe(tabId);
    });

    it('activeFirstTab: should `active` first tab if it isn`t disabled or hide', () => {
      let tab;
      component.tabs = <any>[defaultTab];

      component['activeFirstTab']();
      tab = component.tabs[0];

      expect(tab.active).toBeTruthy();
    });

    it('activeFirstTab: shouldn`t `active` first tab if them are disabled or hide', () => {
      let tab;
      component.tabs = <any>[disabledTab, hiddenTab];

      component['activeFirstTab']();
      tab = component.tabs[0];

      expect(tab.active).toBeFalsy();
    });

    it(`closePopover: should call 'popover.close' if 'popover.isHidden' is 'false'.`, () => {
      const fakeThis = {
        tabDropdown: {
          popover: {
            isHidden: false,
            close: () => {}
          }
        }
      };
      const spyOnClose = spyOn(fakeThis.tabDropdown.popover, 'close');

      component.closePopover.call(fakeThis);
      expect(spyOnClose).toHaveBeenCalled();
    });

    it(`closePopover: shouldn't call 'popover.close' if 'popover.isHidden' is 'true'.`, () => {
      const fakeThis = {
        tabDropdown: {
          popover: {
            isHidden: true,
            close: () => {}
          }
        }
      };
      const spyOnClose = spyOn(fakeThis.tabDropdown.popover, 'close');

      component.closePopover.call(fakeThis);
      expect(spyOnClose).not.toHaveBeenCalled();
    });

    it('deactivateTab: should deactive `previousActiveTab` if it`s truthy', () => {
      component['previousActiveTab'] = activeTab;

      spyOn(component['changeDetector'], 'detectChanges');

      component['deactivateTab']();

      expect(component['previousActiveTab'].active).toBeFalsy();
      expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
    });

    it('deactivateTab: shouldn`t call `detectChanges` if `previousActiveTab` it`s falsy', () => {
      component['previousActiveTab'] = undefined;

      spyOn(component['changeDetector'], 'detectChanges');

      component['deactivateTab']();

      expect(component['previousActiveTab']).toBeFalsy();
      expect(component['changeDetector'].detectChanges).not.toHaveBeenCalled();
    });

    it('activeDistinctTab: shouldn`t call `activeFirstTab` when `previousActiveTab` is true', () => {
      component['previousActiveTab'] = defaultTab;

      spyOn(component, <any>'activeFirstTab');

      component['activeDistinctTab']();

      expect(component['previousActiveTab'].active).toBe(true);
      expect(component['activeFirstTab']).not.toHaveBeenCalled();
    });

    it('activeDistinctTab: should call `activeFirstTab` when `previousActiveTab` is false', () => {
      component['previousActiveTab'] = undefined;

      spyOn(component, <any>'activeFirstTab');

      component['activeDistinctTab']();

      expect(component['activeFirstTab']).toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    const sixTabs = <any>[
      { id: '0', label: '0' },
      { id: '1', label: '1' },
      { id: '2', label: '2' },
      { id: '3', label: '3' },
      { id: '4', label: '4' },
      { id: '5', label: '5' },
      { id: '6', label: '6' }
    ];

    it('should call `closePopover` if `enter` is pressed in `po-tab-button`.', () => {
      component.tabs = <any>[{ id: '0', label: '0' }];
      fixture.detectChanges();

      const eventEnterKey = new KeyboardEvent('keyup', { 'key': 'Enter' });
      const poTabButton = fixture.debugElement.query(By.css('.po-tab-button')).nativeElement;
      const spyOnClosePopover = spyOn(component, 'closePopover');

      poTabButton.dispatchEvent(eventEnterKey);

      expect(spyOnClosePopover).toHaveBeenCalled();
    });

    it('should display `po-tab-dropdown` if has six tabs or more and is not a mobile devide.', () => {
      component.tabs = sixTabs;
      spyOn(UtilsFunction, <any>'isMobile').and.returnValue(false);

      fixture.detectChanges();
      const poTabDropdown = nativeElement.querySelector('.po-tab-button.po-tab-dropdown');

      expect(poTabDropdown).toBeTruthy();
    });

    it('shouldn`t display `po-tab-dropdown` if has six tabs or more but is a mobile devide.', () => {
      component.tabs = sixTabs;
      spyOn(UtilsFunction, <any>'isMobile').and.returnValue(true);

      fixture.detectChanges();
      const poTabDropdown = nativeElement.querySelector('.po-tab-button.po-tab-dropdown');

      expect(poTabDropdown).toBeNull();
    });

    it('should find `po-tabs-container-mobile` if mobile device', () => {
      component.tabs = sixTabs;
      spyOn(UtilsFunction, <any>'isMobile').and.returnValue(true);

      fixture.detectChanges();
      const poTabContainerMobile = nativeElement.querySelector('.po-tabs-container-mobile');

      expect(poTabContainerMobile).toBeTruthy();
    });

    it('should find `po-tab-button-mobile` if mobile device', () => {
      component.tabs = sixTabs;
      spyOn(UtilsFunction, <any>'isMobile').and.returnValue(true);

      fixture.detectChanges();
      const poTabButtonMobile = nativeElement.querySelector('.po-tab-button-mobile');

      expect(poTabButtonMobile).toBeTruthy();
    });
  });
});
