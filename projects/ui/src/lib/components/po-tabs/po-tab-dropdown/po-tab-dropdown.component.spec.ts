import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ElementRef } from '@angular/core';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoButtonComponent } from '../../po-button';
import { PoPopoverComponent, PoPopoverModule } from '../../po-popover';
import { PoTabDropdownComponent } from './po-tab-dropdown.component';

describe('PoTabDropdownComponent:', () => {
  let component: PoTabDropdownComponent;
  let fixture: ComponentFixture<PoTabDropdownComponent>;
  let nativeElement: any;

  const tabs: Array<any> = [
    { label: 'Tab 1', overflow: true, click: () => {} },
    { label: 'Tab 2', overflow: true, click: () => {} },
    { label: 'Tab 3', overflow: true, click: () => {} },
    { label: 'Tab 4', overflow: true, click: () => {} }
  ];

  const buttonElementRefMock = {
    nativeElement: {
      getBoundingClientRect: () => ({
        right: 100,
        bottom: 100
      }),
      closest: (selector: string) => ({
        getBoundingClientRect: () => ({
          width: 300,
          bottom: 120
        })
      })
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoPopoverModule, RouterTestingModule.withRoutes([])],
      declarations: [PoTabDropdownComponent],
      providers: [{ provide: ElementRef, useValue: buttonElementRefMock }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTabDropdownComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });

    component.tabs = tabs;
    component.button = new PoButtonComponent();
    component.button.buttonElement = buttonElementRefMock as ElementRef;
    component.popover = new PoPopoverComponent(null, null);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('closeAndReturnToButtom: should close dropdown and focus on the button', () => {
      spyOn(component, 'closeDropdown');
      spyOn(component.button, 'focus');

      component.closeAndReturnToButtom();

      expect(component.closeDropdown).toHaveBeenCalled();
      expect(component.button.focus).toHaveBeenCalled();
    });

    it('toggleDropdown: should toggle isDropdownOpen and call setDropdownPosition if isDropdownOpen is true', () => {
      spyOn(component, 'setDropdownPosition');

      expect(component.isDropdownOpen).toBeFalse();

      component.toggleDropdown();
      expect(component.isDropdownOpen).toBeTrue();
      expect(component.setDropdownPosition).toHaveBeenCalled();

      component.toggleDropdown();
      expect(component.isDropdownOpen).toBeFalse();
      expect(component.setDropdownPosition).toHaveBeenCalledTimes(1);
    });

    it('closeDropdown: should set isDropdownOpen to false', () => {
      component.isDropdownOpen = true;
      component.closeDropdown();

      expect(component.isDropdownOpen).toBeFalse();
    });

    it('onClickOutside: should call closeDropdown if click is outside and dropdown is open', () => {
      spyOn(component, 'closeDropdown');

      component.isDropdownOpen = true;

      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });

      document.dispatchEvent(event);

      expect(component.closeDropdown).toHaveBeenCalled();
    });

    it('setDropdownPosition: should set dropdownStyles with correct values when rightPosition is positive', () => {
      component.setDropdownPosition();

      const expectedStyles = {
        top: `${120 + 4 + 50}px`,
        maxWidth: '300px',
        right: `${300 - 100}px`
      };

      expect(component.dropdownStyles).toEqual(expectedStyles);
    });

    it('setDropdownPosition: should set dropdownStyles with correct values when rightPosition is zero', () => {
      const buttonElementRefMockZero = {
        nativeElement: {
          getBoundingClientRect: () => ({
            right: 350,
            bottom: 100
          }),
          closest: (selector: string) => ({
            getBoundingClientRect: () => ({
              width: 300,
              bottom: 120
            })
          })
        }
      };

      component.button.buttonElement = buttonElementRefMockZero as ElementRef;

      component.setDropdownPosition();

      const expectedStyles = {
        top: `${120 + 4 + 50}px`,
        maxWidth: '300px',
        right: '0px'
      };

      expect(component.dropdownStyles).toEqual(expectedStyles);
    });
  });
});
