import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ElementRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoButtonComponent } from '../../po-button/po-button.component';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoTabDropdownComponent],
      providers: [{ provide: ElementRef, useValue: buttonElementRefMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTabDropdownComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true, configurable: true });

    component.tabs = tabs;

    // Create a mock button object
    component.button = {
      focus: vi.fn(),
      buttonElement: buttonElementRefMock as ElementRef
    } as any;

    const popoverStub = {
      open: vi.fn(),
      close: vi.fn(),
      isOpen: false
    } as any;

    component.popover = popoverStub;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('closeAndReturnToButtom: should close dropdown and focus on the button', () => {
      vi.spyOn(component, 'closeDropdown').mockImplementation(() => {});
      vi.spyOn(component.button, 'focus').mockImplementation(() => {});

      component.closeAndReturnToButtom();

      expect(component.closeDropdown).toHaveBeenCalled();
      expect(component.button.focus).toHaveBeenCalled();
    });

    it('toggleDropdown: should toggle isDropdownOpen and call setDropdownPosition if isDropdownOpen is true', () => {
      vi.spyOn(component, 'setDropdownPosition').mockImplementation(() => {});

      expect(component.isDropdownOpen).toBe(false);

      component.toggleDropdown();
      expect(component.isDropdownOpen).toBe(true);
      expect(component.setDropdownPosition).toHaveBeenCalled();

      component.toggleDropdown();
      expect(component.isDropdownOpen).toBe(false);
      expect(component.setDropdownPosition).toHaveBeenCalledTimes(1);
    });

    it('closeDropdown: should set isDropdownOpen to false', () => {
      component.isDropdownOpen = true;
      component.closeDropdown();

      expect(component.isDropdownOpen).toBe(false);
    });

    it('onClickOutside: should call closeDropdown if click is outside and dropdown is open', () => {
      vi.spyOn(component, 'closeDropdown').mockImplementation(() => {});

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
      Object.defineProperty(component, 'elementRef', { value: elementRefMock, configurable: true });

      component.setDropdownPosition();

      const expectedStyles = {
        top: `${150 + 4 + window.scrollY}px`,
        maxWidth: '300px',
        right: `${200}px`
      };

      expect(component.dropdownStyles).toEqual(expectedStyles);
    });

    it('setDropdownPosition: should set dropdownStyles with correct values when inside a PoPage', () => {
      const buttonElementRefMockLocal = {
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
      const elementRefMockLocal = {
        nativeElement: {
          closest: (selector: string) => {
            if (selector === '.po-page-content') {
              return true;
            }
            return null;
          }
        }
      };

      component.button.buttonElement = buttonElementRefMockLocal as ElementRef;
      Object.defineProperty(component, 'elementRef', { value: elementRefMockLocal, configurable: true });

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
