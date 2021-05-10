import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of } from 'rxjs';

import * as utilsFunctions from '../../utils/util';
import { configureTestSuite } from './../../util-test/util-expect.spec';
import { PoCleanComponent } from './../po-field/po-clean/po-clean.component';

import { PoLoadingModule } from '../po-loading/po-loading.module';

import { PoBadgeComponent } from '../po-badge';
import { PoMenuComponent } from './po-menu.component';
import { PoMenuFilterComponent } from './po-menu-filter/po-menu-filter.component';
import { PoMenuItemComponent } from './po-menu-item/po-menu-item.component';
import { PoMenuItemsService } from './services/po-menu-items.service';
import { PoMenuService } from './services/po-menu.service';

@Component({ template: 'Search' })
export class SearchComponent {}

@Component({ template: 'Home' })
export class HomeComponent {}

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'test', component: HomeComponent },
  { path: 'search', component: SearchComponent }
];

describe('PoMenuComponent:', () => {
  let component: PoMenuComponent;

  let fixture: ComponentFixture<PoMenuComponent>;
  let nativeElement: any;
  let router: Router;
  let location: Location;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(routes), PoLoadingModule],
      declarations: [
        PoCleanComponent,
        PoMenuComponent,
        PoMenuItemComponent,
        PoMenuFilterComponent,
        HomeComponent,
        SearchComponent,
        PoBadgeComponent
      ],
      providers: [PoMenuItemsService, PoMenuService]
    });
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(PoMenuComponent);
    nativeElement = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;

    component.menus = [
      { label: 'Home', link: './home', icon: 'home' },
      {
        label: 'sub PO',
        icon: 'clock',
        subItems: [
          { label: 'Search', link: '/search' },
          { label: 'Fake Url', link: 'http://fakeUrlPo.com.br' },
          { label: 'Just Action', action: () => {} }
        ]
      },
      { label: 'Fake Url', icon: 'star', link: 'http://fakeUrlPo.com.br' },
      { label: 'Commom Function', icon: 'share', action: () => {} },
      { label: 'Function as string', icon: 'company', action: () => {} },
      {
        label: 'Level 1.1',
        icon: 'chat',
        subItems: [
          {
            label: 'Level 2.1',
            subItems: [
              {
                label: 'Level 3.1',
                subItems: [
                  { label: 'Level 4.1', subItems: [{ label: 'Level 5.1', subItems: [{ label: 'Level 6.1' }] }] },
                  { label: 'Level 4.2' },
                  {
                    label: 'Level 4.2',
                    subItems: [{ label: 'Level 5.1 (não permitido)' }, { label: 'Level 5.2 (não permitido)' }]
                  }
                ]
              },
              { label: 'Level 3.2' }
            ]
          },
          { label: 'Level 2.2' },
          { label: 'Level 2.3' }
        ]
      },
      { label: 'Level 1.2', icon: 'copy' }
    ];

    fixture.detectChanges();

    fixture.ngZone.run(() => {
      router.initialNavigation();
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create menu items', () => {
    expect(nativeElement.querySelectorAll('po-menu-item').length).toBe(18); // All itens that are until level 4
  });

  it('should toggle overlay of menu mobile', () => {
    component.toggleMenuMobile();
    expect(component.mobileOpened).toBeTruthy(true);
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-menu-overlay')).toBeTruthy();

    component.toggleMenuMobile();
    expect(component.mobileOpened).toBeFalsy(false);
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-menu-overlay')).toBeFalsy();
  });

  it('should activate menu item', () => {
    component['clickMenuItem'](component.menus[0]);
    expect(component.activeMenuItem.link).toBe('./home');
    expect(component.groupedMenuItem).toBeFalsy();

    fixture.detectChanges();
    expect(nativeElement.querySelectorAll('.po-menu-item-selected').length).toBe(1);
  });

  it('should change link active', () => {
    component.linkActive = './other';
    component['clickMenuItem'](component.menus[0]);

    fixture.detectChanges();
    expect(component.linkActive).toBe('./home');
    expect(nativeElement.querySelectorAll('.po-menu-item-selected').length).toBe(1);
  });

  it('should open sub menu', () => {
    component['clickMenuItem'](component.menus[1]);
    expect(component.activeMenuItem).toBeFalsy();
    expect(component.groupedMenuItem).toBe(component.menus[1]);

    fixture.detectChanges();
    expect(nativeElement.querySelectorAll('.po-menu-item-selected').length).toBe(0);
    expect(nativeElement.querySelector('.po-menu-sub-items').style.maxHeight).toBe('294px');
  });

  it('should activate sub menu', () => {
    const clickedMenu = component.menus[1].subItems[0];
    component['clickMenuItem'](clickedMenu);
    expect(component.activeMenuItem).toBe(clickedMenu);
    expect(component.groupedMenuItem).toBe(component.menus[1]);

    fixture.detectChanges();
    expect(nativeElement.querySelectorAll('.po-menu-item-selected').length).toBe(1);
    expect(nativeElement.querySelector('.po-menu-sub-items').style.maxHeight).toBe('294px');
  });

  it('should open external link', () => {
    spyOn(window, 'open');

    component['clickMenuItem'](component.menus[2]);
    expect(component.mobileOpened).toBeFalsy();
    expect(component.groupedMenuItem).toBeFalsy();

    expect(window.open).toHaveBeenCalledWith('http://fakeUrlPo.com.br', '_blank');
  });

  it('should call action', () => {
    spyOn(component.menus[3], <any>'action');

    component['clickMenuItem'](component.menus[3]);
    expect(component.activeMenuItem).toBe(undefined);
    expect(component.mobileOpened).toBeFalsy();
    expect(component.menus[3].action).toHaveBeenCalled();
  });

  it('should open menu group', () => {
    component.groupedMenuItem = undefined;
    component['clickMenuItem'](component.menus[1]);

    expect(component.groupedMenuItem).toBe(component.menus[1]);
    expect(component.groupedMenuItem['isOpened']).toBeTruthy(true);
    expect(component.groupedMenuItem.subItems.length).toEqual(3);

    fixture.detectChanges();
    expect(nativeElement.querySelectorAll('.po-menu-item-grouper-up').length).toBe(1);
    expect(nativeElement.querySelector('.po-menu-sub-items').style.maxHeight).toBe('294px');
  });

  it('should close menu group', () => {
    component['clickMenuItem'](component.menus[1]); // opened
    expect(component.groupedMenuItem['isOpened']).toBe(true);

    component['clickMenuItem'](component.menus[1]); // closed
    expect(component.groupedMenuItem['isOpened']).toBe(false);

    expect(component.groupedMenuItem).toBe(component.menus[1]);
    fixture.detectChanges();
    expect(nativeElement.querySelectorAll('.po-menu-item-grouper-up').length).toBe(0);
    expect(nativeElement.querySelector('.po-menu-sub-items').style.maxHeight).toBe('0px');
  });

  it('should open sub menu item', () => {
    component['clickMenuItem'](component.menus[1].subItems[0]);
    expect(component.activeMenuItem.link).toBe('/search');
    expect(component.mobileOpened).toBe(false);
  });

  it('should open sub menu external link', () => {
    component['clickMenuItem'](component.menus[1].subItems[1]);
    expect(component.activeMenuItem).toBe(undefined);
    expect(component.mobileOpened).toBe(false);
  });

  it('should find parent menu', () => {
    let subItem = component.menus[5].subItems[0];

    expect(component['findParent'](component.menus, subItem)).toEqual(component.menus[5]);

    subItem = subItem.subItems[0].subItems[0];
    expect(component['findParent'](component.menus, subItem)).toEqual(component.menus[5].subItems[0].subItems[0]);
  });

  it('should open parent menu', () => {
    const subItem = component.menus[5].subItems[0];
    const parent = component.menus[5];

    component['openParentMenu'](subItem);

    expect(parent['isOpened']).toBe(true);
    expect(component.groupedMenuItem).toBe(parent);
  });

  it('should filter items after 300 milliseconds in debounceFilter()', fakeAsync(() => {
    component['filteringItems'] = false;
    component.menus = [
      { label: 'teste', link: 'a' },
      { label: 'item teste', link: 'b' },
      {
        label: 'item',
        subItems: [
          { label: 'subitem nível 2 teste', link: 'd' },
          {
            label: 'subitem nível 2',
            subItems: [
              { label: 'subitem nivel 3 teste', link: 'd' },
              {
                label: 'subitem nivel 3 ',
                subItems: [
                  { label: 'subitem nivel 4 teste', link: 'd' },
                  { label: 'subitem nivel 4', link: 'e' }
                ]
              }
            ]
          }
        ]
      }
    ];

    component.debounceFilter('teste');
    tick(410);
    expect(component['filteredItems'].length).toBe(5);
    expect(component['filteringItems']).toBeTruthy();
  }));

  it('shouldn`t filter items because parameter is empty in debounceFilter()', fakeAsync(() => {
    component.menus = [
      { label: 'teste', link: 'a' },
      { label: 'item teste', link: 'b' },
      { label: 'item', link: 'c' }
    ];

    component.debounceFilter('');
    tick(410);
    expect(component['filteredItems'].length).toBe(3);
    expect(component['filteringItems']).toBeFalsy();
  }));

  it('should set filteringItems to false when the item clicked is subItems', () => {
    const menuItem = { label: 'Menu item', type: 'subItems', subItems: [{ label: 'Menu subItem', link: 'test' }] };

    component['filteringItems'] = true;
    component['clickMenuItem'](menuItem);
    expect(component['filteringItems']).toBeFalsy();
  });

  it('should not set filteringItems to false when the clicked item is not subitems', () => {
    const menuItem = { label: 'Menu item', type: 'externalLink', link: 'http://fakeUrlPo.com' };

    component['filteringItems'] = true;
    component['clickMenuItem'](menuItem);
    expect(component['filteringItems']).toBeTruthy();
  });

  it('should receive from child active menu item', () => {
    const menuItem = { label: 'Teste', type: 'internalLink' };

    component['menuItemsService'] = fakeMenuService(menuItem) as PoMenuItemsService;
    component.subscribeToMenuItem();
    expect(component.activeMenuItem).toEqual(menuItem);
  });

  it('should receive from child grouped menu item', () => {
    const menuItem = { label: 'Teste', type: 'subItems' };

    component['menuItemsService'] = fakeMenuService(menuItem) as PoMenuItemsService;
    component.subscribeToMenuItem();
    expect(component.groupedMenuItem).toEqual(menuItem);
  });

  // TODO Ng V9
  xit('should navigate to home and activate menu item', done => {
    fixture.ngZone.run(() => {
      router.navigate(['home']).then(() => {
        expect(location.path()).toBe('/home');
        expect(component.activeMenuItem).toBe(component.menus[0]);

        done();
      });
    });
  });

  // TODO Ng V9
  xit('should navigate to search and activate sub menu item and group parent', done => {
    fixture.ngZone.run(() => {
      router.navigate(['search']).then(() => {
        expect(location.path()).toBe('/search');
        expect(component.activeMenuItem).toBe(component.menus[1].subItems[0]);
        expect(component.groupedMenuItem).toBe(component.menus[1]);

        done();
      });
    });
  });

  // TODO Ng V9
  xit('should not navigate if has same link', done => {
    spyOn(component, 'activateMenuByUrl');
    spyOn(component, <any>'checkingRouterChildrenFragments').and.returnValue('/search');

    component.linkActive = '/search';

    fixture.ngZone.run(() => {
      router.navigate(['search']).then(() => {
        expect(component['checkingRouterChildrenFragments']).toHaveBeenCalled();
        expect(component.activateMenuByUrl).not.toHaveBeenCalled();

        done();
      });
    });
  });

  it('should navigate to test and not activate menu item and group parent', done => {
    fixture.ngZone.run(() => {
      router.navigate(['test']).then(() => {
        expect(location.path()).toBe('/test');
        expect(component.activeMenuItem).toBe(undefined);
        expect(component.groupedMenuItem).toBe(undefined);

        done();
      });
    });
  });

  it('should have icons in all first level items', () => {
    expect(component.allowIcons).toBeTruthy();
    expect(nativeElement.querySelectorAll('.po-menu-icon-container').length).toBe(7);
  });

  it('should not have icons in first level items', () => {
    component.menus = [
      { label: 'Com ícone', icon: 'star' },
      { label: 'Sem ícone' },
      { label: 'Com ícone', icon: 'clock' }
    ];
    fixture.detectChanges();
    expect(component.allowIcons).toBeFalsy();
    expect(nativeElement.querySelectorAll('.po-menu-icon-container').length).toBe(0);
  });

  it('should call updateMenu and `validateCollapseClass` if it has not been initialized', () => {
    component['menuInitialized'] = false;
    spyOn(component, <any>'updateMenu');
    spyOn(component, <any>'validateCollapseClass');

    component.ngDoCheck();

    expect(component['updateMenu']).toHaveBeenCalled();
    expect(component['validateCollapseClass']).toHaveBeenCalled();
  });

  it('should call updateMenu when the menu items changes', () => {
    component['menuInitialized'] = true;
    spyOn(component, <any>'updateMenu');
    component.menus.push({ label: 'Com ícone', icon: 'star' });

    component.ngDoCheck();

    expect(component['updateMenu']).toHaveBeenCalled();
  });

  it('should not call updateMenu if the menu items changed, but filteringItems is true', () => {
    component['filteringItems'] = true;
    component['filter'] = true;
    component['menuInitialized'] = true;
    spyOn(component, <any>'updateMenu');
    component.menus.push({ label: 'Com ícone', icon: 'star' });

    component.ngDoCheck();

    expect(component['updateMenu']).not.toHaveBeenCalled();
  });

  it('should call updateMenu if the menu items changed and filter is false', () => {
    component['filteringItems'] = true;
    component['filter'] = false;
    component['menuInitialized'] = true;
    spyOn(component, <any>'updateMenu');
    component.menus.push({ label: 'Com ícone', icon: 'star' });

    component.ngDoCheck();

    expect(component['updateMenu']).toHaveBeenCalled();
  });

  it('should call updateMenu if the menu items changes, filter is true and filteringItems false', () => {
    component['filteringItems'] = false;
    component['filter'] = true;
    component['menuInitialized'] = true;
    spyOn(component, <any>'updateMenu');
    component.menus.push({ label: 'Com ícone', icon: 'star' });

    component.ngDoCheck();

    expect(component['updateMenu']).toHaveBeenCalled();
  });

  it('should call updateMenu if the menu items changes, but filter and filteringItems are false', () => {
    component['filteringItems'] = false;
    component['filter'] = false;
    component['menuInitialized'] = true;
    spyOn(component, <any>'updateMenu');
    component.menus.push({ label: 'Com ícone', icon: 'star' });

    component.ngDoCheck();

    expect(component['updateMenu']).toHaveBeenCalled();
  });

  it('should not call updateMenu if it has been initialized and not changed', () => {
    component['menuInitialized'] = true;
    component['menuPrevious'] = JSON.stringify(component.menus);
    spyOn(component, <any>'updateMenu');

    component.ngDoCheck();

    expect(component['updateMenu']).not.toHaveBeenCalled();
  });

  it('should call methods to update menu when the menu items changes', () => {
    spyOn(component, <any>'setMenuExtraProperties');
    spyOn(component, <any>'validateMenus');
    component['menuInitialized'] = false;
    component.menus.push({ label: 'Com ícone', icon: 'star' });

    component['updateMenu']();

    expect(component['setMenuExtraProperties']).toHaveBeenCalled();
    expect(component['validateMenus']).toHaveBeenCalled();
    expect(component.filteredItems).toEqual(component.menus);
    expect(component['menuPrevious']).toBe(JSON.stringify(component.menus));
    expect(component['menuInitialized']).toBeTruthy();
  });

  it('should set the value of menuPrevious to menuCurrent if it is null', () => {
    component['menuPrevious'] = null;
    const menuCurrent = JSON.stringify(component.menus);

    component.ngDoCheck();

    expect(component['menuPrevious']).toBe(menuCurrent);
  });

  it('itemSubscription: should `unsubscribe` `itemSubscription` on destroy.', () => {
    component['itemSubscription'] = <any>{ unsubscribe: () => {} };

    spyOn(component['itemSubscription'], <any>'unsubscribe');

    component.ngOnDestroy();

    expect(component['itemSubscription'].unsubscribe).toHaveBeenCalled();
  });

  it('should set menu item not found with `literals.itemNotFound`.', () => {
    component.noData = true;

    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-menu-item-no-data .po-menu-icon-label').innerHTML.trim()).toBe(
      component.literals.itemNotFound
    );
  });

  it('should find items that have action or link', fakeAsync(() => {
    const items = [
      { label: 'Test AA', link: 'test/' },
      { label: 'Test AB', link: 'test/' },
      { label: 'Test ABC' },
      { label: 'Test BB', link: 'test/' }
    ];

    const itemsFound = [
      { label: 'Test AA', link: 'test/' },
      { label: 'Test AB', link: 'test/' }
    ];

    const label = 'Test A';

    component.menus = items;
    component.filteredItems = [];

    component.debounceFilter(label);

    tick(500);

    expect(component.filteredItems).toEqual(itemsFound);
  }));

  it('should find items and subItems that have action or link', fakeAsync(() => {
    const action = () => {};

    const items = [
      { label: 'Test AA', link: 'test/' },
      {
        label: 'Test AB',
        link: 'test/',
        subItems: [
          {
            label: 'Test ABB',
            link: 'test/',
            subItems: [
              { label: 'Test ABBC', action },
              { label: 'Test ABBCD', action },
              { label: 'Test ABBCE', action }
            ]
          },
          { label: 'Test AABB', action },
          { label: 'Test AABBB' }
        ]
      },
      { label: 'Test ABD' },
      { label: 'Test ABF', link: 'test/', subItems: [] },
      { label: 'Test BB', link: 'test/' }
    ];

    const itemsFound = [
      { label: 'Test AA', link: 'test/' },
      { label: 'Test AB', link: 'test/', type: 'internalLink' },
      { label: 'Test ABB', link: 'test/', type: 'internalLink' },
      { label: 'Test ABBC', action },
      { label: 'Test ABBCD', action },
      { label: 'Test ABBCE', action },
      { label: 'Test AABB', action },
      { label: 'Test ABF', link: 'test/', subItems: [] }
    ];

    const label = 'Test A';

    component.menus = items;
    component.filteredItems = [];

    component.debounceFilter(label);

    tick(500);

    expect(component.filteredItems).toEqual(itemsFound);
  }));

  describe('Templates:', () => {
    it('should show collapse button if `enableCollapseButton` is enabled', () => {
      component.allowCollapseMenu = true;
      component.collapsed = false;
      component.mobileOpened = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-menu-collapse-button-icon')).toBeTruthy();
    });

    it('should hide collapse button if `enableCollapseButton` is disabled', () => {
      component.allowCollapseMenu = false;
      component.collapsed = false;
      component.mobileOpened = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-collapse-button-icon')).toBeFalsy();
    });

    it('should show menu filter if `enableCollapse` is `false`', () => {
      component.filter = true;
      spyOnProperty(component, 'enableCollapse').and.returnValue(false);

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-menu-filter')).toBeTruthy();
    });

    it('should hide menu filter if `enableCollapse` is `true`', () => {
      component.filter = true;
      spyOnProperty(component, 'enableCollapse').and.returnValue(true);

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-menu-filter')).toBeFalsy();
    });

    it('should show `po-menu-footer` if `collapsed` is `true` and `menus` are valid', () => {
      component.collapsed = true;
      component.menus = [{ label: '1', icon: 'po-icon-user', shortLabel: '123', action: () => {} }];

      fixture.detectChanges();
      const footer = fixture.debugElement.nativeElement.querySelector('.po-menu-footer');

      expect(footer).toBeTruthy();
    });

    it('should not show `po-menu-footer` if `collapsed` is `true` and `menus` are invalid', () => {
      component.collapsed = true;
      component.menus = [{ label: '1', icon: 'po-icon-user', action: () => {} }];

      fixture.detectChanges();
      const footer = fixture.debugElement.nativeElement.querySelector('.po-menu-footer');

      expect(footer).toBeNull();
    });

    it('should show the button at menu bottom if menu is collapsed', () => {
      component.allowCollapseMenu = true;
      component.collapsed = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-menu-collapse-button-icon')).toBeTruthy();
    });

    it('should keep the button at menu bottom if menu is opened.', () => {
      component.allowCollapseMenu = true;
      component.collapsed = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-menu-collapse-button-icon')).toBeTruthy();
    });

    const eventClick = document.createEvent('MouseEvents');
    eventClick.initEvent('click', false, true);

    it('should call method `toggle` if top collapse button is clicked.', () => {
      component.allowCollapseMenu = true;
      component.collapsed = false;
      component.mobileOpened = false;

      fixture.detectChanges();
      const collapseButton = nativeElement.querySelector('.po-menu-collapse-button-icon');
      spyOn(component, 'toggle');

      collapseButton.dispatchEvent(eventClick);

      fixture.detectChanges();
      expect(component.toggle).toHaveBeenCalled();
    });

    it('should call method `toggle` if bottom collapse button is clicked', () => {
      component.allowCollapseMenu = true;
      component.collapsed = true;

      fixture.detectChanges();
      const collapseButton = nativeElement.querySelector('.po-menu-collapse-button-icon');
      spyOn(component, 'toggle');

      collapseButton.dispatchEvent(eventClick);

      fixture.detectChanges();
      expect(component.toggle).toHaveBeenCalled();
    });

    it(`should show message if doesn't have menu items.`, () => {
      component.noData = true;

      fixture.detectChanges();
      const showNoData = nativeElement.querySelector('.po-menu-icon-container.po-menu-item-no-data');

      expect(showNoData).toBeTruthy();
    });

    it(`shouldn't show message if doesn't have menu items.`, () => {
      component.noData = false;

      fixture.detectChanges();
      const showNoData = nativeElement.querySelector('.po-menu-icon-container.po-menu-item-no-data');

      expect(showNoData).toBeFalsy();
    });

    it('should display `po-menu-logo` if have `logo`.', () => {
      component.logo = 'https://po-ui.io/assets/graphics/po-logo-grey.svg';

      fixture.detectChanges();

      expect(nativeElement.querySelector('img.po-menu-logo')).toBeTruthy();
      expect(nativeElement.querySelector('img.po-menu-short-logo')).toBeNull();
    });

    it('should display `po-menu-short-logo` if have `shortLogo` and `enableCollapse` is true.', () => {
      component.shortLogo = 'https://po-ui.io/assets/graphics/po-logo-grey.svg';
      spyOnProperty(component, 'enableCollapse').and.returnValue(true);

      fixture.detectChanges();

      expect(nativeElement.querySelector('img.po-menu-short-logo')).toBeTruthy();
      expect(nativeElement.querySelector('img.po-menu-logo')).toBeNull();
    });

    it('shouldn`t display `po-menu-short-logo` if have `shortLogo` but `enableCollapse` is false.', () => {
      component.shortLogo = 'https://po-ui.io/assets/graphics/po-logo-grey.svg';
      spyOnProperty(component, 'enableCollapse').and.returnValue(false);

      fixture.detectChanges();

      expect(nativeElement.querySelector('img.po-menu-short-logo')).toBeNull();
    });

    it('shouldn`t display `po-menu-short-logo` if `enableCollapse` is true but not have `shortLogo`.', () => {
      component.shortLogo = undefined;
      spyOnProperty(component, 'enableCollapse').and.returnValue(false);

      fixture.detectChanges();

      expect(nativeElement.querySelector('img.po-menu-short-logo')).toBeNull();
    });

    it('shouldn`t display `po-menu-logo` or `po-menu-short-logo` if not have `logo`, `shortLogo` and `enableCollapse` is true.', () => {
      component.logo = undefined;
      component.shortLogo = undefined;
      spyOnProperty(component, 'enableCollapse').and.returnValue(true);

      fixture.detectChanges();

      expect(nativeElement.querySelector('img.po-menu-logo')).toBeNull();
      expect(nativeElement.querySelector('img.po-menu-short-logo')).toBeNull();
    });

    it('shouldn`t display `po-menu-logo` or `po-menu-short-logo` if not have `logo`, `shortLogo` and `enableCollapse` is false.', () => {
      component.logo = undefined;
      component.shortLogo = undefined;
      spyOnProperty(component, 'enableCollapse').and.returnValue(false);

      fixture.detectChanges();

      expect(nativeElement.querySelector('img.po-menu-logo')).toBeNull();
      expect(nativeElement.querySelector('img.po-menu-short-logo')).toBeNull();
    });

    it('shouldn`t display `po-menu-logo` or `po-menu-short-logo` if the logos are defined with empty string.', () => {
      component.logo = ' ';
      component.shortLogo = ' ';
      spyOnProperty(component, 'enableCollapse').and.returnValue(true);

      fixture.detectChanges();

      expect(nativeElement.querySelector('img.po-menu-logo')).toBeNull();
      expect(nativeElement.querySelector('img.po-menu-short-logo')).toBeNull();
    });

    it('should contain `po-menu-header-template` if `enableCollapse` is false and `menuHeaderTemplate` is defined', () => {
      component.menuHeaderTemplate = <any>{ templateRef: null };

      spyOnProperty(component, 'enableCollapse').and.returnValue(false);

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-menu-header-template')).toBeTruthy();
    });

    it('shouldn`t contain `po-menu-header-template` if `enableCollapse` is true and `menuHeaderTemplate` is defined', () => {
      component.menuHeaderTemplate = <any>{ templateRef: null };

      spyOnProperty(component, 'enableCollapse').and.returnValue(true);

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-menu-header-template')).toBeFalsy();
    });

    it('shouldn`t contain `po-menu-header-template` if `enableCollapse` is false and `menuHeaderTemplate` is undefined', () => {
      component.menuHeaderTemplate = undefined;

      spyOnProperty(component, 'enableCollapse').and.returnValue(false);

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-menu-header-template')).toBeFalsy();
    });
  });

  describe('Methods:', () => {
    it(`ngOnInit: should call 'subscribeToMenuItem'`, () => {
      spyOn(component, 'subscribeToMenuItem');

      component.ngOnInit();

      expect(component['subscribeToMenuItem']).toHaveBeenCalled();
    });

    it(`ngAfterViewInit: should call 'menuGlobalService.sendApplicationMenu' with component instance`, () => {
      spyOn(component['menuGlobalService'], <any>'sendApplicationMenu');

      component.ngAfterViewInit();

      expect(component['menuGlobalService'].sendApplicationMenu).toHaveBeenCalledWith(component);
    });

    it(`ngOnDestroy: should call 'resizeListener' if has 'resizeListener`, () => {
      component['createResizeListener']();

      spyOn(component, <any>'resizeListener');
      spyOn(component['menuGlobalService'], <any>'sendRemovedApplicationMenu');

      component.ngOnDestroy();

      expect(component['resizeListener']).toHaveBeenCalled();
      expect(component['menuGlobalService'].sendRemovedApplicationMenu).toHaveBeenCalledWith(component.id);
    });

    it(`collapse: should call 'validateToggleMenu' with 'true'`, () => {
      spyOn(component, <any>'validateToggleMenu');

      component.collapse();

      expect(component['validateToggleMenu']).toHaveBeenCalledWith(true);
    });

    it(`expand: should call 'validateToggleMenu' with 'false'`, () => {
      spyOn(component, <any>'validateToggleMenu');

      component.expand();

      expect(component['validateToggleMenu']).toHaveBeenCalledWith(false);
    });

    it(`toggle: should call 'validateToggleMenu' with '!collapsed'`, () => {
      component.collapsed = true;
      spyOn(component, <any>'validateToggleMenu');

      component.toggle();

      expect(component['validateToggleMenu']).toHaveBeenCalledWith(!component.collapsed);
    });

    describe('validateToggleMenu', () => {
      it(`shouldn't call 'toggleMenuCollapse' if 'allowCollapseMenu' is 'false'`, () => {
        const collapsed = true;
        component.allowCollapseMenu = false;

        spyOn(component, <any>'toggleMenuCollapse');

        component['validateToggleMenu'](collapsed);

        expect(component['toggleMenuCollapse']).not.toHaveBeenCalled();
      });

      it(`should call 'toggleMenuCollapse' with 'collapsed' if 'allowCollapseMenu' is 'true'`, () => {
        const collapsed = false;
        component.allowCollapseMenu = true;

        spyOn(component, <any>'toggleMenuCollapse');

        component['validateToggleMenu'](collapsed);

        expect(component['toggleMenuCollapse']).toHaveBeenCalledWith(collapsed);
      });
    });

    it('toggleMenuCollapse: should set `collapsed`', () => {
      const fakeThis = {
        collapsed: true,
        validateCollapseClass: () => {},
        groupedMenuItem: undefined,
        getActiveMenuParent: () => {},
        toggleGroupedMenuItem: () => {},
        activeMenuItem: undefined,
        activateCollapseSubMenuItem: () => {},
        menuItemsService: {
          sendToChildMenuClicked: () => {}
        },
        updateMenu: () => {}
      };

      component['toggleMenuCollapse'].call(fakeThis, false);
      expect(fakeThis.collapsed).toBe(false);
    });

    it('toggleMenuCollapse: should call `updateMenu`', () => {
      const fakeThis = {
        collapsed: true,
        validateCollapseClass: () => {},
        groupedMenuItem: undefined,
        getActiveMenuParent: () => {},
        toggleGroupedMenuItem: () => {},
        activeMenuItem: undefined,
        activateCollapseSubMenuItem: () => {},
        menuItemsService: {
          sendToChildMenuClicked: () => {}
        },
        updateMenu: () => {}
      };

      spyOn(fakeThis, 'updateMenu');

      component['toggleMenuCollapse'].call(fakeThis);

      expect(fakeThis.updateMenu).toHaveBeenCalled();
    });

    it(`toggleMenuCollapse: should call 'toggleGroupedMenuItem' and 'getActiveMenuParent' if 'groupedMenuItem'
      and 'activeMenuItem' are defined`, () => {
      const fakeThis = {
        collapsed: true,
        validateCollapseClass: () => {},
        groupedMenuItem: { label: 'menu' },
        getActiveMenuParent: () => {},
        toggleGroupedMenuItem: () => {},
        activeMenuItem: { label: 'active menu' },
        activateCollapseSubMenuItem: () => {},
        menuItemsService: {
          sendToChildMenuClicked: () => {}
        },
        updateMenu: () => {}
      };

      spyOn(fakeThis, 'toggleGroupedMenuItem');
      spyOn(fakeThis, 'getActiveMenuParent');

      component['toggleMenuCollapse'].call(fakeThis);

      expect(fakeThis.toggleGroupedMenuItem).toHaveBeenCalled();
      expect(fakeThis.getActiveMenuParent).toHaveBeenCalled();
    });

    it(`toggleMenuCollapse: shouldn't call 'toggleGroupedMenuItem' and 'getActiveMenuParent' if 'groupedMenuItem'
      is undefined`, () => {
      const fakeThis = {
        collapsed: true,
        validateCollapseClass: () => {},
        groupedMenuItem: undefined,
        getActiveMenuParent: () => {},
        toggleGroupedMenuItem: () => {},
        activeMenuItem: { label: 'active menu' },
        activateCollapseSubMenuItem: () => {},
        menuItemsService: {
          sendToChildMenuClicked: () => {}
        },
        updateMenu: () => {}
      };

      spyOn(fakeThis, 'toggleGroupedMenuItem');
      spyOn(fakeThis, 'getActiveMenuParent');

      component['toggleMenuCollapse'].call(fakeThis);

      expect(fakeThis.toggleGroupedMenuItem).not.toHaveBeenCalled();
      expect(fakeThis.getActiveMenuParent).not.toHaveBeenCalled();
    });

    it(`toggleMenuCollapse: shouldn't call 'toggleGroupedMenuItem' and 'getActiveMenuParent' if 'activeMenuItem'
      is undefined`, () => {
      const fakeThis = {
        collapsed: true,
        validateCollapseClass: () => {},
        groupedMenuItem: { label: 'menu' },
        getActiveMenuParent: () => {},
        toggleGroupedMenuItem: () => {},
        activeMenuItem: undefined,
        updateMenu: () => {}
      };

      spyOn(fakeThis, 'toggleGroupedMenuItem');
      spyOn(fakeThis, 'getActiveMenuParent');

      component['toggleMenuCollapse'].call(fakeThis);

      expect(fakeThis.toggleGroupedMenuItem).not.toHaveBeenCalled();
      expect(fakeThis.getActiveMenuParent).not.toHaveBeenCalled();
    });

    it(`toggleMenuCollapse: shouldn't call 'toggleGroupedMenuItem' and 'getActiveMenuParent' if 'activeMenuItem'
      and 'groupedMenuItem' are undefined`, () => {
      const fakeThis = {
        collapsed: true,
        validateCollapseClass: () => {},
        groupedMenuItem: undefined,
        getActiveMenuParent: () => {},
        toggleGroupedMenuItem: () => {},
        activeMenuItem: undefined,
        updateMenu: () => {}
      };

      spyOn(fakeThis, 'toggleGroupedMenuItem');
      spyOn(fakeThis, 'getActiveMenuParent');

      component['toggleMenuCollapse'].call(fakeThis);

      expect(fakeThis.toggleGroupedMenuItem).not.toHaveBeenCalled();
      expect(fakeThis.getActiveMenuParent).not.toHaveBeenCalled();
    });

    it('toggleMenuCollapse: should call `activateCollapseSubMenuItem` and `sendToChildMenuClicked` if has `activeMenuItem`', () => {
      const fakeThis = {
        collapsed: true,
        validateCollapseClass: () => {},
        groupedMenuItem: undefined,
        activeMenuItem: { label: 'active menu' },
        activateCollapseSubMenuItem: () => {},
        menuItemsService: {
          sendToChildMenuClicked: arg => {}
        },
        updateMenu: () => {}
      };

      spyOn(fakeThis, 'activateCollapseSubMenuItem');
      spyOn(fakeThis.menuItemsService, 'sendToChildMenuClicked');

      component['toggleMenuCollapse'].call(fakeThis);

      expect(fakeThis.activateCollapseSubMenuItem).toHaveBeenCalled();
      expect(fakeThis.menuItemsService.sendToChildMenuClicked).toHaveBeenCalledWith({
        active: fakeThis.activeMenuItem,
        grouped: fakeThis.groupedMenuItem,
        activatedByRoute: true
      });
    });

    it(`toggleMenuCollapse: shouldn't call 'activateCollapseSubMenuItem' and 'sendToChildMenuClicked' if
      'activeMenuItem' is undefined`, () => {
      const fakeThis = {
        collapsed: true,
        validateCollapseClass: () => {},
        groupedMenuItem: undefined,
        activeMenuItem: undefined,
        activateCollapseSubMenuItem: () => {},
        menuItemsService: {
          sendToChildMenuClicked: () => {}
        },
        updateMenu: () => {}
      };

      spyOn(fakeThis, 'activateCollapseSubMenuItem');
      spyOn(fakeThis.menuItemsService, 'sendToChildMenuClicked');

      component['toggleMenuCollapse'].call(fakeThis);

      expect(fakeThis.activateCollapseSubMenuItem).not.toHaveBeenCalled();
      expect(fakeThis.menuItemsService.sendToChildMenuClicked).not.toHaveBeenCalled();
    });

    it(`toggleMenuMobile: should call 'validateCollapseClass' with 'collapsedMobile'`, () => {
      component.collapsed = true;
      component.collapsedMobile = true;

      spyOn(component, <any>'validateCollapseClass');

      component.toggleMenuMobile();

      expect(component['validateCollapseClass']).toHaveBeenCalledWith(component.collapsedMobile);
    });

    it(`toggleMenuMobile: should set 'collapsedMobile' to 'true' if 'collapsed' is true and 'mobileOpened' is 'false'`, () => {
      component.collapsed = true;
      component.mobileOpened = false;

      component.toggleMenuMobile();

      expect(component.collapsedMobile).toBe(true);
    });

    it(`toggleMenuMobile: should set 'collapsedMobile' to 'false' if 'collapsed' is 'false'`, () => {
      component.collapsed = false;
      component.mobileOpened = true;

      component.toggleMenuMobile();

      expect(component.collapsedMobile).toBe(false);
    });

    it(`toggleMenuMobile: should set 'collapsedMobile' to 'false' if 'mobileOpened' is 'true'`, () => {
      component.collapsed = true;
      component.mobileOpened = true;

      component.toggleMenuMobile();

      expect(component.collapsedMobile).toBe(false);
    });

    it(`toggleMenuMobile: should set 'menuMobileOpened' to true and call 'createResizeListener' if 'isMobile' is 'false'`, () => {
      spyOn(component, <any>'createResizeListener');
      spyOn(utilsFunctions, <any>'isMobile').and.returnValue(false);

      component.toggleMenuMobile();

      expect(component.mobileOpened).toBe(true);
      expect(component['createResizeListener']).toHaveBeenCalled();
    });

    it(`toggleMenuMobile: should set 'menuMobileOpened' to true and doesn't call 'createResizeListener' if 'isMobile' is 'true'`, () => {
      spyOn(component, <any>'createResizeListener');
      spyOn(utilsFunctions, <any>'isMobile').and.returnValue(true);

      component.toggleMenuMobile();

      expect(component.mobileOpened).toBe(true);
      expect(component['createResizeListener']).not.toHaveBeenCalled();
    });

    it(`toggleMenuMobile: should set 'menuMobileOpened' to false and doesn't call 'createResizeListener'`, () => {
      component.mobileOpened = true;

      spyOn(utilsFunctions, <any>'isMobile').and.returnValue(false);
      spyOn(component, <any>'createResizeListener');

      component.toggleMenuMobile();

      expect(component.mobileOpened).toBe(false);
      expect(component['createResizeListener']).not.toHaveBeenCalled();
    });

    it('toggleGroupedMenuItem: should show submenu items if `collapsed` is false and `allowCollapseMenu` is true', () => {
      const fakeThis = {
        groupedMenuItem: {
          isOpened: true
        },
        collapsed: false,
        allowCollapseMenu: true
      };

      component['toggleGroupedMenuItem'].call(fakeThis);

      expect(fakeThis.groupedMenuItem.isOpened).toBe(true);
    });

    it('toggleGroupedMenuItem: should hide submenu items if `collapsed` and `allowCollapseMenu` are true', () => {
      const fakeThis = {
        groupedMenuItem: {
          isOpened: true
        },
        collapsed: true,
        allowCollapseMenu: true
      };

      component['toggleGroupedMenuItem'].call(fakeThis);

      expect(fakeThis.groupedMenuItem.isOpened).toBe(false);
    });

    it(`toggleResize: should set 'mobileOpened' and 'collapsedMobile' to 'false' and call 'validateCollapseClass'
        if 'mobileOpened' is 'true'`, () => {
      component.mobileOpened = true;

      spyOn(component, <any>'validateCollapseClass');

      component['toggleResize']();

      expect(component.mobileOpened).toBe(false);
      expect(component.collapsedMobile).toBe(false);
      expect(component['validateCollapseClass']).toHaveBeenCalled();
    });

    it(`toggleResize: shouldn't call 'validateCollapseClass' if 'mobileOpened' is 'false'`, () => {
      component.mobileOpened = false;

      spyOn(component, <any>'validateCollapseClass');

      component['toggleResize']();

      expect(component['validateCollapseClass']).not.toHaveBeenCalled();
    });

    it('validateCollapseClass: should add class `po-collapsed-menu` if `isCollapsed` is `true`', () => {
      spyOnProperty(component, 'isCollapsed').and.returnValue(true);

      component['validateCollapseClass']();

      expect(component['element'].nativeElement.parentNode.classList).toContain('po-collapsed-menu');
    });

    it('validateCollapseClass: shouldn`t have class `po-collapsed-menu` if `isCollapsed` is `false`', () => {
      spyOnProperty(component, 'isCollapsed').and.returnValue(false);

      component['validateCollapseClass']();

      expect(component['element'].nativeElement.parentNode.classList).not.toContain('po-collapsed-menu');
    });

    it('validateCollapseClass: shouldn`t have class `po-collapsed-menu` if `collapsedMobile` is `true`', () => {
      const collapsedMobile = true;

      component['validateCollapseClass'](collapsedMobile);

      expect(component['element'].nativeElement.parentNode.classList).not.toContain('po-collapsed-menu');
    });

    it('validateCollapseClass: should add class `po-collapsed-menu` if `isCollapsed` is `true` and `collapsedMobile` is `false` ', () => {
      const collapsedMobile = false;
      spyOnProperty(component, 'isCollapsed').and.returnValue(true);

      component['validateCollapseClass'](collapsedMobile);

      expect(component['element'].nativeElement.parentNode.classList).toContain('po-collapsed-menu');
    });

    it('groupMenuItem: should call method `toggleMenuCollapse` if menu is collapsed', () => {
      component.collapsed = true;
      spyOn(component, <any>'toggleMenuCollapse');

      component['groupMenuItem'](component.menus[1]);

      expect(component['toggleMenuCollapse']).toHaveBeenCalled();
    });

    it('groupMenuItem: shouldn`t call method `toggleMenuCollapse` if menu is open', () => {
      component.collapsed = false;
      spyOn(component, <any>'toggleMenuCollapse');

      component['groupMenuItem'](component.menus[1]);

      expect(component['toggleMenuCollapse']).not.toHaveBeenCalled();
    });

    it('findRootParent: should return parent root of fourth level menu', () => {
      const subItem = component.menus[5].subItems[0].subItems[0].subItems[1];
      const parentRootLabel = 'Level 1.1';

      const parentRoot = component['findRootParent'](component.menus, subItem);
      expect(parentRoot.label).toBe(parentRootLabel);
    });

    it('findRootParent: should return parent root of second level menu', () => {
      const subItem = component.menus[1].subItems[0];
      const parentRootLabel = 'sub PO';

      const parentRoot = component['findRootParent'](component.menus, subItem);
      expect(parentRoot.label).toBe(parentRootLabel);
    });

    it('activateCollapseSubMenuItem: should call `clearGroupMenuIfFirstLevel` with `activeMenuItem`', () => {
      const activeMenuItem = { label: 'menu', level: 0 };
      component.activeMenuItem = activeMenuItem;
      fixture.detectChanges();

      spyOn(component, <any>'clearGroupMenuIfFirstLevel');

      component['activateCollapseSubMenuItem']();

      expect(component['clearGroupMenuIfFirstLevel']).toHaveBeenCalled();
    });

    it('activateCollapseSubMenuItem: should call `openParentMenu` with `activeMenuItem` if menu isn`t collapsed and has a subitem active', () => {
      component.collapsed = false;
      component.activeMenuItem = <any>{ label: 'test', level: 2 };
      component.groupedMenuItem = <any>{ label: 'test', level: 1 };

      spyOn(component, <any>'openParentMenu');

      component['activateCollapseSubMenuItem']();

      expect(component['openParentMenu']).toHaveBeenCalledWith(component.activeMenuItem);
    });

    it('areSubMenus: should return true if all menu levels are greater than `poMenuRootLevel`', () => {
      const menus = [
        { label: 'menu', level: 2 },
        { label: 'menu', level: 3 },
        { label: 'menu', level: 4 },
        { label: 'menu', level: 2 }
      ];

      expect(component['areSubMenus'](menus)).toBe(true);
    });

    it('areSubMenus: should return false if one or more menu levels are greater than `poMenuRootLevel`', () => {
      const menus = [
        { label: 'menu', level: 1 },
        { label: 'menu', level: 3 },
        { label: 'menu', level: 4 },
        { label: 'menu', level: 1 }
      ];

      expect(component['areSubMenus'](menus)).toBe(false);
    });

    it('clearGroupMenuIfFirstLevel: should clear `groupedMenuItem` if `activeMenuItem` level is equal root level', () => {
      const activeMenu = { label: 'menu', level: 1 };
      const fakeThis = {
        groupedMenuItem: { label: 'test', level: 1 }
      };

      component['clearGroupMenuIfFirstLevel'].call(fakeThis, activeMenu);

      expect(fakeThis.groupedMenuItem).toBeUndefined();
    });

    it('clearGroupMenuIfFirstLevel: shouldn`t clear `groupedMenuItem` if `activeMenuItem` level isn`t equal root level', () => {
      const activeMenu = { label: 'menu', level: 2 };
      const fakeThis = {
        groupedMenuItem: { label: 'test', level: 1 }
      };

      component['clearGroupMenuIfFirstLevel'].call(fakeThis, activeMenu);

      expect(fakeThis.groupedMenuItem).toEqual({ label: 'test', level: 1 });
    });

    it(`createResizeListener: should call 'toggleResize' and 'resizeListener' if window is resized`, () => {
      component['createResizeListener']();

      spyOn(component, <any>'toggleResize');
      spyOn(component, <any>'resizeListener');

      window.dispatchEvent(new Event('resize'));

      expect(component['toggleResize']).toHaveBeenCalled();
      expect(component['resizeListener']).toHaveBeenCalled();
    });

    it('groupMenuItem: should call `activateMenuItem` if opened menu has a sub item level activated', () => {
      const activeMenu = component.menus[5].subItems[0].subItems[0].subItems[1];
      const groupedMenu = component.menus[5];

      component.activeMenuItem = activeMenu;
      component.groupedMenuItem = groupedMenu;

      spyOn(component, <any>'activateMenuItem');
      spyOn(component, <any>'isRootMenuEqualGroupedMenu').and.returnValue(true);

      component['groupMenuItem'](groupedMenu);

      expect(component['activateMenuItem']).toHaveBeenCalled();
    });

    it('groupMenuItem: shouldn`t call `activateMenuItem` if opened menu doesn`t have a sub item level activated', () => {
      const activeMenu = component.menus[5].subItems[0].subItems[0].subItems[1];
      const groupedMenu = component.menus[5].subItems[0];

      component.activeMenuItem = activeMenu;
      component.groupedMenuItem = groupedMenu;

      spyOn(component, <any>'activateMenuItem');
      spyOn(component, <any>'isRootMenuEqualGroupedMenu').and.returnValue(false);

      component['groupMenuItem'](groupedMenu);

      expect(component['activateMenuItem']).not.toHaveBeenCalled();
    });

    it('isRootMenuEqualGroupedMenu: should return true if `activeMenuItem` root parent is `groupedMenuItem`', () => {
      const activeMenuItem = { label: 'active menu', id: '1', level: 2 };
      const groupedMenuItem = { label: 'grouped menu', id: '2', level: 1, subItems: [activeMenuItem] };

      expect(component['isRootMenuEqualGroupedMenu']([groupedMenuItem], activeMenuItem, groupedMenuItem)).toBe(true);
    });

    it('isRootMenuEqualGroupedMenu: should return false if `activeMenuItem` root parent isn`t `groupedMenuItem`', () => {
      const activeMenuItem = { label: 'active menu', id: '1', level: 3 };
      const groupedMenuItem = { label: 'grouped menu', id: '2', level: 2, subItems: [activeMenuItem] };
      const rootMenuItem = { label: 'root menu', id: '3', level: 1, subItems: [groupedMenuItem] };

      expect(component['isRootMenuEqualGroupedMenu']([rootMenuItem], activeMenuItem, groupedMenuItem)).toBe(false);
    });

    it('getActiveMenuParent: should return active menu root parent if it`s a subMenu', () => {
      const activeMenuItem = { label: 'active menu', id: '1', level: 3 };
      const groupedMenuItem = { label: 'grouped menu', id: '2', level: 2, subItems: [activeMenuItem] };
      const rootMenuItem = { label: 'root menu', id: '3', level: 1, subItems: [groupedMenuItem] };

      const rootParent = component['getActiveMenuParent']([rootMenuItem], activeMenuItem, groupedMenuItem);
      expect(rootParent).toBe(rootMenuItem);
    });

    it('getActiveMenuParent: should return undefined if active item is not a subMenu', () => {
      const activeMenuItem = { label: 'active menu', id: '1', level: 1 };
      const groupedMenuItem = { label: 'grouped menu', id: '2', level: 2 };

      const rootParent = component['getActiveMenuParent']([groupedMenuItem], activeMenuItem, groupedMenuItem);
      expect(rootParent).toBeUndefined();
    });

    // TODO Ng V9
    xit('checkingRouterChildrenFragments: should return the router url value if router contains a `.children[`primary`]` value', done => {
      fixture.ngZone.run(() => {
        router.navigate(['/search']).then(() => {
          const routerFragment = component['checkingRouterChildrenFragments']();
          expect(routerFragment).toEqual('/search');
          done();
        });
      });
    });

    // TODO Ng V9
    xit('checkingRouterChildrenFragments: should return undefined if router doens`t have a `.children[`primary`]` value', () => {
      const routerFragment = component['checkingRouterChildrenFragments']();
      expect(routerFragment).toEqual('');
    });

    it('activateMenuByUrl: should call `activateMenuItem` and `getFormattedLink` if urlPath and menu.link have same value', done => {
      const urlPath = '/search';
      spyOn(component, <any>'activateMenuItem');

      fixture.ngZone.run(() => {
        router.navigate(['/search']).then(() => {
          component.activateMenuByUrl(urlPath, component.menus);
          expect(component['activateMenuItem']).toHaveBeenCalled();
          expect(component.linkActive).toBe(urlPath);
          done();
        });
      });
    });

    it('convertToMenuItemFiltered: should return only { link, label } if `menuItem` is an object with others properties', () => {
      const expectedValue = { label: 'Menu 1', link: 'menu1' };
      const menuItem = { icon: 'copy', label: 'Menu 1', link: 'menu1' };

      const spySetMenuItemProperties = spyOn(component, <any>'setMenuItemProperties');

      const menuItemFiltered = component['convertToMenuItemFiltered'](menuItem);

      expect(menuItemFiltered).toEqual(expectedValue);
      expect(spySetMenuItemProperties).toHaveBeenCalled();
    });

    it('convertToMenuItemFiltered: should return { link: ``, label: `` } if `menuItem` is undefined', () => {
      const menuItem = undefined;

      const spySetMenuItemProperties = spyOn(component, <any>'setMenuItemProperties');

      const menuItemFiltered = component['convertToMenuItemFiltered'](menuItem);

      expect(menuItemFiltered).toEqual(<any>{ label: '', link: '' });
      expect(spySetMenuItemProperties).toHaveBeenCalled();
    });

    it('filterLocalItems: should call `findItems` and return filtered items', () => {
      const foundMenus = [
        { label: 'Account', link: '/account' },
        { label: 'Company Account', link: '/companyAccount' }
      ];

      const notFoundMenus = [{ label: 'Test', link: '/test' }];

      const menus = [...foundMenus, ...notFoundMenus];
      const filter = 'acc';

      component.menus = menus;

      spyOn(component, <any>'findItems').and.callThrough();

      const filteredItems = component['filterLocalItems'](filter);

      expect(filteredItems).toEqual(foundMenus);
      expect(component['findItems']).toHaveBeenCalled();
    });

    it('filterOnService: should call `getFilteredData` and return filtered menu itens from service', async () => {
      const menuItems = [{ label: 'Menu', link: '/menu' }];
      const search = 'menu';

      component.service = 'http://po.com.br/api';

      const spyGetFilteredData = spyOn(component.filterService, 'getFilteredData').and.returnValue(of(menuItems));

      const filteredMenuItens = await component['filterOnService'](search);

      expect(filteredMenuItens.length).toBe(menuItems.length);
      expect(spyGetFilteredData).toHaveBeenCalledWith(search, component.params);
    });

    it('filterOnService: shouldn`t call `getFilteredData` and return `filteredMenuItens`', async () => {
      const menuItems = [{ label: 'Menu', link: '/menu' }];
      const search = undefined;

      component.filteredItems = [...menuItems];

      component.service = 'http://po.com.br/api';

      const spyGetFilteredData = spyOn(component.filterService, 'getFilteredData');

      const filteredMenuItens = await component['filterOnService'](search);

      expect(filteredMenuItens).toEqual(component.filteredItems);
      expect(spyGetFilteredData).not.toHaveBeenCalled();
    });

    it(`filterItems: shouldn't call 'filterLocalItems' and 'filterOnService' if 'trimFilter' is empty`, () => {
      const filter = '';
      const menus = [{ label: 'Menu 1', link: '/menu1' }];

      component.menus = menus;

      spyOn(component, <any>'filterOnService');
      spyOn(component, <any>'filterLocalItems');

      component['filterItems'](filter);

      expect(component['filteringItems']).toBe(false);
      expect(component['filteredItems']).toEqual(menus);

      expect(component['filterOnService']).not.toHaveBeenCalled();
      expect(component['filterLocalItems']).not.toHaveBeenCalled();
    });

    it('filterItems: should call `filterLocalItems` and not call `filterOnService` and set `filteredItems`', () => {
      const filter = 'men';
      const foundMenus = [{ label: 'Menu 1', link: '/menu1' }];
      const notFoundMenus = [{ label: 'Test', link: '/test' }];
      const menus = [...foundMenus, ...notFoundMenus];

      component.menus = menus;
      component.filterService = undefined;

      const spyFilterLocalItems = spyOn(component, <any>'filterLocalItems').and.returnValue(foundMenus);
      const spyFilterOnService = spyOn(component, <any>'filterOnService');

      component['filterItems'](filter);

      expect(component['filteringItems']).toBe(true);
      expect(component['filteredItems']).toEqual(foundMenus);

      expect(spyFilterLocalItems).toHaveBeenCalled();
      expect(spyFilterOnService).not.toHaveBeenCalled();
    });

    it('filterItems: should call `filterOnService` and not call `filterLocalItems` and set `filteredItems`', async () => {
      const filter = 'men';
      const foundMenus = [{ label: 'Menu 1', link: '/menu1' }];
      const notFoundMenus = [{ label: 'Test', link: '/test' }];
      const menus = [...foundMenus, ...notFoundMenus];

      component.menus = menus;
      component.service = 'http://po.com.br';

      const spyFilterOnService = spyOn(component, <any>'filterOnService').and.returnValue(Promise.resolve(foundMenus));
      const spyFilterLocalItems = spyOn(component, <any>'filterLocalItems');

      await component['filterItems'](filter);

      expect(component['filteringItems']).toBe(true);
      expect(component['filteredItems']).toEqual(foundMenus);

      expect(spyFilterOnService).toHaveBeenCalled();
      expect(spyFilterLocalItems).not.toHaveBeenCalled();
    });

    it(`filterProcess: should set 'filterLoading' to false call 'showNoData', 'changeDetector.detectChanges' and
      'sendToChildMenuClicked' when the return of 'filterItems' promise is resolved`, fakeAsync(() => {
      spyOn(component, <any>'showNoData');
      spyOn(component['changeDetector'], 'detectChanges');
      spyOn(component['menuItemsService'], 'sendToChildMenuClicked');
      spyOn(component, <any>'filterItems').and.returnValue(Promise.resolve());

      component['filterProcess']('filter');

      tick(100);

      expect(component['showNoData']).toHaveBeenCalled();
      expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
      expect(component['menuItemsService'].sendToChildMenuClicked).toHaveBeenCalled();
      expect(component.filterLoading).toBe(false);
    }));

    it(`filterProcess: should set 'filterLoading' to false when the return of 'filterItems' promise is rejected`, () => {
      const error = 'error value';

      const fakeThis = {
        filterItems: () => ({ then: () => ({ catch: callback => callback(error) }) })
      };

      spyOn(Promise, 'reject');

      component['filterProcess'].call(fakeThis);

      expect(component.filterLoading).toBe(false);
      expect(Promise.reject).toHaveBeenCalledWith(error);
    });

    it(`filterProcess: should set 'filterLoading' to true when 'filterProcess' is called`, () => {
      component.filterLoading = false;

      spyOn(component, <any>'filterItems').and.callFake(() => {
        return { then: () => ({ catch: () => {} }) };
      });

      component['filterProcess']('filter');

      expect(component.filterLoading).toBe(true);
    });

    it(`showNoData: should set 'noData' to true if doesn't menu items`, () => {
      component.filteredItems = [];

      component['showNoData']();

      expect(component.noData).toBe(true);
    });

    it(`showNoData: should set 'noData' to false if has menu items`, () => {
      component.filteredItems = [{ link: '/', label: 'home' }];

      component['showNoData']();

      expect(component.noData).toBe(false);
    });
  });

  describe('Properties:', () => {
    it('enableCollapseButton: should be true if `allowCollapseMenu` is true and `collapsed` and `mobileOpened` are false', () => {
      component.allowCollapseMenu = true;
      component.collapsed = false;
      component.mobileOpened = false;

      expect(component.enableCollapseButton).toBe(true);
    });

    it('enableCollapseButton: should be false if menu isn`t allowed to collapse', () => {
      component.allowCollapseMenu = false;
      component.collapsed = false;
      component.mobileOpened = false;

      expect(component.enableCollapseButton).toBe(false);
    });

    it(`hasFooter: should return 'true' if 'enableCollapseButton' and 'enableCollapse' are 'true'`, () => {
      spyOnProperty(component, 'enableCollapseButton').and.returnValue(true);
      spyOnProperty(component, 'enableCollapse').and.returnValue(true);

      expect(component.hasFooter).toBe(true);
    });

    it(`hasFooter: should return 'true' if 'enableCollapseButton' is 'true' and 'enableCollapse' is 'false'`, () => {
      spyOnProperty(component, 'enableCollapseButton').and.returnValue(true);
      spyOnProperty(component, 'enableCollapse').and.returnValue(false);

      expect(component.hasFooter).toBe(true);
    });

    it(`hasFooter: should return 'true' if 'enableCollapseButton' is 'false' and 'enableCollapse' is 'true'`, () => {
      spyOnProperty(component, 'enableCollapseButton').and.returnValue(false);
      spyOnProperty(component, 'enableCollapse').and.returnValue(true);

      expect(component.hasFooter).toBe(true);
    });

    it(`hasFooter: should return 'false' if 'enableCollapseButton' and 'enableCollapse' are 'false'`, () => {
      spyOnProperty(component, 'enableCollapseButton').and.returnValue(false);
      spyOnProperty(component, 'enableCollapse').and.returnValue(false);

      expect(component.hasFooter).toBe(false);
    });

    it(`isCollapsed: should return 'true' if 'allowCollapseMenu' and 'collapsed' are 'true'`, () => {
      component.allowCollapseMenu = true;
      component.collapsed = true;

      expect(component.isCollapsed).toBe(true);
    });

    it(`isCollapsed: should return 'false' if 'allowCollapseMenu' and 'collapsed' are 'false'`, () => {
      component.allowCollapseMenu = false;
      component.collapsed = false;

      expect(component.isCollapsed).toBe(false);
    });
  });
});

function fakeMenuService(item) {
  const observer = new Observable(obs => {
    obs.next(item);
    obs.complete();
  });

  return {
    receiveFromChildMenuClicked: () => observer,
    sendToChildMenuClicked: param => {}
  };
}
