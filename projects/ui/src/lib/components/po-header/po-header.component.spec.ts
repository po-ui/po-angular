import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EMPTY, Subject } from 'rxjs';
import { PoMenuGlobalService } from '../po-menu';
import { PoHeaderComponent } from './po-header.component';

describe('PoHeaderComponent', () => {
  let component: PoHeaderComponent;
  let fixture: ComponentFixture<PoHeaderComponent>;
  let menuGlobalServiceMock: any;
  let changeDetectorRefMock: any;
  let receiveOnChange$: Subject<any>;
  let receiveApplicationMenu$: Subject<any>;
  let receiveRemovedApplicationMenu$: Subject<any>;

  beforeEach(async () => {
    receiveOnChange$ = new Subject<any>();
    receiveApplicationMenu$ = new Subject<any>();
    receiveRemovedApplicationMenu$ = new Subject<any>();

    menuGlobalServiceMock = {
      receiveOnChange$: receiveOnChange$.asObservable(),
      receiveMenus$: EMPTY,
      receiveRemovedApplicationMenu$: receiveRemovedApplicationMenu$.asObservable(),
      receiveId$: EMPTY,
      receiveApplicationMenu$: receiveApplicationMenu$.asObservable()
    };

    changeDetectorRefMock = { detectChanges: jasmine.createSpy('detectChanges') };

    await TestBed.configureTestingModule({
      declarations: [PoHeaderComponent],
      providers: [
        { provide: ChangeDetectorRef, useValue: changeDetectorRefMock },
        { provide: PoMenuGlobalService, useValue: menuGlobalServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateButtonMore if amountMore was changed', () => {
    spyOn(component, 'updateButtonMore');

    component.ngOnChanges({
      amountMore: {
        currentValue: 2,
        previousValue: 1,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.updateButtonMore).toHaveBeenCalled();
  });

  it('should keep currentWidth when receiveOnChange$ emits and width <= 960', () => {
    spyOn(component, 'handleLargeSreen');
    spyOn(component, 'handleSmallSreen');

    component['applicationMenu'] = {} as any;
    (window.innerWidth as any) = 800;
    component['currentWidth'] = 800;
    component.ngOnInit();
    receiveOnChange$.next([{ label: 'menu1' }]);

    expect(component['currentWidth']).toBeDefined();
  });

  it('should keep currentWidth when receiveOnChange$ emits', () => {
    spyOn(component, 'handleLargeSreen');
    spyOn(component, 'handleSmallSreen');

    component['applicationMenu'] = undefined;
    component['currentWidth'] = 800;
    (window.innerWidth as any) = 800;

    component.ngOnInit();
    receiveOnChange$.next([{ label: 'menu1' }]);

    expect(component['currentWidth']).toBeDefined();
  });

  it('should keep currentWidth when receiveOnChange$ emits and width > 960', () => {
    spyOn(component, 'handleLargeSreen');
    spyOn(component, 'handleSmallSreen');

    component['applicationMenu'] = {} as any;
    (window.innerWidth as any) = 1200;
    component['currentWidth'] = 1200;
    component.ngOnInit();
    receiveOnChange$.next([{ label: 'menu1' }]);

    expect(component['currentWidth']).toBeDefined();
  });

  it('should call detectChanges when receiveApplicationMenu emits', () => {
    spyOn(component['cd'], 'detectChanges');
    component.applicationMenu = {} as any;
    component.previousMenuComponentId = '1';
    component.ngOnInit();

    receiveApplicationMenu$.next({ id: '2' });

    expect(component['cd'].detectChanges).toHaveBeenCalled();
  });

  it('should call detectChanges when receiveApplicationMenu emits and id is the same', () => {
    spyOn(component['cd'], 'detectChanges');
    component.applicationMenu = {} as any;
    component.previousMenuComponentId = '2';
    (window as any).innerWidth = 800;
    component.ngOnInit();

    receiveApplicationMenu$.next({ id: '2' });

    expect(component['cd'].detectChanges).toHaveBeenCalled();
  });

  it('should not call detectChanges when receiveApplicationMenu has the same id and notChangeContext is true', () => {
    spyOn(component, 'updateMenu');
    component.applicationMenu = {} as any;
    component.previousMenuComponentId = '2';
    component.notChangeContext = true;
    component.ngOnInit();

    receiveApplicationMenu$.next({ id: '1' });

    expect(component.updateMenu).not.toHaveBeenCalled();
  });

  it('should not call handleSmallSreen when receiveApplicationMenu emits', () => {
    spyOn(component, 'updateMenu');
    component.applicationMenu = {} as any;
    component.previousMenuComponentId = '2';
    (window as any).innerWidth = 800;
    component.ngOnInit();

    receiveApplicationMenu$.next({ id: '1' });

    expect(component.updateMenu).not.toHaveBeenCalled();
  });

  it('should call detectChanges and handleSmallSreen when receiveRemovedApplicationMenu emits', fakeAsync(() => {
    spyOn(component['cd'], 'detectChanges');
    spyOn(component, 'handleSmallSreen');

    (window as any).innerWidth = 800;
    component.applicationMenu = {} as any;
    component.previousMenuComponentId = '1';

    component.ngOnInit();

    receiveRemovedApplicationMenu$.next('1');

    tick();

    expect(component.handleSmallSreen).toHaveBeenCalled();
    expect(component['cd'].detectChanges).toHaveBeenCalled();
  }));

  it('should call detectChanges and handleLargeSreen when receiveRemovedApplicationMenu emits', fakeAsync(() => {
    spyOn(component['cd'], 'detectChanges');
    spyOn(component, 'handleLargeSreen');

    (window as any).innerWidth = 1000;
    component.applicationMenu = {} as any;
    component.previousMenuComponentId = '1';

    component.ngOnInit();

    receiveRemovedApplicationMenu$.next('1');

    tick();

    expect(component.handleLargeSreen).toHaveBeenCalled();
    expect(component['cd'].detectChanges).toHaveBeenCalled();
  }));

  it('should call detectChanges and handleLargeSreen when receiveRemovedApplicationMenu emits and notChangeContext is true', fakeAsync(() => {
    spyOn(component['cd'], 'detectChanges');
    spyOn(component, 'handleLargeSreen');

    (window as any).innerWidth = 1000;
    component.applicationMenu = {} as any;
    component.previousMenuComponentId = '2';
    component.notChangeContext = true;

    component.ngOnInit();

    receiveRemovedApplicationMenu$.next('1');

    tick();

    expect(component.handleLargeSreen).toHaveBeenCalled();
    expect(component['cd'].detectChanges).toHaveBeenCalled();
  }));

  it('should set applicationMenu to undefined when id is equal', fakeAsync(() => {
    spyOn(component['cd'], 'detectChanges');

    (window as any).innerWidth = 1000;
    component.applicationMenu = {} as any;
    component.previousMenuComponentId = '2';

    component.ngOnInit();

    receiveRemovedApplicationMenu$.next('1');

    tick();

    expect(component.applicationMenu).toBeUndefined();
  }));

  it('should subscribe to window resize and call handleLargeSreen when width > 960', fakeAsync(() => {
    spyOn(component, 'handleSmallSreen');
    spyOn(component, 'handleLargeSreen');

    component.ngOnInit();

    (window.innerWidth as any) = 1200;
    window.dispatchEvent(new Event('resize'));

    tick(250);

    expect(component['currentWidth']).toBe(1200);
    expect(component.handleLargeSreen).toHaveBeenCalled();
  }));

  it('ngAfterViewInit: should subscribe to resize event and call updateMenu after debounce', fakeAsync(() => {
    const spyUpdateMenu = spyOn<any>(component, 'updateMenu');

    component.ngAfterViewInit();

    window.dispatchEvent(new Event('resize'));

    tick(301);

    expect(spyUpdateMenu).toHaveBeenCalled();
  }));

  it('should update previousMenusItems when receiveMenus$ emits', () => {
    const receiveMenus$ = new Subject<any>();
    menuGlobalServiceMock.receiveMenus$ = receiveMenus$.asObservable();

    fixture = TestBed.createComponent(PoHeaderComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    receiveMenus$.next([{ id: 'test1' }, { id: component['id'] }]);

    expect((component as any).previousMenusItems).toEqual([{ id: 'test1' }]);
  });

  it('should set existMenuExternal to true when receiveId$ emits different than "po-header-nav-bar"', () => {
    const receiveId$ = new Subject<string>();
    menuGlobalServiceMock.receiveId$ = receiveId$.asObservable();

    fixture = TestBed.createComponent(PoHeaderComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    receiveId$.next('custom-id');

    expect(component.existMenuExternal).toBeTrue();
  });

  it('should call handleSmallSreen if menuCollapse was changed and width is smaller than 960', () => {
    spyOn(component, 'handleSmallSreen');
    component['currentWidth'] = 950;
    component.afterViewInitWascalled = true;

    component.ngOnChanges({
      menuCollapse: {
        currentValue: [{ label: 'test' }],
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.handleSmallSreen).toHaveBeenCalled();
  });

  it('should call handleLargeSreen if menuCollapse was changed and width is bigger than 960', () => {
    spyOn(component, 'handleLargeSreen');
    component['currentWidth'] = 970;
    component.afterViewInitWascalled = true;

    component.ngOnChanges({
      menuCollapse: {
        currentValue: [{ label: 'test' }],
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.handleLargeSreen).toHaveBeenCalled();
  });

  it('should call handleSmallSreen if menuItems was changed and width is smaller than 960', () => {
    spyOn(component, 'handleSmallSreen');
    component['currentWidth'] = 940;
    component.afterViewInitWascalled = true;

    component.ngOnChanges({
      menuItems: {
        currentValue: [{ label: 'test' }],
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.handleSmallSreen).toHaveBeenCalled();
  });

  it('should call handleSmallSreen if menuItems was changed and width is smaller than 960', () => {
    spyOn(component, 'handleSmallSreen');
    component['currentWidth'] = 950;
    component.afterViewInitWascalled = true;

    component.ngOnChanges({
      menuItems: {
        currentValue: [{ label: 'test' }],
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.handleSmallSreen).toHaveBeenCalled();
  });

  it('should update itemVisible and itemsInFlow if amountMore is less than 0', () => {
    component.menuItems = [
      { label: '1', id: '1' },
      { label: '2', id: '2' }
    ];
    component.amountMore = 0;
    component.showOverflow = true;

    component.updateButtonMore();

    expect(component.visibleMenuItems.length).toEqual(2);
    expect(component.overflowItems.length).toEqual(0);
    expect(component.showOverflow).toBeFalsy();
  });

  it('should update itemVisible and itemsInFlow if amountMore is bigger than length of menuItems', () => {
    component.menuItems = [
      { label: '1', id: '1' },
      { label: '2', id: '2' }
    ];
    component.amountMore = 3;
    component.showOverflow = false;

    component.updateButtonMore();

    expect(component.visibleMenuItems.length).toEqual(0);
    expect(component.overflowItems.length).toEqual(2);
    expect(component.showOverflow).toBeTruthy();
  });

  it('should update itemVisible and itemsInFlow if amountMore is bigger than 0', () => {
    component.menuItems = [
      { label: '1', id: '1' },
      { label: '2', id: '2' },
      { label: '2', id: '3' }
    ];
    component.amountMore = 1;
    component.showOverflow = false;

    component.updateButtonMore();

    expect(component.visibleMenuItems.length).toEqual(2);
    expect(component.overflowItems.length).toEqual(1);
    expect(component.showOverflow).toBeTruthy();
  });

  it('should set applicationMenu when applicationMenu is defined', () => {
    component.applicationMenu = { menus: [] } as any;
    component['previousMenusItems'] = [{ label: 'test' }];
    component.handleLargeSreen();

    expect(component.applicationMenu.menus).toEqual([{ label: 'test' }]);
  });

  it('should set menuCollapse when applicationMenu is undefined', () => {
    component.menuCollapseJoin = [];
    component.applicationMenu = undefined;
    component['menuCollapse'] = [{ label: 'test' }];
    component.handleLargeSreen();

    expect(component.menuCollapseJoin).toEqual([{ label: 'test' }]);
  });

  it('should update applicationMenu.menus when applicationMenu exists', () => {
    component['id'] = '123';
    component.menuCollapseJoinExternal = [
      { label: 'Tool 1', action: 'a1' },
      { label: 'Menu 1', action: 'a2' }
    ];
    component['previousMenusItems'] = [{ label: 'Prev 1', action: 'p1' }] as any;

    component.applicationMenu = { menus: [] } as any;

    component.handleSmallSreen();

    expect(component.applicationMenu.menus.length).toBeGreaterThan(0);
  });

  it('should change the value showMenu if menuCollapseJoin has items', () => {
    component.menuCollapseJoin = [{ label: 'test' }];
    component.showMenu = true;

    component.onClickMenu();

    expect(component.showMenu).toBeFalsy();
  });

  it('should call toggleMenuMobile when existMenuExternal is true', () => {
    component.existMenuExternal = true;
    component.applicationMenu = { toggleMenuMobile: () => {} } as any;
    spyOn(component.applicationMenu, 'toggleMenuMobile');

    component.onClickMenu();

    expect(component.applicationMenu.toggleMenuMobile).toHaveBeenCalled();
  });

  it('should set showMenu to false', () => {
    component.showMenu = true;
    component.onCloseMenu();

    expect(component.showMenu).toBeFalsy();
  });

  it('should update selected property', () => {
    spyOn(component, 'updateMenu');
    spyOn(component, <any>'combineItems');
    component.overflowButtonComponentEl = { onClosePopup: () => {} } as any;

    component.menuItems = [
      { label: 'teste', $selected: false, id: '1' },
      { label: 'teste 2', $selected: true, id: '2' }
    ];

    const itemEvent = { item: { label: 'teste', $selected: false, id: '1', $internalRoute: true }, focus: true };

    component['onSelected'](itemEvent);

    expect(component.updateMenu).toHaveBeenCalled();
    expect(component['combineItems']).toHaveBeenCalled();
    expect(component.menuItems[0].$selected).toBeTruthy();
    expect(component.menuItems[1].$selected).toBeFalsy();
  });

  it('should update showOverflow ', () => {
    component.showOverflow = false;

    component.toggleOverflowDropdown();

    expect(component.showOverflow).toBeTruthy();
  });

  it('should call updateButtonMore when amountMore is set', () => {
    const fake = {
      amountMore: 1,
      updateButtonMore: jasmine.createSpy('updateButtonMore')
    };

    PoHeaderComponent.prototype.updateMenu.call(fake);

    expect(fake.updateButtonMore).toHaveBeenCalled();
  });

  it('should calculate visibleMenuItems and overflowItems correctly', () => {
    const fake = {
      amountMore: 0,
      elRef: { nativeElement: { parentElement: { getBoundingClientRect: () => ({ width: 500 }) } } },
      menuWrapperBrand: { nativeElement: { offsetWidth: 50 } },
      menuWrapperTools: { nativeElement: { offsetWidth: 50 } },
      visibleMenuItems: [],
      menuItems: [
        { id: 1, label: 'Item 1' },
        { id: 2, label: 'Item 2' },
        { id: 3, label: 'Item 3' }
      ],
      overflowItems: [],
      cd: { detectChanges: jasmine.createSpy('detectChanges') },
      menuSubItems: {
        toArray: () => [
          { nativeElement: { offsetWidth: 100 } },
          { nativeElement: { offsetWidth: 120 } },
          { nativeElement: { offsetWidth: 150 } }
        ]
      },
      showOverflow: false
    };

    PoHeaderComponent.prototype.updateMenu.call(fake);

    expect(fake.overflowItems.length).toBeGreaterThan(0);
    expect(fake.visibleMenuItems.length + fake.overflowItems.length).toEqual(fake.menuItems.length);
    expect(fake.cd.detectChanges).toHaveBeenCalled();
  });

  it('should use document.documentElement.clientWidth when parent width is not available', () => {
    spyOnProperty(document.documentElement, 'clientWidth', 'get').and.returnValue(800);

    const fake = {
      amountMore: 0,
      elRef: {
        nativeElement: {
          parentElement: {
            getBoundingClientRect: () => ({})
          }
        }
      },
      menuWrapperBrand: { nativeElement: { offsetWidth: 100 } },
      menuWrapperTools: { nativeElement: { offsetWidth: 100 } },
      visibleMenuItems: [],
      menuItems: [
        { id: 1, label: 'Item 1' },
        { id: 2, label: 'Item 2' }
      ],
      overflowItems: [],
      cd: { detectChanges: jasmine.createSpy('detectChanges') },
      menuSubItems: {
        toArray: () => [{ nativeElement: { offsetWidth: 300 } }, { nativeElement: { offsetWidth: 300 } }]
      },
      showOverflow: false
    };

    PoHeaderComponent.prototype.updateMenu.call(fake);

    expect(fake.showOverflow).toBeTrue();
    expect(fake.cd.detectChanges).toHaveBeenCalled();
  });

  it('should combine actionsTools and menuItems into joinMenu with literals.headerLinks and return joined array', () => {
    const myAction = () => {};
    component['actionsTools'] = [
      { label: 'Tool 1', action: myAction, link: '/tool1' },
      { label: 'Tool 2', action: myAction, link: '/tool2' }
    ];

    component['menuItems'] = [
      { label: 'Menu 1', action: myAction, link: '/m1' },
      { label: 'Menu 2', action: myAction, link: '/m2' }
    ];

    component['menuCollapse'] = [{ label: 'Collapsed Menu' }];
    component['literals'] = { headerLinks: 'Links' };
    component['id'] = '123';

    const result = (component as any).combineItems();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual({ label: 'Collapsed Menu' });
    expect(result[1].label).toBe('Links');
    expect(result[1].id).toBe('123');
    expect(result[1].subItems.length).toBe(4);
    expect(result[1].subItems).toEqual([
      { label: 'Menu 1', action: myAction, link: '/m1' },
      { label: 'Menu 2', action: myAction, link: '/m2' },
      { label: 'Tool 1', action: myAction, link: '/tool1' },
      { label: 'Tool 2', action: myAction, link: '/tool2' }
    ]);
  });

  it('should combine actionsTools and menuItems into menuCollapseJoinExternal ', () => {
    const myAction = () => {};
    component['actionsTools'] = [
      { label: 'Tool 1', action: myAction, link: '/tool1' },
      { label: 'Tool 2', action: myAction, link: '/tool2' }
    ];

    component['menuItems'] = [
      { label: 'Menu 1', action: myAction, link: '/m1' },
      { label: 'Menu 2', action: myAction, link: '/m2' }
    ];

    component.menuCollapseJoinExternal = [];

    component['combineItemsExternal']();

    expect(component.menuCollapseJoinExternal.length).toBe(4);
    expect(component.menuCollapseJoinExternal).toEqual([
      { label: 'Menu 1', action: myAction, link: '/m1' },
      { label: 'Menu 2', action: myAction, link: '/m2' },
      { label: 'Tool 1', action: myAction, link: '/tool1' },
      { label: 'Tool 2', action: myAction, link: '/tool2' }
    ]);
  });
});
