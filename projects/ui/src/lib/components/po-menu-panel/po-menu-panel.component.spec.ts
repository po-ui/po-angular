import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoMenuPanelComponent } from './po-menu-panel.component';
import { PoMenuPanelItemComponent } from './po-menu-panel-item/po-menu-panel-item.component';
import { PoMenuPanelItemsService } from './services/po-menu-panel-items.service';
import { PoTooltipModule } from '../../directives/po-tooltip';

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

describe('PoMenuPanelComponent: ', () => {
  let component: PoMenuPanelComponent;

  let fixture: ComponentFixture<PoMenuPanelComponent>;
  let nativeElement: any;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), PoTooltipModule],
      declarations: [PoMenuPanelComponent, PoMenuPanelItemComponent, HomeComponent, SearchComponent],
      providers: [PoMenuPanelItemsService]
    });
  });

  beforeEach(() => {
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(PoMenuPanelComponent);
    nativeElement = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;

    component.menus = [
      { label: 'Home', link: './home', icon: 'po-icon-home' },
      { label: 'PO', link: './po', icon: 'po-icon-clock' },
      { label: 'Fake Url', icon: 'po-icon-star', link: 'http://fakeUrlPo.com.br' },
      { label: 'Commom Function', icon: 'po-icon-share', action: () => {} },
      { label: 'Function as string', icon: 'po-icon-company', action: () => {} }
    ];

    fixture.detectChanges();

    fixture.ngZone.run(() => {
      router.initialNavigation();
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Templates: ', () => {
    it('po-menu-panel-item: should create menu items.', () => {
      expect(nativeElement.querySelectorAll('po-menu-panel-item').length).toBe(5);
    });

    it('should not appear if it is incorrect the icon class po, `po-icon-star`.', () => {
      component.menus = [{ label: 'Home', link: './home', icon: 'star' }];

      fixture.detectChanges();
      expect(nativeElement.querySelectorAll('.po-icon-star').length).toBe(0);
    });

    it('should appear if it is correct the icon class po, `po-icon-star`.', () => {
      component.menus = [{ label: 'Home', link: './home', icon: 'po-icon-star' }];

      fixture.detectChanges();
      expect(nativeElement.querySelectorAll('.po-icon-star').length).toBe(1);
    });

    it('po-menu-panel-item-selected: should have a selected item.', () => {
      component['clickMenuItem'](<any>component.menus[0]);

      fixture.detectChanges();
      expect(nativeElement.querySelectorAll('.po-menu-panel-item-selected').length).toBe(1);
    });
  });

  describe('Methods: ', () => {
    it('subscribeToMenuItem: should receive from child active menu item', () => {
      const menuItem = component.menus[0];

      spyOn(component, <any>'clickMenuItem');

      component['menuItemsService'] = fakeMenuPanelService(menuItem) as PoMenuPanelItemsService;
      component['subscribeToMenuItem']();

      expect(component['clickMenuItem']).toHaveBeenCalled();
    });

    it('clickMenuItem: should call action', () => {
      spyOn(component.menus[3], <any>'action');

      component['clickMenuItem'](<any>component.menus[3]);

      expect(component.activeMenuItem).toBe(undefined);
      expect(component.menus[3].action).toHaveBeenCalled();
    });

    it('activeMenuItem: should activate menu item', () => {
      component['clickMenuItem'](<any>component.menus[0]);

      expect(component.activeMenuItem.link).toBe('./home');
    });

    it('clickMenuItem: should open external link', () => {
      spyOn(window, 'open');

      component['clickMenuItem'](<any>component.menus[2]);

      expect(window.open).toHaveBeenCalledWith('http://fakeUrlPo.com.br', '_blank');
    });

    describe('checkActiveMenuByUrl', () => {
      it('should navigate if there is no linkActive', () => {
        spyOn(component, <any>'activateMenuByUrl');
        component.linkActive = undefined;
        component['checkActiveMenuByUrl']('search');
        expect(component['activateMenuByUrl']).toHaveBeenCalled();
      });

      it('should navigate if has not same link', () => {
        spyOn(component, <any>'activateMenuByUrl');
        component.linkActive = '/home';
        component['checkActiveMenuByUrl']('search');
        expect(component['activateMenuByUrl']).toHaveBeenCalled();
      });

      it('should not navigate if has same link', done => {
        spyOn(component, <any>'activateMenuByUrl');

        component.linkActive = '/search';

        fixture.ngZone.run(() => {
          router.navigate(['search']).then(() => {
            expect(component['activateMenuByUrl']).not.toHaveBeenCalled();

            done();
          });
        });
      });
    });

    describe('activateMenuByUrl:', () => {
      it('shouldn`t call activeMenuItem if menuItem no has same link of param', () => {
        const menuItem = { label: 'Search', link: '/search', icon: 'user' };
        spyOn(component, <any>'activateMenuItem');

        component['activateMenuByUrl']('home', [menuItem]);

        expect(component['activateMenuItem']).not.toHaveBeenCalled();
      });

      it('shouldn`t search by some menuItem that has the same link of param', () => {
        spyOn(component, <any>'activateMenuItem');

        component['activateMenuByUrl']('home', null);

        expect(component['activateMenuItem']).not.toHaveBeenCalled();
      });

      it('shouldn call activeMenuItem if menuItem no has same link of param', () => {
        const menuItem = { label: 'Search', link: '/home', icon: 'user' };
        spyOn(component, <any>'activateMenuItem');

        component['activateMenuByUrl']('/home', [menuItem]);

        expect(component['activateMenuItem']).toHaveBeenCalled();
      });
    });
  });
});

function fakeMenuPanelService(item) {
  const observer = new Observable(obs => {
    obs.next(item);
    obs.complete();
  });

  return {
    receiveFromChildMenuClicked: () => observer,
    sendToChildMenuClicked: param => {}
  };
}
