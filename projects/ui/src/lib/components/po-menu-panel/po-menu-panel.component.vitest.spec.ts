import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs';

import { PoTooltipModule } from '../../directives/po-tooltip';
import { PoMenuPanelItemComponent } from './po-menu-panel-item/po-menu-panel-item.component';
import { PoMenuPanelComponent } from './po-menu-panel.component';
import { PoMenuPanelItemsService } from './services/po-menu-panel-items.service';

@Component({
  template: 'Search',
  standalone: false
})
class SearchComponent {}

@Component({
  template: 'Home',
  standalone: false
})
class HomeComponent {}

const routes: Routes = [
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

    it('should not appear if it is incorrect the icon class po, `an-star`.', () => {
      component.menus = [{ label: 'Home', link: './home', icon: 'star' }];

      fixture.detectChanges();
      expect(nativeElement.querySelectorAll('.an-star').length).toBe(0);
    });

    it('should appear if it is correct the icon class po, `an-star`.', () => {
      component.menus = [{ label: 'Home', link: './home', icon: 'an-star' }];

      fixture.detectChanges();
      expect(nativeElement.querySelectorAll('.an-star').length).toBe(1);
    });

    it('po-menu-panel-item-selected: should have a selected item.', () => {
      component['clickMenuItem'](component.menus[0] as any);

      fixture.detectChanges();
      expect(nativeElement.querySelectorAll('.po-menu-panel-item-selected').length).toBe(1);
    });
  });

  describe('Methods: ', () => {
    it('subscribeToMenuItem: should receive from child active menu item', () => {
      const menuItem = component.menus[0];

      const spy = vi.spyOn(component as any, 'clickMenuItem');

      Object.defineProperty(component, 'menuItemsService', {
        value: fakeMenuPanelService(menuItem),
        configurable: true
      });
      component['subscribeToMenuItem']();

      expect(spy).toHaveBeenCalled();
    });

    it('should call `menu.action` when menu has a defined action', () => {
      const spyAction = vi.fn();
      const menuWithAction = component.menus[3];
      menuWithAction.action = spyAction;

      component['clickMenuItem'](menuWithAction as any);

      expect(spyAction).toHaveBeenCalled();
    });

    it('should open link when menu has a link and it is an external link', () => {
      const spy = vi.spyOn(window, 'open').mockImplementation(() => null);

      const menuWithExternalLink = component.menus[2];
      component['clickMenuItem'](menuWithExternalLink as any);

      expect(spy).toHaveBeenCalledWith(menuWithExternalLink.link, '_blank');
    });

    it('should call `activateMenuItem` when menu has a link and it is an internal link', () => {
      const spy = vi.spyOn(component as any, 'activateMenuItem');

      const menuWithInternalLink = component.menus[1];
      component['clickMenuItem'](menuWithInternalLink as any);

      expect(spy).toHaveBeenCalledWith(menuWithInternalLink);
    });

    it('activeMenuItem: should activate menu item', () => {
      component['clickMenuItem'](component.menus[0] as any);

      expect(component.activeMenuItem.link).toBe('./home');
    });

    it('clickMenuItem: should open external link', () => {
      const spy = vi.spyOn(window, 'open').mockImplementation(() => null);

      component['clickMenuItem'](component.menus[2] as any);

      expect(spy).toHaveBeenCalledWith('http://fakeUrlPo.com.br', '_blank');
    });

    describe('checkActiveMenuByUrl', () => {
      it('should navigate if there is no linkActive', () => {
        const spy = vi.spyOn(component as any, 'activateMenuByUrl');
        component.linkActive = undefined;
        component['checkActiveMenuByUrl']('search');
        expect(spy).toHaveBeenCalled();
      });

      it('should navigate if has not same link', () => {
        const spy = vi.spyOn(component as any, 'activateMenuByUrl');
        component.linkActive = '/home';
        component['checkActiveMenuByUrl']('search');
        expect(spy).toHaveBeenCalled();
      });

      it('should not navigate if has same link', async () => {
        const spy = vi.spyOn(component as any, 'activateMenuByUrl');

        component.linkActive = '/search';

        await fixture.ngZone.run(() => router.navigate(['search']));

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('activateMenuByUrl:', () => {
      it('shouldn`t call activeMenuItem if menuItem no has same link of param', () => {
        const menuItem = { label: 'Search', link: '/search', icon: 'user' };
        const spy = vi.spyOn(component as any, 'activateMenuItem');

        component['activateMenuByUrl']('home', [menuItem]);

        expect(spy).not.toHaveBeenCalled();
      });

      it('shouldn`t search by some menuItem that has the same link of param', () => {
        const spy = vi.spyOn(component as any, 'activateMenuItem');

        component['activateMenuByUrl']('home', null);

        expect(spy).not.toHaveBeenCalled();
      });

      it('should call activeMenuItem if menuItem has same link of param', () => {
        const menuItem = { label: 'Search', link: '/home', icon: 'user' };
        const spy = vi.spyOn(component as any, 'activateMenuItem');

        component['activateMenuByUrl']('/home', [menuItem]);

        expect(spy).toHaveBeenCalled();
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
