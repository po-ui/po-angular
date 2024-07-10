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
        right: 200,
        height: 50
      }),
      closest: (selector: string) => {
        if (selector === '.po-tabs-container') {
          return {
            getBoundingClientRect: () => ({
              bottom: 150,
              width: 400
            })
          };
        }
        return null;
      }
    }
  };

  const elementRefMock = {
    nativeElement: {
      closest: (selector: string) => null
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

    it('setDropdownPosition: should set dropdownStyles with correct values when not inside a PoPage', () => {
      component['elementRef'] = elementRefMock as ElementRef;

      component.setDropdownPosition();

      const expectedStyles = {
        top: `${150 + 4 + window.scrollY}px`,
        maxWidth: '300px',
        right: `${200}px`
      };

      expect(component.dropdownStyles).toEqual(expectedStyles);
    });

    it('setDropdownPosition: should set dropdownStyles with correct values when inside a PoPage', () => {
      const buttonElementRefMock = {
        nativeElement: {
          getBoundingClientRect: () => ({ right: 300, height: 100 }),
          closest: (selector: string) => {
            if (selector === '.po-tabs-container') {
              return { getBoundingClientRect: () => ({ right: 350, height: 120 }) };
            } else if (selector === '.po-page-content') {
              return true;
            }
            return null;
          }
        }
      };
      const elementRefMock = {
        nativeElement: {
          closest: (selector: string) => {
            if (selector === '.po-page-content') {
              return true;
            }
            return null;
          }
        }
      };

      component.button.buttonElement = buttonElementRefMock as ElementRef;
      component['elementRef'] = elementRefMock as ElementRef;

      component.setDropdownPosition();

      const expectedStyles = {
        top: `${120 + 4 + window.scrollY}px`,
        maxWidth: '300px',
        right: '50px'
      };

      expect(component.dropdownStyles).toEqual(expectedStyles);
    });
  });
});
