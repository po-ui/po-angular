import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { configureTestSuite } from 'projects/ui/src/lib/util-test/util-expect.spec';

import { PoNavbarActionsModule } from './po-navbar-actions/po-navbar-actions.module';
import { PoNavbarItemsModule } from './po-navbar-items/po-navbar-items.module';
import { PoNavbarItemNavigationModule } from './po-navbar-item-navigation/po-navbar-item-navigation.module';
import { PoMenuModule } from '../po-menu/po-menu.module';
import { PoNavbarLogoComponent } from './po-navbar-logo/po-navbar-logo.component';
import { PoNavbarComponent } from './po-navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { changeBrowserInnerWidth } from 'projects/templates/src/lib/util-test/util-expect.spec';

describe('PoNavbarComponent:', () => {
  let component: PoNavbarComponent;
  let fixture: ComponentFixture<PoNavbarComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoNavbarComponent, PoNavbarLogoComponent],
      imports: [
        BrowserAnimationsModule,
        PoNavbarActionsModule,
        PoNavbarItemsModule,
        PoNavbarItemNavigationModule,
        PoMenuModule,
        RouterModule.forRoot([])
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoNavbarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoNavbarComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('navbarItemNavigationDisableLeft: should return true if offset is equal to 0`', () => {
      component['offset'] = 0;

      expect(component.navbarItemNavigationDisableLeft).toBe(true);
    });

    it('navbarItemNavigationDisableLeft: should return undefined if offset is different to 0`', () => {
      component['offset'] = 10;

      expect(component.navbarItemNavigationDisableLeft).toBe(false);
    });

    it('navbarItemNavigationDisableRight: should return true if disableRight is true and offset is different to 0`', () => {
      component['offset'] = 10;
      component.disableRight = true;

      expect(component.navbarItemNavigationDisableRight).toBe(true);
    });

    it('navbarItemNavigationDisableRight: should return false if disableRight is false`', () => {
      component.disableRight = false;

      expect(component.navbarItemNavigationDisableRight).toBe(false);
    });

    it('navbarItemNavigationDisableRight: should return false if disableRight is true and offset is equal to 0`', () => {
      component.disableRight = true;
      component['offset'] = 0;

      expect(component.navbarItemNavigationDisableRight).toBe(false);
    });
  });

  describe('Methods:', () => {
    describe('ngAfterViewInit', () => {
      it('should call `displayItemsNavigation`', () => {
        spyOn(component, <any>'displayItemsNavigation');

        component.ngAfterViewInit();

        expect(component['displayItemsNavigation']).toHaveBeenCalled();
      });

      it('should call `initNavbarMenu` if has `menu`', () => {
        spyOn(component, <any>'initNavbarMenu');
        component.menu = <any>{ menus: [] };

        component.ngAfterViewInit();

        expect(component['initNavbarMenu']).toHaveBeenCalled();
      });

      it('shouldn`t call `initNavbarMenu` if doesn`t have `menu`', () => {
        spyOn(component, <any>'initNavbarMenu');
        component.menu = undefined;

        component.ngAfterViewInit();

        expect(component['initNavbarMenu']).not.toHaveBeenCalled();
      });
    });

    it('ngOnDestroy: should call `mediaQuery.removeListener` if has `mediaQuery` listener', () => {
      component['mediaQuery'] = { removeListener: () => {} };

      spyOn(component['mediaQuery'], 'removeListener');

      component.ngOnDestroy();

      expect(component['mediaQuery']['removeListener']).toHaveBeenCalled();
    });

    describe('navigateItems', () => {
      it('should call `navigateLeft` if orientation is `left`', () => {
        const orientation = 'left';

        spyOn(component, <any>'navigateLeft');

        component.navigateItems(orientation);

        expect(component['navigateLeft']).toHaveBeenCalled();
      });

      it('should call `navigateRight` if orientation isn`t `left`', () => {
        const orientation = 'right';

        spyOn(component, <any>'navigateRight');

        component.navigateItems(orientation);

        expect(component['navigateRight']).toHaveBeenCalled();
      });

      it('should call `animate` with `offset`', () => {
        const orientation = 'right';

        spyOn(component, <any>'animate');

        component.navigateItems(orientation);

        expect(component['animate']).toHaveBeenCalledWith(component['offset']);
      });
    });

    it(`allNavbarItemsWidth: should return the sum of the width of all items`, () => {
      const fakeThis = {
        navbarItems: {
          allNavbarItems: [
            {
              nativeElement: {
                offsetWidth: 10
              }
            },
            {
              nativeElement: {
                offsetWidth: 25
              }
            }
          ]
        }
      };

      expect(component['allNavbarItemsWidth'].call(fakeThis)).toBe(35);
    });

    it(`animate: should call 'buildTransitionAnimation' with offset if has elements`, () => {
      const offset = 400;

      spyOn(component, <any>'buildTransitionAnimation').and.callThrough();

      component['animate'](offset);

      expect(component['buildTransitionAnimation']).toHaveBeenCalledWith(offset);
    });

    it(`buildTransitionAnimation: should call builder`, () => {
      const offset = 400;

      spyOn(component['builder'], 'build').and.callThrough();

      component['buildTransitionAnimation'](offset);

      expect(component['builder'].build).toHaveBeenCalled();
    });

    describe('changeNavbarMenuItems', () => {
      it('should set `menus` with `menuItems` if `isCollapsedMedia` is `false`', () => {
        const isCollapsedMedia = false;
        const menuItems = [{ label: 'menu' }];

        component.menu = <any>{ menus: [] };

        component['changeNavbarMenuItems'](isCollapsedMedia, menuItems, [], '');

        expect(component.menu.menus).toEqual(menuItems);
      });

      it('should set `menu.menus` with `navbarItems`, `menuItems` and label if `isCollapsedMedia` is `true`', () => {
        const isCollapsedMedia = true;
        const menuItems = [{ label: 'menu' }];
        const navbarItems = [{ label: 'navbar' }];
        const label = 'Navbar Links';

        const expectedResult = [{ label, subItems: navbarItems }, ...menuItems];

        component.menu = <any>{ menus: [] };

        component['changeNavbarMenuItems'](isCollapsedMedia, menuItems, navbarItems, label);

        expect(component.menu.menus).toEqual(expectedResult);
      });
    });

    describe('calculateLeftNavigation', () => {
      it('should return `undefined` if `offset` is greater than `navbarItemOffset`', () => {
        const expectedResult = undefined;

        component['offset'] = 1000;

        const fakeNavbarItems = {
          allNavbarItems: [{ nativeElement: { offsetLeft: 10, offsetWidth: 15 } }]
        };

        component.navbarItems = <any>fakeNavbarItems;

        expect(component['calculateLeftNavigation']()).toBe(expectedResult);
      });

      it('should return calculated value if `offset` is less than `navbarItemOffset`', () => {
        const expectedResult = -175;

        component['offset'] = 5;

        spyOn(component, <any>'navbarItemsWidth').and.returnValue(200);

        const fakeNavbarItems = {
          allNavbarItems: [{ nativeElement: { offsetLeft: 10, offsetWidth: 15 } }]
        };

        component.navbarItems = <any>fakeNavbarItems;

        expect(component['calculateLeftNavigation']()).toBe(expectedResult);
      });
    });

    describe('calculateRightNavigation', () => {
      it('should return `undefined` if `itemBreakpoint` is greater than `finalPosition`', () => {
        const expectedResult = undefined;
        const fakeItemBreakpoint = 500;

        const fakeNavbarItems = {
          allNavbarItems: [{ nativeElement: { offsetLeft: 10, offsetWidth: 15 } }]
        };

        component.navbarItems = <any>fakeNavbarItems;

        expect(component['calculateRightNavigation'](fakeItemBreakpoint)).toBe(expectedResult);
      });

      it('should return `offsetLeft` value if `itemBreakpoint` is less than `finalPosition`', () => {
        const expectedResult = 10;
        const fakeItemBreakpoint = 8;

        const fakeNavbarItems = {
          allNavbarItems: [{ nativeElement: { offsetLeft: 10, offsetWidth: 15 } }]
        };

        component.navbarItems = <any>fakeNavbarItems;

        expect(component['calculateRightNavigation'](fakeItemBreakpoint)).toBe(expectedResult);
      });
    });

    describe('displayItemsNavigation', () => {
      it(`should set 'showItemsNavigation' to 'true' if 'navbarItemsWidth' is less than the sum of the 'allNavbarItemsWidth'
      and 'poNavbarNavigationWidth' and call 'detectChanges'`, () => {
        spyOn(component, <any>'navbarItemsWidth').and.returnValue(100);
        spyOn(component, <any>'allNavbarItemsWidth').and.returnValue(120);
        spyOn(component['changeDetector'], 'detectChanges');

        component['displayItemsNavigation']();

        expect(component['showItemsNavigation']).toBe(true);
        expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
      });

      it(`should set 'showItemsNavigation' to 'false' if 'navbarItemsWidth' is greater than the sum of the 'allNavbarItemsWidth'
      and 'poNavbarNavigationWidth' and call 'detectChanges'`, () => {
        spyOn(component, <any>'navbarItemsWidth').and.returnValue(500);
        spyOn(component, <any>'allNavbarItemsWidth').and.returnValue(120);
        spyOn(component['changeDetector'], 'detectChanges');

        component['displayItemsNavigation']();

        expect(component['showItemsNavigation']).toBe(false);
        expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
      });

      it(`should call 'setOffsetToZero' and 'animate' with offset value if offset is different to 0`, () => {
        const offset = 100;
        component['offset'] = offset;

        spyOn(component, <any>'setOffsetToZero');
        spyOn(component, <any>'animate');

        component['displayItemsNavigation']();

        expect(component['setOffsetToZero']).toHaveBeenCalled();
        expect(component['animate']).toHaveBeenCalledWith(offset);
      });

      it(`shouldn't call setOffsetToZero and animate if offset is equal to 0`, () => {
        component['offset'] = 0;

        spyOn(component, <any>'setOffsetToZero');
        spyOn(component, <any>'animate');

        component['displayItemsNavigation']();

        expect(component['setOffsetToZero']).not.toHaveBeenCalled();
        expect(component['animate']).not.toHaveBeenCalled();
      });
    });

    it(`initNavbarMenu: should call changeNavbarMenuItems if match in listener`, () => {
      const fakeMediaQuery: any = {
        addListener: (cb: any) => {
          const matches = true;
          cb({ matches });
        },
        removeListener: () => {}
      };

      component.menu = <any>{ menus: [] };

      spyOn(component, <any>'changeNavbarMenuItems');
      spyOn(window, 'matchMedia').and.returnValue(fakeMediaQuery);

      component['initNavbarMenu']();

      expect(component['changeNavbarMenuItems']).toHaveBeenCalled();
    });

    it(`initNavbarMenu: should call changeNavbarMenuItems if window.innerWidth is less than poNavbarMenuMedia`, () => {
      component.menu = <any>{ menus: [] };

      spyOn(component, <any>'changeNavbarMenuItems');

      changeBrowserInnerWidth(700);

      component['initNavbarMenu']();

      expect(component['changeNavbarMenuItems']).toHaveBeenCalled();
    });

    it(`initNavbarMenu: shouldn't call changeNavbarMenuItems if window.innerWidth is greater than poNavbarMenuMedia`, () => {
      component.menu = <any>{ menus: [] };

      spyOn(component, <any>'changeNavbarMenuItems');

      changeBrowserInnerWidth(1500);

      component['initNavbarMenu']();

      expect(component['changeNavbarMenuItems']).not.toHaveBeenCalled();
    });

    it(`initNavbarMenu: should call 'validateMenuLogo'`, () => {
      component.menu = <any>{ menus: [] };
      spyOn(component, <any>'validateMenuLogo');

      component['initNavbarMenu']();

      expect(component['validateMenuLogo']).toHaveBeenCalled();
    });

    it(`navbarItemsWidth: should return navbar items width`, () => {
      const itemsWidth = 50;
      const fakeThis = {
        navbarItemsElement: {
          nativeElement: {
            offsetWidth: itemsWidth
          }
        }
      };

      expect(component['navbarItemsWidth'].call(fakeThis)).toBe(itemsWidth);
    });

    describe('navigateLeft', () => {
      it(`should set 'disableRight' to 'false' and call 'calculateLeftNavigation'`, () => {
        component.disableRight = true;
        spyOn(component, <any>'calculateLeftNavigation');

        component['navigateLeft']();

        expect(component.disableRight).toBe(false);
        expect(component['calculateLeftNavigation']).toHaveBeenCalled();
      });

      it(`should call 'setOffsetToZero' if 'offset' is less than 0`, () => {
        spyOn(component, <any>'calculateLeftNavigation').and.returnValue(-50);
        spyOn(component, <any>'setOffsetToZero');

        component['navigateLeft']();

        expect(component['setOffsetToZero']).toHaveBeenCalled();
      });

      it(`shouldn't call 'setOffsetToZero' if 'offset' is equal 0`, () => {
        spyOn(component, <any>'calculateLeftNavigation').and.returnValue(0);
        spyOn(component, <any>'setOffsetToZero');

        component['navigateLeft']();

        expect(component['setOffsetToZero']).not.toHaveBeenCalled();
      });

      it(`shouldn't call 'setOffsetToZero' if 'offset' is greater than 0`, () => {
        spyOn(component, <any>'calculateLeftNavigation').and.returnValue(100);
        spyOn(component, <any>'setOffsetToZero');

        component['navigateLeft']();

        expect(component['setOffsetToZero']).not.toHaveBeenCalled();
      });
    });

    describe('navigateRight', () => {
      it(`should call 'calculateRightNavigation' with 'itemBreakPoint'`, () => {
        const fakeOffset = 100;
        const fakeNavbarItemsWidth = 50;
        const fakeItemBreakpoint = fakeOffset + fakeNavbarItemsWidth;

        component['offset'] = fakeOffset;
        spyOn(component, <any>'navbarItemsWidth').and.returnValue(fakeNavbarItemsWidth);
        spyOn(component, <any>'calculateRightNavigation');

        component['navigateRight']();

        expect(component['calculateRightNavigation']).toHaveBeenCalledWith(fakeItemBreakpoint);
      });

      it(`should call 'validateMaxOffset' with 'maxAllowedOffset'`, () => {
        const fakeNavbarItemsWidth = 50;
        const fakeAllNavbarItemsWidth = 100;
        const fakeMaxAllowedOffset = fakeAllNavbarItemsWidth - fakeNavbarItemsWidth;

        spyOn(component, <any>'navbarItemsWidth').and.returnValue(fakeNavbarItemsWidth);
        spyOn(component, <any>'allNavbarItemsWidth').and.returnValue(fakeAllNavbarItemsWidth);
        spyOn(component, <any>'validateMaxOffset');

        component['navigateRight']();

        expect(component['validateMaxOffset']).toHaveBeenCalledWith(fakeMaxAllowedOffset);
      });
    });

    it(`onMediaQueryChange: should call 'changeNavbarMenuItems'`, () => {
      component.menu = <any>{ menus: [] };
      spyOn(component, <any>'changeNavbarMenuItems');

      component['onMediaQueryChange']({ changed: false });

      expect(component['changeNavbarMenuItems']).toHaveBeenCalled();
    });

    it(`setOffsetToZero: should set 'offset' to 0`, () => {
      component['offset'] = 100;

      component['setOffsetToZero']();

      expect(component['offset']).toBe(0);
    });

    describe('validateMaxOffset', () => {
      it(`should set 'offset' with 'maxAllowedOffset' value and set 'disableRight' to 'true' if 'offset' is greater than
      'maxAllowedOffset'`, () => {
        const maxAllowedOffset = 20;
        component['offset'] = 50;
        component.disableRight = false;

        component['validateMaxOffset'](maxAllowedOffset);

        expect(component['offset']).toBe(maxAllowedOffset);
        expect(component.disableRight).toBe(true);
      });

      it(`should set 'offset' with 'maxAllowedOffset' value and set 'disableRight' to 'true' if 'offset' is equal to
      'maxAllowedOffset'`, () => {
        const maxAllowedOffset = 20;
        component['offset'] = maxAllowedOffset;
        component.disableRight = false;

        component['validateMaxOffset'](maxAllowedOffset);

        expect(component['offset']).toBe(maxAllowedOffset);
        expect(component.disableRight).toBe(true);
      });

      it(`shouldn't set 'offset' with 'maxAllowedOffset' value and not set 'disableRight' to 'true' if 'offset' is less than
      'maxAllowedOffset'`, () => {
        const maxAllowedOffset = 50;
        component['offset'] = 20;
        component.disableRight = false;

        component['validateMaxOffset'](maxAllowedOffset);

        expect(component['offset']).toBe(20);
        expect(component.disableRight).toBe(false);
      });
    });

    describe('validateMenuLogo:', () => {
      it(`should set 'menu.logo' as 'undefined' and call 'menu.changeDetector.detectChanges' if has 'logo' and 'menu.logo'`, () => {
        const fakeThis = {
          logo: 'logo',
          menu: {
            logo: 'logo',
            changeDetector: {
              detectChanges: () => {}
            }
          }
        };

        spyOn(fakeThis.menu.changeDetector, <any>'detectChanges');
        component['validateMenuLogo'].call(fakeThis);

        expect(fakeThis.menu.logo).toBeUndefined();
        expect(fakeThis.menu.changeDetector.detectChanges).toHaveBeenCalled();
      });

      it(`shouldn't call 'menu.changeDetector.detectChanges' if doesn't have 'menu.logo'`, () => {
        const fakeThis = {
          logo: 'logo',
          menu: {
            logo: undefined,
            changeDetector: {
              detectChanges: () => {}
            }
          }
        };

        spyOn(fakeThis.menu.changeDetector, 'detectChanges');

        component['validateMenuLogo'].call(fakeThis);

        expect(fakeThis.menu.logo).toBeUndefined();
        expect(fakeThis.menu.changeDetector.detectChanges).not.toHaveBeenCalled();
      });

      it(`shouldn't call 'menu.changeDetector.detectChanges' if doesn't have 'logo'`, () => {
        const fakeThis = {
          logo: undefined,
          menu: {
            logo: 'logo',
            changeDetector: {
              detectChanges: () => {}
            }
          }
        };

        spyOn(fakeThis.menu.changeDetector, 'detectChanges');

        component['validateMenuLogo'].call(fakeThis);

        expect(fakeThis.logo).toBeUndefined();
        expect(fakeThis.menu.changeDetector.detectChanges).not.toHaveBeenCalled();
      });
    });
  });

  describe('Template:', () => {
    let nativeElement: any;

    beforeEach(() => {
      nativeElement = fixture.debugElement.nativeElement;
    });

    it(`should apply class 'po-navbar-shadow' if 'shadow' is true`, () => {
      component.shadow = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-navbar-shadow')).toBeTruthy();
    });

    it(`shouldn't apply class 'po-navbar-shadow' if 'shadow' is false`, () => {
      component.shadow = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-navbar-shadow')).toBeNull();
    });

    it(`should apply class 'po-navbar-logo-menu' if have menu`, () => {
      component.menu = <any>[{ label: 'Item 1' }];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-navbar-logo-menu')).toBeTruthy();
    });

    it(`shouldn't apply class 'po-navbar-logo-menu' if menu is undefined`, () => {
      component.menu = undefined;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-navbar-logo-menu')).toBeNull();
    });

    it(`should create 'po-navbar-item-navigation' if 'showItemsNavigation' is true`, () => {
      component.showItemsNavigation = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-navbar-item-navigation')).toBeTruthy();
    });

    it(`shouldn't create 'po-navbar-item-navigation' if 'showItemsNavigation' is false`, () => {
      component.showItemsNavigation = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-navbar-item-navigation')).toBeNull();
    });

    it(`should create 'po-menu' if menu is undefined`, () => {
      component.menu = undefined;

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-menu')).toBeTruthy();
    });

    it(`shouldn't create 'po-menu' if has menu`, () => {
      component.menu = <any>[{ label: 'Item 1' }];

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-menu')).toBeNull();
    });
  });
});
