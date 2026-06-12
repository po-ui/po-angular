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

    component.poPopupElement = { toggle: vi.fn() } as any;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit: should subscribe to resize event and call checkActiveItemByUrl after debounce', fakeAsync(() => {
    const spyCheckFragments = vi.spyOn(component as any, 'checkRouterChildrenFragments').mockReturnValue('/test');
    const spyCheckActive = vi.spyOn(component as any, 'checkActiveItemByUrl');

    component.ngOnInit();

    window.dispatchEvent(new Event('resize'));

    tick(300);

    expect(spyCheckFragments).toHaveBeenCalled();
    expect(spyCheckActive).toHaveBeenCalledWith('/test');
  }));

  it('should call detectChanges when itemOverFlow is changed', () => {
    vi.spyOn(component['cd'] as any, 'detectChanges');

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
    vi.spyOn(component as any, 'checkActiveItemByUrl');

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
    vi.spyOn(component['cd'] as any, 'detectChanges');

    component.openListButtonMore();

    expect(component['cd'].detectChanges).toHaveBeenCalled();
    expect(component.poPopupElement.toggle).toHaveBeenCalled();
  });

  it('should call openListButtonMore when event is Space', () => {
    vi.spyOn(component as any, 'openListButtonMore');

    component.onKeyDownButtonMore({ code: 'Space', preventDefault: () => {} });

    expect(component.openListButtonMore).toHaveBeenCalled();
  });

  it('should call openListButtonMore when event is Enter', () => {
    vi.spyOn(component as any, 'openListButtonMore');

    component.onKeyDownButtonMore({ code: 'Enter', preventDefault: () => {} });

    expect(component.openListButtonMore).toHaveBeenCalled();
  });

  it('should call action when event is Enter', () => {
    const item = {
      label: 'test',
      action: vi.fn()
    };

    component.item = item;
    vi.spyOn(component.itemClick as any, 'emit');

    component.onKeyDownButtonList({ code: 'Enter', preventDefault: () => {} }, item);

    expect(item.action).toHaveBeenCalled();
    expect(component.itemClick.emit).toHaveBeenCalled();
  });

  it('should call onAction when event is Enter', () => {
    const item = {
      label: 'test',
      action: vi.fn()
    };

    component.item = item;
    vi.spyOn(component as any, 'onAction');

    component.onKeyDownButtonList({ code: 'Enter', preventDefault: () => {} }, item);

    expect(component.onAction).toHaveBeenCalled();
  });

  it('should open external link in new tab when isExternalLink is true', () => {
    const item: PoHeaderActions = { link: 'http://external.com', label: 'test1' };

    vi.spyOn(util as any, 'isExternalLink').mockReturnValue(true);
    const windowSpy = vi.spyOn(window as any, 'open');

    component.onAction(item);

    expect(util.isExternalLink).toHaveBeenCalledWith(item.link);
    expect(windowSpy).toHaveBeenCalledWith(item.link, '_blank');
  });

  it('should open external link in new tab when isExternalLink is true and itemDefault is false', () => {
    const item: PoHeaderActions = { link: 'http://external.com', label: 'test1' };

    vi.spyOn(util as any, 'isExternalLink').mockReturnValue(true);
    const windowSpy = vi.spyOn(window as any, 'open');

    component.onAction(item, false);

    expect(util.isExternalLink).toHaveBeenCalledWith(item.link);
    expect(windowSpy).toHaveBeenCalledWith(item.link, '_blank');
  });

  it('should navigate using router when isExternalLink is false', () => {
    const item: PoHeaderActions = { link: 'http://external.com', label: 'test1' };

    vi.spyOn(util as any, 'isExternalLink').mockReturnValue(false);
    const routerSpy = vi.spyOn(router as any, 'navigateByUrl');

    component.onAction(item);

    expect(util.isExternalLink).toHaveBeenCalledWith(item.link);
    expect(routerSpy).toHaveBeenCalledWith(item.link);
  });

  it('should call onAction when event is Space', () => {
    const item = {
      label: 'test',
      action: vi.fn()
    };

    component.item = item;
    vi.spyOn(component as any, 'onAction');

    component.onKeyDownButtonList({ code: 'Space', preventDefault: () => {} }, item);

    expect(component.onAction).toHaveBeenCalled();
  });

  it('should call action and emit event', () => {
    const item = {
      label: 'test',
      action: vi.fn()
    };

    component.item = item;
    vi.spyOn(component.itemClick as any, 'emit');

    component.onAction(item);

    expect(item.action).toHaveBeenCalled();
    expect(component.itemClick.emit).toHaveBeenCalled();
  });

  it('should emit item when exist lastItemSelected', () => {
    component.buttonMoreElement = { nativeElement: { focus: () => {} } };
    component.lastItemSelected = { label: 'test' };
    vi.spyOn(component.itemClick as any, 'emit');

    component.onClosePopup();

    expect(component.itemClick.emit).toHaveBeenCalled();
  });

  it('should set selectedItem to true when item.link matches urlRouter', () => {
    component['item'] = { link: '/home/dashboard' } as any;

    (component as any).checkActiveItemByUrl('/home/dashboard');

    expect(component['selectedItem']).toBe(true);
  });

  it('should set selectedItem to true when item.link matches a partial urlRouter', () => {
    component['item'] = { link: '/home' } as any;

    (component as any).checkActiveItemByUrl('/home/dashboard/details');

    expect(component['selectedItem']).toBe(true);
  });

  it('should set selectedItem to false when item.link does not match urlRouter', () => {
    component['item'] = { link: '/about' } as any;

    (component as any).checkActiveItemByUrl('/home/dashboard');

    expect(component['selectedItem']).toBe(false);
  });

  it('should stop at the first match and not continue looping', () => {
    component['item'] = { link: '/home/dashboard' } as any;

    const spy = vi.spyOn(component as any, 'checkActiveItemByUrl');

    (component as any).checkActiveItemByUrl('/home/dashboard/details');

    expect(component['selectedItem']).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return "/" when there are no children', () => {
    vi.spyOn(router as any, 'parseUrl').mockReturnValue({
      root: { children: {} }
    } as any);

    const result = (component as any).checkRouterChildrenFragments();

    expect(result).toBe('/');
  });

  it('should return the path from primary children when it exists', () => {
    vi.spyOn(router as any, 'parseUrl').mockReturnValue({
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
    vi.spyOn(router as any, 'parseUrl').mockReturnValue({
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

    vi.spyOn(component as any, 'checkRouterChildrenFragments').mockReturnValue('test');
    vi.spyOn(component as any, 'checkActiveItemByUrl');

    vi.spyOn(component['router'].events, 'subscribe').mockImplementation(callback => {
      callback(navigation);
      return new Subscription();
    });

    component['subscribeToRoute']();

    expect(component['checkActiveItemByUrl']).toHaveBeenCalledWith('test');
  });

  it(`subscribeToRoute: should call checkActiveItemByUrl with url router if router events return an instance of NavigationCancel`, () => {
    const navigation = new NavigationCancel(1, 'url/', undefined);

    vi.spyOn(component as any, 'checkRouterChildrenFragments').mockReturnValue('test');
    vi.spyOn(component as any, 'checkActiveItemByUrl');

    vi.spyOn(component['router'].events, 'subscribe').mockImplementation(callback => {
      callback(navigation);
      return new Subscription();
    });

    component['subscribeToRoute']();

    expect(component['checkActiveItemByUrl']).toHaveBeenCalledWith('test');
  });
});
