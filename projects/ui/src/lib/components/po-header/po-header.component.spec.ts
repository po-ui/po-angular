import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoHeaderComponent } from './po-header.component';

describe('PoHeaderComponent', () => {
  let component: PoHeaderComponent;
  let fixture: ComponentFixture<PoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoHeaderComponent],
      providers: [ChangeDetectorRef]
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

  it('should call updateMenu and combineItems if menuItems was changed and afterViewInitWascalled is true', () => {
    spyOn(component, 'updateMenu');
    spyOn(component, <any>'combineItems');

    component.ngOnChanges({
      menuItems: {
        currentValue: [{ label: 'test' }],
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.updateMenu).toHaveBeenCalled();
    expect(component['combineItems']).toHaveBeenCalled();
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

  it('should update showMenu and emit colapsed event', () => {
    spyOn(component.colapsedMenuEvent, 'emit');
    component.showMenu = true;
    component.onClickMenu();

    expect(component.colapsedMenuEvent.emit).toHaveBeenCalled();
    expect(component.showMenu).toBeFalsy();
  });

  it('should set showMenu to false', () => {
    component.showMenu = true;
    component.onCloseMenu();

    expect(component.showMenu).toBeFalsy();
  });

  it('should update selected property', () => {
    spyOn(component, 'updateMenu');
    spyOn(component, <any>'combineItems');

    component.menuItems = [
      { label: 'teste', $selected: false, id: '1' },
      { label: 'teste 2', $selected: true, id: '2' }
    ];

    component['onSelected']({ label: 'teste', $selected: false, id: '1' });

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
});
