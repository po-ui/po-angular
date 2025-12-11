import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NavigationCancel, NavigationEnd, provideRouter, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PoUtils as util } from '../../../utils/util';
import { PoHeaderActions } from '../interfaces/po-header-actions.interface';
import { PoHeaderMenuItemComponent } from './po-header-menu-item.component';

describe('PoHeaderMenuItemComponent', () => {
  let component: PoHeaderMenuItemComponent;
  let fixture: ComponentFixture<PoHeaderMenuItemComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoHeaderMenuItemComponent],
      providers: [ChangeDetectorRef, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoHeaderMenuItemComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();

    component.poPopupElement = { toggle: jasmine.createSpy('toggle') } as any;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit: should subscribe to resize event and call checkActiveItemByUrl after debounce', fakeAsync(() => {
    const spyCheckFragments = spyOn<any>(component, 'checkRouterChildrenFragments').and.returnValue('/test');
    const spyCheckActive = spyOn<any>(component, 'checkActiveItemByUrl');

    component.ngOnInit();

    window.dispatchEvent(new Event('resize'));

    tick(300);

    expect(spyCheckFragments).toHaveBeenCalled();
    expect(spyCheckActive).toHaveBeenCalledWith('/test');
  }));

  it('should call detectChanges when itemOverFlow is changed', () => {
    spyOn(component['cd'], 'detectChanges');

    component.ngOnChanges({
      itemOverFlow: {
        currentValue: [{ label: 'label' }],
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component['cd'].detectChanges).toHaveBeenCalled();
  });

  it('should call checkActiveItemByUrl when item is changed', () => {
    spyOn(component, <any>'checkActiveItemByUrl');

    component.ngOnChanges({
      item: {
        currentValue: [{ label: 'label' }],
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component['checkActiveItemByUrl']).toHaveBeenCalled();
  });

  it('should call detectChanges and toggle Popup', () => {
    spyOn(component['cd'], 'detectChanges');

    component.openListButtonMore();

    expect(component['cd'].detectChanges).toHaveBeenCalled();
    expect(component.poPopupElement.toggle).toHaveBeenCalled();
  });

  it('should call openListButtonMore when event is Space', () => {
    spyOn(component, 'openListButtonMore');

    component.onKeyDownButtonMore({ code: 'Space', preventDefault: () => {} });

    expect(component.openListButtonMore).toHaveBeenCalled();
  });

  it('should call openListButtonMore when event is Enter', () => {
    spyOn(component, 'openListButtonMore');

    component.onKeyDownButtonMore({ code: 'Enter', preventDefault: () => {} });

    expect(component.openListButtonMore).toHaveBeenCalled();
  });

  it('should call action when event is Enter', () => {
    const item = {
      label: 'test',
      action: jasmine.createSpy('action')
    };

    component.item = item as any;
    spyOn(component.itemClick, 'emit');

    component.onKeyDownButtonList({ code: 'Enter', preventDefault: () => {} }, item);

    expect(item.action).toHaveBeenCalled();
    expect(component.itemClick.emit).toHaveBeenCalled();
  });

  it('should call onAction when event is Enter', () => {
    const item = {
      label: 'test',
      action: jasmine.createSpy('action')
    };

    component.item = item as any;
    spyOn(component, 'onAction');

    component.onKeyDownButtonList({ code: 'Enter', preventDefault: () => {} }, item);

    expect(component.onAction).toHaveBeenCalled();
  });

  it('should open external link in new tab when isExternalLink is true', () => {
    const item: PoHeaderActions = { link: 'http://external.com', label: 'test1' };

    spyOn(util, 'isExternalLink').and.returnValue(true);
    const windowSpy = spyOn(window, 'open');

    component.onAction(item);

    expect(util.isExternalLink).toHaveBeenCalledWith(item.link);
    expect(windowSpy).toHaveBeenCalledWith(item.link, '_blank');
  });

  it('should open external link in new tab when isExternalLink is true and itemDefault is false', () => {
    const item: PoHeaderActions = { link: 'http://external.com', label: 'test1' };

    spyOn(util, 'isExternalLink').and.returnValue(true);
    const windowSpy = spyOn(window, 'open');

    component.onAction(item, false);

    expect(util.isExternalLink).toHaveBeenCalledWith(item.link);
    expect(windowSpy).toHaveBeenCalledWith(item.link, '_blank');
  });

  it('should navigate using router when isExternalLink is false', () => {
    const item: PoHeaderActions = { link: 'http://external.com', label: 'test1' };

    spyOn(util, 'isExternalLink').and.returnValue(false);
    const routerSpy = spyOn(router, 'navigateByUrl');

    component.onAction(item);

    expect(util.isExternalLink).toHaveBeenCalledWith(item.link);
    expect(routerSpy).toHaveBeenCalledWith(item.link);
  });

  it('should call onAction when event is Space', () => {
    const item = {
      label: 'test',
      action: jasmine.createSpy('action')
    };

    component.item = item as any;
    spyOn(component, 'onAction');

    component.onKeyDownButtonList({ code: 'Space', preventDefault: () => {} }, item);

    expect(component.onAction).toHaveBeenCalled();
  });

  it('should call action and emit event', () => {
    const item = {
      label: 'test',
      action: jasmine.createSpy('action')
    };

    component.item = item as any;
    spyOn(component.itemClick, 'emit');

    component.onAction(item);

    expect(item.action).toHaveBeenCalled();
    expect(component.itemClick.emit).toHaveBeenCalled();
  });

  it('should emit item when exist lastItemSelected', () => {
    component.buttonMoreElement = { nativeElement: { focus: () => {} } };
    component.lastItemSelected = { label: 'test' };
    spyOn(component.itemClick, 'emit');

    component.onClosePopup();

    expect(component.itemClick.emit).toHaveBeenCalled();
  });

  it('should set selectedItem to true when item.link matches urlRouter', () => {
    component['item'] = { link: '/home/dashboard' } as any;

    (component as any).checkActiveItemByUrl('/home/dashboard');

    expect(component['selectedItem']).toBeTrue();
  });

  it('should set selectedItem to true when item.link matches a partial urlRouter', () => {
    component['item'] = { link: '/home' } as any;

    (component as any).checkActiveItemByUrl('/home/dashboard/details');

    expect(component['selectedItem']).toBeTrue();
  });

  it('should set selectedItem to false when item.link does not match urlRouter', () => {
    component['item'] = { link: '/about' } as any;

    (component as any).checkActiveItemByUrl('/home/dashboard');

    expect(component['selectedItem']).toBeFalse();
  });

  it('should stop at the first match and not continue looping', () => {
    component['item'] = { link: '/home/dashboard' } as any;

    const spy = spyOn<any>(component, 'checkActiveItemByUrl').and.callThrough();

    (component as any).checkActiveItemByUrl('/home/dashboard/details');

    expect(component['selectedItem']).toBeTrue();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return "/" when there are no children', () => {
    spyOn(router, 'parseUrl').and.returnValue({
      root: { children: {} }
    } as any);

    const result = (component as any).checkRouterChildrenFragments();

    expect(result).toBe('/');
  });

  it('should return the path from primary children when it exists', () => {
    spyOn(router, 'parseUrl').and.returnValue({
      root: {
        children: {
          primary: {
            segments: [{ path: 'home' }, { path: 'dashboard' }]
          }
        }
      }
    } as any);

    const result = (component as any).checkRouterChildrenFragments();

    expect(result).toBe('/home/dashboard');
  });

  it('should return "/" when primary children has no segments', () => {
    spyOn(router, 'parseUrl').and.returnValue({
      root: {
        children: {
          primary: {
            segments: []
          }
        }
      }
    } as any);

    const result = (component as any).checkRouterChildrenFragments();

    expect(result).toBe('/');
  });

  it(`subscribeToRoute: should call checkActiveItemByUrl with url router if router events return an instance of NavigationEnd`, () => {
    const navigation = new NavigationEnd(1, 'url/', undefined);

    spyOn(component, <any>'checkRouterChildrenFragments').and.returnValue('test');
    spyOn(component, <any>'checkActiveItemByUrl');

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

    spyOn(component['router'].events, 'subscribe').and.callFake(callback => {
      callback(navigation);
      return new Subscription();
    });

    component['subscribeToRoute']();

    expect(component['checkActiveItemByUrl']).toHaveBeenCalledWith('test');
  });
});
