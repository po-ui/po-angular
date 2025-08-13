import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoHeaderCustomerComponent } from './po-header-customer.component';

describe('PoHeaderCustomerComponent', () => {
  let component: PoHeaderCustomerComponent;
  let fixture: ComponentFixture<PoHeaderCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoHeaderCustomerComponent],
      providers: [ChangeDetectorRef]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoHeaderCustomerComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    component.poPopupAction = { toggle: jasmine.createSpy('toggle') } as any;
    component.poPopoverAction = { close: jasmine.createSpy('close') } as any;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the poPopupAction', () => {
    component.headerUser = {
      avatar: 'avatar.jpg',
      customerBrand: 'brand.jpg',
      items: [{ label: 'label', action: () => {} }]
    };

    component.onClickPopup();

    expect(component.poPopupAction.toggle).toHaveBeenCalled();
  });

  it('should call action', () => {
    component.headerUser = {
      avatar: 'avatar.jpg',
      customerBrand: 'brand.jpg',
      action: () => {},
      items: [{ label: 'label', action: () => {} }]
    };

    spyOn(component.headerUser, 'action');

    component.onClickUserSection();

    expect(component.headerUser.action).toHaveBeenCalled();
  });

  it('should close Popover', () => {
    component.headerUser = {
      avatar: 'avatar.jpg',
      customerBrand: 'brand.jpg',
      action: () => {},
      popover: {
        title: 'popover',
        content: null
      }
    };

    component.onClickClosePopover();

    expect(component.poPopoverAction.close).toHaveBeenCalled();
  });

  it('should call action and toggle the poPopupAction if event is Enter', () => {
    component.headerUser = {
      avatar: 'avatar.jpg',
      customerBrand: 'brand.jpg',
      action: () => {},
      popover: {
        title: 'popover',
        content: null
      }
    };
    spyOn(component.headerUser, 'action');

    component.onKeyDownCustomer({ code: 'Enter' });

    expect(component.poPopupAction.toggle).toHaveBeenCalled();
    expect(component.headerUser.action).toHaveBeenCalled();
  });

  it('should call action and toggle the poPopupAction if event is Space', () => {
    component.headerUser = {
      avatar: 'avatar.jpg',
      customerBrand: 'brand.jpg',
      action: () => {},
      popover: {
        title: 'popover',
        content: null
      }
    };
    spyOn(component.headerUser, 'action');

    component.onKeyDownCustomer({ code: 'Space' });

    expect(component.poPopupAction.toggle).toHaveBeenCalled();
    expect(component.headerUser.action).toHaveBeenCalled();
  });
});
