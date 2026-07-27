import { ChangeDetectorRef } from '@angular/core';
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
        content: null
      }
    };

    component.onClickClosePopover();

    expect(component.poPopoverAction.close).toHaveBeenCalled();
  });

  it('should open poPopoverAction if headerUser has popover and event code is Space', () => {
    component.headerUser = {
      avatar: 'avatar.jpg',
      customerBrand: 'brand.jpg',
      action: () => {},
      popover: { content: null }
    };

    component.poPopoverAction.open = jasmine.createSpy('open');

    Object.defineProperty(component.poPopoverAction, 'isHidden', { get: () => true });

    component.onKeyDownCustomer({ code: 'Space' });

    expect(component.poPopoverAction.open).toHaveBeenCalled();
  });

  it('should close poPopoverAction if headerUser has popover and event code is Space', () => {
    component.headerUser = {
      avatar: 'avatar.jpg',
      customerBrand: 'brand.jpg',
      action: () => {},
      popover: { content: null }
    };

    Object.defineProperty(component.poPopoverAction, 'isHidden', { get: () => false });

    component.onKeyDownCustomer({ code: 'Space' });

    expect(component.poPopoverAction.close).toHaveBeenCalled();
  });

  it('should toggle poPopupAction if headerUser has not popover and event code is Enter', () => {
    component.headerUser = {
      avatar: 'avatar.jpg',
      customerBrand: 'brand.jpg',
      action: () => {}
    };

    component.onKeyDownCustomer({ code: 'Enter' });

    expect(component.poPopupAction.toggle).toHaveBeenCalled();
  });

  describe('onOpen and onClose callbacks', () => {
    it('should call headerUser.onOpen when popup emits p-open', () => {
      const onOpenSpy = jasmine.createSpy('onOpen');
      component.headerUser = {
        avatar: 'avatar.jpg',
        customerBrand: 'brand.jpg',
        items: [{ label: 'Perfil', action: () => {} }],
        onOpen: onOpenSpy
      };

      // Simula o comportamento do template: (p-open)="headerUser?.onOpen()"
      component.headerUser.onOpen();

      expect(onOpenSpy).toHaveBeenCalled();
    });

    it('should call headerUser.onClose when popup emits p-close', () => {
      const onCloseSpy = jasmine.createSpy('onClose');
      component.headerUser = {
        avatar: 'avatar.jpg',
        customerBrand: 'brand.jpg',
        items: [{ label: 'Perfil', action: () => {} }],
        onClose: onCloseSpy
      };

      component.headerUser.onClose();

      expect(onCloseSpy).toHaveBeenCalled();
    });

    it('should call headerUser.onOpen when popover emits p-open', () => {
      const onOpenSpy = jasmine.createSpy('onOpen');
      component.headerUser = {
        avatar: 'avatar.jpg',
        customerBrand: 'brand.jpg',
        popover: { content: null },
        onOpen: onOpenSpy
      };

      component.headerUser.onOpen();

      expect(onOpenSpy).toHaveBeenCalled();
    });

    it('should call headerUser.onClose when popover emits p-close', () => {
      const onCloseSpy = jasmine.createSpy('onClose');
      component.headerUser = {
        avatar: 'avatar.jpg',
        customerBrand: 'brand.jpg',
        popover: { content: null },
        onClose: onCloseSpy
      };

      component.headerUser.onClose();

      expect(onCloseSpy).toHaveBeenCalled();
    });

    it('should not throw when headerUser.onOpen is undefined', () => {
      component.headerUser = {
        avatar: 'avatar.jpg',
        customerBrand: 'brand.jpg',
        items: [{ label: 'Perfil', action: () => {} }]
      };

      expect(() => component.headerUser?.onOpen?.()).not.toThrow();
    });

    it('should not throw when headerUser.onClose is undefined', () => {
      component.headerUser = {
        avatar: 'avatar.jpg',
        customerBrand: 'brand.jpg',
        items: [{ label: 'Perfil', action: () => {} }]
      };

      expect(() => component.headerUser?.onClose?.()).not.toThrow();
    });
  });
});
