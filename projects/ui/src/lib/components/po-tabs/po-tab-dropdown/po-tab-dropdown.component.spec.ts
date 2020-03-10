import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoPopoverModule } from '../../po-popover';
import { PoTabButtonComponent } from '../po-tab-button/po-tab-button.component';
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

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoPopoverModule, RouterTestingModule.withRoutes([])],
      declarations: [PoTabDropdownComponent, PoTabButtonComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTabDropdownComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    component.tabs = tabs;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it(`togglePopover: should call 'popover.open' if 'popover.isHidden' is 'true'.`, () => {
      const fakeThis = {
        popover: {
          isHidden: true,
          open: () => {},
          close: () => {}
        }
      };
      const spyOnOpen = spyOn(fakeThis.popover, 'open');

      component.togglePopover.call(fakeThis);
      expect(spyOnOpen).toHaveBeenCalled();
    });

    it(`togglePopover: should call 'popover.close' if 'popover.isHidden' is 'false'.`, () => {
      const fakeThis = {
        popover: {
          isHidden: false,
          open: () => {},
          close: () => {}
        }
      };
      const spyOnClose = spyOn(fakeThis.popover, 'close');

      component.togglePopover.call(fakeThis);
      expect(spyOnClose).toHaveBeenCalled();
    });

    it('getContainerClass: should return `po-tab-dropdown-container-sm` if `small` is `true`', () => {
      component.small = true;

      expect(component.getContainerClass()).toBe('po-tab-dropdown-container-sm');
    });

    it('getContainerClass: should return `po-tab-dropdown-container` if `small` is `false`', () => {
      component.small = false;

      expect(component.getContainerClass()).toBe('po-tab-dropdown-container');
    });
  });

  describe('Templates:', () => {
    it('should have label', () => {
      const label = 'Mais';

      component.label = label;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tab-button-label').innerHTML).toContain(label);
    });

    it('should create a po-tab-button for each tab', () => {
      expect(nativeElement.querySelectorAll('po-tab-button').length).toBe(tabs.length);
    });

    it('should add class po-tab-dropdown-button-active if tab is active', () => {
      component.tabs[0].active = true;

      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-tab-dropdown-button-active')).toBeTruthy();
    });

    it('should add class po-tab-dropdown-button-sm if tab is small', () => {
      component.small = true;

      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-tab-button-sm')).toBeTruthy();
    });

    it('should add class `po-tab-dropdown-container` if `small` is `false`', () => {
      component.small = false;

      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-tab-dropdown-container')).toBeTruthy();
    });

    it('should add class `po-tab-dropdown-container-sm` if `small` is `true`', () => {
      component.small = true;

      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-tab-dropdown-container-sm')).toBeTruthy();
    });

    it('should call `togglePopover` if `enter` is pressed in div `tabDrop`.', () => {
      const eventEnterKey = new KeyboardEvent('keyup', { 'key': 'Enter' });
      const dropdown = fixture.debugElement.query(By.css('.po-tab-dropdown-content')).nativeElement;

      spyOn(component, 'togglePopover');
      dropdown.dispatchEvent(eventEnterKey);

      expect(component.togglePopover).toHaveBeenCalled();
    });
  });
});
