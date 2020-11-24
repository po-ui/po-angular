import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavigationCancel, NavigationEnd, RouterModule } from '@angular/router';

import { Subscription } from 'rxjs';

import { PoNavbarItemComponent } from './po-navbar-item/po-navbar-item.component';
import { PoNavbarItemsComponent } from './po-navbar-items.component';

describe('PoNavbarItemsComponent:', () => {
  let component: PoNavbarItemsComponent;
  let fixture: ComponentFixture<PoNavbarItemsComponent>;
  let nativeElement: any;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PoNavbarItemsComponent, PoNavbarItemComponent],
        imports: [RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoNavbarItemsComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoNavbarItemsComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngOnDestroy: should call `unsubscribe` of the `routeSubscription`', () => {
      spyOn(component['routeSubscription'], 'unsubscribe');

      component.ngOnDestroy();

      expect(component['routeSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('ngOnInit: should call `subscribeToRoute`', () => {
      spyOn(component, <any>'subscribeToRoute');

      component.ngOnInit();

      expect(component['subscribeToRoute']).toHaveBeenCalled();
    });

    describe('checkActiveItemByUrl:', () => {
      it('should set `selectedItem` with the route item if the item is in a nested route', () => {
        const urlItem = '/guide/test';
        const selectedItem = { label: 'Guide', link: '/guide' };
        component.selectedItem = undefined;

        component.items = [
          { label: 'Guide', link: '/guide' },
          { label: 'Document', link: '/doc' },
          { label: 'Tools', link: '/tool' }
        ];

        component['checkActiveItemByUrl'](urlItem);

        expect(component.selectedItem).toEqual(selectedItem);
      });

      it('should set `selectedItem` with the route item', () => {
        const urlItem = 'http://test3.com';
        const selectedItem = { label: 'test 3', link: 'http://test3.com' };
        component.selectedItem = undefined;

        component.items = [
          { label: 'test 1', link: 'http://test1.com' },
          { label: 'test 2', link: 'http://test2.com' },
          { label: 'test 3', link: 'http://test3.com' },
          { label: 'test 4', link: 'http://test4.com' },
          { label: 'test 5', link: 'http://test5.com' }
        ];

        component['checkActiveItemByUrl'](urlItem);

        expect(component.selectedItem).toEqual(selectedItem);
      });

      it('should set `selectedItem` with undefined if item url is not included in `items`', () => {
        const urlItem = 'http://test6.com';
        component.selectedItem = { label: 'test 3', link: 'http://test3.com' };

        component.items = [
          { label: 'test 1', link: 'http://test1.com' },
          { label: 'test 2', link: 'http://test2.com' },
          { label: 'test 3', link: 'http://test3.com' },
          { label: 'test 4', link: 'http://test4.com' },
          { label: 'test 5', link: 'http://test5.com' }
        ];

        component['checkActiveItemByUrl'](urlItem);

        expect(component.selectedItem).toBeUndefined();
      });
    });

    it('checkRouterChildrenFragments: should return url without params and `#`', () => {
      spyOnProperty(component['router'], 'url').and.returnValue('test/label#fragment?param=1');

      const result = component['checkRouterChildrenFragments']();

      expect(result).toBe('/test/label');
    });

    it('checkRouterChildrenFragments: should return `/` if `url` is `undefined`', () => {
      spyOnProperty(component['router'], 'url').and.returnValue(undefined);

      const result = component['checkRouterChildrenFragments']();

      expect(result).toBe('/');
    });

    it('checkRouterChildrenFragments: should return same url', () => {
      spyOnProperty(component['router'], 'url').and.returnValue('test/label');

      const result2 = component['checkRouterChildrenFragments']();

      expect(result2).toBe('/test/label');
    });

    it(`subscribeToRoute: should call checkActiveItemByUrl with url router if router events return an instance of NavigationEnd`, () => {
      const navigation = new NavigationEnd(1, 'url/', undefined);

      spyOn(component, <any>'checkRouterChildrenFragments').and.returnValue('test');
      spyOn(component, <any>'checkActiveItemByUrl');

      // Mock para poder entrar no subscribe
      spyOn(component['router'].events, 'subscribe').and.callFake(callback => {
        callback(navigation);
        return new Subscription();
      });

      component['subscribeToRoute']();

      expect(component['checkActiveItemByUrl']).toHaveBeenCalledWith('test');
    });

    it(`subscribeToRoute: should call checkActiveItemByUrl with url router if router events return an instance of NavigationCancel`, () => {
      const navigation = new NavigationCancel(1, 'url/', undefined);

      spyOn(component, <any>'checkRouterChildrenFragments').and.returnValue('test');
      spyOn(component, <any>'checkActiveItemByUrl');

      // Mock para poder entrar no subscribe
      spyOn(component['router'].events, 'subscribe').and.callFake(callback => {
        callback(navigation);
        return new Subscription();
      });

      component['subscribeToRoute']();

      expect(component['checkActiveItemByUrl']).toHaveBeenCalledWith('test');
    });

    it(`subscribeToRoute: shouldn't call checkActiveItemByUrl with url router if router events not return an instance of
      NavigationCancel or NavigationEnd`, () => {
      spyOn(component, <any>'checkRouterChildrenFragments').and.returnValue('test');
      spyOn(component, <any>'checkActiveItemByUrl');

      // Mock para poder entrar no subscribe
      spyOn(component['router'].events, 'subscribe').and.callFake(callback => {
        callback(undefined);
        return new Subscription();
      });

      component['subscribeToRoute']();

      expect(component['checkActiveItemByUrl']).not.toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it('should set `po-navbar-item-selected` class in active item', () => {
      component.selectedItem = { label: 'test 3', link: 'http://test3.com' };

      component.items = [
        { label: 'test 1', link: 'http://test1.com' },
        { label: 'test 2', link: 'http://test2.com' },
        component.selectedItem,
        { label: 'test 4', link: 'http://test4.com' },
        { label: 'test 5', link: 'http://test5.com' }
      ];

      fixture.detectChanges();

      const selectedItemLi = nativeElement.querySelector('.po-navbar-item-selected');
      expect(selectedItemLi).toBeTruthy();

      const selectedItem = selectedItemLi.querySelector('po-navbar-item');
      expect(selectedItem.innerText).toBe('test 3');
    });

    it('should set `ng-reflect-clickable` with false if it is active element', () => {
      component.selectedItem = { label: 'test 3', link: 'http://test3.com' };

      component.items = [
        { label: 'test 1', link: 'http://test1.com' },
        { label: 'test 2', link: 'http://test2.com' },
        component.selectedItem,
        { label: 'test 4', link: 'http://test4.com' }
      ];

      fixture.detectChanges();

      const selectedItemLi = nativeElement.querySelector('.po-navbar-item-selected');

      const selectedItem = selectedItemLi.querySelector('po-navbar-item');
      expect(selectedItem.getAttribute('ng-reflect-clickable')).toBe('false');
    });

    it('should set `ng-reflect-clickable` with true if it not is active element', () => {
      component.selectedItem = undefined;

      component.items = [
        { label: 'test 1', link: 'http://test1.com' },
        { label: 'test 2', link: 'http://test2.com' },
        { label: 'test 4', link: 'http://test4.com' }
      ];

      fixture.detectChanges();

      const selectedItem = nativeElement.querySelector('po-navbar-item');
      expect(selectedItem.getAttribute('ng-reflect-clickable')).toBe('true');
    });
  });
});
