import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs';

import { configureTestSuite, expectPropertiesValues } from './../../../util-test/util-expect.spec';

import { PoBadgeComponent } from '../../po-badge';
import { PoMenuItemsService } from '../services/po-menu-items.service';
import { PoMenuItemComponent } from './po-menu-item.component';

@Component({ template: 'Search' })
export class SearchComponent {}

@Component({ template: 'Home' })
export class HomeComponent {}

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent }
];

describe('PoMenuItemComponent:', () => {
  let component: PoMenuItemComponent;
  let fixture: ComponentFixture<PoMenuItemComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [SearchComponent, HomeComponent, PoMenuItemComponent, PoBadgeComponent],
      providers: [PoMenuItemsService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoMenuItemComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    component.label = 'Menu item test';
    component.type = 'internalLink';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-badge-value: should update property p-badge-value with valid values.', () => {
      const validValues = [105, 1, 98, 0];

      expectPropertiesValues(component, 'badgeValue', validValues, validValues);
    });

    it('p-badge-value: should update property p-badge-value with invalid values for undefined.', () => {
      const invalidValues = [null, undefined, '', ' ', {}, [], false, true];

      expectPropertiesValues(component, 'badgeValue', invalidValues, undefined);
    });

    it('p-is-sub-item: should update property with valid values.', () => {
      const validValues = [false, true, '', 'false', 'true'];
      const expectedValues = [false, true, true, false, true];

      expectPropertiesValues(component, 'isSubItem', validValues, expectedValues);
    });

    it('p-is-sub-item: should update property with `false` if values are invalid.', () => {
      const invalidValues = [0, null, undefined, 'undefined', 'null'];

      expectPropertiesValues(component, 'isSubItem', invalidValues, false);
    });

    it('p-is-selected: should update property with valid values.', () => {
      const validValues = [false, true, '', 'false', 'true'];
      const expectedValues = [false, true, true, false, true];

      expectPropertiesValues(component, 'isSelected', validValues, expectedValues);
    });

    it('p-is-selected: should update property with `false` if values are invalid.', () => {
      const invalidValues = [0, null, undefined, 'undefined', 'null'];

      expectPropertiesValues(component, 'isSelected', invalidValues, false);
    });

    it('p-is-selected: should set `isSelectedSubItem` with `false` if `isSelected` and `isSubItem` are `false`.', () => {
      component.isSubItem = false;
      component.isSelected = false;

      expect(component.isSelectedSubItem).toBe(false);
    });

    it('p-is-selected: should set `isSelectedSubItem` with `true` if `isSelected` and `isSubItem` are `true`.', () => {
      component.isSubItem = true;
      component.isSelected = true;

      expect(component.isSelectedSubItem).toBe(true);
    });

    it('p-is-selected: should set `isSelectedSubItem` with `false` if `isSelected` or `isSubItem` is `false`.', () => {
      component.isSubItem = false;
      component.isSelected = true;

      expect(component.isSelectedSubItem).toBe(false);
    });

    it(`canShowBadge: should return false if 'type' is equal to 'subItems'`, () => {
      component.type = 'subItems';

      expect(component.canShowBadge).toBe(false);
    });

    it(`canShowBadge: should return false if 'type' is different to 'subItems' and 'badgeValue' is 'undefined'`, () => {
      component.badgeValue = undefined;

      expect(component.canShowBadge).toBe(false);
    });

    it(`canShowBadge: should return false if 'type' is different to 'subItems' and 'badgeValue' is less than '0'`, () => {
      component.badgeValue = -5;

      expect(component.canShowBadge).toBe(false);
    });

    it(`canShowBadge: should return true if 'type' is different to 'subItems' and 'badgeValue' is greater than '0'`, () => {
      component.badgeValue = 20;

      expect(component.canShowBadge).toBe(true);
    });

    it(`canShowBadge: should return true if 'type' is different to 'subItems' and 'badgeValue' is '0'`, () => {
      component.badgeValue = 0;

      expect(component.canShowBadge).toBe(true);
    });

    it(`subItems: should set with 'subitems' value and call 'calcMenuSubItemsMaxHeight' if 'isOpened' is 'true'`, () => {
      const result = [
        {
          id: '1',
          label: 'item1',
          subItems: [
            { id: '2', label: 'sub1' },
            { id: '3', label: 'sub2' }
          ]
        }
      ];
      component.isOpened = true;

      spyOn(component, <any>'calcMenuSubItemsMaxHeight');

      component.subItems = result;

      expect(component.subItems).toEqual(result);
      expect(component['calcMenuSubItemsMaxHeight']).toHaveBeenCalled();
    });

    it(`subItems: should set with 'subitems' value and doesn't call 'calcMenuSubItemsMaxHeight' if 'isOpened' is 'false'`, () => {
      const result = [
        {
          id: '1',
          label: 'item1',
          subItems: [
            { id: '2', label: 'sub1' },
            { id: '3', label: 'sub2' }
          ]
        }
      ];
      component.isOpened = false;

      spyOn(component, <any>'calcMenuSubItemsMaxHeight');

      component.subItems = result;

      expect(component.subItems).toEqual(result);
      expect(component['calcMenuSubItemsMaxHeight']).not.toHaveBeenCalled();
    });
  });

  it('should call receiveFromParentMenuClicked Observable', () => {
    const menuItem = { label: 'Teste', type: 'subItems' };
    component['menuItemsService'] = fakeMenuService(menuItem) as PoMenuItemsService;

    spyOn(component, <any>'processMenuItem');

    component.ngOnInit();

    expect(component['processMenuItem']).toHaveBeenCalled();
  });

  it('property isSelected should be truthy', () => {
    component.id = '11';
    const menuItem = { id: '11' };

    component['activateMenu'](menuItem);

    expect(component.isSelected).toBeTruthy();
  });

  it('should call preventDefault and emit sendToParentMenuClicked to menuItemsService if ctrl is not pressed', () => {
    const method = 'sendToParentMenuClicked';
    const event = {
      ctrlKey: false,
      preventDefault: () => {}
    };
    spyOn(event, 'preventDefault');
    spyOn(component['menuItemsService'], method);

    component.clickMenuItem(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component['menuItemsService'][method]).toHaveBeenCalled();
  });

  it('should call preventDefault and emit sendToParentMenuClicked to menuItemsService if command is not pressed', () => {
    const method = 'sendToParentMenuClicked';
    const event = {
      metaKey: false,
      preventDefault: () => {}
    };
    spyOn(event, 'preventDefault');
    spyOn(component['menuItemsService'], method);

    component.clickMenuItem(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component['menuItemsService'][method]).toHaveBeenCalled();
  });

  it('should not call preventDefault and menuItemsService when dispatch event ctrl+click', () => {
    const method = 'sendToParentMenuClicked';
    const eventClick = document.createEvent('MouseEvents');
    eventClick.initMouseEvent('click', false, true, window, 0, 0, 0, 0, 0, true, false, false, false, 0, null);

    spyOn(eventClick, 'preventDefault');
    spyOn(component['menuItemsService'], method);

    const menuItem = nativeElement.querySelector('.po-menu-item');
    menuItem.dispatchEvent(eventClick);

    expect(eventClick.preventDefault).not.toHaveBeenCalled();
    expect(component['menuItemsService'][method]).not.toHaveBeenCalled();
  });

  it('should not call preventDefault and menuItemsService when dispatch event command+click', () => {
    const method = 'sendToParentMenuClicked';
    const eventClick = document.createEvent('MouseEvents');
    eventClick.initMouseEvent('click', false, true, window, 0, 0, 0, 0, 0, false, false, false, true, 0, null);

    spyOn(eventClick, 'preventDefault');
    spyOn(component['menuItemsService'], method);

    const menuItem = nativeElement.querySelector('.po-menu-item');
    menuItem.dispatchEvent(eventClick);

    expect(eventClick.preventDefault).not.toHaveBeenCalled();
    expect(component['menuItemsService'][method]).not.toHaveBeenCalled();
  });

  it('hasSubItem should return falsy when menuItem no have subItems', () => {
    const subItems = undefined;
    const hasSubItemSelected = component['hasSubItem'](subItems, '2');

    expect(hasSubItemSelected).toBeFalsy();
  });

  it('hasSubItem should return true when menuItem ID of subItems is the same of parameter Id', () => {
    const subItems = [{ id: '11', label: '' }];
    const hasSubItemSelected = component['hasSubItem'](subItems, '11');

    expect(hasSubItemSelected).toBeTruthy();
  });

  it('hasSubItem should return falsy when menuItem have subItems but the id of menuItem is different of parameter Id', () => {
    const subItems = [{ id: '11', label: '' }];
    const hasSubItemSelected = component['hasSubItem'](subItems, '111');

    expect(hasSubItemSelected).toBeFalsy();
  });

  it('should call activateMenu when type is `internalLink`', () => {
    const fnSpy = 'activateMenu';
    const menu = { active: false, grouped: false };

    spyOn(component, <any>fnSpy).and.returnValue(null);

    component.type = 'internalLink';
    component['processMenuItem'](menu);

    expect(component[fnSpy]).toHaveBeenCalled();
  });

  it('should call groupedMenu when type is `subItems`', () => {
    const fnSpy = 'groupedMenu';
    const menu = { active: false, grouped: false };

    spyOn(component, <any>fnSpy).and.returnValue(null);

    component.type = 'subItems';
    component['processMenuItem'](menu);

    expect(component[fnSpy]).toHaveBeenCalled();
  });

  it('should call groupedMenu or activateMenu', () => {
    const groupedMenuFn = 'groupedMenu';
    const activateMenuFn = 'activateMenu';
    const menu = { active: false, grouped: false };

    spyOn(component, <any>groupedMenuFn);
    spyOn(component, <any>activateMenuFn);

    component.type = '';
    component['processMenuItem'](menu);

    expect(component[groupedMenuFn]).not.toHaveBeenCalled();
    expect(component[activateMenuFn]).not.toHaveBeenCalled();
  });

  it('should call isMenuOpened and hasSubItem ', () => {
    component.subItems = [];
    const isMenuOpendFn = 'isMenuOpened';
    const hasSubItemFn = 'hasSubItem';
    const menu = { active: false, grouped: false, label: '' };

    spyOn(component, <any>isMenuOpendFn);
    spyOn(component, <any>hasSubItemFn);

    component.type = 'subItems';
    component['groupedMenu'](menu, menu);

    expect(component[isMenuOpendFn]).toHaveBeenCalled();
    expect(component[hasSubItemFn]).toHaveBeenCalled();
  });

  it('should not call hasSubItem', () => {
    component.subItems = [];
    const hasSubItemFn = 'hasSubItem';
    const menu = { active: false, grouped: false, label: '' };

    spyOn(component, <any>hasSubItemFn);

    component['groupedMenu'](undefined, menu);

    expect(component[hasSubItemFn]).not.toHaveBeenCalled();
  });

  it('IsMenuOpened should return false when menuOpened parameter is falsy', () => {
    const isOpened = component['isMenuOpened'](undefined, false);

    expect(isOpened).toBeFalsy();
  });

  it('IsMenuOpened return false when id is different than menuOpened ID parameter ', () => {
    const menuOpened = { id: '1', subItems: [{ id: '2' }] };
    component.id = '2';

    const isOpened = component['isMenuOpened'](<any>menuOpened, false);
    expect(isOpened).toBeFalsy();
  });

  it('should set max height to animate po-menu item sub items', () => {
    component.id = '1';
    component.type = 'subItems';
    component.subItems = [{ label: 'Search' }, { label: 'Register' }];

    const menuOpened = { id: '1', label: 'Actions' };

    component['accordionAnimation'](null, menuOpened, false, false);
    fixture.detectChanges();

    expect(component.maxHeight).toBe(196);
    expect(nativeElement.querySelector('.po-menu-sub-items').style.maxHeight).toBe('196px');
  });

  it('should set max height to 196px animate po-menu item sub items with opened menu', () => {
    component.id = '1';
    component.type = 'subItems';
    component.subItems = [{ label: 'Search' }, { label: 'Register' }];

    const menuOpened = {
      id: '1',
      label: 'Search',
      isOpened: true,
      subItems: [{ label: 'Houses' }, { label: 'Boats' }]
    };

    component['accordionAnimation'](null, menuOpened, false, false);
    fixture.detectChanges();

    expect(component.maxHeight).toBe(196);
    expect(nativeElement.querySelector('.po-menu-sub-items').style.maxHeight).toBe('196px');
  });

  it('should set max height to 392px to animate po-menu item sub items with opened menu', () => {
    component.id = '1';
    component.type = 'subItems';
    component.subItems = [{ label: 'Search' }, { label: 'Register' }];

    const menuOpened = {
      id: '1',
      label: 'Search',
      isOpened: true,
      subItems: [{ label: 'Houses' }, { label: 'Boats' }]
    };

    component['accordionAnimation'](null, menuOpened, true, false);
    fixture.detectChanges();

    expect(component.maxHeight).toBe(392);
    expect(nativeElement.querySelector('.po-menu-sub-items').style.maxHeight).toBe('392px');
  });

  it('should set max height to 0px to animate po-menu item sub items with closed menu', () => {
    component.id = '1';
    component.type = 'subItems';
    component.subItems = [{ label: 'Search' }, { label: 'Register' }];

    const menuOpened = {
      id: '1',
      label: 'Search',
      isOpened: false,
      subItems: [{ label: 'Houses' }, { label: 'Boats' }]
    };

    component['accordionAnimation'](null, menuOpened, true, false);
    fixture.detectChanges();

    expect(component.maxHeight).toBe(0);
    expect(nativeElement.querySelector('.po-menu-sub-items').style.maxHeight).toBe('0px');
  });

  it('should not change max height in accordion animation if id is different of menuOpened id', () => {
    component.id = '1';
    component.type = 'subItems';
    component.subItems = [{ label: 'Search' }, { label: 'Register' }];
    component.maxHeight = 0;

    const menuOpened = { id: '2', label: 'Process' };

    component['accordionAnimation'](null, menuOpened, false, false);
    fixture.detectChanges();

    expect(component.maxHeight).toBe(0);
    expect(nativeElement.querySelector('.po-menu-sub-items').style.maxHeight).toBe('0px');
  });

  it('should set max height to 0px animate if po menu is closed', () => {
    component.id = '1';
    component.type = 'subItems';
    component.isOpened = false;

    fixture.detectChanges();

    expect(component.maxHeight).toBe(0);
    expect(nativeElement.querySelector('.po-menu-sub-items').style.maxHeight).toBe('0px');
  });

  it('should not call accordionAnimation if menuOpened is null and isOpened is true', () => {
    component.isOpened = true;
    const accordionAnimation = 'accordionAnimation';

    spyOn(component, <any>accordionAnimation);

    component.type = 'subItems';
    component['groupedMenu'](undefined, undefined);

    expect(component[accordionAnimation]).not.toHaveBeenCalled();
  });

  it('should call `getMinimumHeight` to set max height to animate po-menu subitem level 3 activated from route', () => {
    const menuItem = {
      id: '1',
      label: 'Actions',
      subItems: [{ id: '2', label: 'Search', subItems: [{ id: '3', label: 'Register' }] }]
    };

    component.id = '1';
    component.type = 'subItems';
    component.subItems = <any>[menuItem];

    const menuOpened = menuItem;
    const menuActive = { id: '3', label: 'Register' };

    spyOn(component, <any>'getMinimumHeight').and.callThrough();

    component['accordionAnimation'](menuActive, menuOpened, true, true);
    fixture.detectChanges();

    expect(component.maxHeight).toBe(392);
    expect(nativeElement.querySelector('.po-menu-sub-items').style.maxHeight).toBe('392px');
    expect(component['getMinimumHeight']).toHaveBeenCalledTimes(4);
  });

  it('should call `getMinimumHeight` to set max height to animate po-menu item level 2 activated from route', () => {
    const menuItem = { id: '1', label: 'Actions', subItems: [{ id: '2', label: 'Search' }] };

    component.id = '1';
    component.type = 'subItems';
    component.subItems = <any>[menuItem];

    const menuOpened = menuItem;
    const menuActive = { id: '2', label: 'Search' };

    spyOn(component, <any>'getMinimumHeight').and.callThrough();

    component['accordionAnimation'](menuActive, menuOpened, true, true);
    fixture.detectChanges();

    expect(component.maxHeight).toBe(294);
    expect(nativeElement.querySelector('.po-menu-sub-items').style.maxHeight).toBe('294px');
    expect(component['getMinimumHeight']).toHaveBeenCalledTimes(3);
  });

  it('itemSubscription: should `unsubscribe` on destroy.', () => {
    component['itemSubscription'] = <any>{ unsubscribe: () => {} };

    spyOn(component['itemSubscription'], <any>'unsubscribe');

    component.ngOnDestroy();

    expect(component['itemSubscription'].unsubscribe).toHaveBeenCalled();
  });

  describe('Methods:', () => {
    it('calcMenuSubItemsMaxHeight: should calc `maxHeight` with subItens height.', fakeAsync(() => {
      const fakeThis: any = {
        maxHeight: 0,
        menuSubItems: {
          nativeElement: {
            querySelectorAll: () => {}
          }
        }
      };

      spyOn(fakeThis.menuSubItems.nativeElement, 'querySelectorAll').and.returnValue([
        { offsetHeight: 10 },
        { offsetHeight: 30 }
      ]);

      component['calcMenuSubItemsMaxHeight'].call(fakeThis);

      tick();

      expect(fakeThis.maxHeight).toBe(40);
      expect(fakeThis.menuSubItems.nativeElement.querySelectorAll).toHaveBeenCalledWith('.po-menu-item');
    }));
  });

  describe('Templates:', () => {
    it('should not show icon if level is bigger than 1', () => {
      component.icon = 'po-icon-star';
      component.level = 2;

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('.po-menu-icon-container').length).toBe(0);
      expect(nativeElement.querySelectorAll('.po-icon-star').length).toBe(0);
      expect(nativeElement.querySelectorAll('.po-menu-icon-item').length).toBe(0);
    });

    it('should show icon if it`s first level', () => {
      component.icon = 'po-icon-star';
      component.level = 1;

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('.po-menu-icon-container').length).toBe(1);
      expect(nativeElement.querySelectorAll('.po-icon-star').length).toBe(1);
      expect(nativeElement.querySelectorAll('.po-menu-icon-item').length).toBe(1);
      expect(nativeElement.querySelectorAll('.po-menu-icon-label').length).toBe(1);
    });

    it('shouldn`t show icon class if icon is `star`.', () => {
      component.icon = 'star';
      component.level = 1;

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('.po-icon-star').length).toBe(0);
    });

    it('should show icon class if icon is `po-icon-star`.', () => {
      component.icon = 'po-icon-star';
      component.level = 1;

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('.po-icon-star').length).toBe(1);
    });

    it('should hide `po-menu-sub-item` if menu is collapsed', () => {
      component.type = 'subItems';
      component.collapsedMenu = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-menu-sub-items').hidden).toBeTruthy();
    });

    it('should show `po-menu-sub-item` if menu isn`t collapsed', () => {
      component.type = 'subItems';
      component.collapsedMenu = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-menu-sub-items').hidden).toBeFalsy();
    });

    it('should show menu item arrow icon if menu is open', () => {
      component.type = 'subItems';
      component.collapsedMenu = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-menu-group-icon')).toBeTruthy();
    });

    it('should hide menu item arrow icon if menu is collapsed', () => {
      component.type = 'subItems';
      component.collapsedMenu = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-menu-group-icon')).toBeFalsy();
    });

    it('should show short label is menu is collapsed', () => {
      component.collapsedMenu = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-menu-short-label')).toBeTruthy();
    });

    it('should hide short label is menu is open', () => {
      component.collapsedMenu = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-menu-short-label')).toBeFalsy();
    });

    it('should add short lavel if menu is collapsed', () => {
      const value = 'Value';
      component.collapsedMenu = true;
      component.shortLabel = value;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-menu-short-label').innerHTML).toBe('Value');
    });

    it('should show `po-badge` if `canShowBadge` is `true`', () => {
      spyOnProperty(component, 'canShowBadge').and.returnValue(true);

      fixture.detectChanges();

      const badge = nativeElement.querySelector('.po-badge');

      expect(badge).toBeTruthy();
    });

    it('shouldn`t show `po-badge` if `canShowBadge` is `false`', () => {
      spyOnProperty(component, 'canShowBadge').and.returnValue(false);

      fixture.detectChanges();

      const badge = nativeElement.querySelector('.po-badge');

      expect(badge).toBeNull();
    });

    it('should show `po-badge` with `po-menu-badge-align` if `collapsedMenu` is `false`', () => {
      spyOnProperty(component, 'canShowBadge').and.returnValue(true);
      component.collapsedMenu = false;

      fixture.detectChanges();

      const badgeAlign = nativeElement.querySelector('.po-menu-badge-align');

      expect(badgeAlign).toBeTruthy();
    });

    it('should show `po-badge` with `po-menu-badge-align-collapsed` if `collapsedMenu` is `true`', () => {
      spyOnProperty(component, 'canShowBadge').and.returnValue(true);
      component.collapsedMenu = true;

      fixture.detectChanges();

      const badgeAlign = nativeElement.querySelector('.po-menu-badge-align-collapsed');

      expect(badgeAlign).toBeTruthy();
    });

    it('should contain `po-menu-badge-alert` if `badgeAlert` is true and `collapsedMenu` is false', () => {
      component.badgeAlert = true;
      component.collapsedMenu = false;

      fixture.detectChanges();

      const badgeAlert = nativeElement.querySelector('.po-menu-badge-alert');

      expect(badgeAlert).toBeTruthy();
    });

    it('should contain `po-menu-badge-alert-collapsed` if `badgeAlert` and `collapsedMenu` are true', () => {
      component.badgeAlert = true;
      component.collapsedMenu = true;

      fixture.detectChanges();

      const badgeAlert = nativeElement.querySelector('.po-menu-badge-alert-collapsed');

      expect(badgeAlert).toBeTruthy();
    });

    it('shouldn`t contain `po-menu-badge-alert-collapsed` and `po-menu-badge-alert` if `badgeAlert` is false', () => {
      component.badgeAlert = false;

      fixture.detectChanges();

      const badgeAlert = nativeElement.querySelector('.po-menu-badge-alert');
      const badgeAlertCollapsed = nativeElement.querySelector('.po-menu-badge-alert-collapsed');

      expect(badgeAlert).toBeFalsy();
      expect(badgeAlertCollapsed).toBeFalsy();
    });

    it('should contain `po-menu-sub-item-selected` if `isSelectedSubItem` is `true`', () => {
      component.isSelectedSubItem = true;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-menu-sub-item-selected')).toBeTruthy();
    });

    it('shouldn`t contain `po-menu-sub-item-selected` if `isSelectedSubItem` is `false`', () => {
      component.isSelectedSubItem = false;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-menu-sub-item-selected')).toBeNull();
    });
  });
});

function fakeMenuService(item) {
  const observer = new Observable(obs => {
    obs.next(item);
    obs.complete();
  });

  return {
    receiveFromParentMenuClicked: () => observer
  };
}
