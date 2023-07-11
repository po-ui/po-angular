import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs';

import { PoTooltipModule } from '../../directives/po-tooltip';
import { PoMenuPanelItemComponent } from './po-menu-panel-item/po-menu-panel-item.component';
import { PoMenuPanelComponent } from './po-menu-panel.component';
import { PoMenuPanelItemsService } from './services/po-menu-panel-items.service';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), PoTooltipModule],
      declarations: [PoMenuPanelComponent, PoMenuPanelItemComponent, HomeComponent, SearchComponent],
      providers: [PoMenuPanelItemsService]
    }).compileComponents();

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

    it('should call `menu.action` when menu has a defined action', () => {
      const spyAction = jasmine.createSpy('action');
      const menuWithAction = component.menus[3];
      menuWithAction.action = spyAction;

      component['clickMenuItem'](<any>menuWithAction);

      expect(spyAction).toHaveBeenCalled();
    });

    it('should open link when menu has a link and it is an external link', () => {
      spyOn(window, 'open');

      const menuWithExternalLink = component.menus[2];
      component['clickMenuItem'](<any>menuWithExternalLink);

      expect(window.open).toHaveBeenCalledWith(menuWithExternalLink.link, '_blank');
    });

    it('should call `activateMenuItem` when menu has a link and it is an internal link', () => {
      const spyActivateMenuItem = spyOn(component, <any>'activateMenuItem');

      const menuWithInternalLink = component.menus[1];
      component['clickMenuItem'](<any>menuWithInternalLink);

      expect(spyActivateMenuItem).toHaveBeenCalledWith(<any>menuWithInternalLink);
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
